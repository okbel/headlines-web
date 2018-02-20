const fs = require('fs')
const next = require('next')
const helmet = require('helmet')
const http2 = require('spdy')
const express = require('express')
const compression = require('compression')
const LRUCache = require('lru-cache')

const sharedRoutes = require('../shared/routes')
const Winston = require('./lib/logger')()

class Server {
  static renderAndCache(req, res, pagePath = '', queryParams = '') {
    const key = req.url

    // If we have a page in the cache, let's serve it
    if (this.ssrCache.has(key)) {
      res.send(this.ssrCache.get(key))
      return
    }

    // If not let's render the page into HTML
    this.app.renderToHTML(req, res, pagePath, queryParams)
      .then((html) => {
        // Let's cache this page
        this.ssrCache.set(key, html)
        res.send(html)
      })
      .catch((err) => {
        this.app.renderError(err, req, res, pagePath, queryParams)
      })
  }

  static async start() {
    try {
      Winston.info('Starting server')

      const isDev = process.env.NODE_ENV !== 'production'
      const isProd = !isDev

      const port = parseInt(process.env.PORT, 10) || 3000

      const server = express()
      const app = next({ dev: isDev })
      this.app = app
      const handler = sharedRoutes.getRequestHandler(app)

      await app.prepare()

      const buildStats = isProd
        ? JSON.parse(fs.readFileSync('./.next/build-stats.json', 'utf8').toString())
        : null;

      const buildId = isProd ? fs.readFileSync('./.next/BUILD_ID', 'utf8').toString() : null;

      this.ssrCache = new LRUCache({
        max: 100,
        maxAge: 1000 * 60 * 10, // 10 min
      })

      let appJs
      if (buildStats) {
        appJs = fs.readFileSync('./.next/app.js', 'utf8')
      }

      if (isProd) {
        // Enable compression on production
        server.use(compression({ threshold: 0 }))
      }

      // Enable different security policies through helmet
      server.use(helmet())

      server.use('/favicon.ico', express.static('static/favicon.ico'))

      server.get('/healthcheck', (req, res) => {
        res.json({
          build: {
            id: buildId,
            ...buildStats,
          },
        })
      })

      server.get('*', async (req, res) => {
        const { route, query } = sharedRoutes.match(req.url)

        if (!route) {
          // Nextjs assets or static route
          return handler(req, res)
        }

        Winston.info('Entering route: ', req.url)

        if (req.push && appJs) {
          const stream = res.push(`/_next/${buildStats['app.js'].hash}/app.js`, {
            request: {
              accept: '*/*',
            },
            response: {
              'content-type': 'application/javascript',
            },
          })
          stream.end(appJs)
        }

        if (isProd) {
          return this.renderAndCache(req, res, route.page, query)
        }
        return handler(req, res)
      })

      const options = {
        key: fs.readFileSync('./server/server.key'),
        cert: fs.readFileSync('./server/server.crt'),
      }

      http2.createServer(options, server).listen(port, (error) => {
        if (error) {
          Winston.error(`Ups, something went wrong: ${error}`)
        }

        Winston.info(`Ready on https://localhost:${port}`)
      })
    } catch (error) {
      Winston.error(`Ups, something went wrong: ${error}`)
    }
  }
}

module.exports = Server;

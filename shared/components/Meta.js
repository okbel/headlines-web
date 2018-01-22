import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'

export default class Meta extends Component {
  static propTypes = {
    title: PropTypes.string,
    url: PropTypes.string,
    image: PropTypes.string,
  }

  static defaultProps = {
    title: null,
    url: null,
    image: null,
  }
  render() {
    const { title, url, image } = this.props

    let seoTitle = 'Canillitapp'
    if (title) {
      seoTitle = `${title} | Canillitapp`
    }

    let seoUrl = 'https://canillitapp.com'
    if (url) {
      seoUrl += url
    }

    let seoImage = '/static/ogimage.png'
    if (image) {
      seoImage = image
    }

    return (

      <Head>
        <title key="title">{seoTitle}</title>

        <meta name="og:site_name" content="Canillitapp" />
        <meta name="og:title" content={seoTitle} />
        <meta name="og:type" content="website" />
        <meta name="og:url" content={seoUrl} />
        <meta name="og:image" content={seoImage} />
        <meta name="og:description" content="Encuentra las noticias más relevantes del día y las agrupa para que estés enterado sobre lo que está pasando en pocos minutos." />

        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@canillitapp" />
        <meta name="twitter:description" content="Encuentra las noticias más relevantes del día y las agrupa para que estés enterado sobre lo que está pasando en pocos minutos." />
        <meta name="twitter:url" content={seoUrl} />
        <meta name="twitter:image" content={seoImage} />
      </Head>

    )
  }
}
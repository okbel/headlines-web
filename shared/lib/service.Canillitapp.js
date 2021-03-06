import 'isomorphic-unfetch';

const qs = require('query-string');

export const reqUrlBuild = (url) => {
  if (process.env.API_URL) return `${process.env.API_URL}${url}`;

  const apiUrl = 'api.canillitapp.com';
  // const apiUrl = 'api-stg.dokku.canillitapp.com';

  let protocol = 'https';
  if (typeof window !== 'object') {
    // Use HTTP on backend since SSL is getting some errors on node
    // UNABLE_TO_VERIFY_LEAF_SIGNATURE error
    protocol = 'http';
  }
  return `${protocol}://${apiUrl}${url}`;
};

export const addReaction = (reaction, userId, newsId) =>
  new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(reqUrlBuild(`/reactions/${newsId}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: qs.stringify({
          reaction,
          user_id: userId,
          source: 'WEB',
        }),
      });
      const article = await res.json();
      resolve(article);
    } catch (err) {
      reject(err);
    }
  });

export const getTrending = (date, amount = 6) =>
  new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(reqUrlBuild(`/trending/${date}/${amount}`));
      const articles = await res.json();
      resolve(articles);
    } catch (err) {
      reject(err);
    }
  });

export const getLatest = date =>
  new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(reqUrlBuild(`/latest/${date}`));
      const articles = await res.json();
      resolve(articles);
    } catch (err) {
      reject(err);
    }
  });

export const getSearch = term =>
  new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(reqUrlBuild(`/search/${term}`));
      const articles = await res.json();
      resolve(articles);
    } catch (err) {
      reject(err);
    }
  });

export const getArticle = id =>
  new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(reqUrlBuild(`/news/${id}`));
      const article = await res.json();
      resolve(article);
    } catch (err) {
      reject(err);
    }
  });

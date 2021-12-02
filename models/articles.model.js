const db = require("../db/connection");

const selectArticleById = (article_id) => {
  return db
    .query(
      `
        SELECT articles.author, title, articles.article_id, articles.body, topic, articles.created_at, articles.votes, count(comments.article_id) AS comment_count
        FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;
    `,
      [article_id]
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No articles for supplied ID",
        });
      } else {
        response.rows[0].comment_count = parseInt(
          response.rows[0].comment_count
        );
        return response.rows[0];
      }
    });
};

const updateArticleById = (article_id, updateObject) => {
  if (
    Object.keys(updateObject).length != 1 ||
    !Object.keys(updateObject).includes("inc_votes")
  ) {
    return Promise.reject({ status: 400, msg: "Request invalid" });
  }

  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [updateObject.inc_votes, article_id]
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No articles for supplied ID",
        });
      } else {
        return response.rows[0];
      }
    });
};

const selectArticles = () => {
  return db
    .query(
      `
      SELECT articles.author, title, articles.article_id, articles.body, topic, articles.created_at, articles.votes, count(comments.article_id) AS comment_count
      FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id;
    `
    )
    .then((response) => {
      return response.rows;
    });
};

module.exports = { selectArticleById, updateArticleById, selectArticles };

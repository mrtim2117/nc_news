const { response } = require("express");
const db = require("../db/connection");

const selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1;`,
      [article_id]
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No comments found",
        });
      }
      return response.rows;
    });
};

const insertCommentByArticleId = (article_id, comment) => {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING comment_id, author, article_id, votes, body, created_at;`,
      [comment.username, comment.body, article_id]
    )
    .then((response) => {
      return response.rows[0];
    });
};

const deleteComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
    .then((response) => {
      if (response.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "No comment found",
        });
      } else {
        return;
      }
    });
};

module.exports = {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  deleteComment,
};

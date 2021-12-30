const { response } = require("express");
const db = require("../db/connection");

const selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1;`,
      [article_id]
    )
    .then((response) => {
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

const updateCommentById = (comment_id, updateObject) => {
  if (
    Object.keys(updateObject).length != 1 ||
    !Object.keys(updateObject).includes("inc_votes")
  ) {
    return Promise.reject({ status: 400, msg: "Request invalid" });
  }

  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING comment_id, author, article_id, votes, body, created_at;`,
      [updateObject.inc_votes, comment_id]
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No comments for supplied ID",
        });
      } else {
        return response.rows[0];
      }
    });
};

module.exports = {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  deleteComment,
  updateCommentById,
};

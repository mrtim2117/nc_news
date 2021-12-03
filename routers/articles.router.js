const express = require("express");
const {
  getArticleById,
  patchArticlebyId,
  getArticles,
} = require("../contollers/articles.controller");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../contollers/comments.controller");

const articlesRouter = express.Router();

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticlebyId);

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;

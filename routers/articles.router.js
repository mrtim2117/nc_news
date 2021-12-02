const express = require("express");
const {
  getArticleById,
  patchArticlebyId,
  getArticles,
} = require("../contollers/articles.controller");

const articlesRouter = express.Router();

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticlebyId);

articlesRouter.route("/").get(getArticles);

module.exports = articlesRouter;

const express = require("express");
const {
  getArticleById,
  patchArticlebyId,
} = require("../contollers/articles.controller");

const articlesRouter = express.Router();

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticlebyId);

module.exports = articlesRouter;

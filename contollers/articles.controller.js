const {
  selectArticleById,
  updateArticleById,
} = require("../models/articles.model");

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  return selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticlebyId = (req, res, next) => {
  const { article_id } = req.params;
  const updateObject = req.body;

  return updateArticleById(article_id, updateObject)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticleById, patchArticlebyId };

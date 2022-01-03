const {
  selectArticleById,
  updateArticleById,
  selectArticleCount,
  selectArticles,
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

const getArticles = (req, res, next) => {
  const { sort_by, order, topic, limit, p } = req.query;

  let rowCount = 0;

  return selectArticleCount(topic)
    .then((rows) => {
      rowCount = rows.length;
      return;
    })
    .then(() => {
      return selectArticles(sort_by, order, topic, limit, p);
    })
    .then((articles) => {
      const result = { total_count: rowCount, articles: articles };

      return res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticleById, patchArticlebyId, getArticles };

const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  deleteComment,
} = require("../models/comments.model");

const { checkIfArticleExists } = require("../models/articles.model");

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  return checkIfArticleExists(article_id)
    .then(() => {
      return selectCommentsByArticleId(article_id).then((comments) => {
        return res.status(200).send({ comments });
      });
    })
    .catch((err) => {
      next(err);
    });
};

const postCommentByArticleId = (req, res, next) => {
  const comment = req.body;
  const { article_id } = req.params;

  return checkIfArticleExists(article_id)
    .then(() => {
      return insertCommentByArticleId(article_id, comment).then(
        (insertedComment) => {
          return res.status(201).send({ comment: insertedComment });
        }
      );
    })
    .catch((err) => {
      next(err);
    });
};

const deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  return deleteComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
};

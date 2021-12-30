const express = require("express");
const {
  deleteCommentById,
  patchCommentById,
} = require("../contollers/comments.controller");

const commentsRouter = express.Router();

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchCommentById);

module.exports = commentsRouter;

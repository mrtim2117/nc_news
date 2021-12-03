const express = require("express");
const { deleteCommentById } = require("../contollers/comments.controller");

const commentsRouter = express.Router();

commentsRouter.route("/:comment_id").delete(deleteCommentById);

module.exports = commentsRouter;

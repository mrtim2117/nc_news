const express = require("express");
const getTopics = require("../contollers/topics.controlller");

const topicsRouter = express.Router();
topicsRouter.route("/").get(getTopics);

module.exports = topicsRouter;

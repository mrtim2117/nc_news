const express = require("express");
const topicsRouter = require("./topics.router");
const articlesRouter = require("./articles.router");
const getApi = require("../contollers/api.controller");

const apiRouter = express.Router();

apiRouter.route("/").get(getApi);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;

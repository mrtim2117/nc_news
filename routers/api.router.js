const express = require("express");
const topicsRouter = require("./topics.router");

const apiRouter = express.Router();

apiRouter.route("/").get((req, res, next) => {
  res.status(200).send({ msg: "All is well!" });
});

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;

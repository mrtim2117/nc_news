const express = require("express");
const apiRouter = require("./routers/api.router");
const handleInvalidPath = require("./contollers/bad-path.controller");

const app = express();
app.use("/api", apiRouter);

app.all("/*", handleInvalidPath);

// app.all("/*", (req, res, next) => {
//   res.status(404).send({ msg: "Path not found!" });
// });

module.exports = app;

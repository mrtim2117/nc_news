const express = require("express");
const getUsers = require("../contollers/users.controller");

const usersRouter = express.Router();

usersRouter.route("/").get(getUsers);

module.exports = usersRouter;

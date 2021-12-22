const express = require("express");
const { getUsers, getUserById } = require("../contollers/users.controller");

const usersRouter = express.Router();

usersRouter.route("/").get(getUsers);
usersRouter.route("/:username").get(getUserById);

module.exports = usersRouter;

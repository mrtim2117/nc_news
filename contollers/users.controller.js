const { selectUsers, selectUserById } = require("../models/users.model");

const getUsers = (req, res, next) => {
  return selectUsers()
    .then((users) => {
      return res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

const getUserById = (req, res, next) => {
  const { username } = req.params;

  return selectUserById(username)
    .then((user) => {
      return res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getUsers, getUserById };

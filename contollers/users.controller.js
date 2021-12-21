const selectUsers = require("../models/users.model");

const getUsers = (req, res, next) => {
  return selectUsers()
    .then((users) => {
      return res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = getUsers;

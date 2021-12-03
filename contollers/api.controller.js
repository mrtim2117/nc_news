const listEndpoints = require("../models/api.model");

const getApi = (req, res, next) => {
  return listEndpoints()
    .then((endpoints) => {
      // res.status(200).send({ msg: "All is well!" });
      res.status(200).send({ endpoints: endpoints });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = getApi;

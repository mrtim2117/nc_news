const { handleCustomErrors } = require("../errors/errors.js");

const handleInvalidPath = (req, res, next) => {
  handleCustomErrors({ status: 404, msg: "Path not found!" }, req, res, next);
};

module.exports = handleInvalidPath;

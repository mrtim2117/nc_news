const handleInvalidPath = (req, res, next) => {
  handleCustomErrors({ status: 404, msg: "Path not found!" }, req, res, next);
};

const handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Request invalid" });
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "invalid user" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "missing data" });
  } else {
    next(err);
  }
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const handle500Errors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error!" });
};

module.exports = {
  handleInvalidPath,
  handlePSQLErrors,
  handle500Errors,
  handleCustomErrors,
};

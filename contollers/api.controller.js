const getApi = (req, res, next) => {
  res
    .status(200)
    .send({ msg: "All is well!" })
    .catch((err) => {
      next(err);
    });
};

module.exports = getApi;

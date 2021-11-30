const db = require("../db/connection");

const selectTopics = () => {
  return db.query(`SELECT slug, description FROM topics;`).then((response) => {
    return response.rows;
  });
};

module.exports = selectTopics;

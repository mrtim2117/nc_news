const db = require("../db/connection");

const selectUsers = () => {
  return db.query(`SELECT username FROM users;`).then((response) => {
    return response.rows;
  });
};

module.exports = selectUsers;

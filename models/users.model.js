const db = require("../db/connection");

const selectUsers = () => {
  return db.query(`SELECT username FROM users;`).then((response) => {
    return response.rows;
  });
};

const selectUserById = (username) => {
  const regex = /^[A-Z0-9_]+$/gi;

  if (username.search(regex) === -1) {
    return Promise.reject({
      status: 400,
      msg: "Request invalid",
    });
  }

  return db
    .query(
      `SELECT username, name, avatar_url FROM users WHERE username = $1;`,
      [username]
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No user for supplied username",
        });
      } else {
        return response.rows[0];
      }
    });
};

module.exports = { selectUsers, selectUserById };

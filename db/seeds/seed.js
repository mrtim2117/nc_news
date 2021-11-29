const db = require("../connection");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;

  // 1. create tables
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users (
        username VARCHAR(20) PRIMARY KEY,
        avatar_url VARCHAR(100),
        name VARCHAR(50) NOT NULL
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE topics (
        slug VARCHAR(30) PRIMARY KEY,
        description VARCHAR(255)
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR (100) NOT NULL,
        body TEXT,
        votes INT DEFAULT 0,
        author VARCHAR(20) REFERENCES users(username),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments(
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR(20) REFERENCES users(username),
        article_id INT REFERENCES articles(article_id),
        votes INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        body TEXT
      );`);
    });

  // 2. insert data
};

module.exports = seed;

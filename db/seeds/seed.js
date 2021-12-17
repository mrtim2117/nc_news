const db = require("../connection");
const format = require("pg-format");

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;

  return db

    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles;`);
    })
    .then(() => {
      const dropUsersPromise = db.query(`DROP TABLE IF EXISTS users;`);
      const dropTopicsPromise = db.query(`DROP TABLE IF EXISTS topics;`);

      return Promise.all([dropUsersPromise, dropTopicsPromise]);
    })
    .then(() => {
      const createUsersPromise = db.query(`
        CREATE TABLE users (
          username VARCHAR(20) PRIMARY KEY,
          name VARCHAR(50) NOT NULL,
          avatar_url VARCHAR(200)
        );
      `);

      const createTopicsPromise = db.query(`
        CREATE TABLE topics (
          slug VARCHAR(30) PRIMARY KEY,
          description VARCHAR(255)
        );
      `);

      return Promise.all([createUsersPromise, createTopicsPromise]);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE articles (
          article_id SERIAL PRIMARY KEY,
          title VARCHAR (100) NOT NULL,
          body TEXT NOT NULL,
          votes INT DEFAULT 0 NOT NULL,
          topic VARCHAR(30) REFERENCES topics(slug),
          author VARCHAR(20) REFERENCES users(username),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE comments(
          comment_id SERIAL PRIMARY KEY,
          author VARCHAR(20) REFERENCES users(username) NOT NULL,
          article_id INT REFERENCES articles(article_id) NOT NULL,
          votes INT DEFAULT 0 NOT NULL,
          body TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);
    })
    .then(() => {
      const formattedUserData = userData.map((user) => {
        return [user.username, user.name, user.avatar_url];
      });
      const formattedTopicData = topicData.map((topic) => {
        return [topic.slug, topic.description];
      });

      const queryUserInsert = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;
      `,
        formattedUserData
      );
      const queryTopcsInsert = format(
        `INSERT INTO topics (slug, description) VALUES %L RETURNING *;
      `,
        formattedTopicData
      );

      const userInsertPromise = db.query(queryUserInsert);
      const topicInsertPromise = db.query(queryTopcsInsert);

      return Promise.all([userInsertPromise, topicInsertPromise]);
    })
    .then(() => {
      const formattedArticleData = articleData.map((article) => {
        return [
          article.title,
          article.body,
          article.votes,
          article.topic,
          article.author,
          article.created_at,
        ];
      });

      const queryString = format(
        `INSERT INTO ARTICLES (title, body, votes, topic, author, created_at) VALUES %L RETURNING *;
        `,
        formattedArticleData
      );

      return db.query(queryString);
    })
    .then(() => {
      formattedCommentData = commentData.map((comment) => {
        return [
          comment.author,
          comment.article_id,
          comment.votes,
          comment.body,
          comment.created_at,
        ];
      });

      const queryString = format(
        `INSERT INTO comments (author, article_id, votes, body, created_at) VALUES %L RETURNING *;
        `,
        formattedCommentData
      );

      return db.query(queryString);
    });
};

module.exports = seed;

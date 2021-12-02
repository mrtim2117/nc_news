const db = require("../db/connection");

const selectArticleById = (article_id) => {
  return db
    .query(
      `
        SELECT articles.author, title, articles.article_id, articles.body, topic, articles.created_at, articles.votes, count(comments.article_id) AS comment_count
        FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;
    `,
      [article_id]
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No articles for supplied ID",
        });
      } else {
        response.rows[0].comment_count = parseInt(
          response.rows[0].comment_count
        );
        return response.rows[0];
      }
    });
};

const updateArticleById = (article_id, updateObject) => {
  if (
    Object.keys(updateObject).length != 1 ||
    !Object.keys(updateObject).includes("inc_votes")
  ) {
    return Promise.reject({ status: 400, msg: "Request invalid" });
  }

  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [updateObject.inc_votes, article_id]
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No articles for supplied ID",
        });
      } else {
        return response.rows[0];
      }
    });
};

const selectArticles = (sort_by = "created_at", order = "DESC", topic) => {
  // Check "sort_by" against valid list of fields, since pg doesn't
  // allow us to parameterise ORDER BY, hence attempt to reduce
  // SQL injection risk.
  if (
    ![
      "article_id",
      "author",
      "title",
      "topic",
      "created_at",
      "votes",
      "comment_count",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort field" });
  }

  // Similarly check sort order for same reason
  if (!["ASC", "DESC"].includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Invalid sort order" });
  }

  return db
    .query(`SELECT slug FROM topics;`)
    .then((res) => {
      return res.rows;
    })
    .then((topics) => {
      // Wouldn't normally use string literal for SQL string,
      // but pg forces us to - hence the above array checks!
      const sqlSelect = `SELECT articles.author, title, articles.article_id, articles.body, topic, articles.created_at, articles.votes, count(comments.article_id) AS comment_count `;
      const sqlFrom = `FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;
      const sqlGroupBy = `GROUP BY articles.article_id `;
      const sqlOrderBy = `ORDER BY ${sort_by} ${order}; `;
      let sqlQuery = sqlSelect + sqlFrom;

      // If we have a requested topic, ensure it's valid
      // - again attempting to prevent SQL injection attacks
      if (topic) {
        const validTopics = topics.map((topicObj) => {
          return topicObj.slug;
        });

        if (!validTopics.includes(topic)) {
          return Promise.reject({ status: 400, msg: "Invalid topic" });
        }

        sqlQuery += `WHERE articles.topic = '${topic}' `;
      }

      sqlQuery += sqlGroupBy;
      sqlQuery += sqlOrderBy;

      // Now finally retrieve the requested articles
      return db.query(sqlQuery).then((response) => {
        if (response.rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "No articles found",
          });
        } else {
          response.rows.forEach((row) => {
            row.comment_count = parseInt(row.comment_count);
          });

          return response.rows;
        }
      });
    });
};

module.exports = { selectArticleById, updateArticleById, selectArticles };

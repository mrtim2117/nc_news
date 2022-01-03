const request = require("supertest");

const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test("Returns list of endpoints supported", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(Object.keys(response.body.endpoints).length).toBe(11);
      });
  });
});

describe("Non-existent route", () => {
  test("/api/gobbleguke", () => {
    return request(app)
      .get("/api/gobbleguke")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path not found!");
      });
  });
});

describe("GET /api/topics", () => {
  test("Returns an array of topics of correct structure", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.topics)).toBe(true);
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("Responds with a single article object corresponding to requested ID", () => {
    return request(app)
      .get("/api/articles/9")
      .expect(200)
      .then((response) => {
        expect(response.body.article).toHaveProperty("article_id", 9);
        expect(response.body.article).toHaveProperty("author", "butter_bridge");
        expect(response.body.article).toHaveProperty(
          "title",
          "They're not exactly dogs, are they?"
        );
        expect(response.body.article).toHaveProperty(
          "body",
          "Well? Think about it."
        );
        expect(response.body.article).toHaveProperty("topic", "mitch");
        expect(response.body.article).toHaveProperty(
          "created_at",
          "2020-06-06T09:10:00.000Z"
        );
        expect(response.body.article).toHaveProperty("votes", 0);
        expect(response.body.article).toHaveProperty("comment_count", 2);
        expect(Object.keys(response.body.article).length).toBe(8);
      });
  });
  test("Returns 404 for non-existent article_id", () => {
    return request(app)
      .get("/api/articles/2000")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("No articles for supplied ID");
      });
  });
  test("Returns 400 on requesting article_id of incorrect data type", () => {
    return request(app)
      .get("/api/articles/sausages")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Request invalid");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("Receives 200 and successfully increments votes on object with given aricle_id", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: 4 })
      .expect(200)
      .then((res) => {
        expect(res.body.article).toHaveProperty("article_id", 2);
        expect(res.body.article).toHaveProperty("votes", 4);
        expect(res.body.article).toEqual(
          expect.objectContaining({
            title: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("Receives 200 and successfully decrements votes on object with given aricle_id, where inc_votes is -ve", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -5 })
      .expect(200)
      .then((res) => {
        expect(res.body.article).toHaveProperty("article_id", 1);
        expect(res.body.article).toHaveProperty("votes", 95);
        expect(res.body.article).toEqual(
          expect.objectContaining({
            title: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("Receives 400 when no patch message body provided", () => {
    return request(app)
      .patch("/api/articles/3")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Request invalid");
      });
  });
  test("Receives 400 when patch properties other than 'inc_votes' provided", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ title: "Dave the dev" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Request invalid");
      });
  });
  test("Receives 400 when many patch properties other than 'inc_votes' provided", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ title: "Dave the dev", body: "a body update" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Request invalid");
      });
  });
  test("Receives 400 when invalid data type 'inc_votes' provided", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: "testUpdate" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Request invalid");
      });
  });
  test("Receives 404 when patching non-existent article_id", () => {
    return request(app)
      .patch("/api/articles/5000")
      .send({ inc_votes: 7 })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("No articles for supplied ID");
      });
  });
  test("Receives 400 when patching article_id of incorrect datatype", () => {
    return request(app)
      .patch("/api/articles/sausages")
      .send({ inc_votes: 7 })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Request invalid");
      });
  });
});
describe("/GET /api/articles", () => {
  test("Returns and array of articles with correct structure and pagination (default 10 articles)", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.articles)).toBe(true);
        expect(res.body.articles.length).toBe(10);
        expect(res.body.total_count).toBe(12);
        res.body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("Returns and array of articles with correct structure and pagination (7 articles)", () => {
    return request(app)
      .get("/api/articles?limit=7")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.articles)).toBe(true);
        expect(res.body.total_count).toBe(12);
        expect(res.body.articles.length).toBe(7);
        res.body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("Returns and array of articles with correct structure and pagination (2nd page with 2 articles)", () => {
    return request(app)
      .get("/api/articles?p=2")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.articles)).toBe(true);
        expect(res.body.total_count).toBe(12);
        expect(res.body.articles.length).toBe(2);
        res.body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("Returns and array of articles with correct structure and pagination (2nd page with 2 articles)", () => {
    return request(app)
      .get("/api/articles?p=2&limit=4")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.articles)).toBe(true);
        expect(res.body.total_count).toBe(12);
        expect(res.body.articles.length).toBe(4);
        res.body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("Returns and array of articles with correct structure and pagination (3rd page with 2 articles)", () => {
    return request(app)
      .get("/api/articles?p=3&limit=5")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.articles)).toBe(true);
        expect(res.body.articles.length).toBe(2);
        expect(res.body.total_count).toBe(12);
        res.body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("Returns 400 for negative limit", () => {
    return request(app)
      .get("/api/articles?limit=-2")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid limit");
      });
  });
  test("Returns 400 for invalid limit", () => {
    return request(app)
      .get("/api/articles?limit=sausages")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Request invalid");
      });
  });
  test("Page * limit exceeds object count gives empty array", () => {
    return request(app)
      .get("/api/articles?limit=10&p=5")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toEqual([]);
      });
  });
  test("Page less than 1 gives 400", () => {
    return request(app)
      .get("/api/articles?p=0")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid page");
      });
  });
  test("Negative page gives 400", () => {
    return request(app)
      .get("/api/articles?p=-3")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid page");
      });
  });
  test("Not a page number gives 400", () => {
    return request(app)
      .get("/api/articles?p=sausages")
      .expect(400)
      .then((res) => {});
  });
  test("Order defaults to descending created_at", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body.total_count).toBe(12);
        expect(res.body.articles).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
  test("Sort by property other than 'created_at' and default order", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then((res) => {
        expect(res.body.total_count).toBe(12);
        expect(res.body.articles).toBeSorted({
          key: "article_id",
          descending: true,
        });
      });
  });
  test("Sort by property other than 'created_at' and non-default order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then((res) => {
        expect(res.body.total_count).toBe(12);
        expect(res.body.articles).toBeSorted({
          key: "votes",
          descending: false,
        });
      });
  });
  test("Sort by property other than 'created_at' and explict desc order", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count&order=desc")
      .expect(200)
      .then((res) => {
        expect(res.body.total_count).toBe(12);
        expect(res.body.articles).toBeSorted({
          key: "comment_count",
          descending: true,
        });
      });
  });
  test("Filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeSorted({
          key: "created_at",
          descending: true,
        });
        expect(res.body.articles.length).toBe(10);
        expect(res.body.total_count).toBe(11);
        res.body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("200 and empty articles array where valid topic has no articles associated", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toEqual([]);
        expect(res.body.total_count).toBe(0);
      });
  });
  test("404 Invalid topic for non-existent topic", () => {
    return request(app)
      .get("/api/articles?topic=sausages")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid topic");
      });
  });
  test("400 Invalid sort field for non-existant propert", () => {
    return request(app)
      .get("/api/articles?sort_by=sausages")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid sort field");
      });
  });
  test("400 for valid sort_by and invalid sort order", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=dave")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid sort order");
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("Correct number of comments returned in desired structure for article_id", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.comments)).toBe(true);
        expect(res.body.comments.length).toBe(2);
        res.body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("Returns 200 and empty comments array for valid article with no comments", () => {
    return request(app)
      .get("/api/articles/12/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toEqual([]);
      });
  });
  test("Returns 404 'article not found' for non-existent article_id", () => {
    return request(app)
      .get("/api/articles/215/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("article not found");
      });
  });
  test("Returns 400 'Request invalid' for incorrect article_id data type", () => {
    return request(app)
      .get("/api/articles/sausages/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Request invalid");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("Successfully creates new comment for article_id", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "icellusedkars", body: "Here are some comments" })
      .expect(201)
      .then((res) => {
        const comment = res.body.comment;
        expect(comment.author).toBe("icellusedkars");
        expect(comment.body).toBe("Here are some comments");
        expect(comment.article_id).toBe(2);
        expect(comment.votes).toBe(0);
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("404 for attempting to post a comment to a non-existent article_id", () => {
    return request(app)
      .post("/api/articles/290/comments")
      .send({ username: "icellusedkars", body: "Here are some comments" })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("article not found");
      });
  });
  test("404 for attempting to post a comment under an invalid username", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "DodgyDave", body: "Here are some dodgy comments" })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("invalid user");
      });
  });
  test("Successfully creates new comment for article_id and ignores additional properties posted", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "icellusedkars",
        body: "Here are some comments",
        votes: 5,
      })
      .expect(201)
      .then((res) => {
        const comment = res.body.comment;
        expect(comment.author).toBe("icellusedkars");
        expect(comment.body).toBe("Here are some comments");
        expect(comment.article_id).toBe(2);
        expect(comment.votes).toBe(0);
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("400 and fails insert when posting with missing username", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ body: "Here are some comments for Mr Nobody" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("missing data");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("Responds with 204 and no content on successful deletion", () => {
    return request(app)
      .delete("/api/comments/2")
      .expect(204)
      .then((res) => {
        expect(res.body).toEqual({});
      });
  });
  test("Responds with 404 for non-existent comment_id", () => {
    return request(app)
      .delete("/api/comments/200")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toEqual("No comment found");
      });
  });
  test("Responds with 400 for wrong data type comment_id", () => {
    return request(app)
      .delete("/api/comments/sausages")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Request invalid");
      });
  });
});
describe("/api/users", () => {
  test("responds with array of user objects, each with a username property", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.users)).toBe(true);
        expect(res.body.users.length).toBe(4);
        res.body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });
});
describe("GET /api/users/:username", () => {
  test("responds with user object for requested username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then((res) => {
        expect(res.body.user).toEqual(
          expect.objectContaining({
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          })
        );
      });
  });
  test("responds with 404 for non-existent username", () => {
    return request(app)
      .get("/api/users/snoopdog")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("No user for supplied username");
      });
  });
  test("responds with 400 for invalid username (eg special characters)", () => {
    return request(app)
      .get("/api/users/£$22")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Request invalid");
      });
  });
});
describe("PATCH /api/comments/:comment_id", () => {
  test("Receives 200 and successfully increments votes on object with given comment_id", () => {
    return request(app)
      .patch("/api/comments/14")
      .send({ inc_votes: 5 })
      .expect(200)
      .then((res) => {
        expect(res.body.comment).toHaveProperty("comment_id", 14);
        expect(res.body.comment).toHaveProperty("votes", 21);
        expect(res.body.comment).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("Receives 200 and successfully decrements votes on object with given comment_id", () => {
    return request(app)
      .patch("/api/comments/16")
      .send({ inc_votes: -2 })
      .expect(200)
      .then((res) => {
        expect(res.body.comment).toHaveProperty("comment_id", 16);
        expect(res.body.comment).toHaveProperty("votes", -1);
        expect(res.body.comment).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            created_at: expect.any(String),
          })
        );
      });
  });
  test("Receives 400 when no patch message body present", () => {
    return request(app)
      .patch("/api/comments/14")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Request invalid");
      });
  });
  test("Receives 400 when patch properties other than 'inc_votes' provided", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ author: "DaveTheDev" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Request invalid");
      });
  });
  test("Receives 400 when many patch properties other than 'inc_votes' provided", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ author: "DevDave", votes: 5 })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Request invalid");
      });
  });
  test("Receives 400 when invalid data type 'inc_votes' provided", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "Add some votes" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Request invalid");
      });
  });
  test("Receives 404 when patching non-existent article_id", () => {
    return request(app)
      .patch("/api/comments/500")
      .send({ inc_votes: 2 })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("No comments for supplied ID");
      });
  });
  test("Receives 400 when patching comment_id of incorrect datatype", () => {
    return request(app)
      .patch("/api/comments/sausages")
      .send({ inc_votes: 4 })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Request invalid");
      });
  });
});

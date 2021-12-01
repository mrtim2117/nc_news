const request = require("supertest");

const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test("Returns 'All is well!'", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.msg).toBe("All is well!");
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

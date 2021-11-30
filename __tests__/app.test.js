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

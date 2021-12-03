const fs = require("fs/promises");

const listEndpoints = () => {
  // Load api spec from file
  return fs
    .readFile(__dirname + "/../endpoints.json", "utf-8")
    .then((fileContent) => {
      return JSON.parse(fileContent);
    });
};

module.exports = listEndpoints;

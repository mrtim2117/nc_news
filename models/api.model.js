const fs = require("fs/promises");

const listEndpoints = () => {
  return fs
    .readFile(__dirname + "/../endpoints.json", "utf-8")
    .then((fileContent) => {
      return JSON.parse(fileContent);
    });
};

module.exports = listEndpoints;

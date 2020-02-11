const fs = require('fs');
const TODO_STORE = require('../config/config.js');
const USER_CREDENTIALS_STORE = `${__dirname}/../data/userCredentials.json`;

const readFile = path => fs.readFileSync(path);

const writeIntoFile = (content, path = TODO_STORE) =>
  fs.writeFileSync(path, content);

const isFileNotAvailable = function(path) {
  return !(fs.existsSync(path) && fs.statSync(path).isFile());
};

const loadUserCredentials = function() {
  if (isFileNotAvailable(USER_CREDENTIALS_STORE)) {
    return {};
  }
  return JSON.parse(readFile(USER_CREDENTIALS_STORE));
};

const loadPreviousTodoLists = function() {
  if (isFileNotAvailable(TODO_STORE)) {
    return [];
  }
  return JSON.parse(readFile(TODO_STORE));
};

module.exports = {
  loadPreviousTodoLists,
  isFileNotAvailable,
  writeIntoFile,
  readFile,
  loadUserCredentials
};

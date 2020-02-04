const fs = require('fs');

const TODO_STORE = `${__dirname}/../data/todo.json`;

const readFile = path => fs.readFileSync(path);

const writeIntoFile = content => fs.writeFileSync(TODO_STORE, content);

const isFileNotAvailable = function(path) {
  return !(fs.existsSync(path) && fs.statSync(path).isFile());
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
  readFile
};

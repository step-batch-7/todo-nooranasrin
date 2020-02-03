const fs = require('fs');

const TODO_STORE = `${__dirname}/../data/todo.json`;

const readFile = path => fs.readFileSync(path);

const writeIntoFile = (path, content) => fs.writeFileSync(path, content);

const isFileNotAvailable = function(path) {
  const stat = fs.existsSync(path) && fs.statSync(path);
  return !stat || !stat.isFile();
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

const fs = require('fs');

const TODO_STORE = `${__dirname}/../data/todo.json`;

const readFile = path => fs.readFileSync(path);

const writeIntoFile = (path, content) => fs.writeFileSync(path, content);

const isFileNotAvailable = function(path) {
  return !(fs.existsSync(path) && fs.statSync(path).isFile());
};

const loadPreviousTodoLists = function() {
  if (isFileNotAvailable(TODO_STORE)) {
    return [];
  }
  const data = JSON.parse(readFile(TODO_STORE));
  return data;
};

module.exports = {
  loadPreviousTodoLists,
  isFileNotAvailable,
  writeIntoFile,
  readFile
};

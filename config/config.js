const fs = require('fs');

const createDirectoryIfNotExists = function() {
  if (!fs.existsSync(`${__dirname}/../data`)) {
    fs.mkdirSync(`${__dirname}/../data`);
  }
};

const getStoragePath = function() {
  return process.env.STORAGE_FILE || `${__dirname}/../data/todoLists.json`;
};

createDirectoryIfNotExists();
const storagePath = getStoragePath();
module.exports = storagePath;

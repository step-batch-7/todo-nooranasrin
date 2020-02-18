const fs = require('fs');

const createDirectoryIfNotExists = function() {
  if (!fs.existsSync(`${__dirname}/../data`)) {
    fs.mkdirSync(`${__dirname}/../data`);
  }
};

const createUserCredentialsFile = function() {
  if (!fs.existsSync(`${__dirname}/../data/userCredentials.json`)) {
    fs.writeFileSync(
      `${__dirname}/../data/userCredentials.json`,
      JSON.stringify({})
    );
  }
};

const createTodoStoreFile = function() {
  if (!fs.existsSync(`${__dirname}/../data/todoLists.json`)) {
    fs.writeFileSync(`${__dirname}/../data/todoLists.json`, JSON.stringify({}));
  }
};

const createSetup = function() {
  createDirectoryIfNotExists();
  createUserCredentialsFile();
  createTodoStoreFile();
};

module.exports = createSetup;

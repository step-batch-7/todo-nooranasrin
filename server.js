const { writeFileSync } = require('fs');
require('./config/config')();
const TodoLog = require('./lib/todoLog');
const app = require('./lib/routers');
const TODO_STORE = `${__dirname}/data/todoLists.json`;
const USER_STORE = `${__dirname}/data/userCredentials.json`;
const todoLists = require(TODO_STORE);
const userCredentials = require(USER_STORE);
const [, , port] = process.argv;
const DEFAULT_PORT = 4000;

const main = function(port = DEFAULT_PORT) {
  app.locals = { todoLists: TodoLog.load(todoLists) };
  app.locals.userCredentials = userCredentials;
  app.locals.TODO_STORE = TODO_STORE;
  app.locals.USER_STORE = USER_STORE;
  app.locals.writer = writeFileSync;

  app.listen(port, () => process.stdout.write('Started Listening'));
};

main(port);

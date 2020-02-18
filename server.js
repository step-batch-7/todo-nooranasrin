const { writeFileSync } = require('fs');
require('./config/config')();
const TodoStore = require('./lib/todoStore');
const UserStore = require('./lib/userStore');
const Sessions = require('./lib/sessions');
const app = require('./lib/routers');
const TODO_STORE = `${__dirname}/data/todoLists.json`;
const USER_STORE = `${__dirname}/data/userCredentials.json`;
const todoLists = require(TODO_STORE);
const userCredentials = require(USER_STORE);
const [, , port] = process.argv;
const DEFAULT_PORT = 4000;

const main = function(port = DEFAULT_PORT) {
  app.locals = {
    todoStore: TodoStore.initialize(todoLists, TODO_STORE, writeFileSync),
    sessionStore: new Sessions(1000),
    userStore: UserStore.initialize(userCredentials, USER_STORE, writeFileSync)
  };
  app.listen(port);
};

main(port);

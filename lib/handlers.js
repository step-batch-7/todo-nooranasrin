const TodoLog = require('./todoLog');
const { Todo } = require('./todo');
const {
  loadPreviousTodoLists,
  writeIntoFile,
  loadUserCredentials
} = require('./fileOperations');

const todoLists = TodoLog.load(loadPreviousTodoLists());

const sendTodoList = function(request, response) {
  response.json(todoLists.clone());
};

const saveTODO = function(request, response) {
  request.body.id = todoLists.generateTodoId();
  const todo = Todo.createNewTodo(request.body);
  todoLists.addTodo(todo);
  todoLists.save(writeIntoFile);
  response.json(todoLists.clone);
};

const changeTaskStatus = function(request, response) {
  const { todoId, taskId } = request.body;
  todoLists.changeTaskStatus(todoId, taskId);
  todoLists.save(writeIntoFile);
  response.json(todoLists.clone);
};

const deleteTask = function(request, response) {
  const { todoId, taskId } = request.body;
  todoLists.deleteTask(todoId, taskId);
  todoLists.save(writeIntoFile);
  response.json(todoLists.clone);
};

const deleteTodo = function(request, response) {
  todoLists.deleteTodo(request.body.todoId);
  todoLists.save(writeIntoFile);
  response.json(todoLists.clone);
};

const updateTitle = function(request, response) {
  const { todoId, title } = request.body;
  todoLists.updateTitle(title, todoId);
  todoLists.save(writeIntoFile);
  response.json(todoLists.clone);
};

const updateTask = function(request, response) {
  const { todoId, task, taskId } = request.body;
  todoLists.updateTask(todoId, taskId, task);
  todoLists.save(writeIntoFile);
  response.json(todoLists.clone);
};

const addNewTask = function(request, response) {
  const { todoId, newTask } = request.body;
  todoLists.addNewTask(todoId, newTask);
  todoLists.save(writeIntoFile);
  response.json(todoLists.clone);
};

const registerUser = function(request, response) {
  const { userName, password, email, phoneNumber } = request.body;
  const userCredentials = loadUserCredentials();
  userCredentials[userName] = { password, email, phoneNumber };
  const path = `${__dirname}/../data/userCredentials.json`;
  writeIntoFile(JSON.stringify(userCredentials), path);
  response.setHeader('Location', '/index.html');
  response.statusCode = 301;
  response.end();
};

const validateUserName = function(request, response) {
  const userCredentials = loadUserCredentials();
  const userName = request.body;
  const userNames = Object.keys(userCredentials);
  let isExists = { isExists: false };
  if (userNames.includes(userName)) {
    isExists = { isExists: true };
  }
  response.json(isExists);
};

const validateLogin = function(request, response) {
  const { userName, password } = request.body;
  const userCredentials = loadUserCredentials();
  const userDetails = userCredentials[userName];
  const isExistingUser = { isValid: false };
  if (userDetails && userDetails.password === password) {
    isExistingUser.isValid = true;
  }
  response.json(isExistingUser);
};

module.exports = {
  sendTodoList,
  saveTODO,
  deleteTask,
  changeTaskStatus,
  updateTitle,
  updateTask,
  addNewTask,
  deleteTodo,
  registerUser,
  validateUserName,
  validateLogin
};

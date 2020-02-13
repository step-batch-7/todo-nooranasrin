const querystring = require('querystring');
const CONTENT_TYPES = require('./mimeTypes');
const STATUS_CODE = require('./statusCodes');
const TodoLog = require('./todoLog');
const { Todo } = require('./todo');
const {
  loadPreviousTodoLists,
  isFileNotAvailable,
  writeIntoFile,
  readFile,
  loadUserCredentials
} = require('./fileOperations');

const STATIC_FOLDER = `${__dirname}/../public`;

const todoLists = TodoLog.load(loadPreviousTodoLists());

const getPath = function(path) {
  if (path === '/') {
    return `${STATIC_FOLDER}/index.html`;
  }
  return `${STATIC_FOLDER}${path}`;
};

const sendResponse = function(response, todoLists) {
  response.setHeader('Content-Type', 'application/json');
  response.end(todoLists);
};

const serve404Page = function(request, response) {
  response.writeHead(STATUS_CODE.NOT_FOUND, { 'Content-Type': 'text/html' });
  response.end(`${request.url} page not found`);
};

const sendTodoList = function(request, response) {
  sendResponse(response, todoLists.clone());
};

const serveMainPage = function(request, response, next) {
  const path = getPath(request.url);
  if (isFileNotAvailable(path)) {
    return next();
  }
  const [, extension] = path.match(/.*\.(.*)$/);
  const contentType = CONTENT_TYPES[extension];
  response.setHeader('Content-Type', contentType);
  response.end(readFile(path));
};

const methodNotAllowed = function(request, response) {
  response.setHeader('Content-Type', 'text/plain');
  response.writeHead(STATUS_CODE.METHOD_NOT_ALLOWED);
  response.end('Method Not Allowed');
};

const saveTODO = function(request, response) {
  request.body.id = todoLists.generateTodoId();
  const todo = Todo.createNewTodo(request.body);
  todoLists.addTodo(todo);
  todoLists.save(writeIntoFile);
  sendResponse(response, todoLists.clone());
};

const changeTaskStatus = function(request, response) {
  const { todoId, taskId } = request.body;
  todoLists.changeTaskStatus(todoId, taskId);
  todoLists.save(writeIntoFile);
  sendResponse(response, todoLists.clone());
};

const deleteTask = function(request, response) {
  const { todoId, taskId } = request.body;
  todoLists.deleteTask(todoId, taskId);
  todoLists.save(writeIntoFile);
  sendResponse(response, todoLists.clone());
};

const deleteTodo = function(request, response) {
  todoLists.deleteTodo(request.body.todoId);
  todoLists.save(writeIntoFile);
  sendResponse(response, todoLists.clone());
};

const updateTitle = function(request, response) {
  const { todoId, title } = request.body;
  todoLists.updateTitle(title, todoId);
  todoLists.save(writeIntoFile);
  sendResponse(response, todoLists.clone());
};

const updateTask = function(request, response) {
  const { todoId, task, taskId } = request.body;
  todoLists.updateTask(todoId, taskId, task);
  todoLists.save(writeIntoFile);
  sendResponse(response, todoLists.clone());
};

const addNewTask = function(request, response) {
  const { todoId, newTask } = request.body;
  todoLists.addNewTask(todoId, newTask);
  todoLists.save(writeIntoFile);
  sendResponse(response, todoLists.clone());
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
  sendResponse(response, JSON.stringify(isExists));
};

const validateLogin = function(request, response) {
  const { userName, password } = request.body;
  const userCredentials = loadUserCredentials();
  const userDetails = userCredentials[userName];
  const isExistingUser = { isValid: false };
  if (userDetails && userDetails.password === password) {
    isExistingUser.isValid = true;
  }
  sendResponse(response, JSON.stringify(isExistingUser));
};

const readBody = function(request, response, next) {
  let content = '';
  request.on('data', chunk => {
    content += chunk;
  });
  request.on('end', () => {
    request.body = content;
    next();
  });
};

const readJSON = function(request, response, next) {
  const contentType = request.headers['content-type'];
  if (contentType === 'application/x-www-form-urlencoded') {
    request.body = querystring.parse(request.body);
  }
  if (contentType === 'application/json') {
    request.body = JSON.parse(request.body);
  }
  next();
};

module.exports = {
  readBody,
  readJSON,
  serveMainPage,
  sendTodoList,
  saveTODO,
  deleteTask,
  changeTaskStatus,
  updateTitle,
  updateTask,
  addNewTask,
  deleteTodo,
  registerUser,
  serve404Page,
  methodNotAllowed,
  validateUserName,
  validateLogin
};

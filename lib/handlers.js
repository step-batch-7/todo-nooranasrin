const CONTENT_TYPES = require('./mimeTypes');
const STATUS_CODE = require('./statusCodes');
const TodoLog = require('./todoLog');
const { Todo } = require('./todo');
const {
  loadPreviousTodoLists,
  isFileNotAvailable,
  writeIntoFile,
  readFile
} = require('./fileOperations');

const STATIC_FOLDER = `${__dirname}/../public`;

const todoLists = TodoLog.load(loadPreviousTodoLists());

const getPath = function(path) {
  if (path === '/') {
    return `${STATIC_FOLDER}/index.html`;
  }
  return `${STATIC_FOLDER}${path}`;
};

const serve404Page = function(request, response) {
  response.writeHead(STATUS_CODE.NOT_FOUND, { 'Content-Type': 'text/html' });
  response.end(`${request.url} page not found`);
};

const sendTodoList = function(request, response) {
  response.endJSON(todoLists.clone());
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
  const result = todoLists.clone();
  writeIntoFile(result);
  response.endJSON(result);
};

const changeTaskStatus = function(request, response) {
  const { todoId, taskId } = request.body;
  todoLists.changeTaskStatus(todoId, taskId);
  const result = todoLists.clone();
  writeIntoFile(result);
  response.endJSON(result);
};

const deleteTask = function(request, response) {
  const { todoId, taskId } = request.body;
  todoLists.deleteTask(todoId, taskId);
  const result = todoLists.clone();
  writeIntoFile(result);
  response.endJSON(result);
};

const deleteTodo = function(request, response) {
  todoLists.deleteTodo(request.body.todoId);
  const result = todoLists.clone();
  writeIntoFile(result);
  response.endJSON(result);
};

const updateTitle = function(request, response) {
  const { todoId, title } = request.body;
  todoLists.updateTitle(title, todoId);
  const result = todoLists.clone();
  writeIntoFile(result);
  response.endJSON(result);
};

const updateTask = function(request, response) {
  const { todoId, task, taskId } = request.body;
  todoLists.updateTask(todoId, taskId, task);
  const result = todoLists.clone();
  writeIntoFile(result);
  response.endJSON(result);
};

const addNewTask = function(request, response) {
  const { todoId, newTask } = request.body;
  todoLists.addNewTask(todoId, newTask);
  const result = todoLists.clone();
  writeIntoFile(result);
  response.endJSON(result);
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

const readJSON = function(req, res, next) {
  const contentType = req.headers['content-type'];
  if (contentType === 'application/json') {
    req.body = JSON.parse(req.body);
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
  serve404Page,
  methodNotAllowed
};

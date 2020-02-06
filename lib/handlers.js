const querystring = require('querystring');
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
const App = require('./app');

const STATIC_FOLDER = `${__dirname}/../public`;

const todoLists = TodoLog.load(loadPreviousTodoLists());

const formatTodoDetails = function(body) {
  const todoDetails = querystring.parse(body);
  if (todoDetails.tasks) {
    todoDetails.tasks = JSON.parse(todoDetails.tasks);
  }
  return todoDetails;
};

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
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.end(todoLists.toJSONString());
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
  writeIntoFile(todoLists.toJSONString());
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.end(todoLists.toJSONString());
};

const changeTaskStatus = function(request, response) {
  const { todoId, taskId } = request.body;
  todoLists.changeTaskStatus(todoId, taskId);
  writeIntoFile(todoLists.toJSONString());
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.end(todoLists.toJSONString());
};

const deleteTask = function(request, response) {
  const { todoId, taskId } = request.body;
  todoLists.deleteTask(todoId, taskId);
  writeIntoFile(todoLists.toJSONString());
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.end(todoLists.toJSONString());
};

const deleteTodo = function(request, response) {
  todoLists.deleteTodo(request.body.todoId);
  writeIntoFile(todoLists.toJSONString());
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.end(todoLists.toJSONString());
};

const updateTodo = function(request, response) {
  const updatedTodo = Todo.createNewTodo(request.body);
  todoLists.updateTodo(updatedTodo, request.body.todoId);
  writeIntoFile(todoLists.toJSONString());
  response.setHeader('Content-Type', CONTENT_TYPES.json);
  response.end(todoLists.toJSONString());
};

const readBody = function(request, response, next) {
  let comment = '';
  request.on('data', chunk => {
    comment += chunk;
  });
  request.on('end', () => {
    request.body = formatTodoDetails(comment);
    next();
  });
};

const app = new App();

app.use(readBody);
app.get('', serveMainPage);
app.get('/todoList', sendTodoList);
app.post('/saveTodo', saveTODO);
app.post('/deleteTask', deleteTask);
app.post('/changeTaskStatus', changeTaskStatus);
app.post('/updateTodo', updateTodo);
app.post('/deleteTodo', deleteTodo);
app.get('', serve404Page);
app.use(methodNotAllowed);

module.exports = { app };

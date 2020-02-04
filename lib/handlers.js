const querystring = require('querystring');
const CONTENT_TYPES = require('./mimeTypes');
const STATUS_CODE = require('./statusCodes');
const TodoLog = require('./todoLog');
const Todo = require('./todo');
const {
  loadPreviousTodoLists,
  isFileNotAvailable,
  writeIntoFile,
  readFile
} = require('./fileOperations');
const App = require('./app');

const STATIC_FOLDER = `${__dirname}/../public`;

const todoLists = new TodoLog(loadPreviousTodoLists());

const formatComment = body => querystring.parse(body);

const getContentType = function(path) {
  const [, extension] = path.match(/.*\.(.*)$/);
  return CONTENT_TYPES[extension];
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
  response.setHeader('Content-Type', 'text/html');
  response.end(todoLists.toJSON());
};

const serveMainPage = function(request, response, next) {
  const path = getPath(request.url);
  if (isFileNotAvailable(path)) {
    return next();
  }
  response.setHeader('Content-Type', getContentType(path));
  response.end(readFile(path));
};

const methodNotAllowed = function(request, response) {
  response.setHeader('Content-Type', 'text/plain');
  response.writeHead(STATUS_CODE.METHOD_NOT_ALLOWED);
  response.end('Method Not Allowed');
};

const saveTODO = function(request, response) {
  request.body.id = todoLists.generateTodoId();
  const todo = Todo.formatTodo(request.body);
  todoLists.addTodo(todo);
  writeIntoFile(`${__dirname}/../data/todo.json`, todoLists.toJSON());
  response.setHeader('Content-Type', 'text/plain');
  response.end(JSON.stringify(todo));
};

const readBody = function(request, response, next) {
  let comment = '';
  request.on('data', chunk => {
    comment += chunk;
  });
  request.on('end', () => {
    request.body = formatComment(comment);
    next();
  });
};

const app = new App();

app.use(readBody);
app.get('', serveMainPage);
app.get('/todoList', sendTodoList);
app.post('/saveTodo', saveTODO);
app.get('', serve404Page);
app.use(methodNotAllowed);

module.exports = { app };

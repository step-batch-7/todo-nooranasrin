const fs = require('fs');
const querystring = require('querystring');
const CONTENT_TYPES = require('./mimeTypes');
const STATUS_CODE = require('./statusCodes');
const { loadTemplate } = require('./loadTemplate');
const App = require('./app');

const STATIC_FOLDER = `${__dirname}/../public`;
const TODO_STORE = `${__dirname}/../data/todo.json`;

const isFileNotAvailable = function(path) {
  const stat = fs.existsSync(path) && fs.statSync(path);
  return !stat || !stat.isFile();
};

const formatData = function(data) {
  return data.replace(/\r\n/g, '<br>');
};

const loadPreviousTodoLists = function() {
  if (isFileNotAvailable(TODO_STORE)) {
    return [];
  }
  const comments = JSON.parse(fs.readFileSync(TODO_STORE));
  return comments;
};

const todoLists = loadPreviousTodoLists();

const formatComment = function(body) {
  return querystring.parse(body);
};
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
  const body = loadTemplate('error.html', { URL: request.url });
  response.setHeader('Content-Type', 'text/html');
  response.writeHead(STATUS_CODE.NOT_FOUND);
  response.end(body);
};

const sendTodoList = function(request, response) {
  response.setHeader('Content-Type', 'text/html');
  response.end(JSON.stringify(todoLists));
};

const serveMainPage = function(request, response, next) {
  const path = getPath(request.url);
  if (isFileNotAvailable(path)) {
    return next();
  }
  const contentType = getContentType(path);
  const body = fs.readFileSync(path);
  response.setHeader('Content-Type', contentType);
  response.end(body);
};

const methodNotAllowed = function(request, response) {
  response.setHeader('Content-Type', 'text/plain');
  response.writeHead(STATUS_CODE.METHOD_NOT_ALLOWED);
  response.end('Method Not Allowed');
};

const saveTODO = function(request, response) {
  let { title, lists } = request.body;
  lists = JSON.parse(lists);
  todoLists.push({ title, lists });
  const dataStoragePath = `${__dirname}/../data/todo.json`;
  fs.writeFileSync(dataStoragePath, JSON.stringify(todoLists));
  response.setHeader('location', '/todoList');
  response.writeHead(STATUS_CODE.REDIRECT);
  response.end();
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

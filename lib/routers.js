const handlers = require('./handlers');
const App = require('./app');
const app = new App();

app.use(handlers.readBody);
app.use(handlers.readJSON);
app.get('', handlers.serveMainPage);
app.get('/todoList', handlers.sendTodoList);
app.post('/saveTodo', handlers.saveTODO);
app.post('/deleteTask', handlers.deleteTask);
app.post('/changeTaskStatus', handlers.changeTaskStatus);
app.post('/updateTitle', handlers.updateTitle);
app.post('/updateTask', handlers.updateTask);
app.post('/addNewTask', handlers.addNewTask);
app.post('/deleteTodo', handlers.deleteTodo);
app.get('', handlers.serve404Page);
app.use(handlers.methodNotAllowed);

const handleRequest = (req, res) => app.processRequest(req, res);

module.exports = { handleRequest };
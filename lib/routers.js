const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const app = express();
const handlers = require('./handlers');

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(handlers.attachAppDetails);

app.get('/', handlers.redirectToHomePage);
app.post('/validateLogin', handlers.validateLogin);
app.get('/home.html', handlers.redirectToIndexPage);
app.get('/todoList', handlers.sendTodoList);
app.use(express.static('public'));

app.post('/saveTodo', handlers.saveTODO);
app.post('/addNewTask', handlers.addNewTask);
app.post('/registerUser', handlers.registerUser);

app.delete('/deleteTask', handlers.deleteTask);
app.delete('/deleteTodo', handlers.deleteTodo);

app.patch('/changeTaskStatus', handlers.changeTaskStatus);
app.patch('/updateTitle', handlers.updateTitle);
app.patch('/updateTask', handlers.updateTask);

app.post('/checkUserNameExists', handlers.validateUserName);

module.exports = app;

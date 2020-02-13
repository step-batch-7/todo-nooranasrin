const handlers = require('./handlers');
const express = require('express');
const app = express();

app.use(handlers.readBody);
app.use(handlers.readJSON);
app.use(express.static('public'));
app.get('/todoList', handlers.sendTodoList);
app.post('/saveTodo', handlers.saveTODO);
app.post('/deleteTask', handlers.deleteTask);
app.post('/changeTaskStatus', handlers.changeTaskStatus);
app.post('/updateTitle', handlers.updateTitle);
app.post('/updateTask', handlers.updateTask);
app.post('/addNewTask', handlers.addNewTask);
app.post('/deleteTodo', handlers.deleteTodo);
app.post('/registerUser', handlers.registerUser);
app.post('/checkUserNameExists', handlers.validateUserName);
app.post('/validateLogin', handlers.validateLogin);

module.exports = app;

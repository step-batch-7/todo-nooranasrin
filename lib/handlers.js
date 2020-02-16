const { Todo } = require('./todo');

const attachAppDetails = function(req, res, next) {
  const { writer, todoLists, userCredentials } = req.app.locals;
  req.todoLists = todoLists;
  req.writer = writer;
  req.userCredentials = userCredentials;
  req.TODO_STORE = req.app.locals.TODO_STORE;
  req.USER_STORE = req.app.locals.USER_STORE;
  next();
};

const sendTodoList = function(req, res) {
  res.json(req.todoLists.clone());
};

const saveTODO = function(req, res) {
  req.body.id = req.todoLists.generateTodoId();
  const todo = Todo.createNewTodo(req.body);
  req.todoLists.addTodo(todo);
  req.todoLists.save(req.writer);
  res.json(req.todoLists.clone());
};

const changeTaskStatus = function(req, res) {
  const { todoId, taskId } = req.body;
  req.todoLists.changeTaskStatus(todoId, taskId);
  req.todoLists.save(req.writer);
  res.json(req.todoLists.clone());
};

const deleteTask = function(req, res) {
  const { todoId, taskId } = req.body;
  req.todoLists.deleteTask(todoId, taskId);
  req.todoLists.save(req.writer);
  res.json(req.todoLists.clone());
};

const deleteTodo = function(req, res) {
  req.todoLists.deleteTodo(req.body.todoId);
  req.todoLists.save(req.writer);
  res.json(req.todoLists.clone());
};

const updateTitle = function(req, res) {
  const { todoId, title } = req.body;
  req.todoLists.updateTitle(title, todoId);
  req.todoLists.save(req.writer);
  res.json(req.todoLists.clone());
};

const updateTask = function(req, res) {
  const { todoId, task, taskId } = req.body;
  req.todoLists.updateTask(todoId, taskId, task);
  req.todoLists.save(req.writer);
  res.json(req.todoLists.clone());
};

const addNewTask = function(req, res) {
  const { todoId, newTask } = req.body;
  req.todoLists.addNewTask(todoId, newTask);
  req.todoLists.save(req.writer);
  res.json(req.todoLists.clone());
};

const registerUser = function(req, res) {
  const { userName, password, email, phoneNumber } = req.body;
  req.userCredentials[userName] = { password, email, phoneNumber };
  req.writer(req.USER_STORE, JSON.stringify(req.userCredentials));
  res.setHeader('Location', '/index.html');
  res.statusCode = 301;
  res.end();
};

const validateUserName = function(req, res) {
  const { userName } = req.body;
  const userNames = Object.keys(req.userCredentials);
  let isExists = { isExists: false };
  if (userNames.includes(userName)) {
    isExists = { isExists: true };
  }
  res.json(isExists);
};

const validateLogin = function(req, res) {
  const { userName, password } = req.body;
  const userDetails = req.userCredentials[userName];
  const isExistingUser = { isValid: false };
  isExistingUser.msg = 'username and password is not matching';
  if (userDetails && userDetails.password === password) {
    res.cookie('userName', userName);
    return res.send({ isValid: true, msg: '' });
  }
  res.json(isExistingUser);
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
  validateLogin,
  attachAppDetails
};

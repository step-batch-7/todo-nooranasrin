const attachAppDetails = function(req, res, next) {
  const { todoStore, userStore, sessionStore } = req.app.locals;
  req.todoStore = todoStore;
  req.userStore = userStore;
  req.userName = sessionStore.getUserName(req.cookies.sessionId);
  req.sessionStore = sessionStore;
  req.sessionId = req.cookies.sessionId;
  next();
};

const redirectToIndexPage = function(req, res, next) {
  const sessionId = req.cookies.sessionId;
  if (!sessionId || !req.sessionStore.userSessions[sessionId]) {
    return res.redirect('/');
  }
  next();
};

const redirectToHomePage = function(req, res, next) {
  const sessionId = req.cookies.sessionId;
  if (sessionId && req.sessionStore.userSessions[sessionId]) {
    return res.redirect('/home.html');
  }
  next();
};

const registerUser = function(req, res) {
  const { userName, password, email, phoneNumber } = req.body;
  const credentials = { password, email, phoneNumber };
  req.userStore.addNewUser(userName, credentials);
  req.todoStore.createNewUserTodo(userName);
  res.redirect('/');
};

const validateUserName = function(req, res) {
  const { userName } = req.body;
  if (req.userCredentials[userName]) {
    res.send({ isExists: true });
  }
  res.send({ isExists: false });
};

const validateLogin = function(req, res) {
  const { userName, password } = req.body;
  const isExistingUser = { isValid: false };
  isExistingUser.msg = 'username and password is not matching';
  if (req.userStore.isValidLogin(userName, password)) {
    req.sessionStore.createNewSession(userName);
    const sessionId = req.sessionStore.getSessionId(userName);
    res.cookie('sessionId', sessionId);
    return res.send({ isValid: true, msg: '' });
  }
  res.json(isExistingUser);
};

const sendTodoList = function(req, res) {
  res.json(req.todoStore.getStatus(req.userName));
};

const saveTODO = function(req, res) {
  const { title, tasks } = req.body;
  req.todoStore.addTodo(req.userName, title, tasks);
  res.json(req.todoStore.getStatus(req.userName));
};

const changeTaskStatus = function(req, res) {
  const { todoId, taskId } = req.body;
  req.todoStore.changeTaskStatus(req.userName, todoId, taskId);
  res.json(req.todoStore.getStatus(req.userName));
};

const deleteTask = function(req, res) {
  const { todoId, taskId } = req.body;
  req.todoStore.deleteTask(req.userName, todoId, taskId);
  res.json(req.todoStore.getStatus(req.userName));
};

const deleteTodo = function(req, res) {
  req.todoStore.deleteTodo(req.userName, req.body.todoId);
  res.json(req.todoStore.getStatus(req.userName));
};

const updateTitle = function(req, res) {
  const { todoId, title } = req.body;
  req.todoStore.updateTitle(req.userName, todoId, title);
  res.json(req.todoStore.getStatus(req.userName));
};

const updateTask = function(req, res) {
  const { todoId, task, taskId } = req.body;
  req.todoStore.updateTask(req.userName, todoId, taskId, task);
  res.json(req.todoStore.getStatus(req.userName));
};

const addNewTask = function(req, res) {
  const { todoId, newTask } = req.body;
  req.todoStore.addNewTask(req.userName, todoId, newTask);
  res.json(req.todoStore.getStatus(req.userName));
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
  attachAppDetails,
  redirectToIndexPage,
  redirectToHomePage
};

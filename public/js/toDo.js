const getIds = function(event) {
  const todoId = [...event.path].find(parent => parent.className === 'todo').id;
  const taskId = [...event.path].find(parent => parent.className === 'task').id;
  return { todoId, taskId };
};

const sendXHR = function(data, url, method) {
  const request = new XMLHttpRequest();
  request.open(method, url);
  request.send(data);
  request.onload = formatTodoLists;
};

const deleteTodoList = function() {
  const todoId = [...event.path].find(parent => parent.className === 'todo').id;
  const textToSend = `todoId=${todoId}`;
  sendXHR(textToSend, '/deleteTodo', 'POST');
};

const deleteItem = function() {
  const { todoId, taskId } = getIds(event);
  const textTodSend = `todoId=${todoId}&taskId=${taskId}`;
  sendXHR(textTodSend, '/deleteTask', 'POST');
};

const changeTaskStatus = function() {
  const { todoId, taskId } = getIds(event);
  const textTodSend = `todoId=${todoId}&taskId=${taskId}`;
  sendXHR(textTodSend, '/changeTaskStatus', 'POST');
};

const addTodoItem = function() {
  const taskName = document.querySelector('#item').value;
  if (taskName === '') {
    return;
  }
  document.querySelector('#item').value = '';
  const html = `<input class="title" type="text" value="${taskName}">`;
  appendChildHTML('#addedItems', html);
};

const prepareTextToSend = function() {
  const title = document.getElementById('title').value;
  const tasks = document.querySelector('#addedItems').childNodes;
  const lists = [...tasks].map(task => task.value);
  return `title=${title}&tasks=${JSON.stringify(lists)}`;
};

const changeDisplayStyle = function(firstSelector, secondSelector) {
  document.querySelector(firstSelector).style.display = 'block';
  document.querySelector(secondSelector).style.display = 'none';
};

const hideRegisterWindowAndSaveTodo = function() {
  addTodoItem();
  const dataToSend = prepareTextToSend();
  sendXHR(dataToSend, '/saveTodo', 'POST');
  changeDisplayStyle('#addButton', '#popupDiv');
};

const showTodoMaker = function() {
  removeChild('#addedItems');
  changeDisplayStyle('#popupDiv', '#addButton');
};

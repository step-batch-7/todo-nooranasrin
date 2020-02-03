const generateDiveWithElements = function(html) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.firstChild;
};

const appendChildHTML = (selector, html) => {
  const childNode = generateDiveWithElements(html);
  const parent = document.querySelector(selector);
  parent.appendChild(childNode);
};

const formatTodoItems = function(tasks) {
  let html = '';
  tasks.forEach(item => {
    html += `<div><input type='checkbox' id=${item.id}>${item.task}<div>`;
  });
  return generateDiveWithElements(html);
};

const createHTMLElements = function(todoList) {
  const html = `<h3 class='todoHeading'>${todoList.title}</h3>`;
  const titleDiv = generateDiveWithElements(html);
  const listDiv = document.createElement('div');
  const tasks = formatTodoItems(todoList.tasks);
  return { titleDiv, listDiv, tasks };
};

const appendToTheParent = function(titleDiv, listDiv, id) {
  const mainContainer = document.getElementById('todoLists');
  const mainDiv = document.createElement('div');
  mainDiv.appendChild(titleDiv);
  mainDiv.appendChild(listDiv);
  mainDiv.className = 'todo';
  mainDiv.id = id;
  mainContainer.appendChild(mainDiv);
};

const removeChild = function(selector) {
  const children = document.querySelectorAll(selector)[0].childNodes;
  if (children) {
    [...children].forEach(child => child.parentNode.removeChild(child));
  }
};

const prepareTodoListToShow = function(todoList) {
  const { titleDiv, listDiv, tasks } = createHTMLElements(todoList);
  listDiv.appendChild(tasks);
  appendToTheParent(titleDiv, listDiv, todoList.id);
};

const formatTodo = function() {
  prepareTodoListToShow(JSON.parse(this.responseText));
};

const formatTodoLists = function() {
  const todoLists = JSON.parse(this.responseText);
  removeChild('#todoLists');
  todoLists.forEach(prepareTodoListToShow);
};

const sendXHR = function(data, url, method, callback) {
  const request = new XMLHttpRequest();
  request.open(method, url);
  request.send(data);
  request.onload = callback;
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
  sendXHR(dataToSend, '/saveTodo', 'POST', formatTodo);
  changeDisplayStyle('#addButton', '#popupDiv');
};

const showTodoMaker = function() {
  removeChild('#addedItems');
  changeDisplayStyle('#popupDiv', '#addButton');
};

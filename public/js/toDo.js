let items = [];

const formatTodoItems = function(tasks) {
  const mainDiv = document.createElement('div');
  tasks.forEach(item => {
    const div = document.createElement('div');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = item.id;
    div.appendChild(checkbox);
    div.appendChild(document.createTextNode(item.task));
    mainDiv.appendChild(div);
  });
  return mainDiv;
};

const createHTMLElements = function(todoList) {
  const titleDiv = document.createElement('div');
  const listDiv = document.createElement('div');
  const heading = document.createElement('h3');
  heading.innerText = todoList.title;
  heading.className = 'todoHeading';
  const tasks = formatTodoItems(todoList.tasks);
  return { titleDiv, listDiv, heading, tasks };
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

const showResponse = function() {
  const todoLists = JSON.parse(this.responseText);
  const todo = document.querySelectorAll('.todo');
  todo.length !== 0 &&
    [...todo].forEach(div => div.parentNode.removeChild(div));
  todoLists.forEach(todoList => {
    const { titleDiv, listDiv, heading, tasks } = createHTMLElements(todoList);
    listDiv.appendChild(tasks);
    titleDiv.appendChild(heading);
    appendToTheParent(titleDiv, listDiv, todoList.id);
  });
};

const sendXHR = function(data, url, method, callback) {
  const request = new XMLHttpRequest();
  request.open(method, url);
  request.send(data);
  request.onload = callback;
};

const appendChildHTML = (selector, html) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const childNode = tempDiv.firstChild;
  const parent = document.querySelector(selector);
  parent.appendChild(childNode);
};

const addTodoItem = function() {
  const taskName = document.querySelector('#item').value;
  if (taskName === '') {
    return;
  }
  items.push(taskName);
  document.querySelector('#item').value = '';
  const html = `<div><input class="title" type="text" value="${taskName}"></div>`;
  appendChildHTML('#addedItems', html);
};

const hideRegisterWindowAndSaveTodo = function() {
  addTodoItem();
  const title = document.getElementById('title').value;
  const todo = `title=${title}&items=${JSON.stringify(items)}`;
  sendXHR(todo, '/saveTodo', 'POST', showResponse);
  document.getElementById('addButton').style.display = 'block';
  document.getElementById('popupDiv').style.display = 'none';
};

const popupTodoMaker = function() {
  const taskNames = document.querySelector('#addedItems').childNodes;
  [...taskNames].forEach(div => div.parentNode.removeChild(div));
  items = [];
  document.getElementById('popupDiv').style.display = 'block';
  document.getElementById('addButton').style.display = 'none';
};

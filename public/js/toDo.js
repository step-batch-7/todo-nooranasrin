let items = [];

const formatTodoItems = function(items) {
  const mainDiv = document.createElement('div');
  items.forEach(item => {
    const div = document.createElement('div');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    div.appendChild(checkbox);
    div.appendChild(document.createTextNode(item));
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
  const items = formatTodoItems(todoList.items);
  return { titleDiv, listDiv, heading, items };
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

const showResponse = function(todoLists) {
  const todo = document.querySelectorAll('.todo');
  todo.length !== 0 &&
    [...todo].forEach(div => div.parentNode.removeChild(div));
  todoLists.forEach(todoList => {
    const { titleDiv, listDiv, heading, items } = createHTMLElements(todoList);
    listDiv.appendChild(items);
    titleDiv.appendChild(heading);
    appendToTheParent(titleDiv, listDiv, todoList.id);
  });
};

const sendXHR = function(data, url, method) {
  const request = new XMLHttpRequest();
  request.open(method, url);
  request.send(data);
  request.onload = function() {
    showResponse(JSON.parse(this.responseText));
  };
};

const addTodoItem = function() {
  const item = document.getElementById('item').value;
  if (item === '') {
    return;
  }
  items.push(document.getElementById('item').value);
  document.getElementById('item').value = '';
};

const hideRegisterWindowAndSaveTodo = function() {
  addTodoItem();
  const title = document.getElementById('title').value;
  const todo = `title=${title}&items=${JSON.stringify(items)}`;
  sendXHR(todo, '/saveTodo', 'POST');
  document.getElementById('addButton').style.display = 'block';
  document.getElementById('popupDiv').style.display = 'none';
};

const popupTodoMaker = function() {
  items = [];
  document.getElementById('popupDiv').style.display = 'block';
  document.getElementById('addButton').style.display = 'none';
};

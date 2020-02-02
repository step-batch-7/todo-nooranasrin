let lists = [];

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
  const heading = document.createElement('h5');
  heading.innerText = todoList.title;
  const lists = formatTodoItems(todoList.lists);
  return { titleDiv, listDiv, heading, lists };
};

const appendToTheParent = function(titleDiv, listDiv) {
  let mainContainer = document.getElementById('todoLists');
  const mainDiv = document.createElement('div');
  mainDiv.appendChild(titleDiv);
  mainDiv.appendChild(listDiv);
  mainDiv.id = 'todo';
  mainContainer.appendChild(mainDiv);
};

const showResponse = function(todoLists) {
  document.getElementById('todo').remove();
  todoLists.forEach(todoList => {
    const { titleDiv, listDiv, heading, lists } = createHTMLElements(todoList);
    listDiv.appendChild(lists);
    titleDiv.appendChild(heading);
    appendToTheParent(titleDiv, listDiv);
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

const hideToDoRegisterWindow = function() {
  lists.push(document.getElementById('item').value);
  const title = document.getElementById('title').value;
  const todo = `title=${title}&lists=${JSON.stringify(lists)}`;
  sendXHR(todo, '/saveTodo', 'POST');
  document.getElementById('addButton').style.display = 'block';
  document.getElementById('popupDiv').style.display = 'none';
};

const popupTodoMaker = function() {
  lists = [];
  document.getElementById('popupDiv').style.display = 'block';
  document.getElementById('addButton').style.display = 'none';
};

const addItem = function() {
  lists.push(document.getElementById('item').value);
  document.getElementById('item').value = '';
};

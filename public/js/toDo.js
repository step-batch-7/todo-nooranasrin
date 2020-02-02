let lists = [];

const appendToTheParent = function(titleDiv, listDiv) {
  let mainContainer = document.getElementById('todoLists');
  const mainDiv = document.createElement('div');
  mainDiv.appendChild(titleDiv);
  mainDiv.appendChild(listDiv);
  mainDiv.id = 'todo';
  mainContainer.appendChild(mainDiv);
};

const showResponse = function(todoLists) {
  const element = document.getElementById('todo').remove();
  todoLists.forEach(todoList => {
    const titleDiv = document.createElement('div');
    const listDiv = document.createElement('div');
    const heading = document.createElement('h5');
    heading.innerText = todoList.title;
    const lists = document.createElement('li');
    lists.innerText = JSON.stringify(todoList.lists);
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

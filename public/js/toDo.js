let lists = [];

const sendXHR = function(data, url, method) {
  const request = new XMLHttpRequest();
  request.open(method, url);
  request.send(data);
  request.onload = function() {
    console.log(this);
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

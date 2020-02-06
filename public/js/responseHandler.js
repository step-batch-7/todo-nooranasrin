const generateDiveWithElements = function(html) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.firstChild;
};

const formatTodoItems = function(tasks, patternDiv) {
  tasks.forEach(item => {
    let src = './images/star.png';
    if (item.status) src = './images/done.png';
    let html = `<div class="content" id="${item.id}"> <img src="${src}" height="13px"`;
    html += ` width='13px' class='star' onclick='changeStatus()'/>${item.task}</div>`;
    patternDiv.appendChild(generateDiveWithElements(html));
  });
  return patternDiv;
};

const createHTMLElements = function(todoList) {
  const paperDiv = generateDiveWithElements('<div class="paper"></div>');
  const patternDiv = generateDiveWithElements('<div class="pattern"></div>');
  let titleDiv = `<div class='content'>${todoList.title}`;
  titleDiv += '<img class="editImage" src="./images/edit.png" width="17px" ';
  titleDiv += 'height="17px" onclick = "editTodo()" /></div > ';
  titleDiv = generateDiveWithElements(titleDiv);
  patternDiv.appendChild(titleDiv);
  paperDiv.id = todoList.id;
  return { paperDiv, patternDiv };
};

const removeChild = function(selector) {
  const children = document.querySelector(selector).childNodes;
  if (children) {
    [...children].forEach(child => child.parentNode.removeChild(child));
  }
};

const prepareTodoListToShow = function(todoList) {
  let { paperDiv, patternDiv } = createHTMLElements(todoList);
  patternDiv = formatTodoItems(todoList.tasks, patternDiv);
  paperDiv.appendChild(patternDiv);
  const todoDiv = document.querySelector('#todoDisplay');
  todoDiv.appendChild(paperDiv);
};

const formatTodoLists = function() {
  const todoLists = JSON.parse(this.responseText);
  removeChild('#todoDisplay');
  todoLists.forEach(prepareTodoListToShow);
};

const sendXHR = function(data, url, method, callback) {
  const request = new XMLHttpRequest();
  request.open(method, url);
  request.send(data);
  request.onload = callback;
};

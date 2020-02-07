const generateDiveWithElements = function(html) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.firstChild;
};

const formatTodoItems = function(tasks, patternDiv) {
  const taskDiv = generateDiveWithElements('<div class="task"></div>');
  patternDiv.appendChild(taskDiv);
  tasks.forEach(item => {
    let src = './images/star.png';
    if (item.status) src = './images/done.png';
    let html = `<div class="content" id="${item.id}" " onkeypress="updateTask()">
      <img src="${src}"  class='star' onclick='changeStatus()'/><div class="taskName"
      ondblclick="this.contentEditable=true;">${item.task}</div>
      <img src="./images/deleteTask.png" class='deleteTask' onclick='deleteTask()'/></div>`;
    taskDiv.appendChild(generateDiveWithElements(html));
  });
  return patternDiv;
};

const createHTMLElements = function(todoList) {
  const paperDiv = generateDiveWithElements('<div class="paper"></div>');
  const patternDiv = generateDiveWithElements('<div class="pattern"></div>');
  let titleDiv = `<div class='content' ondblclick="this.contentEditable=true;" 
  onkeypress="updateTitle()"><div class="todoName">${todoList.title}</div>
  <img src="./images/deleteTodo.png"  class='deleteTodo' onClick='deleteTodo()'/>
  <img src="./images/plus.png" class="addTodo" onClick='showTaskAdderWindow()'></div >`;
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

const sendXHR = function(data, url, method) {
  const request = new XMLHttpRequest();
  request.open(method, url);
  request.send(data);
  request.onload = formatTodoLists;
};

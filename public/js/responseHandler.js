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

const generateHTMLForTasks = function(className, status, task, id) {
  let html = '';
  html += `<div class="task" id=${id}>`;
  html += `<input type='checkbox' onclick='changeTaskStatus()' ${status} >`;
  html += `<span ${className}>${task}</span> `;
  html += '<button class="deleteTask" onclick="deleteItem()">';
  html += '<img src="../images/delete.png" height="15px" width="15px">';
  html += '</button><div>';
  return html;
};

const formatTodoItems = function(tasks) {
  let html = '';
  tasks.forEach(item => {
    let className = '';
    let status = '';
    if (item.status) {
      className = 'class="strikeTask" checked';
      status = ' checked';
    }
    html += generateHTMLForTasks(className, status, item.task, item.id);
  });
  return generateDiveWithElements(html);
};

const generateDeleteButton = function() {
  const path = '../images/todoDeleteIcon.png';
  let html = '<button onclick="deleteTodoList()">';
  html += `<img src=${path} width="25px" heighth="25px">`;
  html += '</button>';
  return html;
};

const createHTMLElements = function(todoList) {
  const html = `<h3 class='todoHeading'>${todoList.title}</h3>`;
  const titleDiv = generateDiveWithElements(html);
  const listDiv = document.createElement('div');
  listDiv.className = 'tasks';
  const tasks = formatTodoItems(todoList.tasks);
  const deleteButtonHtml = generateDeleteButton();
  const deleteDiv = generateDiveWithElements(deleteButtonHtml);
  deleteDiv.className = 'todoDeleteButton';
  return { titleDiv, listDiv, tasks, deleteDiv };
};

const appendToTheParent = function(titleDiv, listDiv, id, deleteDiv) {
  const mainContainer = document.getElementById('todoLists');
  const mainDiv = document.createElement('div');
  mainDiv.appendChild(titleDiv);
  mainDiv.appendChild(listDiv);
  mainDiv.appendChild(deleteDiv);
  mainDiv.className = 'todo';
  mainDiv.id = id;
  mainContainer.append(mainDiv);
};

const removeChild = function(selector) {
  const children = document.querySelector(selector).childNodes;
  if (children) {
    [...children].forEach(child => child.parentNode.removeChild(child));
  }
};

const prepareTodoListToShow = function(todoList) {
  const { titleDiv, listDiv, tasks, deleteDiv } = createHTMLElements(todoList);
  listDiv.appendChild(tasks);
  appendToTheParent(titleDiv, listDiv, todoList.id, deleteDiv);
};

const formatTodoLists = function() {
  const todoLists = JSON.parse(this.responseText);
  removeChild('#todoLists');
  todoLists.forEach(prepareTodoListToShow);
};

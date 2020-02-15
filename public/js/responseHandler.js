const checkUserNameIsAvailable = function({ isExists }) {
  const msgBox = document.querySelector('#errorInName');
  if (isExists) {
    msgBox.innerText = 'user already exists';
    return (document.forms['registrationForm'].onsubmit = () => false);
  }
  msgBox.innerText = '';
  document.forms['registrationForm'].onsubmit = validateRegistrationForm;
};

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
  const todoDiv = document.querySelector('#todoLists');
  todoDiv.appendChild(paperDiv);
};

const formatTodoLists = function(todoLists) {
  removeChild('#todoLists');
  todoLists.forEach(prepareTodoListToShow);
};

const requestXHR = (method, url, data, callback) => {
  const req = new XMLHttpRequest();
  req.open(method, url);
  data && req.setRequestHeader('Content-Type', 'application/json');
  const content = data ? JSON.stringify(data, null, 2) : null;
  req.send(content);

  req.onload = function() {
    if (this.status !== 200) return;
    let result = this.responseText;
    const contentType = this.getResponseHeader('Content-Type');
    if ('application/json; charset=utf-8' === contentType) {
      result = JSON.parse(this.responseText);
    }
    callback(result);
  };
};

const getJSON = (url, callback) => {
  requestXHR('GET', url, null, callback);
};

const postJSON = (url, data, callback) => {
  requestXHR('POST', url, data, callback);
};

const deleteJSON = (url, data, callback) => {
  requestXHR('DELETE', url, data, callback);
};

const patchJSON = (url, data, callback) => {
  requestXHR('PATCH', url, data, callback);
};

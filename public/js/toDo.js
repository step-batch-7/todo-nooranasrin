const getParentId = id => [...event.path].find(parent => parent.id === id);

const getIds = function(event) {
  const todoId = [...event.path].find(parent => parent.className === 'paper')
    .id;
  const taskId = [...event.path].find(parent => parent.className === 'content')
    .id;
  return { todoId, taskId };
};

const createNewTaskInputBox = function() {
  const html =
    '<input type="text" class="todoTask" placeholder="Add task here..."/>';
  return generateDiveWithElements(html);
};

const changeDisplayStyle = function(firstSelector, secondSelector) {
  document.querySelector(firstSelector).style.display = 'block';
  document.querySelector(secondSelector).style.display = 'none';
};

const formatTodoToSave = function(titleId, className) {
  const title = document.getElementById(titleId).value;
  const tasks = document.querySelectorAll(className);
  const lists = [...tasks].map(task => task.value);
  return { title, lists };
};

const saveTodo = function() {
  const { title, lists } = formatTodoToSave('todoTitle', '.todoTask');
  const newTodo = `title=${title}&tasks=${JSON.stringify(lists)}`;
  sendXHR(newTodo, '/saveTodo', 'POST', formatTodoLists);
  changeDisplayStyle('#newTodoAddButtonDiv', '#newTodoAdder');
};

const saveEditedTodo = function() {
  changeDisplayStyle('#newTodoAddButtonDiv', '#editTodoDiv');
  const { todoId } = getParentId('editTodoDiv').dataset;
  const { title, lists } = formatTodoToSave('editTodoTitle', '.editTask');
  const data = `title=${title}&tasks=${JSON.stringify(lists)}&todoId=${todoId}`;
  sendXHR(data, '/updateTodo', 'POST', formatTodoLists);
};

const addNewTask = function() {
  const task = event.target.value;
  if (event.key === 'Enter' && task !== '') {
    const newTaskBox = createNewTaskInputBox();
    newTaskBox.onkeypress = addNewTask;
    const newTodoAdder = document.querySelector('#newTodoAdder');
    newTodoAdder.append(newTaskBox);
    newTodoAdder.lastChild.focus();
  }
};

const deleteTaskBoxes = function(selector, id) {
  let taskBoxes = [...document.querySelectorAll(selector)];
  const [taskName] = taskBoxes.splice(0, 1);
  taskName.value = '';
  document.getElementById(id).value = '';
  taskBoxes.forEach(taskBox => taskBox.parentNode.removeChild(taskBox));
};

const showTodoAdderWindow = function() {
  deleteTaskBoxes('.todoTask', 'todoTitle');
  changeDisplayStyle('#newTodoAdder', '#newTodoAddButtonDiv');
};

const changeStatus = function() {
  const { todoId, taskId } = getIds(event);
  const textTodSend = `todoId=${todoId}&taskId=${taskId}`;
  sendXHR(textTodSend, '/changeTaskStatus', 'POST', formatTodoLists);
};

const deleteTodo = function() {
  changeDisplayStyle('#newTodoAddButtonDiv', '#editTodoDiv');
  const { todoId } = getParentId('editTodoDiv').dataset;
  const textToSend = `todoId=${todoId}`;
  sendXHR(textToSend, '/deleteTodo', 'POST', formatTodoLists);
};

const deleteTask = function() {
  [...event.path].find(parent => parent.className === 'editTaskDiv').remove();
};

const createEditTaskTemplate = function(task, editDiv) {
  let html = '<div class="editTaskDiv">';
  html += `<input type='text' class='editTask' value='${task.innerText}' />`;
  html += '<img src="./images/deleteTask.png" width="15px" height="20px"';
  html += ' class="deleteTask" onclick="deleteTask()"/></div>';
  editDiv.appendChild(generateDiveWithElements(html));
};

const createSaveButton = function(editDiv) {
  let save = '<img src="./images/save.png" width="30px" height="35px"';
  save += 'id="saveAfterEdit" onclick="saveEditedTodo()"/>';
  return generateDiveWithElements(save);
};

const createEditBox = function(todoId, editDiv, titleInputBox) {
  let tasks = [...document.getElementById(todoId).firstChild.childNodes];
  const [title] = tasks.splice(0, 1);
  titleInputBox.value = title.innerText;
  tasks.forEach(task => createEditTaskTemplate(task, editDiv));
  editDiv.appendChild(createSaveButton());
};

const deleteEditTaskBox = function(selector) {
  let taskBoxes = [...document.querySelectorAll(selector)];
  taskBoxes.forEach(taskBox => taskBox.parentNode.removeChild(taskBox));
  document.querySelector('#saveAfterEdit').remove();
};

const editTodo = function() {
  deleteEditTaskBox('.editTaskDiv', 'editTodoTitle');
  changeDisplayStyle('#editTodoDiv', '#newTodoAddButtonDiv');
  const { todoId } = getIds(event);
  const editDiv = document.querySelector('#editTodoDiv');
  const title = document.querySelector('#editTodoTitle');
  editDiv.dataset.todoId = todoId;
  createEditBox(todoId, editDiv, title);
};

const attachEventListener = function() {
  const task = document.querySelector('.todoTask');
  task.onkeypress = addNewTask;
};

const main = function() {
  attachEventListener();
  sendXHR('', '/todoList', 'GET', formatTodoLists);
};

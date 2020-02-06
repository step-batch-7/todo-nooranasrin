const getParentId = id => [...event.path].find(parent => parent.id === id);

const deleteTask = () =>
  [...event.path].find(parent => parent.className === 'editTaskDiv').remove();

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
  const { todoId } = getIds(event);
  const data = `todoId=${todoId}`;
  sendXHR(data, '/deleteTodo', 'POST');
};

const updateTask = function() {
  if (event.key === 'Enter') {
    const { todoId, taskId } = getIds(event);
    const updatedTask = event.target.innerText;
    const data = `todoId=${todoId}&taskId=${taskId}&task=${updatedTask}`;
    sendXHR(data, '/updateTask', 'POST');
  }
};

const updateTitle = function() {
  if (event.key === 'Enter') {
    const { todoId } = getIds(event);
    const newTitle = event.target.innerText;
    const data = `todoId=${todoId}&title=${newTitle}`;
    sendXHR(data, '/updateTitle', 'POST');
  }
};

const attachEventListener = function() {
  const task = document.querySelector('.todoTask');
  task.onkeypress = addNewTask;
};

const main = function() {
  sendXHR('', '/todoList', 'GET');
  attachEventListener();
};

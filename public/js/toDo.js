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

const addNewTaskToTheTodo = function() {
  const newTask = event.target.value;
  if (event.key === 'Enter' && newTask !== '') {
    const { todoId } = event.target.dataset;
    const data = `todoId=${todoId}&newTask=${newTask}`;
    event.target.value = '';
    sendXHR(data, '/addNewTask', 'POST');
    document.querySelector('#addNewTaskDiv').style.display = 'none';
    document.querySelector('#todoLists').style.opacity = '1';
  }
};

const showTaskAdderWindow = function() {
  const { todoId } = getIds(event);
  document.querySelector('#todoLists').style.opacity = '0.15';
  document.querySelector('#addNewTaskDiv').style.display = 'block';
  const inputBox = document.querySelector('#newTaskInputBox');
  inputBox.focus();
  inputBox.dataset.todoId = todoId;
  inputBox.onkeypress = addNewTaskToTheTodo;
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

const deleteTask = function() {
  const { todoId, taskId } = getIds(event);
  const data = `todoId=${todoId}&taskId=${taskId}`;
  sendXHR(data, '/deleteTask', 'POST');
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

const displayMatchingTodo = function(event) {
  const searchingWord = event.target.value;
  const todoLists = [...document.querySelectorAll('.paper')].slice(1);
  const matchingTodo = todoLists.filter(todoList => {
    const title = todoList.querySelector('.todoName').innerText;
    return !title.match(searchingWord);
  });
  matchingTodo.forEach(todo => todo.classList.add('hide'));
};

const searchTodo = function() {
  if (event.keyCode === 8) {
    const todoLists = [...document.querySelectorAll('.paper')].slice(1);
    todoLists.forEach(todo => todo.classList.remove('hide'));
  }
  displayMatchingTodo(event);
};

const attachEventListener = function() {
  const task = document.querySelector('.todoTask');
  task.onkeypress = addNewTask;
};

const main = function() {
  sendXHR('', '/todoList', 'GET');
  attachEventListener();
};

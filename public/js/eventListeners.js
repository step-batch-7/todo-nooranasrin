const showTodoAdderWindow = function() {
  deleteTaskBoxes('.todoTask', 'todoTitle');
  changeDisplayStyle('#newTodoAdder', '#newTodoAddButtonDiv');
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

const saveTodo = function() {
  const { title, lists } = formatTodoToSave('todoTitle', '.todoTask');
  postJSON('/saveTodo', { title, tasks: lists }, formatTodoLists);
  changeDisplayStyle('#newTodoAddButtonDiv', '#newTodoAdder');
};

const deleteTodo = function() {
  const { todoId } = getIds(event);
  deleteJSON('/deleteTodo', { todoId }, formatTodoLists);
};

const deleteTask = function() {
  const { todoId, taskId } = getIds(event);
  deleteJSON('/deleteTask', { todoId, taskId }, formatTodoLists);
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

const addNewTaskToTheTodo = function() {
  const newTask = event.target.value;
  if (event.key === 'Enter' && newTask !== '') {
    const { todoId } = event.target.dataset;
    event.target.value = '';
    postJSON('/addNewTask', { todoId, newTask }, formatTodoLists);
    document.querySelector('#addNewTaskDiv').style.display = 'none';
    document.querySelector('#todoLists').style.opacity = '1';
  }
};

const changeStatus = function() {
  const { todoId, taskId } = getIds(event);
  postJSON('/changeTaskStatus', { todoId, taskId }, formatTodoLists);
};

const updateTask = function() {
  if (event.key === 'Enter') {
    const { todoId, taskId } = getIds(event);
    const task = event.target.innerText;
    postJSON('/updateTask', { todoId, taskId, task }, formatTodoLists);
  }
};

const updateTitle = function() {
  if (event.key === 'Enter') {
    const { todoId } = getIds(event);
    const title = event.target.innerText;
    postJSON('/updateTitle', { todoId, title }, formatTodoLists);
  }
};

const searchTodo = function() {
  if (event.keyCode === 8) {
    const todoLists = [...document.querySelectorAll('.paper')].slice(1);
    todoLists.forEach(todo => todo.classList.remove('hide'));
  }
  displayMatchingTodo(event);
};

const searchTask = function() {
  if (event.keyCode === 8) {
    const todoLists = [...document.querySelectorAll('.paper')].slice(1);
    todoLists.forEach(todo => todo.classList.remove('hide'));
  }
  displayMatchingTask(event);
};

const search = function() {
  const status = event.target.checked;
  if (status) return changeDisplayStyle('#taskSearch', '#titleSearch');
  changeDisplayStyle('#titleSearch', '#taskSearch');
};

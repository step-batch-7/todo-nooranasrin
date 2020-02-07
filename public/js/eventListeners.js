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
  const newTodo = `title=${title}&tasks=${JSON.stringify(lists)}`;
  sendXHR(newTodo, '/saveTodo', 'POST', formatTodoLists);
  changeDisplayStyle('#newTodoAddButtonDiv', '#newTodoAdder');
};

const deleteTodo = function() {
  const { todoId } = getIds(event);
  const data = `todoId=${todoId}`;
  sendXHR(data, '/deleteTodo', 'POST');
};

const deleteTask = function() {
  const { todoId, taskId } = getIds(event);
  const data = `todoId=${todoId}&taskId=${taskId}`;
  sendXHR(data, '/deleteTask', 'POST');
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
    const data = `todoId=${todoId}&newTask=${newTask}`;
    event.target.value = '';
    sendXHR(data, '/addNewTask', 'POST');
    document.querySelector('#addNewTaskDiv').style.display = 'none';
    document.querySelector('#todoLists').style.opacity = '1';
  }
};

const changeStatus = function() {
  const { todoId, taskId } = getIds(event);
  const textTodSend = `todoId=${todoId}&taskId=${taskId}`;
  sendXHR(textTodSend, '/changeTaskStatus', 'POST', formatTodoLists);
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

const searchTodo = function() {
  if (event.keyCode === 8) {
    const todoLists = [...document.querySelectorAll('.paper')].slice(1);
    todoLists.forEach(todo => todo.classList.remove('hide'));
  }
  displayMatchingTodo(event);
};

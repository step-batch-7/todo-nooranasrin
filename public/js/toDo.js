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

const deleteTaskBoxes = function(selector, id) {
  let taskBoxes = [...document.querySelectorAll(selector)];
  const [taskName] = taskBoxes.splice(0, 1);
  taskName.value = '';
  document.getElementById(id).value = '';
  taskBoxes.forEach(taskBox => taskBox.parentNode.removeChild(taskBox));
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

const isTaskMatching = function(searchingWord, task) {
  const taskName = task.innerText;
  return !taskName.match(searchingWord);
};

const displayMatchingTask = function(event) {
  const searchingWord = event.target.value;
  const todoLists = [...document.querySelectorAll('.paper')].slice(1);
  const matchingTodo = todoLists.filter(todoList => {
    const tasks = [...todoList.querySelectorAll('.taskName')];
    return tasks.every(isTaskMatching.bind(null, searchingWord));
  });
  matchingTodo.forEach(todo => todo.classList.add('hide'));
};

const attachEventListener = function() {
  const task = document.querySelector('.todoTask');
  task.onkeypress = addNewTask;
};

const main = function() {
  sendXHR('', '/todoList', 'GET');
  attachEventListener();
};

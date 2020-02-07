/* eslint-disable no-magic-numbers */

const generateNewTaskId = function(tasks) {
  let highestId = 0;
  tasks.forEach(todo => {
    if (todo.id > highestId) {
      highestId = todo.id;
    }
  });
  return highestId + 1;
};

const formatTodoItems = function(tasks) {
  return tasks.map((item, index) => {
    return { id: index, task: item, status: false };
  });
};

const findMatching = function(id, list) {
  return list.find(item => item.id === +id);
};

class Todo {
  constructor(title, tasks, id) {
    this.title = title;
    this.tasks = tasks;
    this.id = id;
  }

  static createNewTodo(todo) {
    const tasks = formatTodoItems(todo.tasks);
    return new Todo(todo.title, tasks, todo.id);
  }

  changeTaskStatus(taskId) {
    const task = findMatching(taskId, this.tasks);
    task.status = !task.status;
  }

  updateTitle(newTitle) {
    this.title = newTitle;
  }

  updateTask(taskId, updatedTask) {
    const matchingTask = findMatching(taskId, this.tasks);
    matchingTask.task = updatedTask;
  }

  addNewTask(newTask) {
    const tasks = this.tasks;
    const id = generateNewTaskId(tasks);
    const task = { id, task: newTask, status: false };
    tasks.push(task);
  }

  deleteTask(taskId) {
    const task = findMatching(taskId, this.tasks);
    const index = this.tasks.indexOf(task);
    this.tasks.splice(index, 1);
  }
}

module.exports = { Todo, findMatching };

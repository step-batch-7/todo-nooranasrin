/* eslint-disable no-magic-numbers */

const Task = require('./task');

const generateNewTaskId = function(tasks) {
  let highestId = 0;
  tasks.forEach(todo => {
    if (todo.id > highestId) {
      highestId = todo.id;
    }
  });
  return highestId + 1;
};

const formatTodoItems = tasks =>
  tasks.map((task, index) => new Task(index, task, false));

const findMatching = (id, list) => list.find(item => item.id === +id);

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

  static load(todo) {
    const tasks = todo.tasks.map(task => Task.load(task));
    return new Todo(todo.title, tasks, todo.id);
  }

  getStatus() {
    const tasks = this.tasks.map(task => task.getStatus());
    return { tasks, title: this.title, id: this.id };
  }

  changeTaskStatus(taskId) {
    const task = findMatching(taskId, this.tasks);
    task.changeStatus();
  }

  updateTitle(newTitle) {
    this.title = newTitle;
  }

  updateTask(taskId, updatedTask) {
    const matchingTask = findMatching(taskId, this.tasks);
    matchingTask.update(updatedTask);
  }

  addNewTask(newTask) {
    const tasks = this.tasks;
    const id = generateNewTaskId(tasks);
    tasks.push(new Task(id, newTask, false));
  }

  deleteTask(taskId) {
    const task = findMatching(taskId, this.tasks);
    const index = this.tasks.indexOf(task);
    this.tasks.splice(index, 1);
  }
}

module.exports = { Todo, findMatching };

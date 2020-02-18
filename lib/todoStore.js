const TodoLists = require('./todoLists');

class TodoStore {
  constructor(path, writer) {
    this.path = path;
    this.writer = writer;
    this.todoLists = {};
  }

  static initialize(userTodos, path, writer) {
    const todoStore = new TodoStore(path, writer);
    for (const key in userTodos) {
      todoStore.todoLists[key] = TodoLists.load(userTodos[key]);
    }
    return todoStore;
  }

  addTodo(userName, title, tasks) {
    this.todoLists[userName].addTodo(title, tasks);
    this.save();
  }

  getStatus(userName) {
    return this.todoLists[userName].getStatus();
  }

  createNewUserTodo(userName) {
    this.todoLists[userName] = new TodoLists();
    this.save();
  }

  save() {
    this.writer(this.path, JSON.stringify(this.todoLists));
  }

  addNewTask(userName, todoId, task) {
    this.todoLists[userName].addNewTask(todoId, task);
    this.save();
  }

  deleteTask(userName, todoId, taskId) {
    this.todoLists[userName].deleteTask(todoId, taskId);
    this.save();
  }

  deleteTodo(userName, todoId) {
    this.todoLists[userName].deleteTodo(todoId);
    this.save();
  }

  changeTaskStatus(userName, todoId, taskId) {
    this.todoLists[userName].changeTaskStatus(todoId, taskId);
    this.save();
  }

  updateTask(userName, todoId, taskId, task) {
    this.todoLists[userName].updateTask(todoId, taskId, task);
    this.save();
  }

  updateTitle(userName, todoId, newTitle) {
    this.todoLists[userName].updateTitle(todoId, newTitle);
    this.save();
  }
}

module.exports = TodoStore;

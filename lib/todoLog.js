const Todo = require('./todo');

class TodoLog {
  constructor() {
    this.todoLists = [];
  }

  addTodo(todo) {
    this.todoLists.unshift(todo);
  }

  toJSON() {
    return JSON.stringify(this.todoLists);
  }

  generateTodoId() {
    const id = Math.ceil(Math.random() * 1000);
    const matchingTodo = this.todoLists.find(todo => todo.id === id);
    matchingTodo && this.generateTodoId();
    return id;
  }

  static load(todoList) {
    const todoLog = new TodoLog();
    todoList.forEach(todo => {
      todoLog.addTodo(new Todo(todo.title, todo.tasks, todo.id));
    });
    return todoLog;
  }
}

module.exports = TodoLog;

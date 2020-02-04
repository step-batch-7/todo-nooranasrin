class TodoLog {
  constructor() {
    this.todoLists = [];
  }

  addComment(todo) {
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
}

module.exports = TodoLog;

const { Todo, findMatching } = require('./todo');

class TodoLog {
  constructor() {
    this.todoLists = [];
  }

  addTodo(todo) {
    this.todoLists.push(todo);
  }

  toJSONString() {
    return JSON.stringify(this.todoLists);
  }

  changeTaskStatus(todoId, taskId) {
    const todo = this.todoLists.find(todo => {
      return todo.id === +todoId;
    });
    todo.changeTaskStatus(taskId);
  }

  deleteTodo(todoId) {
    const todo = findMatching(todoId, this.todoLists);
    const index = this.todoLists.indexOf(todo);
    this.todoLists.splice(index, 1);
  }

  deleteTask(todoId, taskId) {
    const todo = findMatching(todoId, this.todoLists);
    todo.deleteTask(taskId);
    if (todo.tasks.length === 0) {
      this.deleteTodo(todoId);
    }
  }

  updateTitle(newTitle, id) {
    const matchingTodo = findMatching(id, this.todoLists);
    matchingTodo.updateTitle(newTitle);
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

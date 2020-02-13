/* eslint-disable no-magic-numbers */
const { Todo, findMatching } = require('./todo');

class TodoLog {
  constructor() {
    this.todoLists = [];
  }

  addTodo(todo) {
    this.todoLists.push(todo);
  }

  clone() {
    return JSON.parse(JSON.stringify(this.todoLists));
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

  updateTask(todoId, taskId, updatedTask) {
    const matchingTodo = findMatching(todoId, this.todoLists);
    matchingTodo.updateTask(taskId, updatedTask);
  }

  updateTitle(newTitle, id) {
    const matchingTodo = findMatching(id, this.todoLists);
    matchingTodo.updateTitle(newTitle);
  }

  addNewTask(todoId, newTask) {
    const matchingTodo = findMatching(todoId, this.todoLists);
    matchingTodo.addNewTask(newTask);
  }

  generateTodoId() {
    const id = Math.ceil(Math.random() * 1000);
    const matchingTodo = this.todoLists.find(todo => todo.id === id);
    matchingTodo && this.generateTodoId();
    return id;
  }

  save(writer) {
    writer(this.clone());
  }

  static load(todoList) {
    const todoLog = new TodoLog();
    todoList.forEach(todo => todoLog.addTodo(Todo.load(todo)));
    return todoLog;
  }
}

module.exports = TodoLog;

/* eslint-disable no-magic-numbers */
const { Todo, findMatching } = require('./todo');

class TodoLists {
  constructor() {
    this.todoLists = [];
  }

  static load(todoList) {
    const todoLog = new TodoLists();
    todoList.forEach(todo => todoLog.todoLists.push(Todo.load(todo)));
    return todoLog;
  }

  addTodo(title, tasks) {
    const id = this.generateTodoId();
    const newTodo = Todo.createNewTodo({ title, tasks, id });
    this.todoLists.push(newTodo);
  }

  toJSON() {
    return this.todoLists.slice();
  }

  getStatus() {
    return this.todoLists.map(todo => todo.getStatus());
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

  updateTitle(id, newTitle) {
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
}

module.exports = TodoLists;

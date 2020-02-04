const formatTodoItems = function(tasks) {
  return tasks.map((item, index) => {
    return { id: index, task: item, status: false };
  });
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
    const task = this.tasks.find(todo => {
      return todo.id === +taskId;
    });
    task.status = !task.status;
  }
}

module.exports = Todo;

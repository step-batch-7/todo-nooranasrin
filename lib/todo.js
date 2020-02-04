const formatTodoItems = function(tasks) {
  let id = 0;
  const todoItems = JSON.parse(tasks);
  return todoItems.map(item => {
    id += 1;
    return { id, task: item, status: 'notDone' };
  });
};

class Todo {
  constructor(title, tasks, id) {
    this.title = title;
    this.tasks = tasks;
    this.id = id;
  }

  static formatTodo(todo) {
    const tasks = formatTodoItems(todo.tasks);
    return new Todo(todo.title, tasks, todo.id);
  }
}

module.exports = Todo;

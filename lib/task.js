class Task {
  constructor(id, task, status) {
    this.id = id;
    this.task = task;
    this.status = status;
  }

  static load(item) {
    const { id, task, status } = item;
    return new Task(id, task, status);
  }

  getStatus() {
    return { id: this.id, status: this.status, task: this.task };
  }

  changeStatus() {
    this.status = !this.task.status;
  }

  update(updatedTask) {
    this.task = updatedTask;
  }
}

module.exports = Task;

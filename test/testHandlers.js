const request = require('supertest');
const sinon = require('sinon');
const fs = require('fs');
const TodoLog = require('../lib/todoLog');
const app = require('../lib/routers');

describe('GET method', () => {
  it('should give the index.html page when the url is /', done => {
    request(app)
      .get('/')
      .expect('Content-Type', /text\/html/)
      .expect(200, done)
      .expect(/LoginPage/);
  });

  it('should give the 404 status code when the url is a not existing file', done => {
    request(app)
      .get('/badFile')
      .expect('Content-Type', /text\/html/)
      .expect(404, done);
  });

  it('should give the index.html page and should pass the data to the server when the url is /', done => {
    request(app)
      .get('/')
      .send('name=flower')
      .expect('Content-Type', /text\/html/)
      .expect(200, done)
      .expect(/LoginPage/);
  });

  it('should give the total todo lists when the url is /todoList', done => {
    const todoLists = [
      {
        title: 'School',
        id: 1,
        tasks: [{ id: 1, task: 'maths', status: false }]
      }
    ];
    app.locals = { todoLists: TodoLog.load(todoLists) };
    request(app)
      .get('/todoList')
      .expect('Content-Type', /application\/json/)
      .expect(200, done);
  });
});

describe('POST method', () => {
  beforeEach(() => {
    const todoLists = [
      {
        title: 'School',
        id: 1,
        tasks: [{ id: 1, task: 'maths', status: false }]
      }
    ];
    app.locals = { todoLists: TodoLog.load(todoLists) };
    app.locals.writer = sinon.fake();
  });
  afterEach(() => sinon.restore());

  it('should be able to save the new todo', done => {
    request(app)
      .post('/saveTodo')
      .send({ title: 'hello', tasks: ['hai'] })
      .expect('Content-Type', /application\/json/)
      .expect(200, done);
  });

  it('should add the a task when the url is /addNewTask', done => {
    request(app)
      .post('/addNewTask')
      .send({ todoId: 1, newTask: 'hai' })
      .expect('Content-Type', /application\/json/)
      .expect(200, done);
  });
});

describe('PATCH', () => {
  beforeEach(() => {
    const todoLists = [
      {
        title: 'School',
        id: 1,
        tasks: [{ id: 1, task: 'maths', status: false }]
      }
    ];
    app.locals = { todoLists: TodoLog.load(todoLists) };
    app.locals.writer = sinon.fake();
  });
  afterEach(() => sinon.restore());

  it('should change the status of task when the url is /changeTaskStatus', done => {
    request(app)
      .patch('/changeTaskStatus')
      .send({ todoId: 1, taskId: 1 })
      .expect('Content-Type', /application\/json/)
      .expect(200, done);
  });

  it('should update the title when the url is /updateTitle', done => {
    request(app)
      .patch('/updateTitle')
      .send({ todoId: 1, title: 'home' })
      .expect('Content-Type', /application\/json/)
      .expect(200, done);
  });

  it('should update the  task when the url is /updateTask', done => {
    request(app)
      .patch('/updateTask')
      .send({ todoId: 1, task: 'home', taskId: 1 })
      .expect('Content-Type', /application\/json/)
      .expect(200, done);
  });
});

describe('DELETE', () => {
  beforeEach(() => {
    const todoLists = [
      {
        title: 'School',
        id: 1,
        tasks: [
          { id: 1, task: 'maths', status: false },
          { id: 2, task: 'maths', status: false }
        ]
      }
    ];
    app.locals = { todoLists: TodoLog.load(todoLists) };
    app.locals.writer = sinon.fake();
  });
  afterEach(() => sinon.restore());

  it('should delete the task when the url is /deleteTask', done => {
    request(app)
      .delete('/deleteTask')
      .send({ todoId: 1, taskId: 1 })
      .expect('Content-Type', /application\/json/)
      .expect(200, done);
  });

  it('should delete a todo when the url is /deleteTodo', done => {
    request(app)
      .delete('/deleteTodo')
      .send({ todoId: 1 })
      .expect('Content-Type', /application\/json/)
      .expect(200, done);
  });
});

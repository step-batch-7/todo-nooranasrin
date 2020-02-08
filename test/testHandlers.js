const request = require('supertest');
const sinon = require('sinon');
const fs = require('fs');
const { handleRequest } = require('../lib/routers');

describe('GET method', () => {
  it('should give the index.html page when the url is /', done => {
    request(handleRequest)
      .get('/')
      .expect('Content-Type', 'text/html')
      .expect(200, done)
      .expect(/My Tasks/);
  });

  it('should give the 404 status code when the url is a not existing file', done => {
    request(handleRequest)
      .get('/badFile')
      .expect('Content-Type', 'text/html')
      .expect(404, done)
      .expect(/page not found/);
  });

  it('should give the index.html page and should pass the data to the server when the url is /', done => {
    request(handleRequest)
      .get('/')
      .send('name=flower')
      .expect('Content-Type', 'text/html')
      .expect(200, done)
      .expect(/My Tasks/);
  });

  it('should give the total todo lists when the url is /todoList', done => {
    request(handleRequest)
      .get('/todoList')
      .expect('Content-Type', 'application/json')
      .expect(200, done);
  });
});

describe('Method Not Allowed', () => {
  it('should give 405 when the method is not allowed', done => {
    request(handleRequest)
      .put('/')
      .expect('Content-Type', 'text/plain')
      .expect(405, done)
      .expect('Method Not Allowed');
  });
});

describe('POST method', () => {
  beforeEach(() => {
    sinon.replace(fs, 'writeFileSync', () => {});
  });
  afterEach(() => sinon.restore());

  it('should be able to save the new todo', done => {
    request(handleRequest)
      .post('/saveTodo')
      .send({ title: 'hello', tasks: ['hai'] })
      .expect(/{"title":"hello"/)
      .expect(200, done);
  });

  it('should change the status of task when the url is /changeTaskStatus', done => {
    request(handleRequest)
      .post('/changeTaskStatus')
      .send({ todoId: 181, taskId: 0 })
      .expect(/{"id":0,"task":"buy milk","status":true}/)
      .expect(200, done);
  });

  it('should delete the task when the url is /deleteTask', done => {
    request(handleRequest)
      .post('/deleteTask')
      .send({ todoId: 181, taskId: 0 })
      .expect(/{"id":2,"task":"clean the floor","status":false}/)
      .expect(200, done);
  });

  it('should update the title when the url is /updateTitle', done => {
    request(handleRequest)
      .post('/updateTitle')
      .send({ todoId: 181, title: 'home' })
      .expect(/"title":"home"/)
      .expect(200, done);
  });

  it('should update the  task when the url is /updateTask', done => {
    request(handleRequest)
      .post('/updateTask')
      .send({ todoId: 181, task: 'home', taskId: 2 })
      .expect(/{"id":2,"task":"home","status":false}/)
      .expect(200, done);
  });

  it('should add the a task when the url is /addNewTask', done => {
    request(handleRequest)
      .post('/addNewTask')
      .send({ todoId: 181, newTask: 'hai' })
      .expect(/{"id":3,"task":"hai","status":false}/)
      .expect(200, done);
  });

  it('should delete a todo when the url is /deleteTodo', done => {
    request(handleRequest)
      .post('/deleteTodo')
      .send({ todoId: 181 })
      .expect(/{"title":"School"/)
      .expect(200, done);
  });
});

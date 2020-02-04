const request = require('supertest');
const sinon = require('sinon');
const fs = require('fs');
const { app } = require('../lib/handlers');

describe('GET method', () => {
  it('should give the index.html page when the url is /', done => {
    request(app.processRequest.bind(app))
      .get('/')
      .expect('Content-Type', 'text/html')
      .expect(200, done)
      .expect(/My Tasks/);
  });

  it('should give the 404 status code when the url is a not existing file', done => {
    request(app.processRequest.bind(app))
      .get('/badFile')
      .expect('Content-Type', 'text/html')
      .expect(404, done)
      .expect(/page not found/);
  });

  it('should give the index.html page and should pass the data to the server when the url is /', done => {
    request(app.processRequest.bind(app))
      .get('/')
      .send('name=flower')
      .expect('Content-Type', 'text/html')
      .expect(200, done)
      .expect(/My Tasks/);
  });

  it('should give the total todo lists when the url is /todoList', done => {
    request(app.processRequest.bind(app))
      .get('/todoList')
      .expect('Content-Type', 'application/json')
      .expect(200, done);
  });
});

describe('Method Not Allowed', () => {
  it('should give 405 when the method is not allowed', done => {
    request(app.processRequest.bind(app))
      .put('/')
      .expect('Content-Type', 'text/plain')
      .expect(405, done)
      .expect('Method Not Allowed');
  });
});

describe('POST method', () => {
  beforeEach(() => sinon.replace(fs, 'writeFileSync', () => {}));
  afterEach(() => sinon.restore());

  it('should be able to save the new todo', done => {
    request(app.processRequest.bind(app))
      .post('/saveTodo')
      .send(`title=Home&tasks=[3]`)
      .expect('Content-Type', 'application/json')
      .expect(/{"title":"Home"/)
      .expect(200, done);
  });
});

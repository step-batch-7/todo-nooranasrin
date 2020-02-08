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
});

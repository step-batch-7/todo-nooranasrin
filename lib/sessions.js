class Sessions {
  constructor(id) {
    this.lastId = id;
    this.userSessions = {};
  }

  createNewSession(userName) {
    this.lastId++;
    this.userSessions[this.lastId] = userName;
  }

  getSessionId(userName) {
    const sessionIds = Object.keys(this.userSessions);
    return sessionIds.find(id => this.userSessions[id] === userName);
  }

  deleteSession(sessionId) {
    delete this.userSessions[sessionId];
  }

  getUserName(sessionId) {
    return this.userSessions[sessionId];
  }
}

module.exports = Sessions;

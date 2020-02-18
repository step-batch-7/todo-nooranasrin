class UserStore {
  constructor(path, writer) {
    this.path = path;
    this.writer = writer;
    this.userCredentials = {};
  }

  static initialize(userCredentials, path, writer) {
    const userStore = new UserStore(path, writer);
    for (const userName in userCredentials) {
      userStore.userCredentials[userName] = userCredentials[userName];
    }
    return userStore;
  }

  addNewUser(userName, credentials) {
    this.userCredentials[userName] = credentials;
    this.save();
  }

  isUserPresent(userName) {
    return this.userCredentials[userName];
  }

  isCorrectPassword(password, userName) {
    return this.userCredentials[userName].password === password;
  }

  isValidLogin(userName, password) {
    return (
      this.isUserPresent(userName) && this.isCorrectPassword(password, userName)
    );
  }

  save() {
    this.writer(this.path, JSON.stringify(this.userCredentials));
  }
}

module.exports = UserStore;

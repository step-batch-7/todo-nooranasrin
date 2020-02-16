/* eslint-disable max-statements */
const checkUserNameIsAvailable = function({ isExists }) {
  const msgBox = document.querySelector('#errorInName');
  if (isExists) {
    msgBox.innerText = 'user already exists';
    return (document.forms['registrationForm'].onsubmit = () => false);
  }
  msgBox.innerText = '';
  document.forms['registrationForm'].onsubmit = () => true;
};

const validateUserName = function() {
  const userName = event.target.value;
  postJSON('/checkUserNameExists', { userName }, checkUserNameIsAvailable);
};

const isValidLogin = function({ isValid, msg }) {
  if (isValid) {
    return (document.location = 'home.html');
  }
  document.querySelector('#errorInUserName').innerText = msg;
};

const validateLogin = function() {
  const userName = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;
  postJSON('/validateLogin', { userName, password }, isValidLogin);
};

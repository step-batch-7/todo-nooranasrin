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

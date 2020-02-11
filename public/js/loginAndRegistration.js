/* eslint-disable max-statements */
const isEmpty = function(userDetails) {
  return userDetails.some(input => input === '');
};

const isValidEmail = function(email) {
  return email.includes('@') && email.includes('.');
};

const isValidNumber = function(phoneNumber) {
  const isInteger = Number.isInteger(+phoneNumber);
  return isInteger && phoneNumber.length === 10 && +phoneNumber > 0;
};

const showErrorMsg = function(msg, querySelector) {
  document.querySelector(querySelector).innerText = msg;
};

const validateRegistrationForm = function() {
  const userName = document.forms['registrationForm']['userName'].value;
  const password = document.forms['registrationForm']['password'].value;
  const email = document.forms['registrationForm']['email'].value;
  const phoneNumber = document.forms['registrationForm']['phoneNumber'].value;

  if (isEmpty([userName, password, email, phoneNumber])) {
    showErrorMsg('* Please Fill All The Fields', '#errorInName');
    return false;
  }
  if (!isValidEmail(email)) {
    showErrorMsg('* Please Enter A Valid Email', '#errorInEmail');
    return false;
  }
  if (!isValidNumber(phoneNumber)) {
    showErrorMsg('* Please Enter A Valid Phone Number', '#errorInPhoneNumber');
    return false;
  }
  return true;
};

const validateUserName = function() {
  const userName = event.target.value;
  postJSON('/checkUserNameExists', userName, checkUserNameIsAvailable);
};

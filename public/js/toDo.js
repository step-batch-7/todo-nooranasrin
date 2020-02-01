const popupTodoMaker = function() {
  document.getElementById('popupDiv').style.display = 'block';
  document.getElementById('addButton').style.display = 'none';
};

const hideToDoRegisterWindow = function() {
  document.getElementById('addButton').style.display = 'block';
  document.getElementById('popupDiv').style.display = 'none';
};

const addItem = function() {
  document.getElementById('item').value = '';
};

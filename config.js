const getStoragePath = function() {
  return process.env.STORAGE_FILE || `${__dirname}/data/todoLists.json`;
};

const storagePath = getStoragePath();
module.exports = storagePath;

export default new (class StorageController {
  setItem(storageName, value) {
    localStorage.setItem(storageName, value);
  }

  getItem(storageName) {
    return localStorage.getItem(storageName);
  }
})();

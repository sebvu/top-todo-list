export default new (class StorageController {
  setItem(storageName, value) {
    localStorage.setItem(storageName, value);
  }
})();

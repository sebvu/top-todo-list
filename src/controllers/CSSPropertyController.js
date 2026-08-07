export default new (class CSSPropertyController {
  constructor() {
    this.#styleSheet = getComputedStyle(document.querySelector("body"));
  }

  #styleSheet;

  requestProperty(propertyName) {
    this.#styleSheet.getPropertyValue(propertyName);
  }

  setVariable(newPropertyName, property) {
    this.#styleSheet.setProperty(newPropertyName, property);
  }
})();

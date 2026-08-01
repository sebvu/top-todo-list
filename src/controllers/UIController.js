import { default as StorageController } from "./StorageController.js";
import { default as LogController } from "./LogController.js";

export default new (class UIController {
  invoke(handler) {
    handler();
  }
})();

// class handlers for toggle

class elementBase {
  toggle() {
    LogController.errLog(this, "toggle() method not implemented");
  }
}

export class themeToggler extends elementBase {
  constructor() {
    super();
  }

  #ATTR_NAME = "data-theme";
  #ROOT_ELEMENT = document.documentElement;

  toggle() {
    const currentTheme = this.#ROOT_ELEMENT.getAttribute(this.#ATTR_NAME);
    const newTheme = currentTheme === "light" ? "dark" : "light";

    this.#ROOT_ELEMENT.setAttribute(this.#ATTR_NAME, newTheme);

    StorageController.setItem(this.#ATTR_NAME, newTheme);

    LogController.log(this, `Toggling theme to ${newTheme}`);
  }
}

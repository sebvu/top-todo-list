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

  toggle() {
    const attributeName = "data-theme";
    const rootElement = document.documentElement;

    const currentTheme = rootElement.getAttribute(attributeName);
    const newTheme = currentTheme === "light" ? "dark" : "light";

    rootElement.setAttribute(attributeName, newTheme);

    StorageController.setItem(attributeName, newTheme);

    LogController.log(this, `Toggling theme to ${newTheme}`);
  }
}

export class sidebarToggler extends elementBase {
  constructor() {
    super();
  }

  toggle() {
    const sidebarElement = document.querySelector("#sidebar");
    const sidebarCloseClass = "sidebar--close";

    if (sidebarElement.classList.contains(sidebarCloseClass)) {
      // open
      sidebarElement.classList.remove(sidebarCloseClass);
      sidebarElement.style.width = "auto";
    } else {
      // open
      sidebarElement.classList.add(sidebarCloseClass);
      sidebarElement.style.width = "0";
      // close
    }
  }
}

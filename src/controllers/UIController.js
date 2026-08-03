import { default as StorageController } from "./StorageController.js";
import { default as LogController } from "./LogController.js";
import { default as Loader } from "../helpers/elLoader.js";

class UIController {
  constructor() {
    // pull dialog container from dom (temporary)
    this.dialogContainer = document.querySelector("#dialog");
    // this.dialogContainer.remove();
    this.dialogContainer.addEventListener("close", () => {
      setTimeout(() => {
        this.dialogContainer.remove();
      }, 400);
    });
    this.dialogContainer.showModal();
  }

  invoke(handler) {
    handler();
  }

  getDialogBox() {
    // const dialogContainer = Loader.loadElements(
    //   Loader.newEl("dialog", {
    //     id: "dialog",
    //     attrsList: { popover: "" },
    //   }),
    // ).pop();
    // return dialogContainer;

    return this.dialogContainer;
  }
}

const UIControl = new UIController();

export default UIControl;

// class handlers for toggle

class elementBase {
  action() {
    LogController.errLog(this, "toggle() method not implemented");
  }
}

export class themeToggler extends elementBase {
  constructor() {
    super();
  }

  action() {
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

  action() {
    const sidebarElement = document.querySelector("#sidebar");
    const sidebarCloseClass = "sidebar--close";

    if (sidebarElement.classList.contains(sidebarCloseClass)) {
      // open
      sidebarElement.classList.remove(sidebarCloseClass);
    } else {
      // close
      sidebarElement.classList.add(sidebarCloseClass);
    }
  }
}

export class addTodoItem extends elementBase {
  constructor() {
    super();
  }

  action() {
    const dialog = UIControl.getDialogBox();

    document.body.appendChild(dialog);

    dialog.showModal();
  }
}

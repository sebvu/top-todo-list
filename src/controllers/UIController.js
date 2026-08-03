import { default as StorageController } from "./StorageController.js";
import { default as LogController } from "./LogController.js";
import { default as Loader } from "../helpers/elLoader.js";

class UIController {
  constructor() {}

  invoke(handler) {
    handler();
  }

  getDialogBox(headerText = "N/A") {
    const dialogContainer = Loader.loadElements(
      Loader.newEl("dialog", {
        id: "dialog",
        classList: "--context-xs",
        attrsList: { popover: "" },
        children: [
          Loader.newEl("hgroup", {
            classList: ["dialog__header", "header", "--context-sm"],
            children: [
              Loader.newEl("h1", {
                classList: [
                  "header__title",
                  "_text",
                  "_text--header-font",
                  "--context-md",
                ],
                text: headerText,
              }),
              Loader.newEl("h2", {
                classList: ["header__subtext", "_text", "--context-xs"],
                children: [
                  Loader.newTextNode("Fill all required ("),
                  Loader.newEl("span", { text: " * " }),
                  Loader.newTextNode(") fields."),
                ],
              }),
            ],
          }),
          Loader.newEl("hr", { classList: "form__hr" }),
        ],
      }),
    ).pop();

    // ensure element is removed from DOM
    dialogContainer.addEventListener("close", () => {
      setTimeout(() => {
        dialogContainer.remove();
      }, 400);
    });

    return dialogContainer;
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
    const dialog = UIControl.getDialogBox("Add Todo List");

    const addTodoItemElements = Loader.loadElements(
      Loader.newEl("form", {
        classList: ["dialog__form", "form", "_text", "--context-xs"],
        attrsList: { action: "", method: "post" },
        children: [
          Loader.newEl("p", {
            classList: "form__field",
            children: [
              Loader.newEl("label", {
                attrsList: { for: "list-name" },
                text: "List Name:",
              }),
              Loader.newEl("input", {
                attrsList: {
                  type: "text",
                  id: "list-name",
                  name: "list_name",
                  minlength: "3",
                  maxlength: "20",
                  value: "New List",
                  required: "",
                },
              }),
              Loader.newEl("span"),
            ],
          }),
          Loader.newEl("button", {
            classList: "form__submit-button",
            attrsList: { submit: "" },
            text: "Submit",
          }),
        ],
      }),
    );

    for (const el of addTodoItemElements) {
      dialog.appendChild(el);
    }

    document.body.appendChild(dialog);

    dialog.showModal();
  }
}

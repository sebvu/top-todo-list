import { default as StorageController } from "./StorageController.js";
import { default as LogController } from "./LogController.js";
import { default as Loader } from "../helpers/elLoader.js";

class UIController {
  constructor() {}

  #currDialog;

  invoke(handler) {
    handler();
  }

  // will take in a submit handler future update
  openDialogBox() {
    const submitButton = Loader.loadElements(
      Loader.newEl("button", {
        classList: "form__submit-button",
        attrsList: { submit: "" },
        text: "Submit",
      }),
    ).pop();

    this.#currDialog.querySelector(".form").appendChild(submitButton);

    document.body.append(this.#currDialog);

    this.#currDialog.showModal();
  }

  getDialogBoxForm(headerText = "N/A") {
    const dialogContainer = Loader.loadElements(
      Loader.newEl("dialog", {
        id: "dialog",
        classList: "--context-xs",
        attrsList: { popover: "" },
        children: [
          Loader.newEl("button", {
            classList: "dialog__exit-button",
            children: [
              Loader.newEl("svg", {
                classList: "dialog__exit-button-icon",
                isNS: true,
                attrsList: { viewBox: "0 0 24 24" },
                children: [
                  Loader.newEl("path", {
                    isNS: true,
                    attrsList: {
                      d: "M9,7L11,12L9,17H11L12,14.5L13,17H15L13,12L15,7H13L12,9.5L11,7H9Z",
                    },
                  }),
                ],
              }),
            ],
          }),
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
          Loader.newEl("form", {
            classList: ["dialog__form", "form", "_text", "--context-xs"],
            attrsList: { action: "", method: "post" },
          }),
        ],
      }),
    ).pop();

    const dialogExitButton = document.querySelector(".dialog__exit-button");
    const dialogSubmitButton = document.querySelector(".form__submit-button");

    // close dialog normally w/exit button
    dialogExitButton.addEventListener("click", () => {
      dialogContainer.close();
    });

    // handle submit
    dialogSubmitButton.addEventListener("click", (e) => {
      e.preventDefault();

      console.log("submit attempt");
    });

    // ensure element is removed from DOM
    dialogContainer.addEventListener("close", () => {
      setTimeout(() => {
        dialogContainer.remove();
      }, 400);
    });

    // update new 'open dialog' reference
    this.#currDialog = dialogContainer;

    const dialogContainerForm = dialogContainer.querySelector(".form");

    return dialogContainerForm;
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

  // submit handler for dialog
  // submit() {
  //
  // }

  action() {
    const dialogForm = UIControl.getDialogBoxForm("Add Todo List");

    const addTodoItemsElements = Loader.loadElements(
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
    );

    for (const el of addTodoItemsElements) {
      dialogForm.appendChild(el);
    }

    // will submit handler for dialog future
    UIControl.openDialogBox();
  }
}

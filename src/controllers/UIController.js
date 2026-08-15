import LogController from "./LogController.js";
import Loader from "../helpers/elLoader.js";
import ProjectController from "./ProjectController.js";
import CSSPropertyController from "./CSSPropertyController.js";

class UIController {
  #currDialog;

  #setCurrentProjectTitle(projectName, projectColor) {
    const currentProjectTitle = document.querySelector(".curr-project__name");
    const currentProjectColor = document.querySelector(".curr-project__icon");

    currentProjectTitle.textContent = projectName;
    currentProjectColor.style.fill = projectColor;
  }

  #createProjectUI(projectName, projectColor) {
    return Loader.loadElements(
      Loader.newEl("li", {
        classList: "projects__item",
        children: [
          Loader.newEl("div", {
            classList: "projects__icon-wrapper",
            children: [
              Loader.newEl("svg", {
                isNS: true,
                classList: "projects__icon",
                attrsList: { viewBox: "0 0 24 24" },
                children: [
                  Loader.newEl("path", {
                    isNS: true,
                    attrsList: {
                      d: "M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M7 7H9V9H7V7M7 11H9V13H7V11M7 15H9V17H7V15M17 17H11V15H17V17M17 13H11V11H17V13M17 9H11V7H17V9Z",
                      fill: projectColor,
                    },
                  }),
                ],
              }),
            ],
          }),
          Loader.newEl("h2", {
            classList: "projects__name",
            text: projectName,
          }),
        ],
      }),
    );
  }

  #setProjectTodoLists(projectTodoLists) {
    console.log(projectTodoLists);
  }

  invoke(handler) {
    handler();
  }

  reloadPage() {
    const projectJSON = ProjectController.getStructureJSON();
    const projectsList = document.querySelector(".projects__list");
    const mainContainer = document.querySelector("#main");

    while (projectsList.firstChild) {
      projectsList.removeChild(projectsList.lastChild);
    }

    while (mainContainer.firstChild) {
      mainContainer.removeChild(mainContainer.lastChild);
    }

    let selectedProject = undefined;

    for (const proj of projectJSON) {
      const projectListElement = this.#createProjectUI(
        proj.projectName,
        proj.projectColor,
      ).pop();
      projectListElement.addEventListener("click", () => {
        ProjectController.getProjectEventHandler(proj.projectName)();
        this.reloadPage();
      });
      projectsList.appendChild(projectListElement);

      const currentProject = ProjectController.getCurrentProject();
      const projectName =
        currentProject === undefined ? undefined : currentProject.name;
      if (proj.projectName === projectName) {
        selectedProject = proj;
      }
    }

    if (selectedProject !== undefined) {
      this.#setCurrentProjectTitle(
        selectedProject.projectName,
        selectedProject.projectColor,
      );

      this.#setProjectTodoLists(selectedProject.todoLists);

      LogController.log(this, `${selectedProject.projectName} project is set.`);
    } else {
      LogController.log(this, "No selected project, main not populated.");
    }
  }

  // will take in a submit handler future update
  openDialogBox(submitHandler) {
    const submitButton = Loader.loadElements(
      Loader.newEl("button", {
        classList: "form__submit-button",
        attrsList: { submit: "" },
        text: "Submit",
      }),
    ).pop();

    submitButton.addEventListener("click", () => {
      console.log("hello");
      submitHandler();
    });

    this.#currDialog.querySelector(".form").appendChild(submitButton);

    document.body.append(this.#currDialog);

    this.#currDialog.showModal();
  }

  closeDialogBox() {
    this.#currDialog.close();
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
          Loader.newEl("ul", {
            classList: "dialog__errors",
          }),
        ],
      }),
    ).pop();

    const dialogExitButton = dialogContainer.querySelector(
      ".dialog__exit-button",
    );

    // close dialog normally w/exit button
    dialogExitButton.addEventListener("click", () => {
      console.log("close invoked");
      dialogContainer.close();
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

    dialogContainerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("attempt submit");
    });

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

  handleTryCreateRes(createRes, errorListElement) {
    if (createRes.errorExists) {
      for (const res of createRes.res) {
        res.input.setCustomValidity(res.errMsg);
        const newErrorListItem = Loader.loadElements(
          Loader.newEl("li", {
            classList: "errors__item",
            children: [Loader.newEl("span")],
            text: res.errMsg,
          }),
        ).pop();
        errorListElement.appendChild(newErrorListItem);
      }
    } else {
      UIControl.closeDialogBox();
    }
  }

  getErrorListAndClearedFormValidity(...fieldElements) {
    for (const el of fieldElements) {
      el.setCustomValidity("");
    }

    const errorListElement = document.querySelector(".dialog__errors");

    while (errorListElement.firstChild) {
      errorListElement.removeChild(errorListElement.lastChild);
    }

    return errorListElement;
  }
}

export class toggleTheme extends elementBase {
  constructor() {
    super();
  }

  action() {
    const attributeName = "data-theme";
    const rootElement = document.documentElement;

    const currentTheme = rootElement.getAttribute(attributeName);
    const newTheme = currentTheme === "light" ? "dark" : "light";

    rootElement.setAttribute(attributeName, newTheme);

    // StorageController.setItem(attributeName, newTheme);

    LogController.log(this, `Toggling theme to ${newTheme}`);
  }
}

export class toggleSidebar extends elementBase {
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

export class addProject extends elementBase {
  constructor() {
    super();
  }

  #submit() {
    const dialogForm = document.querySelector(".dialog__form");
    const projectName = dialogForm.querySelector("#project-name");
    const projectColor = dialogForm.querySelector("#project-color");

    console.log(dialogForm);
    console.log(projectName);
    console.log(projectColor);

    const errorListElement = this.getErrorListAndClearedFormValidity(
      projectName,
      projectColor,
    );

    if (!dialogForm.reportValidity()) return;

    const createProjectRes = ProjectController.tryCreateProject(
      projectName,
      projectColor,
    );

    this.handleTryCreateRes(createProjectRes, errorListElement);

    UIControl.reloadPage();
  }

  action() {
    const dialogForm = UIControl.getDialogBoxForm(
      "Add Project",
      this.#submit.bind(this),
    );

    const addProjectFormElements = Loader.loadElements(
      Loader.newEl("p", {
        classList: "form__field",
        children: [
          Loader.newEl("label", {
            attrsList: { for: "project-name" },
            text: "Project Name:",
          }),
          Loader.newEl("span", {
            children: [
              Loader.newEl("input", {
                attrsList: {
                  type: "text",
                  id: "project-name",
                  name: "project_name",
                  minlength: "3",
                  maxlength: "20",
                  value: "New Project",
                  required: "",
                },
              }),
              Loader.newEl("span"),
            ],
          }),
        ],
      }),
      Loader.newEl("p", {
        classList: "form__field",
        children: [
          Loader.newEl("label", {
            attrsList: { for: "project-color" },
            text: "Project Color",
          }),
          Loader.newEl("span", {
            children: [
              Loader.newEl("input", {
                attrsList: {
                  type: "color",
                  id: "project-color",
                  name: "project_color",
                  list: "project-color-presets",
                  value: CSSPropertyController.requestProperty("--red-color"),
                },
              }),
              Loader.newEl("span"),
            ],
          }),
        ],
      }),
    );

    for (const el of addProjectFormElements) {
      dialogForm.appendChild(el);
    }

    UIControl.openDialogBox(this.#submit.bind(this));
  }
}

export class addTodoList extends elementBase {
  constructor() {
    super();
  }

  // submit handler for dialog
  #submit(thisProject) {
    const dialogForm = document.querySelector(".dialog__form");

    const listName = dialogForm.querySelector("#list-name");

    const errorListElement = this.getErrorListAndClearedFormValidity(listName);

    if (!dialogForm.reportValidity()) return;

    const createTodoListRes = thisProject.tryCreateProject(listName);

    this.handleTryCreateRes(createTodoListRes, errorListElement);

    UIControl.reloadPage();
  }

  action() {
    const dialogForm = UIControl.getDialogBoxForm("Add Todo List");

    const addTodoFormElements = Loader.loadElements(
      Loader.newEl("p", {
        classList: "form__field",
        children: [
          Loader.newEl("label", {
            attrsList: { for: "list-name" },
            text: "List Name:",
          }),
          Loader.newEl("span", {
            children: [
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
        ],
      }),
    );

    for (const el of addTodoFormElements) {
      dialogForm.appendChild(el);
    }

    UIControl.openDialogBox();
  }
}

export class addTodoListItem extends elementBase {
  constructor() {
    super();
  }

  #submit(thisTodoList) {
    const dialogForm = document.querySelector(".dialog__form");

    const itemName = dialogForm.querySelector("#list-item-name");
    const itemDueDate = dialogForm.querySelector("#list-item-duedate");
    const itemDescription = dialogForm.querySelector("#list-item-description");

    const errorListElement = this.getErrorListAndClearedFormValidity(
      itemName,
      itemDueDate,
      itemDescription,
    );

    if (!dialogForm.reportValidity()) return;

    const createTodoItemRes = thisTodoList.tryCreateTodoItem(
      itemName,
      itemDueDate,
      itemDescription,
    );

    this.handleTryCreateRes(createTodoItemRes, errorListElement);

    UIControl.reloadPage();
  }

  action() {
    const dialogForm = UIControl.getDialogBoxForm("Add List Item");

    const formListItemName = Loader.newEl("p", {
      classList: "form__field",
      children: [
        Loader.newEl("label", {
          attrsList: { for: "list-item-name" },
          text: "List Item Name:",
        }),
        Loader.newEl("span", {
          children: [
            Loader.newEl("input", {
              attrsList: {
                type: "text",
                id: "list-item-name",
                name: "list_item_name",
                minlength: "3",
                maxlength: "20",
                value: "New List Item",
                required: "",
              },
            }),
            Loader.newEl("span"),
          ],
        }),
      ],
    });

    const formListItemDueDate = Loader.newEl("p", {
      classList: "form__field",
      children: [
        Loader.newEl("label", {
          attrsList: { for: "list-item-duedate" },
          text: "Item Due Date:",
        }),
        Loader.newEl("span", {
          children: [
            Loader.newEl("input", {
              attrsList: {
                type: "date",
                id: "list-item-duedate",
                name: "list_item_duedate",
                value: new Date(),
                required: "",
              },
            }),
            Loader.newEl("span"),
          ],
        }),
      ],
    });

    const formListItemPriority = Loader.newEl("p", {
      classList: "form__field",
      children: [
        Loader.newEl("label", {
          attrsList: { for: "list-item-priority" },
          text: "Item Priority:",
        }),
        Loader.newEl("span", {
          children: [
            Loader.newEl("select", {
              attrsList: {
                id: "list-item-priority",
                name: "list_item_priority",
                required: "",
              },
              children: [
                Loader.newEl("option", {
                  attrsList: { value: "" },
                  text: "Select priority",
                }),
                Loader.newEl("option", {
                  attrsList: { value: "low" },
                  text: "Low",
                }),
                Loader.newEl("option", {
                  attrsList: { value: "medium" },
                  text: "Medium",
                }),
                Loader.newEl("option", {
                  attrsList: { value: "high" },
                  text: "High",
                }),
              ],
            }),
            Loader.newEl("span"),
          ],
        }),
      ],
    });

    const formListItemDescription = Loader.newEl("p", {
      classList: "form__field",
      children: [
        Loader.newEl("label", {
          attrsList: { for: "list-item-description" },
          text: "Item Description:",
        }),
        Loader.newEl("span", {
          children: [
            Loader.newEl("textarea", {
              attrsList: {
                id: "list-item-duedate",
                name: "list_item_duedate",
                rows: "8",
                text: "A new item that I have to complete, yay...",
              },
            }),
            Loader.newEl("span"),
          ],
        }),
      ],
    });

    const addTodoFormElements = Loader.loadElements(
      formListItemName,
      formListItemDueDate,
      formListItemPriority,
      formListItemDescription,
    );

    for (const el of addTodoFormElements) {
      dialogForm.appendChild(el);
    }

    UIControl.openDialogBox();
  }
}

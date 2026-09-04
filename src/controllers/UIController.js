import LogController from "./LogController.js";
import Loader from "../helpers/elLoader.js";
import ProjectController from "./ProjectController.js";
import CSSPropertyController from "./CSSPropertyController.js";
import { format } from "date-fns";
import StorageController from "./StorageController.js";

// TODO: Add a 'general project view' when there's no project to be shown
// TODO: Save data via localstorage
// TODO: Mobile compatability

// class handlers for toggle

class elementBase {
  action() {
    LogController.errLog(this, "action() method not implemented");
  }

  static handleTryCreateRes(createRes, errorListElement) {
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

  static getErrorListAndClearedFormValidity(...fieldElements) {
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

class toggleTheme extends elementBase {
  constructor() {
    super();
  }

  action() {
    const attributeName = "data-theme";
    const rootElement = document.documentElement;

    const currentTheme = rootElement.getAttribute(attributeName);
    const newTheme = currentTheme === "light" ? "dark" : "light";

    rootElement.setAttribute(attributeName, newTheme);

    StorageController.theme = newTheme;

    LogController.log(this, `Toggling theme to ${newTheme}`);
  }
}

class toggleSidebar extends elementBase {
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

class deleteThisItem extends elementBase {
  constructor() {
    super();
  }

  static submit(itemName, typeOfItem, parentObjectDeleteFunc) {
    const deleteItemCheckbox = document.querySelector("#delete-item");

    if (deleteItemCheckbox.checked) {
      parentObjectDeleteFunc(itemName);
      LogController.log(itemName + " is deleted");

      if (typeOfItem === "project") {
        document.querySelector("#main").setAttribute("data-project", "");

        // HACK: :) this accessor is honestly really bad practice, but it's whatever
        ProjectController.removeCurrentProjectReference();
      }

      UIControl.closeDialogBox(true);
    } else {
      UIControl.closeDialogBox();
    }
    UIControl.reloadPage();
  }

  action(itemName, typeOfItem, parentObjectDeleteFunc) {
    const dialogForm = UIControl.getDialogBoxAddForm(
      `Delete '${itemName}'?`,
      `Are you sure you want to delete '${itemName}' ${typeOfItem}?`,
    );

    const addProjectFormElements = Loader.loadElements(
      Loader.newEl("hr", { classList: "form__hr" }),
      Loader.newEl("p", {
        classList: "form__field",
        children: [
          Loader.newEl("label", {
            attrsList: { for: "delete-item" },
            text: "Delete?",
          }),
          Loader.newEl("span", {
            children: [
              Loader.newEl("input", {
                attrsList: {
                  type: "checkbox",
                  id: "delete-item",
                  name: "delete_item",
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

    UIControl.openDialogBox(
      (() => {
        deleteThisItem.submit(itemName, typeOfItem, parentObjectDeleteFunc);
      }).bind(this),
    );
  }
}

class addProject extends elementBase {
  constructor() {
    super();
  }

  static submit() {
    const dialogForm = document.querySelector(".dialog__form");
    const projectName = dialogForm.querySelector("#project-name");
    const projectColor = dialogForm.querySelector("#project-color");

    const errorListElement = addProject.getErrorListAndClearedFormValidity(
      projectName,
      projectColor,
    );

    if (!dialogForm.reportValidity()) return;

    const createProjectRes = ProjectController.tryCreateProject(
      projectName,
      projectColor,
    );

    addProject.handleTryCreateRes(createProjectRes, errorListElement);

    UIControl.reloadPage();
  }

  action() {
    const dialogForm = UIControl.getDialogBoxAddForm("Add Project");

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

    UIControl.openDialogBox(addProject.submit);
  }
}

class addTodoList extends elementBase {
  constructor() {
    super();
  }

  // submit handler for dialog
  static submit() {
    const dialogForm = document.querySelector(".dialog__form");

    const listName = dialogForm.querySelector("#list-name");

    const errorListElement =
      addTodoList.getErrorListAndClearedFormValidity(listName);

    if (!dialogForm.reportValidity()) return;

    const currProj = ProjectController.getCurrentProject();

    const createTodoListRes = currProj.tryCreateTodoList(listName);

    addTodoList.handleTryCreateRes(createTodoListRes, errorListElement);

    UIControl.reloadPage();
  }

  action() {
    const dialogForm = UIControl.getDialogBoxAddForm("Add Todo List");

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

    UIControl.openDialogBox(addTodoList.submit);
  }
}

class addTodoListItem extends elementBase {
  constructor() {
    super();
  }

  static currentTodoListObject;

  static submit() {
    const dialogForm = document.querySelector(".dialog__form");

    const itemName = dialogForm.querySelector("#list-item-name");
    const itemDueDate = dialogForm.querySelector("#list-item-duedate");
    const itemIsChecked = dialogForm.querySelector("#item-list-ischecked");
    const itemDescription = dialogForm.querySelector("#list-item-description");
    const itemPriorityLevel = dialogForm.querySelector("#list-item-priority");

    const errorListElement = addTodoListItem.getErrorListAndClearedFormValidity(
      itemName,
      itemDueDate,
      itemIsChecked,
      itemDescription,
      itemPriorityLevel,
    );

    if (!dialogForm.reportValidity()) return;

    const createTodoItemRes =
      addTodoListItem.currentTodoListObject.tryCreateListItem(
        itemName,
        itemDueDate,
        itemDescription,
        itemPriorityLevel,
        itemIsChecked,
      );

    addTodoListItem.handleTryCreateRes(createTodoItemRes, errorListElement);

    addTodoListItem.currentTodoListObject.sortListItems();
    UIControl.reloadPage();
  }

  action(listItemName) {
    const dialogForm = UIControl.getDialogBoxAddForm("Add List Item");
    const listItemObj = ProjectController.getTodoListObj(
      ProjectController.getCurrentProject().name,
      listItemName,
    );

    addTodoListItem.currentTodoListObject = listItemObj;

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

    const formListItemIsChecked = Loader.newEl("p", {
      classList: "form__field",
      children: [
        Loader.newEl("label", {
          attrsList: { for: "item-list-ischecked" },
          text: "Item Is Checked:",
        }),
        Loader.newEl("span", {
          children: [
            Loader.newEl("input", {
              attrsList: {
                id: "item-list-ischecked",
                name: "item_list_ischecked",
                type: "checkbox",
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
                id: "list-item-description",
                name: "list_item_description",
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
      formListItemIsChecked,
      formListItemPriority,
      formListItemDescription,
    );

    for (const el of addTodoFormElements) {
      dialogForm.appendChild(el);
    }

    UIControl.openDialogBox(addTodoListItem.submit);
  }
}

class openTodoListItem extends elementBase {
  constructor() {
    super();
  }

  // delete func action for list items
  action(listItemName, todoListName, deleteFunc) {
    const todoListObj = ProjectController.getTodoListObj(
      ProjectController.getCurrentProject().name,
      todoListName,
    );

    const listItemObj = todoListObj.getListItemByName(listItemName);

    const exitHook = () => {
      const hookDialogCheckbox = document.querySelector(
        ".header__switch-container input",
      );

      if (hookDialogCheckbox.checked) {
        listItemObj.setCheck(true);
      } else {
        listItemObj.setCheck(false);
      }
      todoListObj.sortListItems();
      UIControl.reloadPage();
    };

    const [dialogMainSection, dialogCheckbox] =
      UIControl.getDialogBoxPreviewForm(listItemName, exitHook, () => {
        UIControl.getDeleteThisItemControl().action(
          listItemName,
          "todo list item",
          deleteFunc,
        );
      });

    if (listItemObj.isChecked) {
      dialogCheckbox.checked = true;
    }

    const mainSectionContent = Loader.loadElements(
      Loader.newEl("p", {
        classList: ["main-section__duedate", "_text", "_text--header-font"],
        text: `Due Date: ${format(new Date(listItemObj.dueDate), "MM/dd/yyyy")}`,
      }),
      Loader.newEl("p", {
        classList: ["main-section__description", "_text"],
        text: `${listItemObj.description}`,
      }),
    );

    for (const el of mainSectionContent) {
      dialogMainSection.appendChild(el);
    }

    UIControl.openDialogBox();
  }
}

class UIController {
  constructor() {
    const themeToggleButton = document.querySelector(".theme-button");
    const sidebarToggleButton = document.querySelector(".sidebar-button");
    const projectAddButton = document.querySelector(".projects__add-button");
    const addTodoListButton = document.querySelector(".header__add-todo");

    this.toggleThemeControl = new toggleTheme();
    this.toggleSidebarControl = new toggleSidebar();
    this.addProjectControl = new addProject();
    this.deleteThisItemControl = new deleteThisItem();
    this.addTodoListControl = new addTodoList();
    this.addTodoListItemControl = new addTodoListItem();
    this.openTodoListItemControl = new openTodoListItem();

    const bindTogglerWithClass = (togglerClassObj) => {
      return togglerClassObj.action.bind(togglerClassObj);
    };

    const elementHandlerPairs = [
      [themeToggleButton, bindTogglerWithClass(this.toggleThemeControl)],
      [sidebarToggleButton, bindTogglerWithClass(this.toggleSidebarControl)],
      [addTodoListButton, bindTogglerWithClass(this.addTodoListControl)],
      [projectAddButton, bindTogglerWithClass(this.addProjectControl)],
    ];

    for (const [element, handler] of elementHandlerPairs) {
      element.addEventListener("click", () => {
        this.invoke(handler);
      });
    }
  }

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

  #resolveListItemClasses(listItem) {
    const priorityLevel = listItem.priorityLevel.toLowerCase();
    const isChecked = listItem.isChecked;
    const listItemClassList = [];

    switch (priorityLevel) {
      case "low":
        listItemClassList.push("item--priority-low");
        break;
      case "medium":
        listItemClassList.push("item--priority-medium");
        break;
      case "high":
        listItemClassList.push("item--priority-high");
        break;
      default:
        LogController.errLog(
          this,
          `${priorityLevel} is not a registered priority level. This is a logical error, this should not happen.`,
        );
    }

    switch (isChecked) {
      case true:
        listItemClassList.push("item--checked");
        break;
      case false:
        break;
      default:
        LogController.errLog(
          this,
          `${isChecked} is not a registered 'isChecked' value, should be boolean. This is a logical error.`,
        );
    }

    return listItemClassList;
  }

  #setProjectTodoLists(projectTodoLists) {
    const projectTodoListsElArray = [];

    for (const todoList of projectTodoLists) {
      const newTodoListEl = Loader.newEl("section", {
        classList: "todo",
        children: [
          Loader.newEl("hgroup", {
            classList: "todo__header",
            children: [
              Loader.newEl("h1", {
                classList: ["todo__name", "_text", "_text--header-font"],
                text: todoList.name,
              }),
              Loader.newEl("span", {
                classList: "todo__buttons",
                children: [
                  Loader.newEl("button", {
                    classList: ["todo__add-item-button", "_text"],
                    text: "Add Item",
                  }),
                  Loader.newEl("button", {
                    classList: "todo__delete-todo-list-button",
                    children: [
                      Loader.newEl("svg", {
                        classList: "todo__delete-todo-list-button-icon",
                        isNS: true,
                        attrsList: { viewBox: "0 0 24 24" },
                        children: [
                          Loader.newEl("path", {
                            isNS: true,
                            attrsList: {
                              d: "M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z",
                            },
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          ...(() => {
            const todoListItems = [];

            for (const listItem of todoList.listItems) {
              const listItemLoaderEl = Loader.newEl("section", {
                classList: [
                  "item",
                  "todo__item",
                  "_text",
                  "--context-xxxs",
                  ...this.#resolveListItemClasses(listItem),
                ],
                children: [
                  Loader.newEl("ul", {
                    classList: "item__list",
                    children: [
                      Loader.newEl("li", {
                        children: [
                          Loader.newEl("h2", {
                            classList: "item__name",
                            text: listItem.name,
                          }),
                        ],
                      }),
                      Loader.newEl("li", {
                        children: [
                          Loader.newEl("p", {
                            classList: "item__due-date",
                            text: "Due ",
                            children: [
                              Loader.newEl("time", {
                                classList: ["_text", "_text-bold"],
                                attrsList: { datetime: listItem.dueDate },
                                text: format(listItem.dueDate, "MM/dd/yyyy"), // need to format with date-fns
                              }),
                            ],
                          }),
                        ],
                      }),
                      Loader.newEl("li", {
                        children: [
                          Loader.newEl("p", {
                            classList: "item__description",
                            text: listItem.description,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              });
              todoListItems.push(listItemLoaderEl);
            }

            return todoListItems;
          })(),
        ],
      });

      const newLoadedTodoListEl = Loader.loadElements(newTodoListEl).pop();

      const todoListName =
        newLoadedTodoListEl.querySelector(".todo__name").textContent;

      // make add button functional
      const todoListAddItemButtonEl = newLoadedTodoListEl.querySelector(
        ".todo__add-item-button",
      );
      todoListAddItemButtonEl.addEventListener("click", () => {
        this.addTodoListItemControl.action(todoList.name);
      });

      // make todo list delete button functional
      const currentProjectRef = ProjectController.getCurrentProject();

      const todoListDeleteListEl = newLoadedTodoListEl.querySelector(
        ".todo__delete-todo-list-button",
      );

      todoListDeleteListEl.addEventListener("click", () => {
        this.deleteThisItemControl.action(
          todoListName,
          "todo list",
          currentProjectRef.delete.bind(currentProjectRef),
        );
      });

      // list item functionality
      const currentTodoListRef =
        currentProjectRef.getTodoListByName(todoListName);
      const listItemEls = newLoadedTodoListEl.querySelectorAll(".todo__item");
      const listItemName =
        newLoadedTodoListEl.querySelector(".todo__name").textContent;

      for (const el of listItemEls) {
        const elItemName = el.querySelector(".item__name").textContent;

        // delete functionality entrance for todo list items
        el.addEventListener("click", () => {
          this.openTodoListItemControl.action(
            elItemName,
            listItemName,
            currentTodoListRef.delete.bind(currentTodoListRef),
          );
        });
      }

      projectTodoListsElArray.push(newLoadedTodoListEl);
    }
    return projectTodoListsElArray;
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
        document
          .querySelector("#main")
          .setAttribute("data-project", projectName);
      }
    }

    // TODO: add handler for no project defined, i.e. remove add todo list and delete project buttons
    // if (selectedProject === undefined) {
    // }

    if (selectedProject !== undefined) {
      // HACK: cloning node to remove stacked event listeners.. fuck me
      const deleteProjectButton = document.querySelector(
        ".header__delete-project",
      );

      const deleteProjectClonedNode = deleteProjectButton.cloneNode(true);

      deleteProjectButton.parentNode.replaceChild(
        deleteProjectClonedNode,
        deleteProjectButton,
      );

      deleteProjectClonedNode.addEventListener("click", () => {
        this.deleteThisItemControl.action(
          selectedProject.projectName,
          "project",
          ProjectController.delete.bind(ProjectController),
        );
      });

      this.#setCurrentProjectTitle(
        selectedProject.projectName,
        selectedProject.projectColor,
      );

      const projectTodoListsElArray = this.#setProjectTodoLists(
        selectedProject.todoLists,
      );

      for (const todoListEl of projectTodoListsElArray) {
        mainContainer.appendChild(todoListEl);
      }

      LogController.log(this, `${selectedProject.projectName} project is set.`);
    } else {
      this.#setCurrentProjectTitle("No Project Selected 🫪", "#FFF");
      LogController.log(this, "No selected project, main not populated.");
    }
    // save ALL data
    StorageController.saveCurrentData();
  }

  getDeleteThisItemControl() {
    return this.deleteThisItemControl;
  }

  // will take in a submit handler future update
  openDialogBox(submitHandler = undefined) {
    // NOTE: works for all types of dialog box opener classes
    if (submitHandler === undefined) {
      document.body.append(this.#currDialog);

      this.#currDialog.showModal();
    } else {
      const submitButton = Loader.loadElements(
        Loader.newEl("button", {
          classList: "form__submit-button",
          attrsList: { submit: "" },
          text: "Submit",
        }),
      ).pop();

      submitButton.addEventListener("click", submitHandler);

      this.#currDialog.querySelector(".form").appendChild(submitButton);

      document.body.append(this.#currDialog);

      this.#currDialog.showModal();
    }
  }

  // HACK: this is not a great solution, but if there are multiple dialog id instances, propogate delete
  closeDialogBox(propogate = false) {
    if (propogate === false) {
      this.#currDialog.close();
    } else {
      const allDialogEls = Array.from(document.querySelectorAll("#dialog"));

      while (allDialogEls.length > 0) {
        allDialogEls[allDialogEls.length - 1].close();
        allDialogEls.pop();
      }
    }
  }

  getDialogBoxPreviewForm(
    headerText = "N/A",
    exitHook = undefined,
    deleteFunc = undefined,
  ) {
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
          Loader.newEl("button", {
            classList: "dialog__delete-item-button",
            children: [
              Loader.newEl("svg", {
                classList: "dialog__delete-item-button-icon",
                isNS: true,
                attrsList: { viewBox: "0 0 24 24" },
                children: [
                  Loader.newEl("path", {
                    isNS: true,
                    attrsList: {
                      d: "M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z",
                    },
                  }),
                ],
              }),
            ],
          }),
          Loader.newEl("hgroup", {
            classList: [
              "dialog__header",
              "header",
              "header--vertical",
              "--context-sm",
            ],
            children: [
              Loader.newEl("label", {
                classList: "header__switch-container",
                children: [
                  Loader.newEl("input", { attrsList: { type: "checkbox" } }),
                  Loader.newEl("span", { classList: "header__slider" }),
                ],
              }),
              Loader.newEl("h1", {
                classList: [
                  "header__title",
                  "_text",
                  "_text--header-font",
                  "--context-md",
                ],
                text: headerText,
              }),
            ],
          }),
          Loader.newEl("hr", { classList: "form__hr" }),
          Loader.newEl("section", {
            classList: "dialog__main-section",
          }),
        ],
      }),
    ).pop();

    const dialogExitButton = dialogContainer.querySelector(
      ".dialog__exit-button",
    );
    const dialogDeleteItemButton = dialogContainer.querySelector(
      ".dialog__delete-item-button",
    );

    // close dialog normally w/exit button
    dialogExitButton.addEventListener("click", () => {
      LogController.log("close invoked");
      dialogContainer.close();
    });

    if (exitHook !== undefined) {
      dialogContainer.addEventListener("close", exitHook);
    }

    // add functionality for deleteFunc
    if (deleteFunc !== undefined) {
      dialogDeleteItemButton.addEventListener("click", deleteFunc);
    }

    // ensure element is removed from DOM
    dialogContainer.addEventListener("close", () => {
      setTimeout(() => {
        dialogContainer.remove();
      }, 400);
    });

    // update new 'open dialog' reference
    this.#currDialog = dialogContainer;

    const dialogContainerSection = dialogContainer.querySelector(
      ".dialog__main-section",
    );

    const dialogCheckbox = dialogContainer.querySelector(
      ".header__switch-container input",
    );

    return [dialogContainerSection, dialogCheckbox];
  }

  getDialogBoxAddForm(headerText = "N/A", subHeaderText = undefined) {
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
                children: (() => {
                  if (subHeaderText === undefined) {
                    return [
                      Loader.newTextNode("Fill all required ("),
                      Loader.newEl("span", { text: " * " }),
                      Loader.newTextNode(") fields."),
                    ];
                  } else {
                    return [Loader.newTextNode(subHeaderText)];
                  }
                })(),
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
      LogController.log("close invoked");
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
      LogController.log("attempt submit");
    });

    return dialogContainerForm;
  }
}

const UIControl = new UIController();

export default UIControl;

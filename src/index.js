import * as _ from "./style-exporter.js";
import UIController, * as UI from "./controllers/UIController.js";

class TodoList {
  constructor() {
    const themeToggleButton = document.querySelector(".theme-button");
    const sidebarToggleButton = document.querySelector(".sidebar-button");
    const todoListAddButton = document.querySelector(".header__add-todo");

    const bindTogglerWithClass = (togglerClass) => {
      const newToggler = new togglerClass();
      return newToggler.action.bind(newToggler);
    };

    const elementHandlerPairs = [
      [themeToggleButton, bindTogglerWithClass(UI.themeToggler)],
      [sidebarToggleButton, bindTogglerWithClass(UI.sidebarToggler)],
      [todoListAddButton, bindTogglerWithClass(UI.addTodoItem)],
    ];

    for (const [element, handler] of elementHandlerPairs) {
      element.addEventListener("click", () => {
        UIController.invoke(handler);
      });
    }
  }

  setSavedData() {}
}

function main() {
  const todoList = new TodoList();
  todoList.setSavedData();

  const tempDialog = document.querySelector("#dialog");
}

main();

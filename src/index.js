import * as _ from "./style-exporter.js";
import UIController, * as UI from "./controllers/UIController.js";

class TodoList {
  constructor() {
    const themeToggleButton = document.querySelector(".theme-button");
    const sidebarToggleButton = document.querySelector(".sidebar-button");

    const bindTogglerWithClass = (togglerClass) => {
      const newToggler = new togglerClass();
      return newToggler.toggle.bind(newToggler);
    };

    const elementHandlerPairs = [
      [themeToggleButton, bindTogglerWithClass(UI.themeToggler)],
      [sidebarToggleButton, bindTogglerWithClass(UI.sidebarToggler)],
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
}

main();

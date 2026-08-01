import * as _ from "./style-exporter.js";
import UIController, * as UI from "./controllers/UIController.js";

class TodoList {
  constructor() {
    const themeToggleButton = document.querySelector(".theme-button");
    const sidebarToggleButton = document.querySelector(".sidebar-button");

    const elementHandlerPairs = [
      [
        themeToggleButton,
        (() => {
          const newThemeToggler = new UI.themeToggler();
          return newThemeToggler.toggle.bind(newThemeToggler);
        })(),
      ],
    ];

    for (const [element, handler] of elementHandlerPairs) {
      element.addEventListener("click", () => {
        UIController.toggle(handler);
      });
    }
  }
}

function main() {
  const todoList = new TodoList();
}

main();

import * as _ from "./style-exporter.js";
import UIController, * as UI from "./controllers/UIController.js";
import ProjectController from "./controllers/ProjectController.js";

class TodoList {
  constructor() {
    const themeToggleButton = document.querySelector(".theme-button");
    const sidebarToggleButton = document.querySelector(".sidebar-button");
    const todoListAddButton = document.querySelector(".header__add-todo");
    const projectAddButton = document.querySelector(".projects__add-button");

    const bindTogglerWithClass = (togglerClass) => {
      const newToggler = new togglerClass();
      return newToggler.action.bind(newToggler);
    };

    const elementHandlerPairs = [
      [themeToggleButton, bindTogglerWithClass(UI.toggleTheme)],
      [sidebarToggleButton, bindTogglerWithClass(UI.toggleSidebar)],
      [todoListAddButton, bindTogglerWithClass(UI.addTodoList)],
      [projectAddButton, bindTogglerWithClass(UI.addProject)],
    ];

    for (const [element, handler] of elementHandlerPairs) {
      element.addEventListener("click", () => {
        UIController.invoke(handler);
      });
    }
  }
}

function main() {
  const todoList = new TodoList();

  const fuckProject = ProjectController.tryCreateProject("fuck", "red").res;
  const houseCleaningProject = ProjectController.tryCreateProject(
    "House Cleaning",
    "blue",
  ).res;
  const marriageStuff = ProjectController.tryCreateProject(
    "mariageStuff",
    "lavender",
  ).res;

  fuckProject.tryCreateTodoList("nothing").res;
  const fuckProjectSomething = fuckProject.tryCreateTodoList("something").res;

  (fuckProjectSomething.tryCreateListItem(
    "yes",
    "11/24/2033",
    "hello! im trying my hardest here PLEASE HELP ME AHSDLFKJSDALFSLDAKFJLSAEJFLOSEIj",
    "low",
  ),
    fuckProjectSomething.tryCreateListItem(
      "no",
      "11/24/2032",
      "hello! im trying my hardest here PLEASE HELP ME AHSDLFKJSDALFSLDAKFJLSAEJFLOSEIj",
      "high",
    ),
    fuckProjectSomething.tryCreateListItem(
      "okay?",
      "11/24/2037",
      "hello! im trying my hardest here PLEASE HELP ME AHSDLFKJSDALFSLDAKFJLSAEJFLOSEIj",
      "medium",
    ),
    fuckProjectSomething.tryCreateListItem(
      "sure",
      "11/24/2027",
      "hello! im trying my hardest here PLEASE HELP ME AHSDLFKJSDALFSLDAKFJLSAEJFLOSEIj",
      "high",
    ),
    fuckProjectSomething.tryCreateListItem(
      "maybe",
      "11/24/2030",
      "hello! im trying my hardest here PLEASE HELP ME AHSDLFKJSDALFSLDAKFJLSAEJFLOSEIj",
      "low",
    ),
    fuckProjectSomething.tryCreateListItem(
      "dskjfds",
      "11/24/2030",
      "hello! im trying my hardest here PLEASE HELP ME AHSDLFKJSDALFSLDAKFJLSAEJFLOSEIj",
      "medium",
    ),
    fuckProjectSomething.tryCreateListItem(
      "sdjfsedf",
      "11/24/2035",
      "hello! im trying my hardest here PLEASE HELP ME AHSDLFKJSDALFSLDAKFJLSAEJFLOSEIj",
      "medium",
    ),
    fuckProjectSomething.tryCreateListItem(
      "a",
      "11/24/2032",
      "hello! im trying my hardest here PLEASE HELP ME AHSDLFKJSDALFSLDAKFJLSAEJFLOSEIj",
      "high",
    ),
    fuckProjectSomething.tryCreateListItem(
      "ddd",
      "11/24/2032",
      "hello! im trying my hardest here PLEASE HELP ME AHSDLFKJSDALFSLDAKFJLSAEJFLOSEIj",
      "high",
    ),
    fuckProjectSomething.tryCreateListItem(
      "b",
      "11/24/2032",
      "hello! im trying my hardest here PLEASE HELP ME AHSDLFKJSDALFSLDAKFJLSAEJFLOSEIj",
      "high",
    ),
    fuckProjectSomething.tryCreateListItem(
      "c",
      "11/24/2032",
      "hello! im trying my hardest here PLEASE HELP ME AHSDLFKJSDALFSLDAKFJLSAEJFLOSEIj",
      "high",
    ),
    UIController.reloadPage());
}

main();

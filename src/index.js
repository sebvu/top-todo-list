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
      [todoListAddButton, bindTogglerWithClass(UI.addTodoItem)],
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

  const fuckProject = ProjectController.createProject("fuck");
  const houseCleaningProject =
    ProjectController.createProject("House Cleaning");

  fuckProject
    .createTodoList("fucking list")
    .createListItem(
      "my girlfriend",
      "03/7/2026",
      "she's my girlfriend?? idk what to say",
      "low",
      ["capture her", "FUCK!"],
    );
  houseCleaningProject
    .createTodoList("Who to Invite")
    .createListItem(
      "Cristal",
      "07/804423/2456",
      "girlfriend, once again. like, she gotta HELP ME!",
      "medium",
    );
  houseCleaningProject
    .createTodoList("Buy List")
    .createListItem(
      "fabuloso",
      "A DATE",
      "i need fabuloso to go clean ugh",
      "low",
      ["fabuloso", "stuff"],
    );

  // console.log(fuckProject);
  // console.log(houseCleaningProject);
  //
  // const structure = ProjectController.getStructureJSON();
  // console.log(structure);
}

main();

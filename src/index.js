import * as _ from "./style-exporter.js";
import UIController from "./controllers/UIController.js";
import ProjectController from "./controllers/ProjectController.js";

function main() {
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
      "yes",
      "11/24/2033",
      "hello! im trying my hardest here PLEASE HELP ME AHSDLFKJSDALFSLDAKFJLSAEJFLOSEIj",
      "high",
    ),
    UIController.reloadPage());
}

main();

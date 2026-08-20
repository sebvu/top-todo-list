import * as _ from "./style-exporter.js";
import UIController from "./controllers/UIController.js";
import ProjectController from "./controllers/ProjectController.js";

function main() {
  // const fuckProject = ProjectController.tryCreateProject("fuck", "red").res;
  // const houseCleaningProject = ProjectController.tryCreateProject(
  //   "House Cleaning",
  //   "blue",
  // ).res;
  // const marriageStuff = ProjectController.tryCreateProject(
  //   "mariageStuff",
  //   "lavender",
  // ).res;
  //
  // fuckProject.tryCreateTodoList("nothing").res;
  // const fuckProjectSomething = fuckProject.tryCreateTodoList("something").res;
  //
  // (fuckProjectSomething.tryCreateListItem(
  //   "yes",
  //   "11/24/2033",
  //   "hello! im trying my hardest here PLEASE HELP ME AHSDLFKJSDALFSLDAKFJLSAEJFLOSEIj",
  //   "low",
  // ),
  //   fuckProjectSomething.tryCreateListItem(
  //     "yes",
  //     "11/24/2033",
  //     "hello! im trying my hardest here PLEASE HELP ME AHSDLFKJSDALFSLDAKFJLSAEJFLOSEIj",
  //     "high",
  //   ),
  // UIController.reloadPage());

  const helloProject = ProjectController.tryCreateProject(
    "Todo List Project",
    "pink",
  ).res;

  const priorityLevelTodoList =
    helloProject.tryCreateTodoList("Priority Levels").res;

  priorityLevelTodoList.tryCreateListItem(
    "Sorting showoff stuff",
    "12/08/2030",
    "This is sorted lower due to the date",
    "high",
    true,
  );

  priorityLevelTodoList.tryCreateListItem(
    "A task due soon",
    "12/02/2029",
    "This is sorted the highest due to being due soon.",
    "high",
  );

  priorityLevelTodoList.tryCreateListItem(
    "Make 'High' Category",
    "12/05/2030",
    "This is an example of a 'high priority' list item!",
    "high",
  );

  priorityLevelTodoList.tryCreateListItem(
    "Make 'Medium' Category",
    "12/05/2030",
    "This is an example of a 'medium priority' list item!",
    "medium",
  );

  priorityLevelTodoList.tryCreateListItem(
    "Make 'Low' Category",
    "12/05/2030",
    "This is an example of a 'medium priority' list item!",
    "low",
  );

  priorityLevelTodoList.tryCreateListItem(
    "not due anytime soon",
    "12/05/2182",
    "This task is.. long term for sure..",
    "high",
  );

  const docsTodoList = helloProject.tryCreateTodoList("Docs").res;

  docsTodoList.tryCreateListItem(
    "README",
    "12/05/9999",
    "This project is long overdue, I thoroughly enjoyed every aspect of it! Switch the themes, create your own projects, add todo list, list items, etc.. Delete everything! BREAK IT! This project is definitely breakable. Enjoy!",
    "high",
    true,
  );

  UIController.reloadPage();
}

main();

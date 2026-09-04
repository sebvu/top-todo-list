import * as _ from "./style-exporter.js";
import StorageController from "./controllers/StorageController.js";
import ProjectController from "./controllers/ProjectController.js";
import UIControl from "./controllers/UIController.js";

function restoreData() {
  StorageController.doPermanentVisitTrigger();
  ProjectController.setProjectArrayWithJSON(
    StorageController.getCurrentDataJson(),
  );
  document.documentElement.setAttribute("data-theme", StorageController.theme);
}

function main() {
  // NOTE: will be ran ONCE upon first visit, never again.
  restoreData();

  UIControl.reloadPage();
}

main();

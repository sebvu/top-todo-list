import * as _ from "./style-exporter.js";
import UIController from "./controllers/UIController.js";
import StorageController from "./controllers/StorageController.js";

function main() {
  StorageController.doPermanentVisitTrigger();

  UIController.reloadPage();
}

main();

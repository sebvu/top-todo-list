import LogController from "./LogController.js";
import ProjectController from "./ProjectController.js";

export default new (class StorageController {
  constructor() {}

  #THEME_NAME = "theme";
  #DATA_NAME = "saved_data";

  set theme(theme) {
    if (theme !== "dark" || theme !== "light") {
      LogController.errLog(
        this,
        `Attempted setting theme to a non-existant theme: "${theme}" when expecting (light|dark)(case-sensitive). Defaulting to light.`,
      );
      theme = "light";
    }
    localStorage.setItem(this.#THEME_NAME, newTheme);
  }

  get theme() {
    const currSavedTheme = localStorage.getItem(this.#THEME_NAME);

    return currSavedTheme;
  }

  saveCurrentData() {
    localStorage.setItem(
      this.#DATA_NAME,
      JSON.stringify(ProjectController.getStructureJSON()),
    );
  }

  getCurrentData() {
    return JSON.parse(localStorage.getItem(this.#DATA_NAME));
  }
})();

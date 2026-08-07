import LogController from "./LogController.js";

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

  getSavedData() {
    return [
      {
        projectName: "House Cleaning",
        id: "wowowow",
        todoLists: [
          {
            name: "general stuff to do",
            listItems: [
              {
                name: "People to Invite",
                dueDate: "2026-08-07",
                description:
                  "These people owe me. They OWE ME! I'VE HELPED THEM, THEY NEED TO HELP ME! HELP ME!!",
                priorityLevel: "high",
                checkList: [
                  "Cristal",
                  "Jester (me!?)",
                  "Maya",
                  "Latte",
                  "Darelle",
                  "Vanessa",
                ],
              },
              {
                name: "Stuff to clean",
                dueDate: "2026-08-10",
                description:
                  "I hate doing this stuff.. Ugh. Lower priority cause I hate doing stuff",
                priorityLevel: "medium",
                checkList: [
                  "floors",
                  "walls",
                  "bed",
                  "the entire neighborhood (wtf)",
                ],
              },
              {
                name: "food",
                dueDate: "2026-08-07",
                description: "Need to get snacks.. ig :(",
                priorityLevel: "medium",
                checkList: ["cheetos"],
              },
              {
                name: "cry",
                dueDate: "2026-08-07",
                description: "wanna cry",
                priorityLevel: "low",
                checkList: [],
              },
            ],
          },
        ],
      },
      {
        projectName: "the odin project",
        id: "sdlfjksdjlk",
        todoLists: [
          {
            name: "todo list",
            listItems: [
              {
                name: "backend",
                dueDate: "2027-08-07",
                description: "work on the damn backend",
                priorityLevel: "high",
                checkList: ["backend stuff #1", "backend stuff #2"],
              },
            ],
          },
        ],
      },
    ];
  }

  addProject() {}
})();

import LogController from "./LogController.js";
import ProjectController from "./ProjectController.js";

export default new (class StorageController {
  constructor() {}

  #THEME_NAME = "theme";
  #DATA_NAME = "saved_data";
  #FIRST_VISIT = "first_visit";

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

  #setDummyData() {
    const programmingProjects = ProjectController.tryCreateProject(
      "Programming Projects",
      "#04a5e5",
    ).res;

    const todoListProj =
      programmingProjects.tryCreateTodoList("Todo List Project").res;

    const myDignity = programmingProjects.tryCreateTodoList("My Dignity").res;

    const ASLPractice =
      programmingProjects.tryCreateTodoList("ASL Practice Proj").res;

    const todoListItemArray = [
      [
        "Setup General Project",
        "07/28/2028",
        "Project needs to be setup with webpack, etc etc..",
        "high",
        true,
      ],
      [
        "Build Sidebar",
        "08/01/2028",
        "Sidebar needs to be collapsable, element must be animated and everything just clean overall. ",
        "high",
        true,
      ],
      [
        "Build Header",
        "09/16/2028",
        "Functional buttons will only appear if a project is selected, otherwise, it should be removed via CSS whenever no project is selected. This group also should include a toggle for the sidebar, as well as a theme switcher icon.",
        "high",
        true,
      ],
      [
        "Main Content",
        "10/18/2028",
        "Will dynamically display ALL data via a json object saved on StorageController.",
        "high",
        true,
      ],
      [
        "Make Mobile Compatible",
        "11/18/2028",
        "Mobile compatability with devices",
        "medium",
      ],
      [
        "Catppuccin Colored",
        "11/18/2028",
        "Catppuccin colors are always amazing, best theme.",
        "medium",
        true,
      ],
      [
        "Find background images",
        "11/18/2028",
        "Thanks to Johannes Plenio, we did find background images. The link is: https://unsplash.com/@jplenio",
        "medium",
        true,
      ],
      [
        "Add Emoji Selector",
        "12/18/2028",
        "Add emoji selectors for projects, this is never gonna be checked. Fuck no. Too much effort for a tiny side project.",
        "low",
      ],
      ["get my 2 months wasted back", "12/18/2028", "never happening", "high"],
    ];

    const calculatorProjItemArray = [
      [
        "Is this feasible?",
        "12/02/2032",
        "I need to calculate the numbers, do the research, create the software requirement specifications to ensure I can DO THIS WITH 100% certainty",
        "high",
        true,
      ],
      [
        "Make it.",
        "12/02/2032",
        "it will never happen anyways. i'm not gonna make it.",
        "low",
      ],
    ];

    const ASLPracticeItemArray = [
      [
        "Determine SDLC",
        "02/16/2030",
        "Need to determine the correct SDLC approach for this project based on the SRS (Software Requirement Document) and the DDS (Design Document Specification)",
        "high",
        true,
      ],
      [
        "Determine whether to use images or 3d models",
        "03/29/2030",
        "This is a tossup, 3d models and images both have pros and cons respectively. For one, static images are 'human', meaning that you can easily take pics of real human hands instead of 3d modeling the hands. However, like its saying, it is static images. 3d models I could allow for animation, and even tilting the hand itself. However, it isn't the most 'natural' approach..",
        "medium",
      ],
      [
        "Theme it to make pretty, or some jazzy thingy..",
        "03/29/2030",
        "Who doesn't like good themes? Find a good theme for this website!",
        "medium",
      ],
      [
        "fix the typo on the front page",
        "03/29/2030",
        "why is it 'fngerspell' instead of 'fingerspell', whatever man",
        "low",
        true,
      ],
    ];

    for (const item of todoListItemArray) {
      todoListProj.tryCreateListItem(...item);
    }

    for (const item of calculatorProjItemArray) {
      myDignity.tryCreateListItem(...item);
    }

    for (const item of ASLPracticeItemArray) {
      ASLPractice.tryCreateListItem(...item);
    }

    // seperator //

    const marriagePlanning = ProjectController.tryCreateProject(
      "Marriage Planning ♥️ ",
      "#e64553",
    ).res;

    const whoMarry = marriagePlanning.tryCreateTodoList("Who :))").res;

    const generalMarriageTodos = marriagePlanning.tryCreateTodoList(
      "General Wedding Todos",
    ).res;

    const InviteList = marriagePlanning.tryCreateTodoList("Invite List").res;

    const generalMarriageTodosItemArray = [
      [
        "big fucking cake",
        "03/10/2034",
        "there BETTER BE A CAKE?? cannot be tres leche, she doesn't like that. even though i love it, grr. maybe oreo? oreo is awesome, i'm thinking... fuck i need suggestions, i don't know. but CAKE IS A MUST",
        "high",
      ],
      [
        "mediterranean or italian food or sum",
        "03/10/2034",
        "idk if i'm spelling it right but there better be BOMB pasta",
        "high",
      ],
      [
        "'Thanks for coming!' cards",
        "03/12/2034",
        "lame, just labor. i mean, i appreciate everyone coming. but fuck, i hate labor. yay i guess",
        "medium",
      ],
      [
        "music selection",
        "03/12/2034",
        "literally the easiest thing imo, just pop my liked songs please",
        "low",
      ],
    ];

    const InviteListItemArr = [
      [
        "my entire family",
        "05/10/2034",
        "it's my family, what do you expect?",
        "high",
        true,
      ],
      [
        "duracell venezuelan girl",
        "05/10/2034",
        "she's a great friend and i appreciate her a lot",
        "high",
        true,
      ],
      [
        "vanny vones",
        "05/10/2034",
        "also a great friend and i appreciate her a lot",
        "high",
        true,
      ],
      [
        "casper the fucking ghost",
        "04/08/2034",
        "it's casper, not really that important. but he's badass. gotta visit his grave",
        "low",
      ],
      ["larry", "04/09/2034", "fuck larry. but he's involved.", "low"],
    ];

    const whoMarryItemArray = [
      [
        "cristal 🫪",
        "10/08/2033",
        "who else but the only common denominator in all my TOP projects :)",
        "high",
        true,
      ],
    ];

    for (const item of generalMarriageTodosItemArray) {
      generalMarriageTodos.tryCreateListItem(...item);
    }

    for (const item of InviteListItemArr) {
      InviteList.tryCreateListItem(...item);
    }

    for (const item of whoMarryItemArray) {
      whoMarry.tryCreateListItem(...item);
    }
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

  doPermanentVisitTrigger() {
    const hasVisited = localStorage.getItem(this.#FIRST_VISIT);

    console.log(hasVisited);

    if (
      hasVisited === undefined ||
      hasVisited === null ||
      hasVisited === false
    ) {
      LogController.log(
        this,
        "permanent visit trigger is now true, welcome to my website :)",
      );

      this.#setDummyData();

      // localStorage.setItem(this.#FIRST_VISIT, true);
    } else {
      LogController.log(this, "skipping permanent visit trigger");
    }
  }
})();

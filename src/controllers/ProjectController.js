import LogController from "./LogController.js";

// [...{input (element), verifier, errMsg}] an array of pairs
// returns [{input (element), errMsg}] (only error ones)
const verifyInput = (verifyPairs) => {
  const falsePairResults = [];

  for (const pair of verifyPairs) {
    if (pair.verifier(resolveString(pair.input)) === true) {
      falsePairResults.push({ input: pair.input, errMsg: pair.errMsg });
    }
  }

  // status checker for checking if errors exists
  const anyErrorsExists = falsePairResults.length !== 0;
  return { errorExists: anyErrorsExists, res: falsePairResults };
};

// elements could either be submitted via dialog or through command line,
// this is just a resolver so it's always a FUCKING STRING
const resolveString = (element) => {
  return typeof element === "string" || typeof element === "boolean"
    ? element
    : element.value;
};

class ProjectController {
  #projectArray = [];
  #currentProject = undefined;

  #hasProjectCopy(projectName) {
    return this.#projectArray.some(
      (el) => el.name.toLowerCase() === projectName.toLowerCase(),
    );
  }

  getProjectEventHandler(projectName) {
    const currentProjectSelected = this.#projectArray.find(
      (proj) => proj.name === projectName,
    );

    if (currentProjectSelected === undefined) {
      LogController.errLog(
        this,
        `finding ${projectName} in project Array is undefined when attempting addEventListener. This should not happen.`,
      );
    }

    return function _() {
      this.#currentProject = currentProjectSelected;
    }.bind(this);
  }

  getCurrentProject() {
    return this.#currentProject;
  }

  getTodoListObj(projectName, todoListName) {
    try {
      if (projectName === undefined) {
        throw new Error(
          `project name is undefined when attempting to get todo list ${todoListName}`,
        );
      }

      const currentProjectObj = this.#projectArray.find(
        (projObj) => projObj.name === projectName,
      );

      if (currentProjectObj === undefined) {
        throw new Error(
          `searching for ${projectName} did not yield a project object.`,
        );
      }

      const todoListObj = currentProjectObj.getTodoListByName(todoListName);

      if (todoListObj === undefined) {
        throw new Error(
          `searching for ${todoListName} todo list in ${projectName} project object yielded no results`,
        );
      }

      return todoListObj;
    } catch (e) {
      LogController.errLog(this, e);
    }
  }

  getStructureJSON() {
    let projectJSON = [];

    for (const proj of this.#projectArray) {
      projectJSON.push({
        projectName: proj.name,
        projectColor: proj.color,
        todoLists: (() => {
          const todoListObjects = [];
          for (const todoList of proj.todoListArray) {
            const todoListObject = {
              name: todoList.name,
              listItems: (() => {
                const listItemObjects = [];
                for (const listItem of todoList.listItemArray) {
                  const listItemObject = {
                    name: listItem.name,
                    dueDate: listItem.dueDate,
                    description: listItem.description,
                    priorityLevel: listItem.priorityLevel,
                  };
                  listItemObjects.push(listItemObject);
                }
                return listItemObjects;
              })(),
            };
            todoListObjects.push(todoListObject);
          }
          return todoListObjects;
        })(),
      });
    }

    return projectJSON;
  }

  #createProject(name, color) {
    const newProject = new Project(name, color);
    this.#projectArray.push(newProject);
    return newProject;
  }

  tryCreateProject(name, color) {
    const verifyPairs = [
      {
        input: name,
        verifier: this.#hasProjectCopy.bind(this),
        // always guarantee a string is sent (this fucking sucks)
        errMsg: `"${resolveString(name)}" project name already taken.`,
      },
    ];

    const verifyInputResult = verifyInput(verifyPairs);

    if (verifyInputResult.errorExists === true) {
      return verifyInputResult;
    } else {
      verifyInputResult.res = this.#createProject(
        resolveString(name),
        resolveString(color),
      );
      return verifyInputResult;
    }
  }

  getProjectByName(projectName) {
    return this.#projectArray.find(
      (el) => el.name.toLowerCase() === projectName.toLowerCase(),
    );
  }
}

export default new ProjectController();

class Project {
  constructor(name, color) {
    this.#name = name;
    this.#color = color;
  }
  #name;
  #color;
  #todoListArray = [];

  #hasTodoListCopy(todoListName) {
    return this.#todoListArray.some(
      (el) => el.name.toLowerCase() === todoListName.toLowerCase(),
    );
  }

  #createTodoList(name) {
    const newTodoList = new TodoList(name);
    this.#todoListArray.push(newTodoList);
    return newTodoList;
  }

  get todoListArray() {
    return this.#todoListArray;
  }

  tryCreateTodoList(name) {
    const verifyPairs = [
      {
        input: name,
        verifier: this.#hasTodoListCopy.bind(this),
        errMsg: `"${resolveString(name)}" project name already taken.`,
      },
    ];

    const verifyInputResult = verifyInput(verifyPairs);

    if (verifyInputResult.errorExists === true) {
      return verifyInputResult;
    } else {
      verifyInputResult.res = this.#createTodoList(resolveString(name));
      return verifyInputResult;
    }
    // need to change implementation for UI control as well
  }

  getTodoListByName(todoListName) {
    return this.#todoListArray.find(
      (el) => el.name.toLowerCase() === todoListName.toLowerCase(),
    );
  }

  get name() {
    return this.#name;
  }

  set name(newName) {
    const oldName = this.#name;

    this.#name = newName;

    LogController(this, `${oldName} project renamed to ${this.#name}`);
  }

  get color() {
    return this.#color;
  }

  set color(newColor) {
    const oldColor = this.#color;

    this.#color = newColor;

    LogController(this, `${oldColor} project color changed to ${this.#color}`);
  }
}

class TodoList {
  constructor(name) {
    this.#name = name;
  }
  #name;
  #listItemArray = [];

  #hasListItemCopy(listItemName) {
    return this.#listItemArray.some(
      (el) => el.name.toLowerCase() === listItemName.toLowerCase(),
    );
  }

  #isValidDueDate(dueDate) {
    const currDateObj = new Date();
    const dueDateObj = new Date(dueDate);

    return currDateObj > dueDateObj;
  }

  #isValidPriorityLevel(priorityLevel) {
    const lowerCasePriorityLevel = priorityLevel.toLowerCase();

    return (
      lowerCasePriorityLevel !== "low" &&
      lowerCasePriorityLevel !== "medium" &&
      lowerCasePriorityLevel !== "high"
    );
  }

  #createListItem(name, dueDate, description, priorityLevel, isChecked) {
    const newListItem = new ListItem(
      name,
      dueDate,
      description,
      priorityLevel,
      isChecked,
    );
    this.#listItemArray.push(newListItem);

    // sort decreasing by priority level, due date then name

    this.#listItemArray.sort((a, b) => {
      if (a.priorityLevel === b.priorityLevel) return 0;
      if (a.priorityLevel === "low") return 1;
      if (a.priorityLevel === "medium")
        return b.priorityLevel === "high" ? 1 : -1;
      if (a.priorityLevel === "high") return -1;
    });

    this.#listItemArray.sort((a, b) => {
      if (a.priorityLevel !== b.priorityLevel) return 0;

      const aDate = new Date(a.dueDate);
      const bDate = new Date(b.dueDate);

      return aDate > bDate ? 1 : -1;
    });

    return newListItem;
  }

  get listItemArray() {
    return this.#listItemArray;
  }

  tryCreateListItem(
    name,
    dueDate,
    description,
    priorityLevel,
    isChecked = false,
  ) {
    const verifyPairs = [
      {
        input: name,
        verifier: this.#hasListItemCopy.bind(this),
        errMsg: `"${resolveString(name)}" list item name already taken.`,
      },
      {
        input: dueDate,
        verifier: this.#isValidDueDate.bind(this),
        errMsg: `"${resolveString(dueDate)}" due date cannot be before current date.`,
      },
      {
        input: priorityLevel,
        verifier: this.#isValidPriorityLevel.bind(this),
        errMsg: `"${resolveString(priorityLevel)}" does not match a valid priority level value.`,
      },
    ];

    const verifyInputResult = verifyInput(verifyPairs);

    if (verifyInputResult.errorExists === true) {
      return verifyInputResult;
    } else {
      verifyInputResult.res = this.#createListItem(
        resolveString(name),
        resolveString(dueDate),
        resolveString(description),
        resolveString(priorityLevel),
        resolveString(isChecked),
      );
      return verifyInputResult;
    }
  }

  getListItemByName(listItemName) {
    return this.#listItemArray.find(
      (el) => el.name.toLowerCase() === listItemName.toLowerCase(),
    );
  }

  get name() {
    return this.#name;
  }

  set name(newName) {
    const oldName = this.#name;

    this.#name = newName;

    LogController(this, `${oldName} TodoList renamed to ${this.#name}`);
  }
}

class ListItem {
  constructor(name, dueDate, description, priorityLevel, isChecked = false) {
    this.#name = name;
    this.#dueDate = dueDate;
    this.#description = description;
    this.#priorityLevel = priorityLevel;
    this.#isChecked = isChecked;
  }

  #name;
  #dueDate;
  #description;
  #priorityLevel;
  #isChecked;

  get name() {
    return this.#name;
  }

  set name(newName) {
    const oldName = this.#name;

    this.#name = newName;

    LogController(this, `${oldName} ListItem renamed to ${this.#name}`);
  }

  get dueDate() {
    return this.#dueDate;
  }

  set dueDate(newDueDate) {
    const oldDueDate = this.#dueDate;

    this.#name = newDueDate;

    LogController(
      this,
      `${oldDueDate} ListItem due date changed to ${this.#dueDate}`,
    );
  }

  get description() {
    return this.#description;
  }

  set description(newDescription) {
    const oldDescription = this.#description;

    this.#description = newDescription;

    LogController(
      this,
      `${oldDescription} ListItem description changed to ${this.#description}`,
    );
  }

  get priorityLevel() {
    return this.#priorityLevel;
  }

  set priorityLevel(newPriorityLevel) {
    const oldPriorityLevel = this.#priorityLevel;

    this.#priorityLevel = newPriorityLevel;

    LogController(
      this,
      `${oldPriorityLevel} ListItem priority level changed to ${this.#description}`,
    );
  }

  get isChecked() {
    return this.#isChecked;
  }

  toggleChecked() {
    this.#isChecked = this.#isChecked === true ? false : true;
  }
}

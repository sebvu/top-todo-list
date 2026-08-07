import LogController from "./LogController.js";

class ProjectController {
  #projectArray = [];

  #hasProjectCopy(projectName) {
    return this.#projectArray.some(
      (el) => el.name.toLowerCase() === projectName.toLowerCase(),
    );
  }

  getStructureJSON() {
    let projectObjects = [];

    for (const proj of this.#projectArray) {
      projectObjects.push({
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
                    checkList: listItem.checkList,
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

    return projectObjects;
  }

  createProject(name) {
    if (this.#hasProjectCopy(name)) {
      return undefined;
    } else {
      const newProject = new Project(name);
      this.#projectArray.push(newProject);
      return newProject;
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
  constructor(name) {
    this.#name = name;
  }
  #name;
  #color;
  #todoListArray = [];

  #hasTodoListCopy(todoListName) {
    return this.#todoListArray.some(
      (el) => el.name.toLowerCase() === todoListName.toLowerCase(),
    );
  }

  get todoListArray() {
    return this.#todoListArray;
  }

  createTodoList(name) {
    if (this.#hasTodoListCopy(name)) {
      return undefined;
    } else {
      const newTodoList = new TodoList(name);
      this.#todoListArray.push(newTodoList);
      return newTodoList;
    }
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

  get listItemArray() {
    return this.#listItemArray;
  }

  createListItem(name, dueDate, description, priorityLevel, checkList = []) {
    if (this.#hasListItemCopy(name)) {
      return undefined;
    } else {
      const newListItem = new ListItem(
        name,
        dueDate,
        description,
        priorityLevel,
        checkList,
      );
      this.#listItemArray.push(newListItem);
      return newListItem;
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
  constructor(name, dueDate, description, priorityLevel, checkList = []) {
    this.#name = name;
    this.#dueDate = dueDate;
    this.#description = description;
    this.#priorityLevel = this.#ensureValidPriorityLevel(priorityLevel);
    this.#checkList = checkList;
  }

  #name;
  #dueDate;
  #description;
  #priorityLevel;
  #checkList;

  #ensureValidPriorityLevel(priorityLevel) {
    const lowerCasePriorityLevel = priorityLevel.toLowerCase();

    if (
      lowerCasePriorityLevel !== "low" &&
      lowerCasePriorityLevel !== "medium" &&
      lowerCasePriorityLevel !== "high"
    ) {
      LogController.errLog(
        this,
        `priorityLevel "${lowerCasePriorityLevel}" does not match a valid priorityLevel. Defaulting to "low".`,
      );
      return "low";
    } else {
      return lowerCasePriorityLevel;
    }
  }

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

    this.#priorityLevel = this.#ensureValidPriorityLevel(newPriorityLevel);

    LogController(
      this,
      `${oldPriorityLevel} ListItem priority level changed to ${this.#description}`,
    );
  }

  get checklist() {
    return this.#checkList;
  }

  addToCheckList(checkListItem) {
    this.#checkList.push(checkListItem);

    LogController(this, `${checkListItem} added to ListItem ${this.#name}`);
  }
}

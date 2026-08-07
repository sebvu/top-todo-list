import LogController from "./LogController.js";

class ProjectController {
  #projectArray = [];

  #hasProjectCopy(projectName) {
    return this.#projectArray.some(
      (el) => el.toLowerCase() === projectName.toLowerCase(),
    );
  }

  createProject(name) {
    if (this.#hasProjectCopy(name)) {
      return false;
    } else {
      const newProject = new Project(name);
      this.#projectArray.push(newProject);
      return true;
    }
  }
}

export default ProjectController();

class Project {
  constructor(name) {
    this.#name = name;
  }
  #name;
  #todoListArray = [];

  #hasTodoListCopy(todoListName) {
    return this.#todoListArray.some(
      (el) => el.toLowerCase() === todoListName.toLowerCase(),
    );
  }

  createTodoList(name) {
    if (this.#hasTodoListCopy(name)) {
      return false;
    } else {
      const newTodoList = new TodoList(name);
      this.#todoListArray.push(newTodoList);
      return true;
    }
  }

  get name() {
    return this.#name;
  }

  set name(newName) {
    const oldName = this.#name;

    this.#name = newName;

    LogController(this, `${oldName} project renamed to ${this.#name}`);
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
      (el) => el.toLowerCase() === listItemName.toLowerCase(),
    );
  }

  createListItem(name, dueDate, description, priorityLevel, checkList) {
    if (this.#hasListItemCopy(name)) {
      return false;
    } else {
      const newListItem = new ListItem(
        this,
        name,
        dueDate,
        description,
        priorityLevel,
        checkList,
      );
      this.#listItemArray.push(newListItem);
      return true;
    }
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
    if (
      priorityLevel !== "low" ||
      priorityLevel !== "medium" ||
      priorityLevel !== "high"
    ) {
      LogController.errLog(
        this,
        `priorityLevel "${priorityLevel}" does not match a valid priorityLevel. Defaulting to "low".`,
      );
      return "low";
    } else {
      return priorityLevel;
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

  // checklist implementation later
}

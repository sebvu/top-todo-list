export default new (class LogController {
  #composeMsg(callerThis, msg) {
    const thisClassName = Object.getPrototypeOf(callerThis).constructor.name;
    return `[${thisClassName}] ${msg}`;
  }

  log(callerThis, msg) {
    console.log(this.#composeMsg(callerThis, msg));
  }

  errLog(callerThis, msg) {
    throw Error(this.#composeMsg(callerThis, msg));
  }
})();

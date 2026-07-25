/* 
	MIT LICENSE, FREE USE & DISTRIBUTION

	Copyright (c) 2026 Jester Santos
*/

class el {
  constructor(elementType, { id, classList, attrsList, isNS, children, text }) {
    this.elementType = elementType;
    this.opts = { id, classList, attrsList, isNS, children, text };
  }
}

class textNode {
  constructor(text) {
    this.text = text;
  }
}

class logHandler {
  constructor() {
    this.prefixCaller = "elLoader";
  }

  #composeLog = (msg, isError = false) => {
    if (isError) {
      throw Error(`[${this.prefixCaller}] ${msg}`);
    } else {
      console.log(`[${this.prefixCaller}] ${msg}`);
    }
  };

  log = (msg) => {
    this.#composeLog(msg);
  };

  errLog = (msg) => {
    this.#composeLog(msg, true);
  };
}
class ElementLoader {
  constructor() {
    this.#l = new logHandler();
  }

  #l;

  /**
   * Construct new 'el' type obj
   * @return {Object} | new el object
   */
  newEl = (
    elementType,
    {
      id = null,
      classList = null,
      attrsList = null,
      isNS = false,
      children = null,
      text = null,
    } = {},
  ) => {
    return new el(elementType, {
      id,
      classList,
      attrsList,
      isNS,
      children,
      text,
    });
  };

  /**
   * Construct new 'textNode' type obj
   * @return {Object} | new textNode object
   */
  newTextNode = (text = "") => {
    return new textNode(text);
  };

  /**
   * DFS based 'loader' to generate elements with shorter syntax.
   * @param {el[]} | elList - A ...spread array list of elLoad specific objects with possible children
   * @return {Object[]} | Returns an array of all elements as well as children if defined
   */
  loadElements = (...elList) => {
    try {
      const DFSel = (n, pEl, topEl = false) => {
        if (n === null) return null;

        /* 'spread' initial nodes 'c' to rootElement pEl */
        if (topEl) {
          for (const c of n) {
            DFSel(c, pEl);
          }
        } else {
          if (n instanceof textNode) {
            /* is text node */
            pEl.appendChild(document.createTextNode(n.text));
          } else {
            /* convert node to a dom element */
            const nEl = (() => {
              if (n.opts.isNS === true)
                /* only support is SVG for now */
                return document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  n.elementType,
                );
              else return document.createElement(n.elementType);
            })();

            /* == setting opts == */
            if (n.opts.id !== null) nEl.setAttribute("id", n.opts.id);

            if (n.opts.classList !== null) {
              if (!Array.isArray(n.opts.classList)) {
                n.opts.classList = [
                  n.opts.classList,
                ]; /* prev single entry err for single class */
              }
              nEl.classList.add(...n.opts.classList);
            }

            if (n.opts.text !== null) nEl.textContent = n.opts.text;

            if (n.opts.attrsList !== null) {
              for (const att in n.opts.attrsList) {
                nEl.setAttribute(att, n.opts.attrsList[att]);
              }
            }

            /* will only push to array if its the top element */
            pEl.appendChild(nEl);

            /* prevent single entry err for single child */
            if (!Array.isArray(n.opts.children))
              n.opts.children = [n.opts.children];

            for (const c of n.opts.children) {
              DFSel(c, nEl);
            }
          }
        }
      };
      const rootNode = document.createElement("div");
      DFSel(elList, rootNode, true);
      this.#l.log("Elements loaded successfully.");
      return [...rootNode.children];
    } catch (err) {
      this.#l.errLog(err);
    }
  };
}

export default new ElementLoader();

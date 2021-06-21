/*!
 * TOAST UI Rolling
 * @version 2.2.5
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Rolling"] = factory();
	else
		root["tui"] = root["tui"] || {}, root["tui"]["Rolling"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is existing or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isUndefined = __webpack_require__(7);
var isNull = __webpack_require__(13);

/**
 * Check whether the given variable is existing or not.
 * If the given variable is not null and not undefined, returns true.
 * @param {*} param - Target for checking
 * @returns {boolean} Is existy?
 * @memberof module:type
 * @example
 * var isExisty = require('tui-code-snippet/type/isExisty'); // node, commonjs
 *
 * isExisty(''); //true
 * isExisty(0); //true
 * isExisty([]); //true
 * isExisty({}); //true
 * isExisty(null); //false
 * isExisty(undefined); //false
*/
function isExisty(param) {
  return !isUndefined(param) && !isNull(param);
}

module.exports = isExisty;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Extend the target object from other objects.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * @module object
 */

/**
 * Extend the target object from other objects.
 * @param {object} target - Object that will be extended
 * @param {...object} objects - Objects as sources
 * @returns {object} Extended object
 * @memberof module:object
 */
function extend(target, objects) { // eslint-disable-line no-unused-vars
  var hasOwnProp = Object.prototype.hasOwnProperty;
  var source, prop, i, len;

  for (i = 1, len = arguments.length; i < len; i += 1) {
    source = arguments[i];
    for (prop in source) {
      if (hasOwnProp.call(source, prop)) {
        target[prop] = source[prop];
      }
    }
  }

  return target;
}

module.exports = extend;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Execute the provided callback once for each element present in the array(or Array-like object) in ascending order.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Execute the provided callback once for each element present
 * in the array(or Array-like object) in ascending order.
 * If the callback function returns false, the loop will be stopped.
 * Callback function(iteratee) is invoked with three arguments:
 *  1) The value of the element
 *  2) The index of the element
 *  3) The array(or Array-like object) being traversed
 * @param {Array|Arguments|NodeList} arr The array(or Array-like object) that will be traversed
 * @param {function} iteratee Callback function
 * @param {Object} [context] Context(this) of callback function
 * @memberof module:collection
 * @example
 * var forEachArray = require('tui-code-snippet/collection/forEachArray'); // node, commonjs
 *
 * var sum = 0;
 *
 * forEachArray([1,2,3], function(value){
 *     sum += value;
 * });
 * alert(sum); // 6
 */
function forEachArray(arr, iteratee, context) {
  var index = 0;
  var len = arr.length;

  context = context || null;

  for (; index < len; index += 1) {
    if (iteratee.call(context, arr[index], index, arr) === false) {
      break;
    }
  }
}

module.exports = forEachArray;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is a string or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is a string or not.
 * If the given variable is a string, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is string?
 * @memberof module:type
 */
function isString(obj) {
  return typeof obj === 'string' || obj instanceof String;
}

module.exports = isString;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is an instance of Array or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is an instance of Array or not.
 * If the given variable is an instance of Array, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is array instance?
 * @memberof module:type
 */
function isArray(obj) {
  return obj instanceof Array;
}

module.exports = isArray;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Execute the provided callback once for each property of object which actually exist.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Execute the provided callback once for each property of object which actually exist.
 * If the callback function returns false, the loop will be stopped.
 * Callback function(iteratee) is invoked with three arguments:
 *  1) The value of the property
 *  2) The name of the property
 *  3) The object being traversed
 * @param {Object} obj The object that will be traversed
 * @param {function} iteratee  Callback function
 * @param {Object} [context] Context(this) of callback function
 * @memberof module:collection
 * @example
 * var forEachOwnProperties = require('tui-code-snippet/collection/forEachOwnProperties'); // node, commonjs
 *
 * var sum = 0;
 *
 * forEachOwnProperties({a:1,b:2,c:3}, function(value){
 *     sum += value;
 * });
 * alert(sum); // 6
 */
function forEachOwnProperties(obj, iteratee, context) {
  var key;

  context = context || null;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (iteratee.call(context, obj[key], key, obj) === false) {
        break;
      }
    }
  }
}

module.exports = forEachOwnProperties;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview
 * This module provides a function to make a constructor
 * that can inherit from the other constructors like the CLASS easily.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var inherit = __webpack_require__(15);
var extend = __webpack_require__(1);

/**
 * @module defineClass
 */

/**
 * Help a constructor to be defined and to inherit from the other constructors
 * @param {*} [parent] Parent constructor
 * @param {Object} props Members of constructor
 *  @param {Function} props.init Initialization method
 *  @param {Object} [props.static] Static members of constructor
 * @returns {*} Constructor
 * @memberof module:defineClass
 * @example
 * var defineClass = require('tui-code-snippet/defineClass/defineClass'); // node, commonjs
 *
 * //-- #2. Use property --//
 * var Parent = defineClass({
 *     init: function() { // constuructor
 *         this.name = 'made by def';
 *     },
 *     method: function() {
 *         // ...
 *     },
 *     static: {
 *         staticMethod: function() {
 *              // ...
 *         }
 *     }
 * });
 *
 * var Child = defineClass(Parent, {
 *     childMethod: function() {}
 * });
 *
 * Parent.staticMethod();
 *
 * var parentInstance = new Parent();
 * console.log(parentInstance.name); //made by def
 * parentInstance.staticMethod(); // Error
 *
 * var childInstance = new Child();
 * childInstance.method();
 * childInstance.childMethod();
 */
function defineClass(parent, props) {
  var obj;

  if (!props) {
    props = parent;
    parent = null;
  }

  obj = props.init || function() {};

  if (parent) {
    inherit(obj, parent);
  }

  if (props.hasOwnProperty('static')) {
    extend(obj, props['static']);
    delete props['static'];
  }

  extend(obj.prototype, props);

  return obj;
}

module.exports = defineClass;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is undefined or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is undefined or not.
 * If the given variable is undefined, returns true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is undefined?
 * @memberof module:type
 */
function isUndefined(obj) {
  return obj === undefined; // eslint-disable-line no-undefined
}

module.exports = isUndefined;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is an object or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is an object or not.
 * If the given variable is an object, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is object?
 * @memberof module:type
 */
function isObject(obj) {
  return obj === Object(obj);
}

module.exports = isObject;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is a function or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is a function or not.
 * If the given variable is a function, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is function?
 * @memberof module:type
 */
function isFunction(obj) {
  return obj instanceof Function;
}

module.exports = isFunction;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Utils for Rolling component
 * @author NHN. FE dev Lab. <dl_javascript@nhn.com>
 */



var forEachArray = __webpack_require__(2);
var sendHostname = __webpack_require__(17);

var utils = {
  /**
   * Create a new function that, when called, has its this keyword set to the provided value.
   * @param {function} fn A original function before binding
   * @param {Object} obj context of function in arguments[0]
   * @returns {function} A new bound function with context that is in arguments[1]
   */
  bind: function(fn, context) {
    var slice = Array.prototype.slice;
    var args;

    if (fn.bind) {
      return fn.bind.apply(fn, slice.call(arguments, 1));
    }

    args = slice.call(arguments, 2);

    return function() {
      return fn.apply(context, args.length ? args.concat(slice.call(arguments)) : arguments);
    };
  },

  /**
   * Construct a new array with elements that pass the test by the provided callback function.
   * @param {Array|NodeList|Arguments} arr - array to be traversed
   * @param {function} iteratee - callback function
   * @param {Object} context - context of callback function
   * @returns {Array}
   */
  filter: function(arr, iteratee, context) {
    var result = [];

    forEachArray(arr, function(elem) {
      if (iteratee.apply(context || null, arguments)) {
        result.push(elem);
      }
    });

    return result;
  },

  /**
   * send host name
   * @ignore
   */
  sendHostName: function() {
    sendHostname('rolling', 'UA-129987462-1');
  }
};

module.exports = utils;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Rolling component core.
 * @author NHN. FE dev Lab.<dl_javascript@nhn.com>
 */



var CustomEvents = __webpack_require__(12);
var defineClass = __webpack_require__(6);
var isExisty = __webpack_require__(0);
var util = __webpack_require__(10);

var Roller = __webpack_require__(19);
var Data = __webpack_require__(25);

/**
 * Rolling core object
 * @class Rolling
 * @param {Object} options The options
 *      @param {HTMLElement|String} options.element A root element or id that will become root element's
 *      @param {Boolean} [options.isVariable=true|false] Whether the data is changable or not [default value is false]
 *      @param {Boolean} [options.isCircular=true|false] Whether circular or not [default value is true but isVariable true case]
 *      @param {Boolean} [options.isAuto=true|false] Whether auto rolling or not [default value is false]
 *      @param {Boolean} [options.usageStatistics=true|false] send hostname to google analytics [default value is true]
 *      @param {Number} [options.delayTime=1000|...] Distance time of auto rolling. [defulat 3 second]
 *      @param {Number} [options.direction='horizontal|vertical'] The flow direction panel [default value is horizontal]
 *      @param {Number} [options.duration='1000|...] A move duration
 *      @param {Number} [options.initNum='0|...] Initalize selected rolling panel number
 *      @param {String} [options.motion='linear|[quad]easeIn|[quad]easeOut|[quad]easeInOut|circEaseIn|circEaseOut|circEaseInOut] A effect name [default value is noeffect]
 *      @param {String} [options.unit='item|page'] A unit of rolling
 *      @param {String} [options.wrapperTag='ul.className|div.className'] A tag name for panel warpper, connect tag name with class name by dots. [defualt value is ul]
 *      @param {String} [options.panelTag='li.className'] A tag name for panel, connect tag name with class by dots [default value is li]
 * @param {Array|String} data A data of rolling panels
 * @example
 * // ES6
 * import Rolling from 'tui-rolling';
 *
 * // CommonJS
 * const Rolling = require('tui-rolling');
 *
 * // Browser
 * const Rolling = tui.Rolling;
 *
 * const instance = new tui.Rolling({
 *      element: document.getElementById('rolling'),
 *      initNum: 0,
 *      direction: 'horizontal',
 *      isVariable: true,
 *      unit: 'page',
 *      isAuto: false,
 *      motion: 'easeInOut',
 *      duration: 2000
 * }, ['<div>data1</div>','<div>data2</div>', '<div>data3</div>']);
 */
var Rolling = defineClass(
  /** @lends Rolling.prototype */ {
    // eslint-disable-next-line complexity
    init: function(options, data) {
      var isAuto = !!options.isAuto;

      /**
       * Whether ga tracking or not
       * @type {Boolean}
       * @private
       */
      var usageStatistics = isExisty(options.usageStatistics) ? options.usageStatistics : true;

      /**
       * options object
       * @type {Object}
       * @private
       */
      this._options = options;

      /**
       * The flow of next move
       * @type {String|string}
       * @private
       */
      this._flow = options.flow || 'next';

      /**
       * Whether html is drawn or not
       * @type {boolean}
       * @private
       */
      this._isDrawn = !!options.isDrawn;

      /**
       * Auto rolling timer
       * @type {null}
       * @private
       */
      this._timer = null;

      /**
       * Auto rolling delay time
       * @type {Number}
       * @private
       */
      this._delayTime = options.delayTime || 3000;

      /**
       * A model for rolling data
       * @type {Data}
       * @private
       */
      this._model = !options.isDrawn ? new Data(options, data) : null;

      /**
       * A rolling action object
       * @type {Roller}
       * @private
       */
      this._roller = new Roller(options, this._model && this._model.getData(), this);

      if (options.initNum) {
        this.moveTo(options.initNum);
      }

      if (isAuto) {
        this.auto();
      }

      if (usageStatistics) {
        util.sendHostName();
      }
    },

    /* eslint-disable complexity */
    /**
     * Roll the rolling component. If there is no data, the component have to have with fixed data
     * @param {String} data A rolling data
     * @param {String} [flow] A direction rolling
     * @example
     * rolling.roll('<div>data</div>', 'horizontal');
     */
    roll: function(data, flow) {
      var overBoundary;

      flow = flow || this._flow;

      // If rolling status is not idle, return
      if (this._roller.status !== 'idle') {
        return;
      }

      if (this._options.isVariable) {
        if (!data) {
          throw new Error('roll must run with data');
        }

        this.setFlow(flow);
        this._roller.move(data);
      } else {
        this.setFlow(flow);

        if (this._model) {
          overBoundary = this._model.changeCurrent(flow);
          data = this._model.getData();
        }
        if (!overBoundary) {
          this._roller.move(data);
        }
      }
    },
    /* eslint-enable complexity */

    /**
     * Set direction
     * @param {String} flow A direction of rolling
     * @example
     * rolling.setFlow('horizontal');
     */
    setFlow: function(flow) {
      this._flow = flow;
      this._roller.setFlow(flow);
    },

    /* eslint-disable complexity */
    /**
     * Move to target page
     * @param {Number} page A target page
     * @example
     * rolling.moveTo(3);
     */
    moveTo: function(page) {
      var len, max, min, current;
      var duration, absInterval, isPrev, flow, i;

      if (this._isDrawn) {
        this._roller.moveTo(page);

        return;
      }

      len = this._model.getDataListLength();
      max = Math.min(len, page);
      min = Math.max(1, page);
      current = this._model.getCurrent();

      if (isNaN(Number(page))) {
        throw new Error('#PageError moveTo method have to run with page');
      }

      if (this._options.isVariable) {
        throw new Error("#DataError : Variable Rolling can't use moveTo");
      }

      isPrev = this.isNegative(page - current);
      page = isPrev ? min : max;
      flow = isPrev ? 'prev' : 'next';
      absInterval = Math.abs(page - current);
      duration = this._options.duration / absInterval;

      this.setFlow(flow);

      for (i = 0; i < absInterval; i += 1) {
        this._model.changeCurrent(flow);
        this._roller.move(this._model.getData(), duration);
      }
    },
    /* eslint-enable complexity */

    /**
     * Check the number is negative or not
     * @param {Number} number - A number to figure out
     * @returns {Boolean}
     * @private
     */
    isNegative: function(number) {
      return !isNaN(number) && number < 0;
    },

    /**
     * Stop auto rolling
     */
    stop: function() {
      window.clearInterval(this._timer);
    },

    /**
     * Start auto rolling
     * @example
     * rolling.auto();
     */
    auto: function() {
      this.stop();
      this._timer = window.setInterval(
        util.bind(function() {
          this._model.changeCurrent(this._flow);
          this._roller.move(this._model.getData());
        }, this),
        this._delayTime
      );
    }
  }
);

CustomEvents.mixin(Rolling);

module.exports = Rolling;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview This module provides some functions for custom events. And it is implemented in the observer design pattern.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var extend = __webpack_require__(1);
var isExisty = __webpack_require__(0);
var isString = __webpack_require__(3);
var isObject = __webpack_require__(8);
var isArray = __webpack_require__(4);
var isFunction = __webpack_require__(9);
var forEach = __webpack_require__(14);

var R_EVENTNAME_SPLIT = /\s+/g;

/**
 * @class
 * @example
 * // node, commonjs
 * var CustomEvents = require('tui-code-snippet/customEvents/customEvents');
 */
function CustomEvents() {
  /**
     * @type {HandlerItem[]}
     */
  this.events = null;

  /**
     * only for checking specific context event was binded
     * @type {object[]}
     */
  this.contexts = null;
}

/**
 * Mixin custom events feature to specific constructor
 * @param {function} func - constructor
 * @example
 * var CustomEvents = require('tui-code-snippet/customEvents/customEvents'); // node, commonjs
 *
 * var model;
 * function Model() {
 *     this.name = '';
 * }
 * CustomEvents.mixin(Model);
 *
 * model = new Model();
 * model.on('change', function() { this.name = 'model'; }, this);
 * model.fire('change');
 * alert(model.name); // 'model';
 */
CustomEvents.mixin = function(func) {
  extend(func.prototype, CustomEvents.prototype);
};

/**
 * Get HandlerItem object
 * @param {function} handler - handler function
 * @param {object} [context] - context for handler
 * @returns {HandlerItem} HandlerItem object
 * @private
 */
CustomEvents.prototype._getHandlerItem = function(handler, context) {
  var item = {handler: handler};

  if (context) {
    item.context = context;
  }

  return item;
};

/**
 * Get event object safely
 * @param {string} [eventName] - create sub event map if not exist.
 * @returns {(object|array)} event object. if you supplied `eventName`
 *  parameter then make new array and return it
 * @private
 */
CustomEvents.prototype._safeEvent = function(eventName) {
  var events = this.events;
  var byName;

  if (!events) {
    events = this.events = {};
  }

  if (eventName) {
    byName = events[eventName];

    if (!byName) {
      byName = [];
      events[eventName] = byName;
    }

    events = byName;
  }

  return events;
};

/**
 * Get context array safely
 * @returns {array} context array
 * @private
 */
CustomEvents.prototype._safeContext = function() {
  var context = this.contexts;

  if (!context) {
    context = this.contexts = [];
  }

  return context;
};

/**
 * Get index of context
 * @param {object} ctx - context that used for bind custom event
 * @returns {number} index of context
 * @private
 */
CustomEvents.prototype._indexOfContext = function(ctx) {
  var context = this._safeContext();
  var index = 0;

  while (context[index]) {
    if (ctx === context[index][0]) {
      return index;
    }

    index += 1;
  }

  return -1;
};

/**
 * Memorize supplied context for recognize supplied object is context or
 *  name: handler pair object when off()
 * @param {object} ctx - context object to memorize
 * @private
 */
CustomEvents.prototype._memorizeContext = function(ctx) {
  var context, index;

  if (!isExisty(ctx)) {
    return;
  }

  context = this._safeContext();
  index = this._indexOfContext(ctx);

  if (index > -1) {
    context[index][1] += 1;
  } else {
    context.push([ctx, 1]);
  }
};

/**
 * Forget supplied context object
 * @param {object} ctx - context object to forget
 * @private
 */
CustomEvents.prototype._forgetContext = function(ctx) {
  var context, contextIndex;

  if (!isExisty(ctx)) {
    return;
  }

  context = this._safeContext();
  contextIndex = this._indexOfContext(ctx);

  if (contextIndex > -1) {
    context[contextIndex][1] -= 1;

    if (context[contextIndex][1] <= 0) {
      context.splice(contextIndex, 1);
    }
  }
};

/**
 * Bind event handler
 * @param {(string|{name:string, handler:function})} eventName - custom
 *  event name or an object {eventName: handler}
 * @param {(function|object)} [handler] - handler function or context
 * @param {object} [context] - context for binding
 * @private
 */
CustomEvents.prototype._bindEvent = function(eventName, handler, context) {
  var events = this._safeEvent(eventName);
  this._memorizeContext(context);
  events.push(this._getHandlerItem(handler, context));
};

/**
 * Bind event handlers
 * @param {(string|{name:string, handler:function})} eventName - custom
 *  event name or an object {eventName: handler}
 * @param {(function|object)} [handler] - handler function or context
 * @param {object} [context] - context for binding
 * //-- #1. Get Module --//
 * var CustomEvents = require('tui-code-snippet/customEvents/customEvents'); // node, commonjs
 *
 * //-- #2. Use method --//
 * // # 2.1 Basic Usage
 * CustomEvents.on('onload', handler);
 *
 * // # 2.2 With context
 * CustomEvents.on('onload', handler, myObj);
 *
 * // # 2.3 Bind by object that name, handler pairs
 * CustomEvents.on({
 *     'play': handler,
 *     'pause': handler2
 * });
 *
 * // # 2.4 Bind by object that name, handler pairs with context object
 * CustomEvents.on({
 *     'play': handler
 * }, myObj);
 */
CustomEvents.prototype.on = function(eventName, handler, context) {
  var self = this;

  if (isString(eventName)) {
    // [syntax 1, 2]
    eventName = eventName.split(R_EVENTNAME_SPLIT);
    forEach(eventName, function(name) {
      self._bindEvent(name, handler, context);
    });
  } else if (isObject(eventName)) {
    // [syntax 3, 4]
    context = handler;
    forEach(eventName, function(func, name) {
      self.on(name, func, context);
    });
  }
};

/**
 * Bind one-shot event handlers
 * @param {(string|{name:string,handler:function})} eventName - custom
 *  event name or an object {eventName: handler}
 * @param {function|object} [handler] - handler function or context
 * @param {object} [context] - context for binding
 */
CustomEvents.prototype.once = function(eventName, handler, context) {
  var self = this;

  if (isObject(eventName)) {
    context = handler;
    forEach(eventName, function(func, name) {
      self.once(name, func, context);
    });

    return;
  }

  function onceHandler() { // eslint-disable-line require-jsdoc
    handler.apply(context, arguments);
    self.off(eventName, onceHandler, context);
  }

  this.on(eventName, onceHandler, context);
};

/**
 * Splice supplied array by callback result
 * @param {array} arr - array to splice
 * @param {function} predicate - function return boolean
 * @private
 */
CustomEvents.prototype._spliceMatches = function(arr, predicate) {
  var i = 0;
  var len;

  if (!isArray(arr)) {
    return;
  }

  for (len = arr.length; i < len; i += 1) {
    if (predicate(arr[i]) === true) {
      arr.splice(i, 1);
      len -= 1;
      i -= 1;
    }
  }
};

/**
 * Get matcher for unbind specific handler events
 * @param {function} handler - handler function
 * @returns {function} handler matcher
 * @private
 */
CustomEvents.prototype._matchHandler = function(handler) {
  var self = this;

  return function(item) {
    var needRemove = handler === item.handler;

    if (needRemove) {
      self._forgetContext(item.context);
    }

    return needRemove;
  };
};

/**
 * Get matcher for unbind specific context events
 * @param {object} context - context
 * @returns {function} object matcher
 * @private
 */
CustomEvents.prototype._matchContext = function(context) {
  var self = this;

  return function(item) {
    var needRemove = context === item.context;

    if (needRemove) {
      self._forgetContext(item.context);
    }

    return needRemove;
  };
};

/**
 * Get matcher for unbind specific hander, context pair events
 * @param {function} handler - handler function
 * @param {object} context - context
 * @returns {function} handler, context matcher
 * @private
 */
CustomEvents.prototype._matchHandlerAndContext = function(handler, context) {
  var self = this;

  return function(item) {
    var matchHandler = (handler === item.handler);
    var matchContext = (context === item.context);
    var needRemove = (matchHandler && matchContext);

    if (needRemove) {
      self._forgetContext(item.context);
    }

    return needRemove;
  };
};

/**
 * Unbind event by event name
 * @param {string} eventName - custom event name to unbind
 * @param {function} [handler] - handler function
 * @private
 */
CustomEvents.prototype._offByEventName = function(eventName, handler) {
  var self = this;
  var andByHandler = isFunction(handler);
  var matchHandler = self._matchHandler(handler);

  eventName = eventName.split(R_EVENTNAME_SPLIT);

  forEach(eventName, function(name) {
    var handlerItems = self._safeEvent(name);

    if (andByHandler) {
      self._spliceMatches(handlerItems, matchHandler);
    } else {
      forEach(handlerItems, function(item) {
        self._forgetContext(item.context);
      });

      self.events[name] = [];
    }
  });
};

/**
 * Unbind event by handler function
 * @param {function} handler - handler function
 * @private
 */
CustomEvents.prototype._offByHandler = function(handler) {
  var self = this;
  var matchHandler = this._matchHandler(handler);

  forEach(this._safeEvent(), function(handlerItems) {
    self._spliceMatches(handlerItems, matchHandler);
  });
};

/**
 * Unbind event by object(name: handler pair object or context object)
 * @param {object} obj - context or {name: handler} pair object
 * @param {function} handler - handler function
 * @private
 */
CustomEvents.prototype._offByObject = function(obj, handler) {
  var self = this;
  var matchFunc;

  if (this._indexOfContext(obj) < 0) {
    forEach(obj, function(func, name) {
      self.off(name, func);
    });
  } else if (isString(handler)) {
    matchFunc = this._matchContext(obj);

    self._spliceMatches(this._safeEvent(handler), matchFunc);
  } else if (isFunction(handler)) {
    matchFunc = this._matchHandlerAndContext(handler, obj);

    forEach(this._safeEvent(), function(handlerItems) {
      self._spliceMatches(handlerItems, matchFunc);
    });
  } else {
    matchFunc = this._matchContext(obj);

    forEach(this._safeEvent(), function(handlerItems) {
      self._spliceMatches(handlerItems, matchFunc);
    });
  }
};

/**
 * Unbind custom events
 * @param {(string|object|function)} eventName - event name or context or
 *  {name: handler} pair object or handler function
 * @param {(function)} handler - handler function
 * @example
 * //-- #1. Get Module --//
 * var CustomEvents = require('tui-code-snippet/customEvents/customEvents'); // node, commonjs
 *
 * //-- #2. Use method --//
 * // # 2.1 off by event name
 * CustomEvents.off('onload');
 *
 * // # 2.2 off by event name and handler
 * CustomEvents.off('play', handler);
 *
 * // # 2.3 off by handler
 * CustomEvents.off(handler);
 *
 * // # 2.4 off by context
 * CustomEvents.off(myObj);
 *
 * // # 2.5 off by context and handler
 * CustomEvents.off(myObj, handler);
 *
 * // # 2.6 off by context and event name
 * CustomEvents.off(myObj, 'onload');
 *
 * // # 2.7 off by an Object.<string, function> that is {eventName: handler}
 * CustomEvents.off({
 *   'play': handler,
 *   'pause': handler2
 * });
 *
 * // # 2.8 off the all events
 * CustomEvents.off();
 */
CustomEvents.prototype.off = function(eventName, handler) {
  if (isString(eventName)) {
    // [syntax 1, 2]
    this._offByEventName(eventName, handler);
  } else if (!arguments.length) {
    // [syntax 8]
    this.events = {};
    this.contexts = [];
  } else if (isFunction(eventName)) {
    // [syntax 3]
    this._offByHandler(eventName);
  } else if (isObject(eventName)) {
    // [syntax 4, 5, 6]
    this._offByObject(eventName, handler);
  }
};

/**
 * Fire custom event
 * @param {string} eventName - name of custom event
 */
CustomEvents.prototype.fire = function(eventName) {  // eslint-disable-line
  this.invoke.apply(this, arguments);
};

/**
 * Fire a event and returns the result of operation 'boolean AND' with all
 *  listener's results.
 *
 * So, It is different from {@link CustomEvents#fire}.
 *
 * In service code, use this as a before event in component level usually
 *  for notifying that the event is cancelable.
 * @param {string} eventName - Custom event name
 * @param {...*} data - Data for event
 * @returns {boolean} The result of operation 'boolean AND'
 * @example
 * var map = new Map();
 * map.on({
 *     'beforeZoom': function() {
 *         // It should cancel the 'zoom' event by some conditions.
 *         if (that.disabled && this.getState()) {
 *             return false;
 *         }
 *         return true;
 *     }
 * });
 *
 * if (this.invoke('beforeZoom')) {    // check the result of 'beforeZoom'
 *     // if true,
 *     // doSomething
 * }
 */
CustomEvents.prototype.invoke = function(eventName) {
  var events, args, index, item;

  if (!this.hasListener(eventName)) {
    return true;
  }

  events = this._safeEvent(eventName);
  args = Array.prototype.slice.call(arguments, 1);
  index = 0;

  while (events[index]) {
    item = events[index];

    if (item.handler.apply(item.context, args) === false) {
      return false;
    }

    index += 1;
  }

  return true;
};

/**
 * Return whether at least one of the handlers is registered in the given
 *  event name.
 * @param {string} eventName - Custom event name
 * @returns {boolean} Is there at least one handler in event name?
 */
CustomEvents.prototype.hasListener = function(eventName) {
  return this.getListenerLength(eventName) > 0;
};

/**
 * Return a count of events registered.
 * @param {string} eventName - Custom event name
 * @returns {number} number of event
 */
CustomEvents.prototype.getListenerLength = function(eventName) {
  var events = this._safeEvent(eventName);

  return events.length;
};

module.exports = CustomEvents;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is null or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is null or not.
 * If the given variable(arguments[0]) is null, returns true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is null?
 * @memberof module:type
 */
function isNull(obj) {
  return obj === null;
}

module.exports = isNull;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Execute the provided callback once for each property of object(or element of array) which actually exist.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isArray = __webpack_require__(4);
var forEachArray = __webpack_require__(2);
var forEachOwnProperties = __webpack_require__(5);

/**
 * @module collection
 */

/**
 * Execute the provided callback once for each property of object(or element of array) which actually exist.
 * If the object is Array-like object(ex-arguments object), It needs to transform to Array.(see 'ex2' of example).
 * If the callback function returns false, the loop will be stopped.
 * Callback function(iteratee) is invoked with three arguments:
 *  1) The value of the property(or The value of the element)
 *  2) The name of the property(or The index of the element)
 *  3) The object being traversed
 * @param {Object} obj The object that will be traversed
 * @param {function} iteratee Callback function
 * @param {Object} [context] Context(this) of callback function
 * @memberof module:collection
 * @example
 * var forEach = require('tui-code-snippet/collection/forEach'); // node, commonjs
 *
 * var sum = 0;
 *
 * forEach([1,2,3], function(value){
 *     sum += value;
 * });
 * alert(sum); // 6
 *
 * // In case of Array-like object
 * var array = Array.prototype.slice.call(arrayLike); // change to array
 * forEach(array, function(value){
 *     sum += value;
 * });
 */
function forEach(obj, iteratee, context) {
  if (isArray(obj)) {
    forEachArray(obj, iteratee, context);
  } else {
    forEachOwnProperties(obj, iteratee, context);
  }
}

module.exports = forEach;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Provide a simple inheritance in prototype-oriented.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var createObject = __webpack_require__(16);

/**
 * Provide a simple inheritance in prototype-oriented.
 * Caution :
 *  Don't overwrite the prototype of child constructor.
 *
 * @param {function} subType Child constructor
 * @param {function} superType Parent constructor
 * @memberof module:inheritance
 * @example
 * var inherit = require('tui-code-snippet/inheritance/inherit'); // node, commonjs
 *
 * // Parent constructor
 * function Animal(leg) {
 *     this.leg = leg;
 * }
 * Animal.prototype.growl = function() {
 *     // ...
 * };
 *
 * // Child constructor
 * function Person(name) {
 *     this.name = name;
 * }
 *
 * // Inheritance
 * inherit(Person, Animal);
 *
 * // After this inheritance, please use only the extending of property.
 * // Do not overwrite prototype.
 * Person.prototype.walk = function(direction) {
 *     // ...
 * };
 */
function inherit(subType, superType) {
  var prototype = createObject(superType.prototype);
  prototype.constructor = subType;
  subType.prototype = prototype;
}

module.exports = inherit;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Create a new object with the specified prototype object and properties.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * @module inheritance
 */

/**
 * Create a new object with the specified prototype object and properties.
 * @param {Object} obj This object will be a prototype of the newly-created object.
 * @returns {Object}
 * @memberof module:inheritance
 */
function createObject(obj) {
  function F() {} // eslint-disable-line require-jsdoc
  F.prototype = obj;

  return new F();
}

module.exports = createObject;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Send hostname on DOMContentLoaded.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isUndefined = __webpack_require__(7);
var imagePing = __webpack_require__(18);

var ms7days = 7 * 24 * 60 * 60 * 1000;

/**
 * Check if the date has passed 7 days
 * @param {number} date - milliseconds
 * @returns {boolean}
 * @private
 */
function isExpired(date) {
  var now = new Date().getTime();

  return now - date > ms7days;
}

/**
 * Send hostname on DOMContentLoaded.
 * To prevent hostname set tui.usageStatistics to false.
 * @param {string} appName - application name
 * @param {string} trackingId - GA tracking ID
 * @ignore
 */
function sendHostname(appName, trackingId) {
  var url = 'https://www.google-analytics.com/collect';
  var hostname = location.hostname;
  var hitType = 'event';
  var eventCategory = 'use';
  var applicationKeyForStorage = 'TOAST UI ' + appName + ' for ' + hostname + ': Statistics';
  var date = window.localStorage.getItem(applicationKeyForStorage);

  // skip if the flag is defined and is set to false explicitly
  if (!isUndefined(window.tui) && window.tui.usageStatistics === false) {
    return;
  }

  // skip if not pass seven days old
  if (date && !isExpired(date)) {
    return;
  }

  window.localStorage.setItem(applicationKeyForStorage, new Date().getTime());

  setTimeout(function() {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      imagePing(url, {
        v: 1,
        t: hitType,
        tid: trackingId,
        cid: hostname,
        dp: hostname,
        dh: appName,
        el: appName,
        ec: eventCategory
      });
    }
  }, 1000);
}

module.exports = sendHostname;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Request image ping.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var forEachOwnProperties = __webpack_require__(5);

/**
 * @module request
 */

/**
 * Request image ping.
 * @param {String} url url for ping request
 * @param {Object} trackingInfo infos for make query string
 * @returns {HTMLElement}
 * @memberof module:request
 * @example
 * var imagePing = require('tui-code-snippet/request/imagePing'); // node, commonjs
 *
 * imagePing('https://www.google-analytics.com/collect', {
 *     v: 1,
 *     t: 'event',
 *     tid: 'trackingid',
 *     cid: 'cid',
 *     dp: 'dp',
 *     dh: 'dh'
 * });
 */
function imagePing(url, trackingInfo) {
  var trackingElement = document.createElement('img');
  var queryString = '';
  forEachOwnProperties(trackingInfo, function(value, key) {
    queryString += '&' + key + '=' + value;
  });
  queryString = queryString.substring(1);

  trackingElement.src = url + '?' + queryString;

  trackingElement.style.display = 'none';
  document.body.appendChild(trackingElement);
  document.body.removeChild(trackingElement);

  return trackingElement;
}

module.exports = imagePing;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Roller
 * @author NHN. FE dev Lab.<dl_javascript@nhn.com>
 */



var forEachArray = __webpack_require__(2);
var forEachOwnProperties = __webpack_require__(5);
var defineClass = __webpack_require__(6);
var extend = __webpack_require__(1);
var isExisty = __webpack_require__(0);
var isHTMLTag = __webpack_require__(20);
var isNotEmpty = __webpack_require__(21);
var isString = __webpack_require__(3);
var util = __webpack_require__(10);

var motion = __webpack_require__(24);

/**
 * A roller method set for fixed panel
 * @namespace movePanelSet
 * @static
 * @ignore
 */
var movePanelSet = {
  /**
   * Set rolling container
   * @private
   */
  // eslint-disable-next-line complexity
  _setContainer: function() {
    var options = this._options;
    var element = this._element;
    var firstChild = element.firstChild;
    var wrap, next, tag, className;

    if (options.wrapperTag) {
      tag = options.wrapperTag && options.wrapperTag.split('.')[0];
      className = (options.wrapperTag && options.wrapperTag.split('.')[1]) || '';
      wrap = document.createElement(tag);

      if (className) {
        wrap.className = className;
      }
      this._element.innerHTML = '';
      this._element.appendChild(wrap);
    } else {
      if (isHTMLTag(firstChild)) {
        wrap = firstChild;
      }
      next = firstChild && firstChild.nextSibling;
      if (isHTMLTag(next)) {
        wrap = next;
      } else {
        wrap = document.createElement('ul');
        this._element.appendChild(wrap);
      }
    }
    this._container = wrap;
  },

  /**
   * Make rolling panel
   * @param {object} initData - Data
   * @private
   */
  _setPanel: function(initData) {
    var panelSet = this.panel;
    var info = this._getElementInfo();

    this._container.innerHTML = '';

    forEachOwnProperties(
      panelSet,
      function(value, key) {
        panelSet[key] = this._makeElement(info.tag, info.className, key);
      },
      this
    );

    panelSet.center.innerHTML = initData;
    this._container.appendChild(panelSet.center);
  },

  /**
   * Get element info
   * @returns {object} Element info
   * @private
   */
  // eslint-disable-next-line complexity
  _getElementInfo: function() {
    var panel = this._container.firstChild;
    var options = this._options;
    var tag, className;

    if (isString(options.panelTag)) {
      tag = options.panelTag.split('.')[0];
      className = options.panelTag.split('.')[1] || '';
    } else {
      if (!isHTMLTag(panel)) {
        panel = panel && panel.nextSibling;
      }
      tag = isHTMLTag(panel) ? panel.tagName : 'li';
      className = (panel && panel.className) || '';
    }

    return {
      tag: tag,
      className: className
    };
  },

  /**
   * Make HTML Element
   * @param {String} tag A tag name
   * @param {String} className A class name
   * @returns {HTMLElement}
   * @private
   */
  _makeElement: function(tag, className) {
    var element = document.createElement(tag);

    element.className = className;
    element.style.position = 'absolute';
    element.style.width = '100%';
    element.style.height = '100%';
    element.style.left = '0px';
    element.style.top = '0px';

    return element;
  },

  /**
   * Set panel data
   * @param {String} data A data for replace panel
   * @private
   */
  _updatePanel: function(data) {
    this.panel[this._flow || 'center'].innerHTML = data;
  },

  /**
   * Append move panel
   * @private
   */
  _appendMoveData: function() {
    var flow = this._flow;
    var movePanel = this.panel[flow];
    var style = movePanel.style;
    var dest = (flow === 'prev' ? -this._distance : this._distance) + 'px';

    style[this._range] = dest;

    this.movePanel = movePanel;
    this._container.appendChild(movePanel);
  },

  /**
   * Get each panels' move distances
   * @returns {*}
   * @private
   */
  _getMoveSet: function() {
    var flow = this._flow;
    var result;

    if (flow === 'prev') {
      result = [0, this._distance];
    } else {
      result = [-this._distance, 0];
    }

    return result;
  },

  /**
   * Get start points
   * @returns {Array}
   * @private
   */
  _getStartSet: function() {
    var panel = this.panel;
    var flow = this._flow;
    var range = this._range;
    var isPrev = flow === 'prev';
    var first = isPrev ? panel.prev : panel.center;
    var second = isPrev ? panel.center : panel.next;

    return [parseInt(first.style[range], 10), parseInt(second.style[range], 10)];
  },

  /**
   * Get move target
   * @param {String} flow A flow to move
   * @private
   */
  _setTarget: function(flow) {
    this._targets = [this.panel.center];

    if (flow === 'prev') {
      this._targets.unshift(this.panel[flow]);
    } else {
      this._targets.push(this.panel[flow]);
    }
  },

  /**
   * A panel move
   * @param {Object} data - A data to update panel
   * @param {Number} duration - Idle time
   * @param {String} flow - A direction to next rolling
   */
  move: function(data, duration, flow) {
    var result;

    flow = flow || this._flow;

    if (this.status === 'idle') {
      this.status = 'run';
    } else {
      this._queueing(data, duration, flow);

      return;
    }

    /**
     * @event Rolling#beforeMove
     * @type {object} ev - Custom event object
     * @property {String} data - Inner HTML
     * @example
     * instance.on('beforeMove', (ev) => {
     *     console.log(ev.data)
     * });
     */
    result = this._rolling.invoke('beforeMove', {
      data: data
    });

    if (!result) {
      this.status = 'idle';

      return;
    }

    // Set next panel
    this._updatePanel(data);
    this._appendMoveData();
    this._setTarget(flow);

    if (!this._motion) {
      this._moveWithoutMotion();
    } else {
      this._moveWithMotion(duration);
    }
  },

  /**
   * Set position
   * @private
   */
  _moveWithoutMotion: function() {
    var pos = this._getMoveSet();
    var range = this._range;

    forEachArray(this._targets, function(element, index) {
      element.style[range] = pos[index] + 'px';
    });

    this.complete();
  },

  /**
   * Run animation
   * @param {Number} duration - Idle time
   * @private
   */
  _moveWithMotion: function(duration) {
    var flow = this._flow;
    var start = this._getStartSet(flow);
    var distance = this._distance;
    var range = this._range;

    duration = duration || this._duration;

    this._animate({
      delay: 10,
      duration: duration || 1000,
      delta: this._motion,
      step: util.bind(function(delta) {
        forEachArray(this._targets, function(element, index) {
          var dest = flow === 'prev' ? distance * delta : -(distance * delta);
          element.style[range] = start[index] + dest + 'px';
        });
      }, this),
      complete: util.bind(this.complete, this)
    });
  },

  /**
   * Complate callback
   */
  complete: function() {
    var panel = this.panel;
    var flow = this._flow;
    var tempPanel, first;

    tempPanel = panel.center;
    panel.center = panel[flow];
    panel[flow] = tempPanel;

    this._targets = null;
    this._container.removeChild(tempPanel);
    this.status = 'idle';

    if (isNotEmpty(this._queue)) {
      first = this._queue.shift();
      this.move(first.data, first.duration, first.flow);
    } else {
      /**
       * @event Rolling#afterMove
       * @example
       * instance.on('afterMove', () => {
       *     // code
       * });
       */
      this._rolling.fire('afterMove');
    }
  }
};

/**
 * Container move methods
 * @namespace moveContainerSet
 * @static
 * @ignore
 */
var moveContainerSet = {
  /**
   * Set container
   * @private
   */
  _setContainer: function() {
    var element = this._element;
    var firstChild = element.firstChild;
    var wrap;
    if (this._isDrawn) {
      wrap = isHTMLTag(firstChild) ? firstChild : firstChild.nextSibling;
      this._container = wrap;
      this._container.style[this._range] = 0;
    }
    this._setItemCount();
  },

  /**
   * Move area check
   * @param {String} flow A direction to move
   * @returns {Boolean}
   * @private
   */
  _isLimitPoint: function(flow) {
    var moved = this._getCurrentPosition();
    var result;

    if (flow === 'next') {
      result = !(this.limit > -moved);
    } else {
      result = !(moved < 0);
    }

    return result;
  },

  /**
   * Get current position
   * @returns {Number} Current position;
   * @private
   */
  _getCurrentPosition: function() {
    return parseInt(this._container.style[this._range], 10);
  },

  /**
   * Move panels
   * @param {Number} duration - Idle time
   * @param {String} flow - A direction to next rolling
   */
  /* eslint-disable complexity */
  move: function(duration, flow) {
    var result;

    flow = flow || this._flow;

    if (this.status === 'idle') {
      this.status = 'run';
    } else {
      this._queueing(duration, flow);

      return;
    }

    result = this._rolling.invoke('beforeMove');

    if (!result) {
      this.status = 'idle';

      return;
    }

    if (!this._isCircular && this._isLimitPoint(flow)) {
      this.status = 'idle';

      return;
    }

    if (this._isCircular) {
      this._rotatePanel(flow);
    }

    if (!this._motion) {
      this._moveWithoutMotion();
    } else {
      this._moveWithMotion(duration);
    }
  },
  /* eslint-enable complexity */

  /**
   * Fix panels
   */
  complete: function() {
    if (this._isCircular) {
      this._setPanel();
    }
    this.status = 'idle';
  },

  /**
   * Get move distance
   * @param {String} flow A direction
   * @returns {number}
   * @private
   */
  _getMoveDistance: function(flow) {
    var moved = this._getCurrentPosition();
    var castDist = this._distance * this._unitCount;
    var result;

    if (flow === 'prev') {
      if (this._isCircular) {
        return this._distance;
      }
      result = moved + castDist > 0 ? -moved : castDist;
    } else {
      if (this._isCircular) {
        return -this._distance;
      }
      result = castDist > this.limit + moved ? -this.limit - moved : -castDist;
    }

    return result;
  },

  /**
   * Set position
   * @private
   */
  _moveWithoutMotion: function() {
    var flow = this._flow;
    var pos = this._getMoveDistance(flow);
    var range = this._range;
    var start = parseInt(this._container.style[range], 10);

    this._container.style[range] = start + pos + 'px';
    this.complete();
  },

  /**
   * Run animation
   * @param {Number} duration - Idle time
   * @private
   */
  _moveWithMotion: function(duration) {
    var flow = this._flow;
    var container = this._container;
    var range = this._range;
    var start = parseInt(container.style[range], 10);
    var distance = this._getMoveDistance(flow);

    duration = duration || this._duration;

    this._animate({
      delay: 10,
      duration: duration || 1000,
      delta: this._motion,
      step: util.bind(function(delta) {
        var dest = distance * delta;
        container.style[range] = start + dest + 'px';
      }, this),
      complete: util.bind(this.complete, this)
    });
  },

  /**
   * Rotate panel
   * @param {String} flow A flow to rotate panel
   * @private
   */
  _rotatePanel: function(flow) {
    var range = this._range;
    var isPrev = flow === 'prev';
    var basis = this._basis;
    var standard, moveset, movesetLength, containerMoveDist;

    flow = flow || this._flow;

    this._setPartOfPanels(flow);

    moveset = this._movePanelSet;
    movesetLength = moveset.length;
    containerMoveDist = this._getMoveDistance(flow);

    if (this._isInclude(this._panels[this._basis], moveset)) {
      this._basis = isPrev ? basis - movesetLength : basis + movesetLength;

      return;
    }

    if (isPrev) {
      standard = this._panels[0];
      forEachArray(
        moveset,
        function(element) {
          this._container.insertBefore(element, standard);
        },
        this
      );
    } else {
      forEachArray(
        moveset,
        function(element) {
          this._container.appendChild(element);
        },
        this
      );
    }
    this._container.style[range] =
      parseInt(this._container.style[range], 10) - containerMoveDist + 'px';
  },

  /**
   * Check current panel is included rotate panels
   * @param {HTMLElement} item A target element
   * @param {Array} colleciton A array to compare
   * @returns {boolean}
   * @private
   */
  _isInclude: function(item, colleciton) {
    var i = 0;
    var length = colleciton.length;
    var result = false;

    for (; i < length; i += 1) {
      if (colleciton[i] === item) {
        result = true;
        break;
      }
    }

    return result;
  },

  /**
   * Find rotate panel by direction
   * @param {String} flow A direction
   * @private
   */
  _setPartOfPanels: function(flow) {
    var itemcount = this._itemcount;
    var isPrev = flow === 'prev';
    var count = this._rollunit !== 'page' ? 1 : itemcount;
    var dist = isPrev ? -count : count;
    var point = isPrev ? [dist] : [0, dist];

    this._movePanelSet = this._panels.slice.apply(this._panels, point);
  },

  /**
   * Get display item count
   * @private
   */
  _setItemCount: function() {
    var element = this._element;
    var elementStyle = element.style;
    var elementWidth = parseInt(elementStyle.width || element.clientWidth, 10);
    var elementHeight = parseInt(elementStyle.height || element.clientHeight, 10);
    var item = this._element.getElementsByTagName('li')[0];
    var itemStyle = item.style;
    var itemWidth = parseInt(itemStyle.width || item.clientWidth, 10);
    var itemHeight = parseInt(itemStyle.height || item.clientHeight, 10);

    if (this._range === 'left') {
      this._itemcount = Math.round(elementWidth / itemWidth);
    } else {
      this._itemcount = Math.round(elementHeight / itemHeight);
    }
  },

  /**
   * Initalize panels
   * @private
   */
  _initPanel: function() {
    var panels = this._container.childNodes;
    var index = 0;

    this._panels = util.filter(panels, function(panel) {
      var isValid = isHTMLTag(panel);
      if (isValid) {
        panel.className += ' __index' + index + '__';
        index += 1;
      }

      return isValid;
    });
  },

  /**
   * Set panel list
   * @private
   */
  _setPanel: function() {
    var panels = this._container.childNodes;

    this._panels = util.filter(panels, function(element) {
      return isHTMLTag(element);
    });
    this._basis = this._basis || 0;
    this._setBoundary();
  },

  /**
   * Set fixed area incircular rolling
   * @private
   */
  _setBoundary: function() {
    var panels = this._panels;
    var distance = this._distance;
    var range = this._range;
    var rangeDistance = parseInt(this._element.style[range === 'left' ? 'width' : 'height'], 10);
    var wrapArea =
      this._rollunit === 'page' ? distance / this._itemcount : distance * panels.length;
    var limitDist = wrapArea - rangeDistance;

    this.limit = limitDist;
  },

  /**
   * Get current index on selected page
   * @param {Number} page A move panel number
   * @returns {number}
   * @private
   */
  _checkPagePosition: function(page) {
    var dist = null;
    var panels = this._panels;

    forEachArray(panels, function(panel, index) {
      if (panel.className.indexOf('__index' + page) !== -1) {
        if (!isExisty(dist)) {
          dist = index;
        }
      }
    });

    return dist;
  },

  /**
   * A move to some panel.
   * @param {Number} page A number of panel
   */
  moveTo: function(page) {
    var itemCount = this._itemcount;
    var panelCount = this._panels.length;
    var distance = this._distance;
    var pos, itemDist, unitDist;

    page = Math.max(page, 0);
    page = Math.min(page, this._panels.length - 1);

    pos = this._checkPagePosition(page);
    itemDist = this._rollunit === 'page' ? distance / itemCount : distance;
    unitDist = -pos * itemDist;

    if (!this._isCircular) {
      unitDist = Math.max(unitDist, -this.limit);
    } else {
      unitDist = Math.max(unitDist, -(itemDist * (panelCount - itemCount)));
      this._basis = pos;
      this._setPanel();
    }

    this._container.style[this._range] = unitDist + 'px';
  }
};

/**
 * Roller that move rolling panel
 * @param {Object} options - The options of rolling component
 * @param {Object} initData - Data to set panels
 * @param {Rolling} Rolling - Rolling object to bind custom event
 * @constructor
 * @ignore
 */
var Roller = defineClass(
  /** @lends Roller.prototype */ {
    /* eslint-disable complexity */
    init: function(options, initData, rolling) {
      /**
       * A options
       * @type {Object}
       * @private
       */
      this._options = options;

      /**
       * A root element
       * @type {(HTMLElement|String)}
       * @private
       */
      this._element = isString(options.element)
        ? document.getElementById(options.element)
        : options.element;

      /**
       * A direction of rolling (vertical|horizontal)
       * @type {String}
       * @private
       */
      this._direction = options.direction || 'horizontal';

      /**
       * A style attribute to move('left | top')
       * @type {string}
       * @private
       */
      this._range = this._direction === 'horizontal' ? 'left' : 'top';

      /**
       * A function that is used to move
       * @type {Function}
       */
      this._motion = motion[options.motion || 'noeffect'];

      /**
       * A rolling unit
       * @type {Number}
       * @private
       */
      this._rollunit = options.unit || 'page';

      /**
       * Whether html is drawn or not
       * @type {boolean}
       * @private
       */
      this._isDrawn = !!options.isDrawn;

      /**
       * A item per page
       * @type {boolean}
       * @private
       */
      this._itemcount = options.itemcount;

      /**
       * A direction to next rolling
       * @type {string}
       * @private
       */
      this._flow = options.flow || 'next';

      /**
       * A animation duration
       * @type {*|number}
       * @private
       */
      this._duration = options.duration || 1000;

      /**
       * Whether circular or not
       * @type {Boolean}
       * @private
       */
      this._isCircular = isExisty(options.isCircular) ? options.isCircular : true;

      /**
       * A roller state
       * @type {String}
       */
      this.status = 'idle';

      /**
       * A container that will be moved
       * @type {HTMLElement}
       * @private
       */
      this._container = null;

      /**
       * Changable data panel
       * @type {Object}
       */
      this.panel = {
        prev: null,
        center: null,
        next: null
      };

      /**
       * Fixed roller panels, that have node list by array
       * @type {Array}
       */
      this._panels = [];

      /**
       * Base element
       * @type {HTMLElement}
       */
      this._basis = null;

      /**
       * Root element width, if move unit is page this is move width
       * @type {number}
       * @private
       */
      this._distance = 0;

      /**
       * Moved panel target
       * @type {Array}
       * @private
       */
      this._targets = [];

      /**
       * Queue for order that is requested during moving
       * @type {Array}
       * @private
       */
      this._queue = [];

      /**
       * A move unit count
       * @type {number}
       * @private
       */
      this._unitCount = options.rollunit === 'page' ? 1 : options.unitCount || 1;

      /**
       * Rolling object
       * @type {Rolling}
       * @private
       */
      this._rolling = rolling;

      if (!this._isDrawn) {
        this.mixin(movePanelSet);
      } else {
        this.mixin(moveContainerSet);
      }

      this._setContainer();
      this._masking();
      this._setUnitDistance();

      if (this._isDrawn) {
        this._initPanel();
      }
      this._setPanel(initData);
    },
    /* eslint-enable complexity */

    /**
     * Mixin
     * @param {Object} methods A method set [staticDataMethods|remoteDataMethods]
     */
    mixin: function(methods) {
      extend(this, methods);
    },

    /**
     * Masking
     * @method
     * @private
     */
    _masking: function() {
      var element = this._element;
      var elementStyle = element.style;

      elementStyle.position = 'relative';
      elementStyle.overflow = 'hidden';
      elementStyle.width = elementStyle.width || element.clientWidth + 'px';
      elementStyle.height = elementStyle.height || element.clientHeight + 'px';
    },

    /**
     * Get unit move distance
     * @private
     */
    _setUnitDistance: function() {
      var elementStyle = this._element.style;
      var dist;

      if (this._direction === 'horizontal') {
        dist = elementStyle.width.replace('px', '');
      } else {
        dist = elementStyle.height.replace('px', '');
      }

      if (this._rollunit !== 'page' && this._isDrawn) {
        dist = Math.ceil(dist / this._itemcount);
      }
      this._distance = parseInt(dist, 10);
    },

    /**
     * Queue move order
     * @param {String} data A page data
     * @param {Number} duration A duartion
     * @param {String} flow A direction to move
     * @private
     */
    _queueing: function(data, duration, flow) {
      this._queue.push({
        data: data,
        duration: duration,
        flow: flow
      });
    },

    /**
     * A default direction
     * @param {String} flow A flow that will be defualt value
     */
    setFlow: function(flow) {
      this._flow = flow || this._flow || 'next';
    },

    /**
     * change animation effect
     * @param {String} type A name of effect
     */
    changeMotion: function(type) {
      this._motion = motion[type];
    },

    /**
     * Animate
     * @param {Object} options A options for animating
     */
    _animate: function(options) {
      var start = new Date();
      var id = window.setInterval(function() {
        var timePassed = new Date() - start;
        var progress = timePassed / options.duration;
        var delta;

        if (progress > 1) {
          progress = 1;
        }
        delta = options.delta(progress);

        options.step(delta);

        if (progress === 1) {
          window.clearInterval(id);
          options.complete();
        }
      }, options.delay || 10);
    }
  }
);

module.exports = Roller;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is a HTML tag or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is a HTML tag or not.
 * If the given variables is a HTML tag, return true.
 * @param {*} html - Target for checking
 * @returns {boolean} Is HTML tag?
 * @memberof module:type
 */
function isHTMLTag(html) {
  if (typeof HTMLElement === 'object') {
    return (html && (html instanceof HTMLElement));
  }

  return !!(html && html.nodeType && html.nodeType === 1);
}

module.exports = isHTMLTag;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is not empty(not null, not undefined, or not empty array, not empty object) or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isEmpty = __webpack_require__(22);

/**
 * Check whether the given variable is not empty
 * (not null, not undefined, or not empty array, not empty object) or not.
 * If the given variables is not empty, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is not empty?
 * @memberof module:type
 */
function isNotEmpty(obj) {
  return !isEmpty(obj);
}

module.exports = isNotEmpty;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-disable complexity */
/**
 * @fileoverview Check whether the given variable is empty(null, undefined, or empty array, empty object) or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isString = __webpack_require__(3);
var isExisty = __webpack_require__(0);
var isArray = __webpack_require__(4);
var isArguments = __webpack_require__(23);
var isObject = __webpack_require__(8);
var isFunction = __webpack_require__(9);

/**
 * Check whether given argument is empty string
 * @param {*} obj - Target for checking
 * @returns {boolean} whether given argument is empty string
 * @private
 */
function _isEmptyString(obj) {
  return isString(obj) && obj === '';
}

/**
 * Check whether given argument has own property
 * @param {Object} obj - Target for checking
 * @returns {boolean} - whether given argument has own property
 * @private
 */
function _hasOwnProperty(obj) {
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      return true;
    }
  }

  return false;
}

/**
 * Check whether the given variable is empty(null, undefined, or empty array, empty object) or not.
 *  If the given variables is empty, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is empty?
 * @memberof module:type
 */
function isEmpty(obj) {
  if (!isExisty(obj) || _isEmptyString(obj)) {
    return true;
  }

  if (isArray(obj) || isArguments(obj)) {
    return obj.length === 0;
  }

  if (isObject(obj) && !isFunction(obj)) {
    return !_hasOwnProperty(obj);
  }

  return true;
}

module.exports = isEmpty;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is an arguments object or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isExisty = __webpack_require__(0);

/**
 * @module type
 */

/**
 * Check whether the given variable is an arguments object or not.
 * If the given variable is an arguments object, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is arguments?
 * @memberof module:type
 */
function isArguments(obj) {
  var result = isExisty(obj) &&
        ((Object.prototype.toString.call(obj) === '[object Arguments]') || !!obj.callee);

  return result;
}

module.exports = isArguments;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Module of motions
 * @author NHN. FE dev Lab.<dl_javascript@nhn.com>
 */



/**
 * Rolling motion collection
 * @namespace motion
 * @ignore
 */
var motion = (function() {
  var quadEaseIn, circEaseIn, quadEaseOut, circEaseOut, quadEaseInOut, circEaseInOut;

  /**
   * easeIn
   * @param {Number} delta - Delta value
   * @returns {Function}
   */
  function makeEaseIn(delta) {
    return function(progress) {
      return delta(progress);
    };
  }

  /**
   * easeOut
   * @param {Number} delta - Delta value
   * @returns {Function}
   */
  function makeEaseOut(delta) {
    return function(progress) {
      return 1 - delta(1 - progress);
    };
  }

  /**
   * easeInOut
   * @param {Number} delta - Delta value
   * @returns {Function}
   */
  function makeEaseInOut(delta) {
    return function(progress) {
      var result;

      if (progress < 0.5) {
        result = delta(2 * progress) / 2;
      } else {
        result = (2 - delta(2 * (1 - progress))) / 2;
      }

      return result;
    };
  }

  /**
   * Linear
   * @param {Number} progress - Progress value
   * @returns {Number}
   * @memberof motion
   * @method linear
   * @static
   */
  function linear(progress) {
    return progress;
  }

  /**
   * Quad
   * @param {Number} progress - Progress value
   * @returns {Number}
   * @memberof motion
   * @method quad
   * @static
   */
  function quad(progress) {
    return Math.pow(progress, 2);
  }

  /**
   * Circle
   * @param {Number} progress - Progress value
   * @returns {Number}
   * @memberof motion
   * @method circ
   * @static
   */
  function circ(progress) {
    return 1 - Math.sin(Math.acos(progress));
  }

  /**
   * qued + easeIn
   * @memberof motion
   * @method quadEaseIn
   * @static
   */
  quadEaseIn = makeEaseIn(quad);

  /**
   * circ + easeIn
   * @memberof motion
   * @method circEaseIn
   * @static
   */
  circEaseIn = makeEaseIn(circ);

  /**
   * quad + easeOut
   * @memberof motion
   * @method quadEaseOut
   * @static
   */
  quadEaseOut = makeEaseOut(quad);

  /**
   * circ + easeOut
   * @memberof motion
   * @method circEaseOut
   * @static
   */
  circEaseOut = makeEaseOut(circ);

  /**
   * quad + easeInOut
   * @memberof motion
   * @method quadEaseInOut
   * @static
   */
  quadEaseInOut = makeEaseInOut(quad);

  /**
   * circ + easeInOut
   * @memberof motion
   * @method circEaseInOut
   * @static
   */
  circEaseInOut = makeEaseInOut(circ);

  return {
    linear: linear,
    easeIn: quadEaseIn,
    easeOut: quadEaseOut,
    easeInOut: quadEaseInOut,
    quadEaseIn: quadEaseIn,
    quadEaseOut: quadEaseOut,
    quadEaseInOut: quadEaseInOut,
    circEaseIn: circEaseIn,
    circEaseOut: circEaseOut,
    circEaseInOut: circEaseInOut
  };
})();

module.exports = motion;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview A data for move
 * @author NHN. FE dev Lab.<dl_javascript@nhn.com>
 */



var forEachArray = __webpack_require__(2);
var defineClass = __webpack_require__(6);
var extend = __webpack_require__(1);
var isBoolean = __webpack_require__(26);

/**
 * Node for each data panel
 * @namespace Node
 * @param {Object} data node data or html value
 * @ignore
 * @constructor
 */
var Node = function(data) {
  this.prev = null;
  this.next = null;
  this.data = data;
};

/**
 * Static data method set
 * @namespace staticDataMethods
 * @ignore
 */
var staticDataMethods = {
  /**
   * Initialize data
   * @param {Array} datalist A list that is not connected with each other
   * @private
   */
  _initData: function(datalist) {
    var before = null;
    var nodelist = [before];
    var first;

    forEachArray(datalist, function(data, index) {
      var node = new Node(data);
      node.prev = before;

      if (before) {
        before.next = node;
      } else {
        first = node;
      }

      if (index === datalist.length - 1) {
        node.next = first;
        first.prev = node;
      }

      before = node;

      nodelist.push(node);
    });

    this._datalist = nodelist;
  },

  /**
   * Get index data
   * @param {Number} index A index to get
   * @returns {String}
   */
  getData: function(index) {
    return this._datalist[index || this._current].data;
  },

  /**
   * Get list length
   * @returns {Array}
   */
  getDataListLength: function() {
    return this._datalist.length - 1;
  },

  /**
   * Get next data
   * @param {Number} index A next index
   * @returns {String}
   * @private
   */
  getPrevData: function(index) {
    return this._datalist[index || this._current].prev.data;
  },

  /**
   * Get prev data
   * @param {Number} index A prev index
   * @returns {String}
   * @private
   */
  getNextData: function(index) {
    return this._datalist[index || this._current].next.data;
  },

  /**
   * Change current
   * @param {String} flow A direction
   * @returns {Boolean} Current state
   * @private
   */
  changeCurrent: function(flow) {
    var length = this.getDataListLength();

    if (flow === 'prev') {
      this._current -= 1;
      if (this._current < 1) {
        this._current = this._isCircular ? length : 1;

        return true;
      }
    } else {
      this._current += 1;
      if (this._current > length) {
        this._current = this._isCircular ? 1 : length;

        return true;
      }
    }

    return false;
  },

  /**
   * Get current
   * @returns {Number}
   */
  getCurrent: function() {
    return this._current;
  }
};

/**
 * Changable data method set
 * @namespace remoteDataMethods
 * @static
 * @ignore
 */
var remoteDataMethods = {
  /**
   * Initialize data
   * @param {String} data A data to draw
   * @private
   */
  _initData: function(data) {
    this._data = new Node(data);
  },

  /**
   * Get current data or some data by index
   * @param {Number} index A index of data
   * @returns {String}
   */
  getData: function() {
    return this._data.data;
  },

  /**
   * Set data
   * @param {String} type ['prev|next'] A data index
   * @param {String} data A data in rolling component
   */
  setData: function(type, data) {
    this._data[type] = new Node(data);
  },

  /**
   * Disconnect data
   * @param {String} type ['prev|next'] Rewrite data
   */
  severLink: function(type) {
    var data = this._data;
    this._data = this._data[type];
    data[type] = null;
  },

  /**
   * Get previous Data
   * @returns {String}
   * @private
   */
  getPrevData: function() {
    return this._data.prev && this._data.prev.data;
  },

  /**
   * Get next data
   * @returns {String}
   * @private
   */
  getNextData: function() {
    return this._data.next && this._data.next.data;
  }
};

/**
 * Data model for rolling
 * @param {Object} options A component options
 * @param {(Array|Object)} data A data of rolling
 * @constructor
 * @ignore
 */
var Data = defineClass(
  /** @lends Data.prototype */ {
    init: function(options, data) {
      /**
       * Whether changable data
       * @type {Boolean}
       */
      this.isVariable = !!options.isVariable;

      /**
       * A data list
       * @type {Array}
       */
      this._datalist = null;

      /**
       * A data
       * @type {Node}
       * @private
       */
      this._data = null;

      /**
       * A init number
       * @type {Number}
       */
      this._current = options.initNum || 1;

      /**
       * Whehter circular
       * @type {Boolean}
       * @private
       */
      this._isCircular = isBoolean(options.isCircular) ? options.isCircular : true;

      if (this.isVariable) {
        this.mixin(remoteDataMethods);
      } else {
        this.mixin(staticDataMethods);
      }

      this._initData(data);
    },

    /**
     * Mixin
     * @param {Object} methods A method set [staticDataMethods|remoteDataMethods]
     */
    mixin: function(methods) {
      extend(this, methods);
    }
  }
);

module.exports = Data;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is a string or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is a boolean or not.
 *  If the given variable is a boolean, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is boolean?
 * @memberof module:type
 */
function isBoolean(obj) {
  return typeof obj === 'boolean' || obj instanceof Boolean;
}

module.exports = isBoolean;


/***/ })
/******/ ]);
});
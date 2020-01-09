/*!
 * tui-rolling.js
 * @version 2.2.1
 * @author NHNEnt FE Development Lab <dl_javascript@nhnent.com>
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("tui-code-snippet"));
	else if(typeof define === 'function' && define.amd)
		define(["tui-code-snippet"], factory);
	else if(typeof exports === 'object')
		exports["Rolling"] = factory(require("tui-code-snippet"));
	else
		root["tui"] = root["tui"] || {}, root["tui"]["Rolling"] = factory((root["tui"] && root["tui"]["util"]));
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Rolling component core.
	 * @author NHN Ent. FE dev team.<dl_javascript@nhnent.com>
	 */

	'use strict';

	var snippet = __webpack_require__(1);

	var Roller = __webpack_require__(2);
	var Data = __webpack_require__(4);

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
	 * var Rolling = tui.Rolling; // or require('tui-rolling')
	 * var instance = new tui.Rolling({
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
	var Rolling = snippet.defineClass(/** @lends Rolling.prototype */{
	    init: function(options, data) { // eslint-disable-line complexity
	        var isAuto = !!options.isAuto;

	        /**
	         * Whether ga tracking or not
	         * @type {Boolean}
	         * @private
	         */
	        var usageStatistics = snippet.isExisty(options.usageStatistics) ? options.usageStatistics : true;

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
	            snippet.sendHostname('rolling', 'UA-129987462-1');
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
	            throw new Error('#DataError : Variable Rolling can\'t use moveTo');
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
	        this._timer = window.setInterval(snippet.bind(function() {
	            this._model.changeCurrent(this._flow);
	            this._roller.move(this._model.getData());
	        }, this), this._delayTime);
	    }
	});

	snippet.CustomEvents.mixin(Rolling);

	module.exports = Rolling;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Roller
	 * @author NHN Ent. FE dev team.<dl_javascript@nhnent.com>
	 */

	'use strict';

	var snippet = __webpack_require__(1);

	var motion = __webpack_require__(3);

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
	    _setContainer: function() { // eslint-disable-line complexity
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
	            if (snippet.isHTMLTag(firstChild)) {
	                wrap = firstChild;
	            }
	            next = firstChild && firstChild.nextSibling;
	            if (snippet.isHTMLTag(next)) {
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

	        snippet.forEach(panelSet, function(value, key) {
	            panelSet[key] = this._makeElement(info.tag, info.className, key);
	        }, this);

	        panelSet.center.innerHTML = initData;
	        this._container.appendChild(panelSet.center);
	    },

	    /**
	     * Get element info
	     * @returns {object} Element info
	     * @private
	     */
	    _getElementInfo: function() { // eslint-disable-line complexity
	        var panel = this._container.firstChild;
	        var options = this._options;
	        var tag, className;

	        if (snippet.isString(options.panelTag)) {
	            tag = (options.panelTag).split('.')[0];
	            className = (options.panelTag).split('.')[1] || '';
	        } else {
	            if (!snippet.isHTMLTag(panel)) {
	                panel = panel && panel.nextSibling;
	            }
	            tag = snippet.isHTMLTag(panel) ? panel.tagName : 'li';
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
	        var flow = this._flow,
	            movePanel = this.panel[flow],
	            style = movePanel.style,
	            dest = (flow === 'prev' ? -this._distance : this._distance) + 'px';

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
	         * instance.on('beforeMove', function(ev) {
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

	        snippet.forEach(this._targets, function(element, index) {
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
	            step: snippet.bind(function(delta) {
	                snippet.forEach(this._targets, function(element, index) {
	                    var dest = (flow === 'prev') ? distance * delta : -(distance * delta);
	                    element.style[range] = start[index] + dest + 'px';
	                });
	            }, this),
	            complete: snippet.bind(this.complete, this)
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

	        if (snippet.isNotEmpty(this._queue)) {
	            first = this._queue.shift();
	            this.move(first.data, first.duration, first.flow);
	        } else {
	            /**
	             * @event Rolling#afterMove
	             * @example
	             * instance.on('afterMove', function() {
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
	        var element = this._element,
	            firstChild = element.firstChild,
	            wrap;
	        if (this._isDrawn) {
	            wrap = snippet.isHTMLTag(firstChild) ? firstChild : firstChild.nextSibling;
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
	            result = (moved + castDist) > 0 ? -moved : castDist;
	        } else {
	            if (this._isCircular) {
	                return -this._distance;
	            }
	            result = castDist > (this.limit + moved) ? (-this.limit - moved) : -castDist;
	        }

	        return result;
	    },

	    /**
	     * Set postion
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
	            step: snippet.bind(function(delta) {
	                var dest = distance * delta;
	                container.style[range] = start + dest + 'px';
	            }, this),
	            complete: snippet.bind(this.complete, this)
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
	            snippet.forEach(moveset, function(element) {
	                this._container.insertBefore(element, standard);
	            }, this);
	        } else {
	            snippet.forEach(moveset, function(element) {
	                this._container.appendChild(element);
	            }, this);
	        }
	        this._container.style[range] = parseInt(this._container.style[range], 10) - containerMoveDist + 'px';
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
	        var isPrev = (flow === 'prev');
	        var count = (this._rollunit !== 'page') ? 1 : itemcount;
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
	        var container = this._container;
	        var panels = container.childNodes;

	        panels = snippet.toArray(panels);

	        this._panels = snippet.filter(panels, function(element) {
	            return snippet.isHTMLTag(element);
	        });
	        snippet.forEach(this._panels, function(panel, index) {
	            panel.className += ' __index' + index + '__';
	        });
	    },

	    /**
	     * Set panel list
	     * @private
	     */
	    _setPanel: function() {
	        var container = this._container;
	        var panels = container.childNodes;

	        panels = snippet.toArray(panels);

	        this._panels = snippet.filter(panels, function(element) {
	            return snippet.isHTMLTag(element);
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
	        var wrapArea = this._rollunit === 'page' ? (distance / this._itemcount) : distance * panels.length;
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

	        snippet.forEach(panels, function(panel, index) {
	            if (panel.className.indexOf('__index' + page) !== -1) {
	                if (!snippet.isExisty(dist)) {
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
	        itemDist = (this._rollunit === 'page') ? distance / itemCount : distance;
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
	var Roller = snippet.defineClass(/** @lends Roller.prototype */{
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
	        this._element = snippet.isString(options.element) ? document.getElementById(options.element) : options.element;

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
	        this._isCircular = snippet.isExisty(options.isCircular) ? options.isCircular : true;

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
	        this._unitCount = options.rollunit === 'page' ? 1 : (options.unitCount || 1);

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
	        snippet.extend(this, methods);
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
	        elementStyle.width = elementStyle.width || (element.clientWidth + 'px');
	        elementStyle.height = elementStyle.height || (element.clientHeight + 'px');
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
	        var start = new Date(),
	            id = window.setInterval(function() {
	                var timePassed = new Date() - start,
	                    progress = timePassed / options.duration,
	                    delta;
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
	});

	module.exports = Roller;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/**
	 * @fileoverview Module of motions
	 * @author NHN Ent. FE dev team.<dl_javascript@nhnent.com>
	 */

	'use strict';

	/**
	 * Rolling motion collection
	 * @namespace motion
	 * @ignore
	 */
	var motion = (function() {
	    var quadEaseIn,
	        circEaseIn,
	        quadEaseOut,
	        circEaseOut,
	        quadEaseInOut,
	        circEaseInOut;

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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview A data for move
	 * @author NHN Ent. FE dev team.<dl_javascript@nhnent.com>
	 */

	'use strict';

	var snippet = __webpack_require__(1);

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
	        var first, nodelist;

	        nodelist = snippet.map(datalist, function(data, index) {
	            var node = new Node(data);
	            node.prev = before;

	            if (before) {
	                before.next = node;
	            } else {
	                first = node;
	            }
	            if (index === (datalist.length - 1)) {
	                node.next = first;
	                first.prev = node;
	            }

	            before = node;

	            return node;
	        }, this);

	        nodelist.unshift(null);

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
	var Data = snippet.defineClass(/** @lends Data.prototype */{
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
	        this._isCircular = snippet.isBoolean(options.isCircular) ? options.isCircular : true;

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
	        snippet.extend(this, methods);
	    }
	});

	module.exports = Data;


/***/ })
/******/ ])
});
;
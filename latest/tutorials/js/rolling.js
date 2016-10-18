/**
 * component-rolling
 * @author NHNEnt FE Development Team <dl_javascript@nhnent.com>
 * @version v1.0.1
 * @license MIT
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Rolling = require('./src/js/rolling');

tui.util.defineNamespace('tui.component', {
  Rolling: Rolling
});

},{"./src/js/rolling":5}],2:[function(require,module,exports){
/**
 * Rolling motion collection 
 * @namespace motion
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
     * @param delta
     * @returns {Function}
     */
    function makeEaseIn(delta) {
        return function(progress) {
            return delta(progress);
        };
    }
    /**
     * easeOut
     * @param delta
     * @returns {Function}
     */
    function makeEaseOut(delta) {
        return function(progress) {
            return 1 - delta(1 - progress);
        };
    }

    /**
     * easeInOut
     * @param delta
     * @returns {Function}
     */
    function makeEaseInOut(delta) {
        return function(progress) {
            if (progress < 0.5) {
                return delta(2 * progress) / 2;
            } else {
                return (2 - delta(2 * (1 - progress))) / 2;
            }
        };
    }
    /**
     * Linear
     * @memberof motion
     * @method linear
     * @static
     */
    function linear(progress) {
        return progress;
    }
    function quad(progress) {
        return Math.pow(progress, 2);
    }
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

},{}],3:[function(require,module,exports){
/**
 * @fileoverview A data for move
 * @author NHN Ent. FE dev team.<dl_javascript@nhnent.com>
 * @dependency ne-code-snippet
 */



/** 
 * Data model for rolling
 * @param {Object} option A component options
 * @param {(Array|Object)} data A data of rolling
 * @constructor
 */
var Data = tui.util.defineClass(/** @lends Data.prototype */{
    init: function(option, data) {
        /**
         * Whether changable data
         * @type {Boolean}
         */
        this.isVariable = !!option.isVariable;
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
        this._current = option.initNum || 1;
        /**
         * Whehter circular
         * @type {Boolean}
         * @private
         */
        this._isCircular = tui.util.isBoolean(option.isCircular) ? option.isCircular : true;
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
        tui.util.extend(this, methods);
    }
});

/**
 * Static data method set
 * @namespace staticDataMethods
 */
var staticDataMethods = {
    /**
     * Initialize data
     * @param {Array} datalist A list that is not connected with each other
     * @returns {Array} _datalist
     * @private
     */
    _initData: function(datalist) {
        var before = null,
            first,
            nodelist;

        nodelist = tui.util.map(datalist, function(data, index) {

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
    },
    /**
     * Get current
     * @returns {number}
     */
    getCurrent: function() {
        return this._current;
    }
};

/**
 * Changable data method set
 * @namespace remoteDataMethods
 * @static
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
 * Node for each data panel
 * @namespace Node
 * @param {Object} data node data or html value
 * @constructor
 */
var Node = function(data) {

    this.prev = null;
    this.next = null;
    this.data = data;

};

module.exports = Data;

},{}],4:[function(require,module,exports){
/**
 * @fileoverview Roller 
 * @author NHN Ent. FE dev team.<dl_javascript@nhnent.com>
 * @dependency ne-code-snippet
 */
var motion = require('./motion');
/**
 * Roller that move rolling panel
 *
 * @param {Object} option The option of rolling component
 * @constructor
 */
var Roller = tui.util.defineClass(/** @lends Roller.prototype */{
    init: function(option, initData) {
        /**
         * A options
         * @type {Object}
         */
        this._option = option;
        /**
         * A root element
         * @type {(HTMLElement|String)}
         * @private
         */
        this._element = tui.util.isString(option.element) ? document.getElementById(option.element) : option.element;
        /**
         * A direction of rolling (vertical|horizontal)
         * @type {String}
         * @private
         */
        this._direction = option.direction || 'horizontal';
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
        this._motion = motion[option.motion || 'noeffect'];
        /**
         * A rolling unit
         * @type {Number}
         * @private
         */
        this._rollunit = option.unit || 'page';
        /**
         * Whether html is drawn or not
         * @type {boolean}
         * @private
         */
        this._isDrawn = !!option.isDrawn;
        /**
         * A item per page
         * @type {boolean}
         * @private
         */
        this._itemcount = option.itemcount;
        /**
         * A direction to next rolling
         * @type {String|string}
         * @private
         */
        this._flow = option.flow || 'next';
        /**
         * A animation duration
         * @type {*|number}
         * @private
         */
        this._duration = option.duration || 1000;
        /**
         * Whether circular or not
         * @type {Boolean}
         * @private
         */
        this._isCircular = tui.util.isExisty(option.isCircular) ? option.isCircular : true;
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
        this.panel = { prev: null, center: null, next: null };
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
        this._unitCount = option.rollunit === 'page' ? 1 : (option.unitCount || 1);
        /**
         * Custom event
         * @type {Object}
         * @private
         */
        this._events = {};

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

    /**
     * Mixin
     * @param {Object} methods A method set [staticDataMethods|remoteDataMethods]
     */
    mixin: function(methods) {
        tui.util.extend(this, methods);
    },

    /**
     * Masking 
     * @method
     * @private
     */
    _masking: function() {
        var element = this._element,
            elementStyle = element.style;
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

        var dist,
            elementStyle = this._element.style;

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
     * @param {Object} option A options for animating
     */
    _animate: function(option) {
        var start = new Date(),
            id = window.setInterval(function() {
                var timePassed = new Date() - start,
                    progress = timePassed / option.duration,
                    delta;
                if (progress > 1) {
                    progress = 1;
                }
                delta = option.delta(progress);

                option.step(delta);

                if (progress === 1) {
                    window.clearInterval(id);
                    option.complete();
                }
            }, option.delay || 10);
    }
});

/**
 * A roller method set for fixed panel
 * @namespace movePanelSet
 * @static
 */
var movePanelSet = {
    /**
     * Set rolling container
     * @private
     */
    _setContainer: function() {
        var option = this._option,
            element = this._element,
            firstChild = element.firstChild,
            wrap,
            next,
            tag,
            className;

        if (option.wrapperTag) {
            tag = option.wrapperTag && option.wrapperTag.split('.')[0];
            className = option.wrapperTag && option.wrapperTag.split('.')[1] || '';
            wrap = document.createElement(tag);
            if (className) {
            wrap.className = className;
            }
            this._element.innerHTML = '';
            this._element.appendChild(wrap);
        } else {
            if (tui.util.isHTMLTag(firstChild)) {
                wrap = firstChild;
            }
            next = firstChild && firstChild.nextSibling;
            if (tui.util.isHTMLTag(next)) {
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
     * @private
     */
    _setPanel: function(initData) {
        var panel = this._container.firstChild,
            panelSet = this.panel,
            option = this._option,
            tag,
            className,
            key;

        if (tui.util.isString(option.panelTag)) {
            tag = (option.panelTag).split('.')[0];
            className = (option.panelTag).split('.')[1] || '';
        } else {
            if (!tui.util.isHTMLTag(panel)) {
                panel = panel && panel.nextSibling;
            }
            tag = tui.util.isHTMLTag(panel) ? panel.tagName : 'li';
            className = (panel && panel.className) || '';
        }

        this._container.innerHTML = '';

        for (key in panelSet) {
            panelSet[key] = this._makeElement(tag, className, key);
        }

        panelSet.center.innerHTML = initData;
        this._container.appendChild(panelSet.center);

    },
    /**
     * Make HTML Element     
     * @param {String} tag A tag name
     * @param {String} className A class name
     * @param {String} key A class key name
     * @returns {HTMLElement}
     * @private
     */
    _makeElement: function(tag, className, key) {
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
        if (flow === 'prev') {
            return [0, this._distance];
        } else {
            return [-this._distance, 0];
        }
    },

    /**
     * Get start points
     * @returns {Array}
     * @private
     */
    _getStartSet: function() {
        var panel = this.panel,
            flow = this._flow,
            range = this._range,
            isPrev = flow === 'prev',
            first = isPrev ? panel['prev'] : panel['center'],
            second = isPrev ? panel['center'] : panel['next'];
        return [parseInt(first.style[range], 10), parseInt(second.style[range], 10)];
    },

    /**
     * Get move target
     * @param {String} flow A flow to move
     * @private
     */
    _setTarget: function(flow) {
        this._targets = [this.panel['center']];
        if (flow === 'prev') {
            this._targets.unshift(this.panel[flow]);
        } else {
            this._targets.push(this.panel[flow]);
        }

    },
    /**
     * A panel move
     * @param {Object} data A data to update panel
     */
    move: function(data, duration, flow) {
        flow = flow || this._flow;
        if (this.status === 'idle') {
            this.status = 'run';
        } else {
            this._queueing(data, duration, flow);
            return;
        }

        /**
         * Before move custom event fire
         * @fires beforeMove
         * @param {String} data Inner HTML
         * @example
         * tui.component.RollingInstance.attach('beforeMove', function(data) {
         *    // ..... run code
         * });
         */
        var res = this.invoke('beforeMove', {data: data});

        if (!res) {
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
        var flow = this._flow,
            pos = this._getMoveSet(flow),
            range = this._range;
        tui.util.forEach(this._targets, function(element, index) {
            element.style[range] = pos[index] + 'px';
        });
        this.complete();
    },

    /**
     * Run animation
     * @private
     */
    _moveWithMotion: function(duration) {
        var flow = this._flow,
            start = this._getStartSet(flow),
            distance = this._distance,
            range = this._range;

        duration = duration || this._duration;

        this._animate({
            delay: 10,
            duration: duration || 1000,
            delta: this._motion,
            step: tui.util.bind(function(delta) {
                tui.util.forEach(this._targets, function(element, index) {
                    var dest = (flow === 'prev') ? distance * delta : -(distance * delta);
                    element.style[range] = start[index] + dest + 'px';

                });
            }, this),
            complete: tui.util.bind(this.complete, this)
        });
    },

    /**
     * Complate callback
     */
    complete: function() {
        var panel = this.panel,
            tempPanel,
            flow = this._flow;

        tempPanel = panel['center'];
        panel['center'] = panel[flow];
        panel[flow] = tempPanel;

        this._targets = null;
        this._container.removeChild(tempPanel);
        this.status = 'idle';

        if (tui.util.isNotEmpty(this._queue)) {
            var first = this._queue.shift();
            this.move(first.data, first.duration, first.flow);
        } else {
            /**
             * After custom event run
             * @fires afterMove
             * @example
             * tui.component.RollingInstance.attach('afterMove', function() {
             *    // ..... run code
             * });
             */
            this.fire('afterMove');
        }
    }
};

/**
 * Container move methods
 * @namespace moveContainerSet
 * @static
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
            wrap = tui.util.isHTMLTag(firstChild) ? firstChild : firstChild.nextSibling;
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
        if (flow === 'next') {
            if (this.limit > -moved) {
                return false;
            } else {
                return true;
            }
        } else {
            if(moved < 0) {
                return false;
            } else {
                return true;
            }
        }
    },

    /**
     * Get current position
     * @private
     */
    _getCurrentPosition: function() {
        return parseInt(this._container.style[this._range], 10);
    },

    /**
     * Move panels
     * @param {Object} data A data to update panel
     */
    move: function(duration, flow) {
        flow = flow || this._flow;

        if (this.status === 'idle') {
            this.status = 'run';
        } else {
            this._queueing(duration, flow);
            return;
        }

        /**
         * Fire before custom event
         * @fires beforeMove
         * @param {String} data inner HTML
         * @example
         * tui.component.RollingInstance.attach('beforeMove', function(data) {
         *    // ..... run code
         * });
         */
        var res = this.invoke('beforeMove');
        if (!res) {
            this.status = 'idle';
            return;
        }

        if(!this._isCircular && this._isLimitPoint(flow)) {
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
        var moved = this._getCurrentPosition(),
            castDist = this._distance * this._unitCount;
        if (flow === 'prev') {
            if (this._isCircular) {
                return this._distance;
            }
            return (moved + castDist) > 0 ? -moved : castDist;
        } else {
            if (this._isCircular) {
                return -this._distance;
            }
            return castDist > (this.limit + moved)? (-this.limit - moved) : -castDist;
        }
    },

    /**
     * Set postion
     * @private
     */
    _moveWithoutMotion: function() {
        var flow = this._flow,
            pos = this._getMoveDistance(flow),
            range = this._range,
            start = parseInt(this._container.style[range], 10);
        this._container.style[range] = start + pos + 'px';
        this.complete();
    },

    /**
     * Run animation
     * @private
     */
    _moveWithMotion: function(duration) {
        var flow = this._flow,
            container = this._container,
            range = this._range,
            start = parseInt(container.style[range], 10),
            distance = this._getMoveDistance(flow);
        duration = duration || this._duration;

        this._animate({
            delay: 10,
            duration: duration || 1000,
            delta: this._motion,
            step: tui.util.bind(function(delta) {
                var dest = distance * delta;
                container.style[range] = start + dest + 'px';
            }, this),
            complete: tui.util.bind(this.complete, this)
        });
    },

    /**
     * Rotate panel
     * @param {String} flow A flow to rotate panel
     * @private
     */
    _rotatePanel: function(flow) {

        flow = flow || this._flow;

        var standard,
            moveset,
            movesetLength,
            range = this._range,
            containerMoveDist,
            isPrev = flow === 'prev',
            basis = this._basis;

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
            tui.util.forEach(moveset, function(element) {
                this._container.insertBefore(element, standard);
            }, this);
        } else {
            tui.util.forEach(moveset, function(element) {
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
        var i,
            len;
        for(i = 0, len = colleciton.length; i < len; i++) {
            if (colleciton[i] === item) {
                return true;
            }
        }
    },

    /**
     * Find rotate panel by direction
     * @param {String} flow A direction
     * @private
     */
    _setPartOfPanels: function(flow) {
        var itemcount = this._itemcount,
            isPrev = (flow === 'prev'),
            count = (this._rollunit !== 'page') ? 1 : itemcount,
            dist = isPrev ? -count : count,
            point = isPrev ? [dist] : [0, dist];

        this._movePanelSet = this._panels.slice.apply(this._panels, point);
    },

    /**
     * Get display item count
     * @private
     */
    _setItemCount: function() {
        var element = this._element,
            elementStyle = element.style,
            elementWidth = parseInt(elementStyle.width || element.clientWidth, 10),
            elementHeight = parseInt(elementStyle.height || element.clientHeight, 10),
            item = this._element.getElementsByTagName('li')[0], // 마크업은 li로 픽스
            itemStyle = item.style,
            itemWidth = parseInt(itemStyle.width || item.clientWidth, 10),
            itemHeight = parseInt(itemStyle.height || item.clientHeight, 10);

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
        var container = this._container,
            panels = container.childNodes,
            i,
            arr;

        panels = tui.util.toArray(panels);

        this._panels = tui.util.filter(panels, function(element) {
            return tui.util.isHTMLTag(element);
        });
        tui.util.forEach(this._panels, function(panel, index) {
            panel.className += ' __index' + index + '__';
        });
    },

    /**
     * Set panel list
     * @private
     */
    _setPanel: function() {
        var container = this._container,
            panels = container.childNodes,
            i,
            arr;

        panels = tui.util.toArray(panels);

        this._panels = tui.util.filter(panels, function(element) {
            return tui.util.isHTMLTag(element);
        });
        this._basis = this._basis || 0;
        this._setBoundary();
    },

    /**
     * Set fixed area incircular rolling
     * @param {String} flow A direction
     * @returns {Boolean}
     * @private
     */
    _setBoundary: function() {
        var panels = this._panels,
            distance = this._distance,
            range = this._range,
            rangeDistance = parseInt(this._element.style[range === 'left' ? 'width' : 'height'], 10),
            wrapArea = this._rollunit === 'page' ? (distance / this._itemcount) : distance * panels.length,
            limitDist = wrapArea - rangeDistance;
        this.limit = limitDist;
    },

    /**
     * Get current index on selected page
     * @param {Number} page A move panel number
     * @returns {number}
     * @private
     */
    _checkPagePosition: function(page) {
        var dist = null,
            panels = this._panels;
        tui.util.forEach(panels, function(panel, index) {
            if (panel.className.indexOf('__index' + page) !== -1) {
                if (!tui.util.isExisty(dist)) {
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
        page = Math.max(page, 0);
        page = Math.min(page, this._panels.length - 1);

        var pos = this._checkPagePosition(page),
            itemCount = this._itemcount,
            panelCount = this._panels.length,
            distance = this._distance,
            itemDist = this._rollunit === 'page' ? distance / itemCount : distance,
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

tui.util.CustomEvents.mixin(Roller);
module.exports = Roller;

},{"./motion":2}],5:[function(require,module,exports){
/**
 * @fileoverview Rolling component core.
 * @author NHN Ent. FE dev team.<dl_javascript@nhnent.com>
 * @dependency tui-code-snippet ~v.1.1.0
 */

var Roller = require('./roller');
var Data = require('./rolldata');
/**
 * Rolling core object
 * @param {Object} option The options 
 *      @param {HTMLElement|String} option.element A root element or id that will become root element's
 *      @param {Boolean} [option.isVariable=true|false] Whether the data is changable or not [default value is false]
 *      @param {Boolean} [option.isCircular=true|false] Whether circular or not [default value is true but isVariable true case]
 *      @param {Boolean} [option.auto=true|false] Whether auto rolling or not [default value is false]
 *      @param {Number} [option.delayTime=1000|...] Distance time of auto rolling. [defulat 3 second]
 *      @param {Number} [option.direction='horizontal|vertical'] The flow direction panel [default value is horizontal]
 *      @param {Number} [option.duration='1000|...] A move duration
 *      @param {Number} [option.initNum='0|...] Initalize selected rolling panel number
 *      @param {String} [option.motion='linear|[quad]easeIn|[quad]easeOut|[quad]easeInOut|circEaseIn|circEaseOut|circEaseInOut] A effect name [default value is noeffect]
 *      @param {String} [option.unit='item|page'] A unit of rolling
 *      @param {String} [option.wrapperTag='ul.className|div.className'] A tag name for panel warpper, connect tag name with class name by dots. [defualt value is ul]
 *      @param {String} [option.panelTag='li.className'] A tag name for panel, connect tag name with class by dots [default value is li]
 * @param {Array|String} data A data of rolling panels
 *
 * @example
 * var roll = new tui.component.Rolling({
 *      element: document.getElementById('rolling'),
 *      initNum: 0,
 *      direction: 'horizontal',
 *      isVariable: true,
 *      unit: 'page',
 *      isAuto: false,
 *      motion: 'easeInOut',
 *      duration:2000
 * }, ['<div>data1</div>','<div>data2</div>', '<div>data3</div>']);
 * @constructor
 */
var Rolling = tui.util.defineClass(/** @lends Rolling.prototype */{
    /**
     * Initialize
     * */
    init: function(option, data) {
        /**
         * Option object
         * @type {Object}
         * @private
         */
        this._option = option;
        /**
         * The flow of next move
         * @type {String|string}
         * @private
         */
        this._flow = option.flow || 'next';
        /**
         * Whether html is drawn or not
         * @type {boolean}
         * @private
         */
        this._isDrawn = !!option.isDrawn;
        /**
         * Auto rolling timer
         * @type {null}
         * @private
         */
        this._timer = null;
        /**
         * Auto rolling delay time
         */
        this.delayTime = this.delayTime || 3000;
        /**
         * A model for rolling data
         * @type {Data}
         * @private
         */
        this._model = !option.isDrawn ? new Data(option, data) : null;
        /**
         * A rolling action object
         * @type {Roller}
         * @private
         */
        this._roller = new Roller(option, this._model && this._model.getData());

        if (option.initNum) {
            this.moveTo(option.initNum);
        }
        if (!!option.isAuto) {
            this.auto();
        }
    },

    /**
     * Roll the rolling component. If there is no data, the component have to have with fixed data
     * @api
     * @param {String} data A rolling data
     * @param {String} [flow] A direction rolling
     * @example
     * rolling.roll('<div>data</div>', 'horizontal');
     */
    roll: function(data, flow) {
        flow = flow || this._flow;

        // If rolling status is not idle, return
        if (this._roller.status !== 'idle') {
            return;
        }

        if (this._option.isVariable) {
            if (!data) {
                throw new Error('roll must run with data');
            }

            this.setFlow(flow);
            this._roller.move(data);

        } else {
            var overBoundary;
            this.setFlow(flow);
            if (this._model) {
                overBoundary = this._model.changeCurrent(flow);
                data = this._model.getData();
            }
            if(!overBoundary) {
                this._roller.move(data);
            }
        }

    },

    /**
     * Set direction
     * @api
     * @param {String} flow A direction of rolling
     * @example
     * rolling.setFlow('horizontal');
     */
    setFlow: function(flow) {
        this._flow = flow;
        this._roller.setFlow(flow);
    },

    /**
     * Move to target page
     * @api
     * @param {Number} page A target page
     * @example
     * rolling.moveTo(3);
     */
    moveTo: function(page) {

        if (this._isDrawn) {
            this._roller.moveTo(page);
            return;
        }

        var len = this._model.getDataListLength(),
            max = Math.min(len, page),
            min = Math.max(1, page),
            current = this._model.getCurrent(),
            duration,
            absInterval,
            isPrev,
            flow,
            i;

        if (isNaN(Number(page))) {
            throw new Error('#PageError moveTo method have to run with page');
        }
        if (this._option.isVariable) {
            throw new Error('#DataError : Variable Rolling can\'t use moveTo');
        }

        isPrev = this.isNegative(page - current);
        page = isPrev ? min : max;
        flow = isPrev ? 'prev' : 'next';
        absInterval = Math.abs(page - current);
        duration = this._option.duration / absInterval;

        this.setFlow(flow);

        for (i = 0; i < absInterval; i++) {
            this._model.changeCurrent(flow);
            this._roller.move(this._model.getData(), duration);
        }

    },

    /**
     * Check the number is negative or not
     * @param number A number to figure out
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
     * @api
     * @example
     * rolling.auto();
     */
    auto: function() {
        this.stop();
        this._timer = window.setInterval(tui.util.bind(function() {
            this._model.changeCurrent(this._flow);
            this._roller.move(this._model.getData());

        }, this), this.delayTime);
    },

    /**
     * Attach custom event
     * @param {String} type A event type
     * @param {Function} callback A callback function for custom event 
     */
    attach: function(type, callback) {
        this._roller.on(type, callback);
    },

    /**
     * Run custom event
     * @param {String} type A event type
     * @param {Object} [options] A data from fire event
     */
    fire: function(type, options) {
        this._roller.fire(type, options);
    }
});

module.exports = Rolling;

},{"./rolldata":3,"./roller":4}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInNyYy9qcy9tb3Rpb24uanMiLCJzcmMvanMvcm9sbGRhdGEuanMiLCJzcmMvanMvcm9sbGVyLmpzIiwic3JjL2pzL3JvbGxpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3YzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgUm9sbGluZyA9IHJlcXVpcmUoJy4vc3JjL2pzL3JvbGxpbmcnKTtcblxudHVpLnV0aWwuZGVmaW5lTmFtZXNwYWNlKCd0dWkuY29tcG9uZW50Jywge1xuICBSb2xsaW5nOiBSb2xsaW5nXG59KTtcbiIsIi8qKlxuICogUm9sbGluZyBtb3Rpb24gY29sbGVjdGlvbiBcbiAqIEBuYW1lc3BhY2UgbW90aW9uXG4gKi9cbnZhciBtb3Rpb24gPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHF1YWRFYXNlSW4sXG4gICAgICAgIGNpcmNFYXNlSW4sXG4gICAgICAgIHF1YWRFYXNlT3V0LFxuICAgICAgICBjaXJjRWFzZU91dCxcbiAgICAgICAgcXVhZEVhc2VJbk91dCxcbiAgICAgICAgY2lyY0Vhc2VJbk91dDtcblxuICAgIC8qKlxuICAgICAqIGVhc2VJblxuICAgICAqIEBwYXJhbSBkZWx0YVxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtYWtlRWFzZUluKGRlbHRhKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihwcm9ncmVzcykge1xuICAgICAgICAgICAgcmV0dXJuIGRlbHRhKHByb2dyZXNzKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogZWFzZU91dFxuICAgICAqIEBwYXJhbSBkZWx0YVxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtYWtlRWFzZU91dChkZWx0YSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24ocHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIHJldHVybiAxIC0gZGVsdGEoMSAtIHByb2dyZXNzKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBlYXNlSW5PdXRcbiAgICAgKiBAcGFyYW0gZGVsdGFcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gICAgICovXG4gICAgZnVuY3Rpb24gbWFrZUVhc2VJbk91dChkZWx0YSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24ocHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIGlmIChwcm9ncmVzcyA8IDAuNSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWx0YSgyICogcHJvZ3Jlc3MpIC8gMjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICgyIC0gZGVsdGEoMiAqICgxIC0gcHJvZ3Jlc3MpKSkgLyAyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBMaW5lYXJcbiAgICAgKiBAbWVtYmVyb2YgbW90aW9uXG4gICAgICogQG1ldGhvZCBsaW5lYXJcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGluZWFyKHByb2dyZXNzKSB7XG4gICAgICAgIHJldHVybiBwcm9ncmVzcztcbiAgICB9XG4gICAgZnVuY3Rpb24gcXVhZChwcm9ncmVzcykge1xuICAgICAgICByZXR1cm4gTWF0aC5wb3cocHJvZ3Jlc3MsIDIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjaXJjKHByb2dyZXNzKSB7XG4gICAgICAgIHJldHVybiAxIC0gTWF0aC5zaW4oTWF0aC5hY29zKHByb2dyZXNzKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcXVlZCArIGVhc2VJblxuICAgICAqIEBtZW1iZXJvZiBtb3Rpb25cbiAgICAgKiBAbWV0aG9kIHF1YWRFYXNlSW5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcXVhZEVhc2VJbiA9IG1ha2VFYXNlSW4ocXVhZCk7XG4gICAgLyoqXG4gICAgICogY2lyYyArIGVhc2VJblxuICAgICAqIEBtZW1iZXJvZiBtb3Rpb25cbiAgICAgKiBAbWV0aG9kIGNpcmNFYXNlSW5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgICAgIGNpcmNFYXNlSW4gPSBtYWtlRWFzZUluKGNpcmMpO1xuICAgIC8qKlxuICAgICAqIHF1YWQgKyBlYXNlT3V0XG4gICAgICogQG1lbWJlcm9mIG1vdGlvblxuICAgICAqIEBtZXRob2QgcXVhZEVhc2VPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgICAgIHF1YWRFYXNlT3V0ID0gbWFrZUVhc2VPdXQocXVhZCk7XG4gICAgLyoqXG4gICAgICogY2lyYyArIGVhc2VPdXRcbiAgICAgKiBAbWVtYmVyb2YgbW90aW9uXG4gICAgICogQG1ldGhvZCBjaXJjRWFzZU91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBjaXJjRWFzZU91dCA9IG1ha2VFYXNlT3V0KGNpcmMpO1xuICAgIC8qKlxuICAgICAqIHF1YWQgKyBlYXNlSW5PdXRcbiAgICAgKiBAbWVtYmVyb2YgbW90aW9uXG4gICAgICogQG1ldGhvZCBxdWFkRWFzZUluT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHF1YWRFYXNlSW5PdXQgPSBtYWtlRWFzZUluT3V0KHF1YWQpO1xuICAgIC8qKlxuICAgICAqIGNpcmMgKyBlYXNlSW5PdXRcbiAgICAgKiBAbWVtYmVyb2YgbW90aW9uXG4gICAgICogQG1ldGhvZCBjaXJjRWFzZUluT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIGNpcmNFYXNlSW5PdXQgPSBtYWtlRWFzZUluT3V0KGNpcmMpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbGluZWFyOiBsaW5lYXIsXG4gICAgICAgIGVhc2VJbjogcXVhZEVhc2VJbixcbiAgICAgICAgZWFzZU91dDogcXVhZEVhc2VPdXQsXG4gICAgICAgIGVhc2VJbk91dDogcXVhZEVhc2VJbk91dCxcbiAgICAgICAgcXVhZEVhc2VJbjogcXVhZEVhc2VJbixcbiAgICAgICAgcXVhZEVhc2VPdXQ6IHF1YWRFYXNlT3V0LFxuICAgICAgICBxdWFkRWFzZUluT3V0OiBxdWFkRWFzZUluT3V0LFxuICAgICAgICBjaXJjRWFzZUluOiBjaXJjRWFzZUluLFxuICAgICAgICBjaXJjRWFzZU91dDogY2lyY0Vhc2VPdXQsXG4gICAgICAgIGNpcmNFYXNlSW5PdXQ6IGNpcmNFYXNlSW5PdXRcbiAgICB9O1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBtb3Rpb247XG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgQSBkYXRhIGZvciBtb3ZlXG4gKiBAYXV0aG9yIE5ITiBFbnQuIEZFIGRldiB0ZWFtLjxkbF9qYXZhc2NyaXB0QG5obmVudC5jb20+XG4gKiBAZGVwZW5kZW5jeSBuZS1jb2RlLXNuaXBwZXRcbiAqL1xuXG5cblxuLyoqIFxuICogRGF0YSBtb2RlbCBmb3Igcm9sbGluZ1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbiBBIGNvbXBvbmVudCBvcHRpb25zXG4gKiBAcGFyYW0geyhBcnJheXxPYmplY3QpfSBkYXRhIEEgZGF0YSBvZiByb2xsaW5nXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIERhdGEgPSB0dWkudXRpbC5kZWZpbmVDbGFzcygvKiogQGxlbmRzIERhdGEucHJvdG90eXBlICove1xuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbiwgZGF0YSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogV2hldGhlciBjaGFuZ2FibGUgZGF0YVxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaXNWYXJpYWJsZSA9ICEhb3B0aW9uLmlzVmFyaWFibGU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGRhdGEgbGlzdFxuICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9kYXRhbGlzdCA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGRhdGFcbiAgICAgICAgICogQHR5cGUge05vZGV9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9kYXRhID0gbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgaW5pdCBudW1iZXJcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2N1cnJlbnQgPSBvcHRpb24uaW5pdE51bSB8fCAxO1xuICAgICAgICAvKipcbiAgICAgICAgICogV2hlaHRlciBjaXJjdWxhclxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2lzQ2lyY3VsYXIgPSB0dWkudXRpbC5pc0Jvb2xlYW4ob3B0aW9uLmlzQ2lyY3VsYXIpID8gb3B0aW9uLmlzQ2lyY3VsYXIgOiB0cnVlO1xuICAgICAgICBpZiAodGhpcy5pc1ZhcmlhYmxlKSB7XG4gICAgICAgICAgICB0aGlzLm1peGluKHJlbW90ZURhdGFNZXRob2RzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubWl4aW4oc3RhdGljRGF0YU1ldGhvZHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faW5pdERhdGEoZGF0YSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBNaXhpblxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBtZXRob2RzIEEgbWV0aG9kIHNldCBbc3RhdGljRGF0YU1ldGhvZHN8cmVtb3RlRGF0YU1ldGhvZHNdXG4gICAgICovXG4gICAgbWl4aW46IGZ1bmN0aW9uKG1ldGhvZHMpIHtcbiAgICAgICAgdHVpLnV0aWwuZXh0ZW5kKHRoaXMsIG1ldGhvZHMpO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIFN0YXRpYyBkYXRhIG1ldGhvZCBzZXRcbiAqIEBuYW1lc3BhY2Ugc3RhdGljRGF0YU1ldGhvZHNcbiAqL1xudmFyIHN0YXRpY0RhdGFNZXRob2RzID0ge1xuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgZGF0YVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGRhdGFsaXN0IEEgbGlzdCB0aGF0IGlzIG5vdCBjb25uZWN0ZWQgd2l0aCBlYWNoIG90aGVyXG4gICAgICogQHJldHVybnMge0FycmF5fSBfZGF0YWxpc3RcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pbml0RGF0YTogZnVuY3Rpb24oZGF0YWxpc3QpIHtcbiAgICAgICAgdmFyIGJlZm9yZSA9IG51bGwsXG4gICAgICAgICAgICBmaXJzdCxcbiAgICAgICAgICAgIG5vZGVsaXN0O1xuXG4gICAgICAgIG5vZGVsaXN0ID0gdHVpLnV0aWwubWFwKGRhdGFsaXN0LCBmdW5jdGlvbihkYXRhLCBpbmRleCkge1xuXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG5ldyBOb2RlKGRhdGEpO1xuICAgICAgICAgICAgbm9kZS5wcmV2ID0gYmVmb3JlO1xuXG4gICAgICAgICAgICBpZiAoYmVmb3JlKSB7XG4gICAgICAgICAgICAgICAgYmVmb3JlLm5leHQgPSBub2RlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmaXJzdCA9IG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IChkYXRhbGlzdC5sZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgICAgIG5vZGUubmV4dCA9IGZpcnN0O1xuICAgICAgICAgICAgICAgIGZpcnN0LnByZXYgPSBub2RlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiZWZvcmUgPSBub2RlO1xuXG4gICAgICAgICAgICByZXR1cm4gbm9kZTtcblxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgbm9kZWxpc3QudW5zaGlmdChudWxsKTtcbiAgICAgICAgdGhpcy5fZGF0YWxpc3QgPSBub2RlbGlzdDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGluZGV4IGRhdGFcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggQSBpbmRleCB0byBnZXRcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgICAqL1xuICAgIGdldERhdGE6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhbGlzdFtpbmRleCB8fCB0aGlzLl9jdXJyZW50XS5kYXRhO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgbGlzdCBsZW5ndGhcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0RGF0YUxpc3RMZW5ndGg6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YWxpc3QubGVuZ3RoIC0gMTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IG5leHQgZGF0YVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBBIG5leHQgaW5kZXhcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZ2V0UHJldkRhdGE6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhbGlzdFtpbmRleCB8fCB0aGlzLl9jdXJyZW50XS5wcmV2LmRhdGE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBwcmV2IGRhdGFcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggQSBwcmV2IGluZGV4XG4gICAgICogQHJldHVybnMge1N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldE5leHREYXRhOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YWxpc3RbaW5kZXggfHwgdGhpcy5fY3VycmVudF0ubmV4dC5kYXRhO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2UgY3VycmVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmbG93IEEgZGlyZWN0aW9uXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBjaGFuZ2VDdXJyZW50OiBmdW5jdGlvbihmbG93KSB7XG4gICAgICAgIHZhciBsZW5ndGggPSB0aGlzLmdldERhdGFMaXN0TGVuZ3RoKCk7XG4gICAgICAgIGlmIChmbG93ID09PSAncHJldicpIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQgLT0gMTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50IDwgMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQgPSB0aGlzLl9pc0NpcmN1bGFyID8gbGVuZ3RoIDogMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQgKz0gMTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50ID4gbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudCA9IHRoaXMuX2lzQ2lyY3VsYXIgPyAxIDogbGVuZ3RoO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBHZXQgY3VycmVudFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0Q3VycmVudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50O1xuICAgIH1cbn07XG5cbi8qKlxuICogQ2hhbmdhYmxlIGRhdGEgbWV0aG9kIHNldFxuICogQG5hbWVzcGFjZSByZW1vdGVEYXRhTWV0aG9kc1xuICogQHN0YXRpY1xuICovXG52YXIgcmVtb3RlRGF0YU1ldGhvZHMgPSB7XG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZSBkYXRhXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGEgQSBkYXRhIHRvIGRyYXdcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pbml0RGF0YTogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGlzLl9kYXRhID0gbmV3IE5vZGUoZGF0YSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBjdXJyZW50IGRhdGEgb3Igc29tZSBkYXRhIGJ5IGluZGV4XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IEEgaW5kZXggb2YgZGF0YVxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAgICovXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhLmRhdGE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBkYXRhXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgWydwcmV2fG5leHQnXSBBIGRhdGEgaW5kZXhcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSBBIGRhdGEgaW4gcm9sbGluZyBjb21wb25lbnRcbiAgICAgKi9cbiAgICBzZXREYXRhOiBmdW5jdGlvbih0eXBlLCBkYXRhKSB7XG4gICAgICAgIHRoaXMuX2RhdGFbdHlwZV0gPSBuZXcgTm9kZShkYXRhKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRGlzY29ubmVjdCBkYXRhXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgWydwcmV2fG5leHQnXSBSZXdyaXRlIGRhdGFcbiAgICAgKi9cbiAgICBzZXZlckxpbms6IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLl9kYXRhO1xuICAgICAgICB0aGlzLl9kYXRhID0gdGhpcy5fZGF0YVt0eXBlXTtcbiAgICAgICAgZGF0YVt0eXBlXSA9IG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBwcmV2aW91cyBEYXRhXG4gICAgICogQHJldHVybnMge1N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldFByZXZEYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGEucHJldiAmJiB0aGlzLl9kYXRhLnByZXYuZGF0YTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IG5leHQgZGF0YVxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBnZXROZXh0RGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhLm5leHQgJiYgdGhpcy5fZGF0YS5uZXh0LmRhdGE7XG4gICAgfVxufTtcblxuLyoqXG4gKiBOb2RlIGZvciBlYWNoIGRhdGEgcGFuZWxcbiAqIEBuYW1lc3BhY2UgTm9kZVxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgbm9kZSBkYXRhIG9yIGh0bWwgdmFsdWVcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgTm9kZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgIHRoaXMucHJldiA9IG51bGw7XG4gICAgdGhpcy5uZXh0ID0gbnVsbDtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGE7XG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgUm9sbGVyIFxuICogQGF1dGhvciBOSE4gRW50LiBGRSBkZXYgdGVhbS48ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICogQGRlcGVuZGVuY3kgbmUtY29kZS1zbmlwcGV0XG4gKi9cbnZhciBtb3Rpb24gPSByZXF1aXJlKCcuL21vdGlvbicpO1xuLyoqXG4gKiBSb2xsZXIgdGhhdCBtb3ZlIHJvbGxpbmcgcGFuZWxcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uIFRoZSBvcHRpb24gb2Ygcm9sbGluZyBjb21wb25lbnRcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgUm9sbGVyID0gdHVpLnV0aWwuZGVmaW5lQ2xhc3MoLyoqIEBsZW5kcyBSb2xsZXIucHJvdG90eXBlICove1xuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbiwgaW5pdERhdGEpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgb3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fb3B0aW9uID0gb3B0aW9uO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSByb290IGVsZW1lbnRcbiAgICAgICAgICogQHR5cGUgeyhIVE1MRWxlbWVudHxTdHJpbmcpfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IHR1aS51dGlsLmlzU3RyaW5nKG9wdGlvbi5lbGVtZW50KSA/IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9wdGlvbi5lbGVtZW50KSA6IG9wdGlvbi5lbGVtZW50O1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBkaXJlY3Rpb24gb2Ygcm9sbGluZyAodmVydGljYWx8aG9yaXpvbnRhbClcbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IG9wdGlvbi5kaXJlY3Rpb24gfHwgJ2hvcml6b250YWwnO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBzdHlsZSBhdHRyaWJ1dGUgdG8gbW92ZSgnbGVmdCB8IHRvcCcpXG4gICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9yYW5nZSA9IHRoaXMuX2RpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnID8gJ2xlZnQnIDogJ3RvcCc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCB0byBtb3ZlXG4gICAgICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX21vdGlvbiA9IG1vdGlvbltvcHRpb24ubW90aW9uIHx8ICdub2VmZmVjdCddO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSByb2xsaW5nIHVuaXRcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3JvbGx1bml0ID0gb3B0aW9uLnVuaXQgfHwgJ3BhZ2UnO1xuICAgICAgICAvKipcbiAgICAgICAgICogV2hldGhlciBodG1sIGlzIGRyYXduIG9yIG5vdFxuICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2lzRHJhd24gPSAhIW9wdGlvbi5pc0RyYXduO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBpdGVtIHBlciBwYWdlXG4gICAgICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5faXRlbWNvdW50ID0gb3B0aW9uLml0ZW1jb3VudDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgZGlyZWN0aW9uIHRvIG5leHQgcm9sbGluZ1xuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfHN0cmluZ31cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2Zsb3cgPSBvcHRpb24uZmxvdyB8fCAnbmV4dCc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGFuaW1hdGlvbiBkdXJhdGlvblxuICAgICAgICAgKiBAdHlwZSB7KnxudW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9kdXJhdGlvbiA9IG9wdGlvbi5kdXJhdGlvbiB8fCAxMDAwO1xuICAgICAgICAvKipcbiAgICAgICAgICogV2hldGhlciBjaXJjdWxhciBvciBub3RcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9pc0NpcmN1bGFyID0gdHVpLnV0aWwuaXNFeGlzdHkob3B0aW9uLmlzQ2lyY3VsYXIpID8gb3B0aW9uLmlzQ2lyY3VsYXIgOiB0cnVlO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSByb2xsZXIgc3RhdGVcbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc3RhdHVzID0gJ2lkbGUnO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBjb250YWluZXIgdGhhdCB3aWxsIGJlIG1vdmVkXG4gICAgICAgICAqIEB0eXBlIHtIVE1MRWxlbWVudH1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lciA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGFuZ2FibGUgZGF0YSBwYW5lbFxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5wYW5lbCA9IHsgcHJldjogbnVsbCwgY2VudGVyOiBudWxsLCBuZXh0OiBudWxsIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaXhlZCByb2xsZXIgcGFuZWxzLCB0aGF0IGhhdmUgbm9kZSBsaXN0IGJ5IGFycmF5XG4gICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3BhbmVscyA9IFtdO1xuICAgICAgICAvKipcbiAgICAgICAgICogQmFzZSBlbGVtZW50IFxuICAgICAgICAgKiBAdHlwZSB7SFRNTEVsZW1lbnR9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9iYXNpcyA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSb290IGVsZW1lbnQgd2lkdGgsIGlmIG1vdmUgdW5pdCBpcyBwYWdlIHRoaXMgaXMgbW92ZSB3aWR0aFxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fZGlzdGFuY2UgPSAwO1xuICAgICAgICAvKipcbiAgICAgICAgICogTW92ZWQgcGFuZWwgdGFyZ2V0XG4gICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3RhcmdldHMgPSBbXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFF1ZXVlIGZvciBvcmRlciB0aGF0IGlzIHJlcXVlc3RlZCBkdXJpbmcgbW92aW5nIFxuICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9xdWV1ZSA9IFtdO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBtb3ZlIHVuaXQgY291bnRcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3VuaXRDb3VudCA9IG9wdGlvbi5yb2xsdW5pdCA9PT0gJ3BhZ2UnID8gMSA6IChvcHRpb24udW5pdENvdW50IHx8IDEpO1xuICAgICAgICAvKipcbiAgICAgICAgICogQ3VzdG9tIGV2ZW50XG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAgICAgICBpZiAoIXRoaXMuX2lzRHJhd24pIHtcbiAgICAgICAgICAgIHRoaXMubWl4aW4obW92ZVBhbmVsU2V0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubWl4aW4obW92ZUNvbnRhaW5lclNldCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2V0Q29udGFpbmVyKCk7XG4gICAgICAgIHRoaXMuX21hc2tpbmcoKTtcbiAgICAgICAgdGhpcy5fc2V0VW5pdERpc3RhbmNlKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2lzRHJhd24pIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRQYW5lbCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NldFBhbmVsKGluaXREYXRhKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTWl4aW5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbWV0aG9kcyBBIG1ldGhvZCBzZXQgW3N0YXRpY0RhdGFNZXRob2RzfHJlbW90ZURhdGFNZXRob2RzXVxuICAgICAqL1xuICAgIG1peGluOiBmdW5jdGlvbihtZXRob2RzKSB7XG4gICAgICAgIHR1aS51dGlsLmV4dGVuZCh0aGlzLCBtZXRob2RzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTWFza2luZyBcbiAgICAgKiBAbWV0aG9kXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfbWFza2luZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5fZWxlbWVudCxcbiAgICAgICAgICAgIGVsZW1lbnRTdHlsZSA9IGVsZW1lbnQuc3R5bGU7XG4gICAgICAgIGVsZW1lbnRTdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgICAgIGVsZW1lbnRTdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgICBlbGVtZW50U3R5bGUud2lkdGggPSBlbGVtZW50U3R5bGUud2lkdGggfHwgKGVsZW1lbnQuY2xpZW50V2lkdGggKyAncHgnKTtcbiAgICAgICAgZWxlbWVudFN0eWxlLmhlaWdodCA9IGVsZW1lbnRTdHlsZS5oZWlnaHQgfHwgKGVsZW1lbnQuY2xpZW50SGVpZ2h0ICsgJ3B4Jyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCB1bml0IG1vdmUgZGlzdGFuY2VcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRVbml0RGlzdGFuY2U6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBkaXN0LFxuICAgICAgICAgICAgZWxlbWVudFN0eWxlID0gdGhpcy5fZWxlbWVudC5zdHlsZTtcblxuICAgICAgICBpZiAodGhpcy5fZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICAgIGRpc3QgPSBlbGVtZW50U3R5bGUud2lkdGgucmVwbGFjZSgncHgnLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkaXN0ID0gZWxlbWVudFN0eWxlLmhlaWdodC5yZXBsYWNlKCdweCcsICcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9yb2xsdW5pdCAhPT0gJ3BhZ2UnICYmIHRoaXMuX2lzRHJhd24pIHtcbiAgICAgICAgICAgIGRpc3QgPSBNYXRoLmNlaWwoZGlzdCAvIHRoaXMuX2l0ZW1jb3VudCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZGlzdGFuY2UgPSBwYXJzZUludChkaXN0LCAxMCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFF1ZXVlIG1vdmUgb3JkZXIgICAgXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGEgQSBwYWdlIGRhdGFcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHVyYXRpb24gQSBkdWFydGlvblxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmbG93IEEgZGlyZWN0aW9uIHRvIG1vdmVcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9xdWV1ZWluZzogZnVuY3Rpb24oZGF0YSwgZHVyYXRpb24sIGZsb3cpIHtcbiAgICAgICAgdGhpcy5fcXVldWUucHVzaCh7XG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICAgICAgZmxvdzogZmxvd1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQSBkZWZhdWx0IGRpcmVjdGlvblxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmbG93IEEgZmxvdyB0aGF0IHdpbGwgYmUgZGVmdWFsdCB2YWx1ZVxuICAgICAqL1xuICAgIHNldEZsb3c6IGZ1bmN0aW9uKGZsb3cpIHtcbiAgICAgICAgdGhpcy5fZmxvdyA9IGZsb3cgfHwgdGhpcy5fZmxvdyB8fCAnbmV4dCc7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGNoYW5nZSBhbmltYXRpb24gZWZmZWN0XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgQSBuYW1lIG9mIGVmZmVjdFxuICAgICAqL1xuICAgIGNoYW5nZU1vdGlvbjogZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB0aGlzLl9tb3Rpb24gPSBtb3Rpb25bdHlwZV07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFuaW1hdGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uIEEgb3B0aW9ucyBmb3IgYW5pbWF0aW5nXG4gICAgICovXG4gICAgX2FuaW1hdGU6IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICB2YXIgc3RhcnQgPSBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgaWQgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRpbWVQYXNzZWQgPSBuZXcgRGF0ZSgpIC0gc3RhcnQsXG4gICAgICAgICAgICAgICAgICAgIHByb2dyZXNzID0gdGltZVBhc3NlZCAvIG9wdGlvbi5kdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgZGVsdGE7XG4gICAgICAgICAgICAgICAgaWYgKHByb2dyZXNzID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzcyA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlbHRhID0gb3B0aW9uLmRlbHRhKHByb2dyZXNzKTtcblxuICAgICAgICAgICAgICAgIG9wdGlvbi5zdGVwKGRlbHRhKTtcblxuICAgICAgICAgICAgICAgIGlmIChwcm9ncmVzcyA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbChpZCk7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbi5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIG9wdGlvbi5kZWxheSB8fCAxMCk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogQSByb2xsZXIgbWV0aG9kIHNldCBmb3IgZml4ZWQgcGFuZWxcbiAqIEBuYW1lc3BhY2UgbW92ZVBhbmVsU2V0XG4gKiBAc3RhdGljXG4gKi9cbnZhciBtb3ZlUGFuZWxTZXQgPSB7XG4gICAgLyoqXG4gICAgICogU2V0IHJvbGxpbmcgY29udGFpbmVyXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0Q29udGFpbmVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG9wdGlvbiA9IHRoaXMuX29wdGlvbixcbiAgICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50LFxuICAgICAgICAgICAgZmlyc3RDaGlsZCA9IGVsZW1lbnQuZmlyc3RDaGlsZCxcbiAgICAgICAgICAgIHdyYXAsXG4gICAgICAgICAgICBuZXh0LFxuICAgICAgICAgICAgdGFnLFxuICAgICAgICAgICAgY2xhc3NOYW1lO1xuXG4gICAgICAgIGlmIChvcHRpb24ud3JhcHBlclRhZykge1xuICAgICAgICAgICAgdGFnID0gb3B0aW9uLndyYXBwZXJUYWcgJiYgb3B0aW9uLndyYXBwZXJUYWcuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IG9wdGlvbi53cmFwcGVyVGFnICYmIG9wdGlvbi53cmFwcGVyVGFnLnNwbGl0KCcuJylbMV0gfHwgJyc7XG4gICAgICAgICAgICB3cmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICAgICAgICAgICAgaWYgKGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgd3JhcC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZCh3cmFwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0dWkudXRpbC5pc0hUTUxUYWcoZmlyc3RDaGlsZCkpIHtcbiAgICAgICAgICAgICAgICB3cmFwID0gZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5leHQgPSBmaXJzdENoaWxkICYmIGZpcnN0Q2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICBpZiAodHVpLnV0aWwuaXNIVE1MVGFnKG5leHQpKSB7XG4gICAgICAgICAgICAgICAgd3JhcCA9IG5leHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQod3JhcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY29udGFpbmVyID0gd3JhcDtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIE1ha2Ugcm9sbGluZyBwYW5lbFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldFBhbmVsOiBmdW5jdGlvbihpbml0RGF0YSkge1xuICAgICAgICB2YXIgcGFuZWwgPSB0aGlzLl9jb250YWluZXIuZmlyc3RDaGlsZCxcbiAgICAgICAgICAgIHBhbmVsU2V0ID0gdGhpcy5wYW5lbCxcbiAgICAgICAgICAgIG9wdGlvbiA9IHRoaXMuX29wdGlvbixcbiAgICAgICAgICAgIHRhZyxcbiAgICAgICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgICAgIGtleTtcblxuICAgICAgICBpZiAodHVpLnV0aWwuaXNTdHJpbmcob3B0aW9uLnBhbmVsVGFnKSkge1xuICAgICAgICAgICAgdGFnID0gKG9wdGlvbi5wYW5lbFRhZykuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IChvcHRpb24ucGFuZWxUYWcpLnNwbGl0KCcuJylbMV0gfHwgJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXR1aS51dGlsLmlzSFRNTFRhZyhwYW5lbCkpIHtcbiAgICAgICAgICAgICAgICBwYW5lbCA9IHBhbmVsICYmIHBhbmVsLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFnID0gdHVpLnV0aWwuaXNIVE1MVGFnKHBhbmVsKSA/IHBhbmVsLnRhZ05hbWUgOiAnbGknO1xuICAgICAgICAgICAgY2xhc3NOYW1lID0gKHBhbmVsICYmIHBhbmVsLmNsYXNzTmFtZSkgfHwgJyc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAgICAgZm9yIChrZXkgaW4gcGFuZWxTZXQpIHtcbiAgICAgICAgICAgIHBhbmVsU2V0W2tleV0gPSB0aGlzLl9tYWtlRWxlbWVudCh0YWcsIGNsYXNzTmFtZSwga2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhbmVsU2V0LmNlbnRlci5pbm5lckhUTUwgPSBpbml0RGF0YTtcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLmFwcGVuZENoaWxkKHBhbmVsU2V0LmNlbnRlcik7XG5cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIE1ha2UgSFRNTCBFbGVtZW50ICAgICBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGFnIEEgdGFnIG5hbWVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lIEEgY2xhc3MgbmFtZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgQSBjbGFzcyBrZXkgbmFtZVxuICAgICAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9tYWtlRWxlbWVudDogZnVuY3Rpb24odGFnLCBjbGFzc05hbWUsIGtleSkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgICAgICAgZWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICBlbGVtZW50LnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgICBlbGVtZW50LnN0eWxlLmhlaWdodCA9ICcxMDAlJztcbiAgICAgICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gJzBweCc7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUudG9wID0gJzBweCc7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgcGFuZWwgZGF0YVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhIEEgZGF0YSBmb3IgcmVwbGFjZSBwYW5lbFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3VwZGF0ZVBhbmVsOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHRoaXMucGFuZWxbdGhpcy5fZmxvdyB8fCAnY2VudGVyJ10uaW5uZXJIVE1MID0gZGF0YTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQXBwZW5kIG1vdmUgcGFuZWxcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9hcHBlbmRNb3ZlRGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmbG93ID0gdGhpcy5fZmxvdyxcbiAgICAgICAgICAgIG1vdmVQYW5lbCA9IHRoaXMucGFuZWxbZmxvd10sXG4gICAgICAgICAgICBzdHlsZSA9IG1vdmVQYW5lbC5zdHlsZSxcbiAgICAgICAgICAgIGRlc3QgPSAoZmxvdyA9PT0gJ3ByZXYnID8gLXRoaXMuX2Rpc3RhbmNlIDogdGhpcy5fZGlzdGFuY2UpICsgJ3B4JztcblxuICAgICAgICBzdHlsZVt0aGlzLl9yYW5nZV0gPSBkZXN0O1xuXG4gICAgICAgIHRoaXMubW92ZVBhbmVsID0gbW92ZVBhbmVsO1xuICAgICAgICB0aGlzLl9jb250YWluZXIuYXBwZW5kQ2hpbGQobW92ZVBhbmVsKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGVhY2ggcGFuZWxzJyBtb3ZlIGRpc3RhbmNlc1xuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2dldE1vdmVTZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZmxvdyA9IHRoaXMuX2Zsb3c7XG4gICAgICAgIGlmIChmbG93ID09PSAncHJldicpIHtcbiAgICAgICAgICAgIHJldHVybiBbMCwgdGhpcy5fZGlzdGFuY2VdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFstdGhpcy5fZGlzdGFuY2UsIDBdO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBzdGFydCBwb2ludHNcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0U3RhcnRTZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcGFuZWwgPSB0aGlzLnBhbmVsLFxuICAgICAgICAgICAgZmxvdyA9IHRoaXMuX2Zsb3csXG4gICAgICAgICAgICByYW5nZSA9IHRoaXMuX3JhbmdlLFxuICAgICAgICAgICAgaXNQcmV2ID0gZmxvdyA9PT0gJ3ByZXYnLFxuICAgICAgICAgICAgZmlyc3QgPSBpc1ByZXYgPyBwYW5lbFsncHJldiddIDogcGFuZWxbJ2NlbnRlciddLFxuICAgICAgICAgICAgc2Vjb25kID0gaXNQcmV2ID8gcGFuZWxbJ2NlbnRlciddIDogcGFuZWxbJ25leHQnXTtcbiAgICAgICAgcmV0dXJuIFtwYXJzZUludChmaXJzdC5zdHlsZVtyYW5nZV0sIDEwKSwgcGFyc2VJbnQoc2Vjb25kLnN0eWxlW3JhbmdlXSwgMTApXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IG1vdmUgdGFyZ2V0XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZsb3cgQSBmbG93IHRvIG1vdmVcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRUYXJnZXQ6IGZ1bmN0aW9uKGZsb3cpIHtcbiAgICAgICAgdGhpcy5fdGFyZ2V0cyA9IFt0aGlzLnBhbmVsWydjZW50ZXInXV07XG4gICAgICAgIGlmIChmbG93ID09PSAncHJldicpIHtcbiAgICAgICAgICAgIHRoaXMuX3RhcmdldHMudW5zaGlmdCh0aGlzLnBhbmVsW2Zsb3ddKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3RhcmdldHMucHVzaCh0aGlzLnBhbmVsW2Zsb3ddKTtcbiAgICAgICAgfVxuXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBBIHBhbmVsIG1vdmVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBBIGRhdGEgdG8gdXBkYXRlIHBhbmVsXG4gICAgICovXG4gICAgbW92ZTogZnVuY3Rpb24oZGF0YSwgZHVyYXRpb24sIGZsb3cpIHtcbiAgICAgICAgZmxvdyA9IGZsb3cgfHwgdGhpcy5fZmxvdztcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAnaWRsZScpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gJ3J1bic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9xdWV1ZWluZyhkYXRhLCBkdXJhdGlvbiwgZmxvdyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQmVmb3JlIG1vdmUgY3VzdG9tIGV2ZW50IGZpcmVcbiAgICAgICAgICogQGZpcmVzIGJlZm9yZU1vdmVcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGEgSW5uZXIgSFRNTFxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiB0dWkuY29tcG9uZW50LlJvbGxpbmdJbnN0YW5jZS5hdHRhY2goJ2JlZm9yZU1vdmUnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAqICAgIC8vIC4uLi4uIHJ1biBjb2RlXG4gICAgICAgICAqIH0pO1xuICAgICAgICAgKi9cbiAgICAgICAgdmFyIHJlcyA9IHRoaXMuaW52b2tlKCdiZWZvcmVNb3ZlJywge2RhdGE6IGRhdGF9KTtcblxuICAgICAgICBpZiAoIXJlcykge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAnaWRsZSc7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgbmV4dCBwYW5lbFxuICAgICAgICB0aGlzLl91cGRhdGVQYW5lbChkYXRhKTtcbiAgICAgICAgdGhpcy5fYXBwZW5kTW92ZURhdGEoKTtcbiAgICAgICAgdGhpcy5fc2V0VGFyZ2V0KGZsb3cpO1xuXG4gICAgICAgIGlmICghdGhpcy5fbW90aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlV2l0aG91dE1vdGlvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbW92ZVdpdGhNb3Rpb24oZHVyYXRpb24pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBwb3NpdGlvblxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX21vdmVXaXRob3V0TW90aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZsb3cgPSB0aGlzLl9mbG93LFxuICAgICAgICAgICAgcG9zID0gdGhpcy5fZ2V0TW92ZVNldChmbG93KSxcbiAgICAgICAgICAgIHJhbmdlID0gdGhpcy5fcmFuZ2U7XG4gICAgICAgIHR1aS51dGlsLmZvckVhY2godGhpcy5fdGFyZ2V0cywgZnVuY3Rpb24oZWxlbWVudCwgaW5kZXgpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbcmFuZ2VdID0gcG9zW2luZGV4XSArICdweCc7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNvbXBsZXRlKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJ1biBhbmltYXRpb25cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9tb3ZlV2l0aE1vdGlvbjogZnVuY3Rpb24oZHVyYXRpb24pIHtcbiAgICAgICAgdmFyIGZsb3cgPSB0aGlzLl9mbG93LFxuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLl9nZXRTdGFydFNldChmbG93KSxcbiAgICAgICAgICAgIGRpc3RhbmNlID0gdGhpcy5fZGlzdGFuY2UsXG4gICAgICAgICAgICByYW5nZSA9IHRoaXMuX3JhbmdlO1xuXG4gICAgICAgIGR1cmF0aW9uID0gZHVyYXRpb24gfHwgdGhpcy5fZHVyYXRpb247XG5cbiAgICAgICAgdGhpcy5fYW5pbWF0ZSh7XG4gICAgICAgICAgICBkZWxheTogMTAsXG4gICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24gfHwgMTAwMCxcbiAgICAgICAgICAgIGRlbHRhOiB0aGlzLl9tb3Rpb24sXG4gICAgICAgICAgICBzdGVwOiB0dWkudXRpbC5iaW5kKGZ1bmN0aW9uKGRlbHRhKSB7XG4gICAgICAgICAgICAgICAgdHVpLnV0aWwuZm9yRWFjaCh0aGlzLl90YXJnZXRzLCBmdW5jdGlvbihlbGVtZW50LCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGVzdCA9IChmbG93ID09PSAncHJldicpID8gZGlzdGFuY2UgKiBkZWx0YSA6IC0oZGlzdGFuY2UgKiBkZWx0YSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbcmFuZ2VdID0gc3RhcnRbaW5kZXhdICsgZGVzdCArICdweCc7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIHRoaXMpLFxuICAgICAgICAgICAgY29tcGxldGU6IHR1aS51dGlsLmJpbmQodGhpcy5jb21wbGV0ZSwgdGhpcylcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENvbXBsYXRlIGNhbGxiYWNrXG4gICAgICovXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcGFuZWwgPSB0aGlzLnBhbmVsLFxuICAgICAgICAgICAgdGVtcFBhbmVsLFxuICAgICAgICAgICAgZmxvdyA9IHRoaXMuX2Zsb3c7XG5cbiAgICAgICAgdGVtcFBhbmVsID0gcGFuZWxbJ2NlbnRlciddO1xuICAgICAgICBwYW5lbFsnY2VudGVyJ10gPSBwYW5lbFtmbG93XTtcbiAgICAgICAgcGFuZWxbZmxvd10gPSB0ZW1wUGFuZWw7XG5cbiAgICAgICAgdGhpcy5fdGFyZ2V0cyA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5yZW1vdmVDaGlsZCh0ZW1wUGFuZWwpO1xuICAgICAgICB0aGlzLnN0YXR1cyA9ICdpZGxlJztcblxuICAgICAgICBpZiAodHVpLnV0aWwuaXNOb3RFbXB0eSh0aGlzLl9xdWV1ZSkpIHtcbiAgICAgICAgICAgIHZhciBmaXJzdCA9IHRoaXMuX3F1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICB0aGlzLm1vdmUoZmlyc3QuZGF0YSwgZmlyc3QuZHVyYXRpb24sIGZpcnN0LmZsb3cpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBBZnRlciBjdXN0b20gZXZlbnQgcnVuXG4gICAgICAgICAgICAgKiBAZmlyZXMgYWZ0ZXJNb3ZlXG4gICAgICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgICAgICogdHVpLmNvbXBvbmVudC5Sb2xsaW5nSW5zdGFuY2UuYXR0YWNoKCdhZnRlck1vdmUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAqICAgIC8vIC4uLi4uIHJ1biBjb2RlXG4gICAgICAgICAgICAgKiB9KTtcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5maXJlKCdhZnRlck1vdmUnKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogQ29udGFpbmVyIG1vdmUgbWV0aG9kc1xuICogQG5hbWVzcGFjZSBtb3ZlQ29udGFpbmVyU2V0XG4gKiBAc3RhdGljXG4gKi9cbnZhciBtb3ZlQ29udGFpbmVyU2V0ID0ge1xuICAgIC8qKlxuICAgICAqIFNldCBjb250YWluZXJcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRDb250YWluZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnQsXG4gICAgICAgICAgICBmaXJzdENoaWxkID0gZWxlbWVudC5maXJzdENoaWxkLFxuICAgICAgICAgICAgd3JhcDtcbiAgICAgICAgaWYgKHRoaXMuX2lzRHJhd24pIHtcbiAgICAgICAgICAgIHdyYXAgPSB0dWkudXRpbC5pc0hUTUxUYWcoZmlyc3RDaGlsZCkgPyBmaXJzdENoaWxkIDogZmlyc3RDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lciA9IHdyYXA7XG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIuc3R5bGVbdGhpcy5fcmFuZ2VdID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZXRJdGVtQ291bnQoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTW92ZSBhcmVhIGNoZWNrXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZsb3cgQSBkaXJlY3Rpb24gdG8gbW92ZVxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2lzTGltaXRQb2ludDogZnVuY3Rpb24oZmxvdykge1xuICAgICAgICB2YXIgbW92ZWQgPSB0aGlzLl9nZXRDdXJyZW50UG9zaXRpb24oKTtcbiAgICAgICAgaWYgKGZsb3cgPT09ICduZXh0Jykge1xuICAgICAgICAgICAgaWYgKHRoaXMubGltaXQgPiAtbW92ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYobW92ZWQgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgY3VycmVudCBwb3NpdGlvblxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2dldEN1cnJlbnRQb3NpdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLl9jb250YWluZXIuc3R5bGVbdGhpcy5fcmFuZ2VdLCAxMCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE1vdmUgcGFuZWxzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgQSBkYXRhIHRvIHVwZGF0ZSBwYW5lbFxuICAgICAqL1xuICAgIG1vdmU6IGZ1bmN0aW9uKGR1cmF0aW9uLCBmbG93KSB7XG4gICAgICAgIGZsb3cgPSBmbG93IHx8IHRoaXMuX2Zsb3c7XG5cbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAnaWRsZScpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gJ3J1bic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9xdWV1ZWluZyhkdXJhdGlvbiwgZmxvdyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlyZSBiZWZvcmUgY3VzdG9tIGV2ZW50XG4gICAgICAgICAqIEBmaXJlcyBiZWZvcmVNb3ZlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhIGlubmVyIEhUTUxcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogdHVpLmNvbXBvbmVudC5Sb2xsaW5nSW5zdGFuY2UuYXR0YWNoKCdiZWZvcmVNb3ZlJywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgKiAgICAvLyAuLi4uLiBydW4gY29kZVxuICAgICAgICAgKiB9KTtcbiAgICAgICAgICovXG4gICAgICAgIHZhciByZXMgPSB0aGlzLmludm9rZSgnYmVmb3JlTW92ZScpO1xuICAgICAgICBpZiAoIXJlcykge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAnaWRsZSc7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZighdGhpcy5faXNDaXJjdWxhciAmJiB0aGlzLl9pc0xpbWl0UG9pbnQoZmxvdykpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gJ2lkbGUnO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2lzQ2lyY3VsYXIpIHtcbiAgICAgICAgICAgIHRoaXMuX3JvdGF0ZVBhbmVsKGZsb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLl9tb3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX21vdmVXaXRob3V0TW90aW9uKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlV2l0aE1vdGlvbihkdXJhdGlvbik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEZpeCBwYW5lbHNcbiAgICAgKi9cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLl9pc0NpcmN1bGFyKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRQYW5lbCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhdHVzID0gJ2lkbGUnO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgbW92ZSBkaXN0YW5jZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmbG93IEEgZGlyZWN0aW9uXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZXRNb3ZlRGlzdGFuY2U6IGZ1bmN0aW9uKGZsb3cpIHtcbiAgICAgICAgdmFyIG1vdmVkID0gdGhpcy5fZ2V0Q3VycmVudFBvc2l0aW9uKCksXG4gICAgICAgICAgICBjYXN0RGlzdCA9IHRoaXMuX2Rpc3RhbmNlICogdGhpcy5fdW5pdENvdW50O1xuICAgICAgICBpZiAoZmxvdyA9PT0gJ3ByZXYnKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5faXNDaXJjdWxhcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9kaXN0YW5jZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAobW92ZWQgKyBjYXN0RGlzdCkgPiAwID8gLW1vdmVkIDogY2FzdERpc3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5faXNDaXJjdWxhcikge1xuICAgICAgICAgICAgICAgIHJldHVybiAtdGhpcy5fZGlzdGFuY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2FzdERpc3QgPiAodGhpcy5saW1pdCArIG1vdmVkKT8gKC10aGlzLmxpbWl0IC0gbW92ZWQpIDogLWNhc3REaXN0O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBwb3N0aW9uXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfbW92ZVdpdGhvdXRNb3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZmxvdyA9IHRoaXMuX2Zsb3csXG4gICAgICAgICAgICBwb3MgPSB0aGlzLl9nZXRNb3ZlRGlzdGFuY2UoZmxvdyksXG4gICAgICAgICAgICByYW5nZSA9IHRoaXMuX3JhbmdlLFxuICAgICAgICAgICAgc3RhcnQgPSBwYXJzZUludCh0aGlzLl9jb250YWluZXIuc3R5bGVbcmFuZ2VdLCAxMCk7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZVtyYW5nZV0gPSBzdGFydCArIHBvcyArICdweCc7XG4gICAgICAgIHRoaXMuY29tcGxldGUoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUnVuIGFuaW1hdGlvblxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX21vdmVXaXRoTW90aW9uOiBmdW5jdGlvbihkdXJhdGlvbikge1xuICAgICAgICB2YXIgZmxvdyA9IHRoaXMuX2Zsb3csXG4gICAgICAgICAgICBjb250YWluZXIgPSB0aGlzLl9jb250YWluZXIsXG4gICAgICAgICAgICByYW5nZSA9IHRoaXMuX3JhbmdlLFxuICAgICAgICAgICAgc3RhcnQgPSBwYXJzZUludChjb250YWluZXIuc3R5bGVbcmFuZ2VdLCAxMCksXG4gICAgICAgICAgICBkaXN0YW5jZSA9IHRoaXMuX2dldE1vdmVEaXN0YW5jZShmbG93KTtcbiAgICAgICAgZHVyYXRpb24gPSBkdXJhdGlvbiB8fCB0aGlzLl9kdXJhdGlvbjtcblxuICAgICAgICB0aGlzLl9hbmltYXRlKHtcbiAgICAgICAgICAgIGRlbGF5OiAxMCxcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbiB8fCAxMDAwLFxuICAgICAgICAgICAgZGVsdGE6IHRoaXMuX21vdGlvbixcbiAgICAgICAgICAgIHN0ZXA6IHR1aS51dGlsLmJpbmQoZnVuY3Rpb24oZGVsdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVzdCA9IGRpc3RhbmNlICogZGVsdGE7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnN0eWxlW3JhbmdlXSA9IHN0YXJ0ICsgZGVzdCArICdweCc7XG4gICAgICAgICAgICB9LCB0aGlzKSxcbiAgICAgICAgICAgIGNvbXBsZXRlOiB0dWkudXRpbC5iaW5kKHRoaXMuY29tcGxldGUsIHRoaXMpXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSb3RhdGUgcGFuZWxcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmxvdyBBIGZsb3cgdG8gcm90YXRlIHBhbmVsXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfcm90YXRlUGFuZWw6IGZ1bmN0aW9uKGZsb3cpIHtcblxuICAgICAgICBmbG93ID0gZmxvdyB8fCB0aGlzLl9mbG93O1xuXG4gICAgICAgIHZhciBzdGFuZGFyZCxcbiAgICAgICAgICAgIG1vdmVzZXQsXG4gICAgICAgICAgICBtb3Zlc2V0TGVuZ3RoLFxuICAgICAgICAgICAgcmFuZ2UgPSB0aGlzLl9yYW5nZSxcbiAgICAgICAgICAgIGNvbnRhaW5lck1vdmVEaXN0LFxuICAgICAgICAgICAgaXNQcmV2ID0gZmxvdyA9PT0gJ3ByZXYnLFxuICAgICAgICAgICAgYmFzaXMgPSB0aGlzLl9iYXNpcztcblxuICAgICAgICB0aGlzLl9zZXRQYXJ0T2ZQYW5lbHMoZmxvdyk7XG5cbiAgICAgICAgbW92ZXNldCA9IHRoaXMuX21vdmVQYW5lbFNldDtcbiAgICAgICAgbW92ZXNldExlbmd0aCA9IG1vdmVzZXQubGVuZ3RoO1xuICAgICAgICBjb250YWluZXJNb3ZlRGlzdCA9IHRoaXMuX2dldE1vdmVEaXN0YW5jZShmbG93KTtcblxuICAgICAgICBpZiAodGhpcy5faXNJbmNsdWRlKHRoaXMuX3BhbmVsc1t0aGlzLl9iYXNpc10sIG1vdmVzZXQpKSB7XG4gICAgICAgICAgICB0aGlzLl9iYXNpcyA9IGlzUHJldiA/IGJhc2lzIC0gbW92ZXNldExlbmd0aCA6IGJhc2lzICsgbW92ZXNldExlbmd0aDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNQcmV2KSB7XG4gICAgICAgICAgICBzdGFuZGFyZCA9IHRoaXMuX3BhbmVsc1swXTtcbiAgICAgICAgICAgIHR1aS51dGlsLmZvckVhY2gobW92ZXNldCwgZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lci5pbnNlcnRCZWZvcmUoZWxlbWVudCwgc3RhbmRhcmQpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0dWkudXRpbC5mb3JFYWNoKG1vdmVzZXQsIGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250YWluZXIuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jb250YWluZXIuc3R5bGVbcmFuZ2VdID0gcGFyc2VJbnQodGhpcy5fY29udGFpbmVyLnN0eWxlW3JhbmdlXSwgMTApIC0gY29udGFpbmVyTW92ZURpc3QgKyAncHgnO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBjdXJyZW50IHBhbmVsIGlzIGluY2x1ZGVkIHJvdGF0ZSBwYW5lbHNcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBpdGVtIEEgdGFyZ2V0IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBjb2xsZWNpdG9uIEEgYXJyYXkgdG8gY29tcGFyZVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2lzSW5jbHVkZTogZnVuY3Rpb24oaXRlbSwgY29sbGVjaXRvbikge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIGxlbjtcbiAgICAgICAgZm9yKGkgPSAwLCBsZW4gPSBjb2xsZWNpdG9uLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY29sbGVjaXRvbltpXSA9PT0gaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEZpbmQgcm90YXRlIHBhbmVsIGJ5IGRpcmVjdGlvblxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmbG93IEEgZGlyZWN0aW9uXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0UGFydE9mUGFuZWxzOiBmdW5jdGlvbihmbG93KSB7XG4gICAgICAgIHZhciBpdGVtY291bnQgPSB0aGlzLl9pdGVtY291bnQsXG4gICAgICAgICAgICBpc1ByZXYgPSAoZmxvdyA9PT0gJ3ByZXYnKSxcbiAgICAgICAgICAgIGNvdW50ID0gKHRoaXMuX3JvbGx1bml0ICE9PSAncGFnZScpID8gMSA6IGl0ZW1jb3VudCxcbiAgICAgICAgICAgIGRpc3QgPSBpc1ByZXYgPyAtY291bnQgOiBjb3VudCxcbiAgICAgICAgICAgIHBvaW50ID0gaXNQcmV2ID8gW2Rpc3RdIDogWzAsIGRpc3RdO1xuXG4gICAgICAgIHRoaXMuX21vdmVQYW5lbFNldCA9IHRoaXMuX3BhbmVscy5zbGljZS5hcHBseSh0aGlzLl9wYW5lbHMsIHBvaW50KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGRpc3BsYXkgaXRlbSBjb3VudFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldEl0ZW1Db3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5fZWxlbWVudCxcbiAgICAgICAgICAgIGVsZW1lbnRTdHlsZSA9IGVsZW1lbnQuc3R5bGUsXG4gICAgICAgICAgICBlbGVtZW50V2lkdGggPSBwYXJzZUludChlbGVtZW50U3R5bGUud2lkdGggfHwgZWxlbWVudC5jbGllbnRXaWR0aCwgMTApLFxuICAgICAgICAgICAgZWxlbWVudEhlaWdodCA9IHBhcnNlSW50KGVsZW1lbnRTdHlsZS5oZWlnaHQgfHwgZWxlbWVudC5jbGllbnRIZWlnaHQsIDEwKSxcbiAgICAgICAgICAgIGl0ZW0gPSB0aGlzLl9lbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaScpWzBdLCAvLyDrp4jtgazsl4XsnYAgbGnroZwg7ZS97IqkXG4gICAgICAgICAgICBpdGVtU3R5bGUgPSBpdGVtLnN0eWxlLFxuICAgICAgICAgICAgaXRlbVdpZHRoID0gcGFyc2VJbnQoaXRlbVN0eWxlLndpZHRoIHx8IGl0ZW0uY2xpZW50V2lkdGgsIDEwKSxcbiAgICAgICAgICAgIGl0ZW1IZWlnaHQgPSBwYXJzZUludChpdGVtU3R5bGUuaGVpZ2h0IHx8IGl0ZW0uY2xpZW50SGVpZ2h0LCAxMCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX3JhbmdlID09PSAnbGVmdCcpIHtcbiAgICAgICAgICAgIHRoaXMuX2l0ZW1jb3VudCA9IE1hdGgucm91bmQoZWxlbWVudFdpZHRoIC8gaXRlbVdpZHRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2l0ZW1jb3VudCA9IE1hdGgucm91bmQoZWxlbWVudEhlaWdodCAvIGl0ZW1IZWlnaHQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEluaXRhbGl6ZSBwYW5lbHMgXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaW5pdFBhbmVsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuX2NvbnRhaW5lcixcbiAgICAgICAgICAgIHBhbmVscyA9IGNvbnRhaW5lci5jaGlsZE5vZGVzLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGFycjtcblxuICAgICAgICBwYW5lbHMgPSB0dWkudXRpbC50b0FycmF5KHBhbmVscyk7XG5cbiAgICAgICAgdGhpcy5fcGFuZWxzID0gdHVpLnV0aWwuZmlsdGVyKHBhbmVscywgZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHR1aS51dGlsLmlzSFRNTFRhZyhlbGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHR1aS51dGlsLmZvckVhY2godGhpcy5fcGFuZWxzLCBmdW5jdGlvbihwYW5lbCwgaW5kZXgpIHtcbiAgICAgICAgICAgIHBhbmVsLmNsYXNzTmFtZSArPSAnIF9faW5kZXgnICsgaW5kZXggKyAnX18nO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHBhbmVsIGxpc3RcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRQYW5lbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLl9jb250YWluZXIsXG4gICAgICAgICAgICBwYW5lbHMgPSBjb250YWluZXIuY2hpbGROb2RlcyxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBhcnI7XG5cbiAgICAgICAgcGFuZWxzID0gdHVpLnV0aWwudG9BcnJheShwYW5lbHMpO1xuXG4gICAgICAgIHRoaXMuX3BhbmVscyA9IHR1aS51dGlsLmZpbHRlcihwYW5lbHMsIGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0dWkudXRpbC5pc0hUTUxUYWcoZWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9iYXNpcyA9IHRoaXMuX2Jhc2lzIHx8IDA7XG4gICAgICAgIHRoaXMuX3NldEJvdW5kYXJ5KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBmaXhlZCBhcmVhIGluY2lyY3VsYXIgcm9sbGluZ1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmbG93IEEgZGlyZWN0aW9uXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0Qm91bmRhcnk6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcGFuZWxzID0gdGhpcy5fcGFuZWxzLFxuICAgICAgICAgICAgZGlzdGFuY2UgPSB0aGlzLl9kaXN0YW5jZSxcbiAgICAgICAgICAgIHJhbmdlID0gdGhpcy5fcmFuZ2UsXG4gICAgICAgICAgICByYW5nZURpc3RhbmNlID0gcGFyc2VJbnQodGhpcy5fZWxlbWVudC5zdHlsZVtyYW5nZSA9PT0gJ2xlZnQnID8gJ3dpZHRoJyA6ICdoZWlnaHQnXSwgMTApLFxuICAgICAgICAgICAgd3JhcEFyZWEgPSB0aGlzLl9yb2xsdW5pdCA9PT0gJ3BhZ2UnID8gKGRpc3RhbmNlIC8gdGhpcy5faXRlbWNvdW50KSA6IGRpc3RhbmNlICogcGFuZWxzLmxlbmd0aCxcbiAgICAgICAgICAgIGxpbWl0RGlzdCA9IHdyYXBBcmVhIC0gcmFuZ2VEaXN0YW5jZTtcbiAgICAgICAgdGhpcy5saW1pdCA9IGxpbWl0RGlzdDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGN1cnJlbnQgaW5kZXggb24gc2VsZWN0ZWQgcGFnZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwYWdlIEEgbW92ZSBwYW5lbCBudW1iZXJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2NoZWNrUGFnZVBvc2l0aW9uOiBmdW5jdGlvbihwYWdlKSB7XG4gICAgICAgIHZhciBkaXN0ID0gbnVsbCxcbiAgICAgICAgICAgIHBhbmVscyA9IHRoaXMuX3BhbmVscztcbiAgICAgICAgdHVpLnV0aWwuZm9yRWFjaChwYW5lbHMsIGZ1bmN0aW9uKHBhbmVsLCBpbmRleCkge1xuICAgICAgICAgICAgaWYgKHBhbmVsLmNsYXNzTmFtZS5pbmRleE9mKCdfX2luZGV4JyArIHBhZ2UpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGlmICghdHVpLnV0aWwuaXNFeGlzdHkoZGlzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzdCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkaXN0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBIG1vdmUgdG8gc29tZSBwYW5lbC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcGFnZSBBIG51bWJlciBvZiBwYW5lbFxuICAgICAqL1xuICAgIG1vdmVUbzogZnVuY3Rpb24ocGFnZSkge1xuICAgICAgICBwYWdlID0gTWF0aC5tYXgocGFnZSwgMCk7XG4gICAgICAgIHBhZ2UgPSBNYXRoLm1pbihwYWdlLCB0aGlzLl9wYW5lbHMubGVuZ3RoIC0gMSk7XG5cbiAgICAgICAgdmFyIHBvcyA9IHRoaXMuX2NoZWNrUGFnZVBvc2l0aW9uKHBhZ2UpLFxuICAgICAgICAgICAgaXRlbUNvdW50ID0gdGhpcy5faXRlbWNvdW50LFxuICAgICAgICAgICAgcGFuZWxDb3VudCA9IHRoaXMuX3BhbmVscy5sZW5ndGgsXG4gICAgICAgICAgICBkaXN0YW5jZSA9IHRoaXMuX2Rpc3RhbmNlLFxuICAgICAgICAgICAgaXRlbURpc3QgPSB0aGlzLl9yb2xsdW5pdCA9PT0gJ3BhZ2UnID8gZGlzdGFuY2UgLyBpdGVtQ291bnQgOiBkaXN0YW5jZSxcbiAgICAgICAgICAgIHVuaXREaXN0ID0gLXBvcyAqIGl0ZW1EaXN0O1xuXG4gICAgICAgIGlmICghdGhpcy5faXNDaXJjdWxhcikge1xuICAgICAgICAgICAgdW5pdERpc3QgPSBNYXRoLm1heCh1bml0RGlzdCwgLXRoaXMubGltaXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdW5pdERpc3QgPSBNYXRoLm1heCh1bml0RGlzdCwgLShpdGVtRGlzdCAqIChwYW5lbENvdW50IC0gaXRlbUNvdW50KSkpO1xuICAgICAgICAgICAgdGhpcy5fYmFzaXMgPSBwb3M7XG4gICAgICAgICAgICB0aGlzLl9zZXRQYW5lbCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZVt0aGlzLl9yYW5nZV0gPSB1bml0RGlzdCArICdweCc7XG4gICAgfVxufTtcblxudHVpLnV0aWwuQ3VzdG9tRXZlbnRzLm1peGluKFJvbGxlcik7XG5tb2R1bGUuZXhwb3J0cyA9IFJvbGxlcjtcbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBSb2xsaW5nIGNvbXBvbmVudCBjb3JlLlxuICogQGF1dGhvciBOSE4gRW50LiBGRSBkZXYgdGVhbS48ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICogQGRlcGVuZGVuY3kgdHVpLWNvZGUtc25pcHBldCB+di4xLjEuMFxuICovXG5cbnZhciBSb2xsZXIgPSByZXF1aXJlKCcuL3JvbGxlcicpO1xudmFyIERhdGEgPSByZXF1aXJlKCcuL3JvbGxkYXRhJyk7XG4vKipcbiAqIFJvbGxpbmcgY29yZSBvYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb24gVGhlIG9wdGlvbnMgXG4gKiAgICAgIEBwYXJhbSB7SFRNTEVsZW1lbnR8U3RyaW5nfSBvcHRpb24uZWxlbWVudCBBIHJvb3QgZWxlbWVudCBvciBpZCB0aGF0IHdpbGwgYmVjb21lIHJvb3QgZWxlbWVudCdzXG4gKiAgICAgIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbi5pc1ZhcmlhYmxlPXRydWV8ZmFsc2VdIFdoZXRoZXIgdGhlIGRhdGEgaXMgY2hhbmdhYmxlIG9yIG5vdCBbZGVmYXVsdCB2YWx1ZSBpcyBmYWxzZV1cbiAqICAgICAgQHBhcmFtIHtCb29sZWFufSBbb3B0aW9uLmlzQ2lyY3VsYXI9dHJ1ZXxmYWxzZV0gV2hldGhlciBjaXJjdWxhciBvciBub3QgW2RlZmF1bHQgdmFsdWUgaXMgdHJ1ZSBidXQgaXNWYXJpYWJsZSB0cnVlIGNhc2VdXG4gKiAgICAgIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbi5hdXRvPXRydWV8ZmFsc2VdIFdoZXRoZXIgYXV0byByb2xsaW5nIG9yIG5vdCBbZGVmYXVsdCB2YWx1ZSBpcyBmYWxzZV1cbiAqICAgICAgQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb24uZGVsYXlUaW1lPTEwMDB8Li4uXSBEaXN0YW5jZSB0aW1lIG9mIGF1dG8gcm9sbGluZy4gW2RlZnVsYXQgMyBzZWNvbmRdXG4gKiAgICAgIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9uLmRpcmVjdGlvbj0naG9yaXpvbnRhbHx2ZXJ0aWNhbCddIFRoZSBmbG93IGRpcmVjdGlvbiBwYW5lbCBbZGVmYXVsdCB2YWx1ZSBpcyBob3Jpem9udGFsXVxuICogICAgICBAcGFyYW0ge051bWJlcn0gW29wdGlvbi5kdXJhdGlvbj0nMTAwMHwuLi5dIEEgbW92ZSBkdXJhdGlvblxuICogICAgICBAcGFyYW0ge051bWJlcn0gW29wdGlvbi5pbml0TnVtPScwfC4uLl0gSW5pdGFsaXplIHNlbGVjdGVkIHJvbGxpbmcgcGFuZWwgbnVtYmVyXG4gKiAgICAgIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9uLm1vdGlvbj0nbGluZWFyfFtxdWFkXWVhc2VJbnxbcXVhZF1lYXNlT3V0fFtxdWFkXWVhc2VJbk91dHxjaXJjRWFzZUlufGNpcmNFYXNlT3V0fGNpcmNFYXNlSW5PdXRdIEEgZWZmZWN0IG5hbWUgW2RlZmF1bHQgdmFsdWUgaXMgbm9lZmZlY3RdXG4gKiAgICAgIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9uLnVuaXQ9J2l0ZW18cGFnZSddIEEgdW5pdCBvZiByb2xsaW5nXG4gKiAgICAgIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9uLndyYXBwZXJUYWc9J3VsLmNsYXNzTmFtZXxkaXYuY2xhc3NOYW1lJ10gQSB0YWcgbmFtZSBmb3IgcGFuZWwgd2FycHBlciwgY29ubmVjdCB0YWcgbmFtZSB3aXRoIGNsYXNzIG5hbWUgYnkgZG90cy4gW2RlZnVhbHQgdmFsdWUgaXMgdWxdXG4gKiAgICAgIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9uLnBhbmVsVGFnPSdsaS5jbGFzc05hbWUnXSBBIHRhZyBuYW1lIGZvciBwYW5lbCwgY29ubmVjdCB0YWcgbmFtZSB3aXRoIGNsYXNzIGJ5IGRvdHMgW2RlZmF1bHQgdmFsdWUgaXMgbGldXG4gKiBAcGFyYW0ge0FycmF5fFN0cmluZ30gZGF0YSBBIGRhdGEgb2Ygcm9sbGluZyBwYW5lbHNcbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIHJvbGwgPSBuZXcgdHVpLmNvbXBvbmVudC5Sb2xsaW5nKHtcbiAqICAgICAgZWxlbWVudDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JvbGxpbmcnKSxcbiAqICAgICAgaW5pdE51bTogMCxcbiAqICAgICAgZGlyZWN0aW9uOiAnaG9yaXpvbnRhbCcsXG4gKiAgICAgIGlzVmFyaWFibGU6IHRydWUsXG4gKiAgICAgIHVuaXQ6ICdwYWdlJyxcbiAqICAgICAgaXNBdXRvOiBmYWxzZSxcbiAqICAgICAgbW90aW9uOiAnZWFzZUluT3V0JyxcbiAqICAgICAgZHVyYXRpb246MjAwMFxuICogfSwgWyc8ZGl2PmRhdGExPC9kaXY+JywnPGRpdj5kYXRhMjwvZGl2PicsICc8ZGl2PmRhdGEzPC9kaXY+J10pO1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBSb2xsaW5nID0gdHVpLnV0aWwuZGVmaW5lQ2xhc3MoLyoqIEBsZW5kcyBSb2xsaW5nLnByb3RvdHlwZSAqL3tcbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplXG4gICAgICogKi9cbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb24sIGRhdGEpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9wdGlvbiBvYmplY3RcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX29wdGlvbiA9IG9wdGlvbjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBmbG93IG9mIG5leHQgbW92ZVxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfHN0cmluZ31cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2Zsb3cgPSBvcHRpb24uZmxvdyB8fCAnbmV4dCc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaGV0aGVyIGh0bWwgaXMgZHJhd24gb3Igbm90XG4gICAgICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5faXNEcmF3biA9ICEhb3B0aW9uLmlzRHJhd247XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBdXRvIHJvbGxpbmcgdGltZXJcbiAgICAgICAgICogQHR5cGUge251bGx9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl90aW1lciA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBdXRvIHJvbGxpbmcgZGVsYXkgdGltZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5kZWxheVRpbWUgPSB0aGlzLmRlbGF5VGltZSB8fCAzMDAwO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBtb2RlbCBmb3Igcm9sbGluZyBkYXRhXG4gICAgICAgICAqIEB0eXBlIHtEYXRhfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fbW9kZWwgPSAhb3B0aW9uLmlzRHJhd24gPyBuZXcgRGF0YShvcHRpb24sIGRhdGEpIDogbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgcm9sbGluZyBhY3Rpb24gb2JqZWN0XG4gICAgICAgICAqIEB0eXBlIHtSb2xsZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9yb2xsZXIgPSBuZXcgUm9sbGVyKG9wdGlvbiwgdGhpcy5fbW9kZWwgJiYgdGhpcy5fbW9kZWwuZ2V0RGF0YSgpKTtcblxuICAgICAgICBpZiAob3B0aW9uLmluaXROdW0pIHtcbiAgICAgICAgICAgIHRoaXMubW92ZVRvKG9wdGlvbi5pbml0TnVtKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoISFvcHRpb24uaXNBdXRvKSB7XG4gICAgICAgICAgICB0aGlzLmF1dG8oKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSb2xsIHRoZSByb2xsaW5nIGNvbXBvbmVudC4gSWYgdGhlcmUgaXMgbm8gZGF0YSwgdGhlIGNvbXBvbmVudCBoYXZlIHRvIGhhdmUgd2l0aCBmaXhlZCBkYXRhXG4gICAgICogQGFwaVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhIEEgcm9sbGluZyBkYXRhXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtmbG93XSBBIGRpcmVjdGlvbiByb2xsaW5nXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiByb2xsaW5nLnJvbGwoJzxkaXY+ZGF0YTwvZGl2PicsICdob3Jpem9udGFsJyk7XG4gICAgICovXG4gICAgcm9sbDogZnVuY3Rpb24oZGF0YSwgZmxvdykge1xuICAgICAgICBmbG93ID0gZmxvdyB8fCB0aGlzLl9mbG93O1xuXG4gICAgICAgIC8vIElmIHJvbGxpbmcgc3RhdHVzIGlzIG5vdCBpZGxlLCByZXR1cm5cbiAgICAgICAgaWYgKHRoaXMuX3JvbGxlci5zdGF0dXMgIT09ICdpZGxlJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX29wdGlvbi5pc1ZhcmlhYmxlKSB7XG4gICAgICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JvbGwgbXVzdCBydW4gd2l0aCBkYXRhJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2V0RmxvdyhmbG93KTtcbiAgICAgICAgICAgIHRoaXMuX3JvbGxlci5tb3ZlKGRhdGEpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgb3ZlckJvdW5kYXJ5O1xuICAgICAgICAgICAgdGhpcy5zZXRGbG93KGZsb3cpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX21vZGVsKSB7XG4gICAgICAgICAgICAgICAgb3ZlckJvdW5kYXJ5ID0gdGhpcy5fbW9kZWwuY2hhbmdlQ3VycmVudChmbG93KTtcbiAgICAgICAgICAgICAgICBkYXRhID0gdGhpcy5fbW9kZWwuZ2V0RGF0YSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoIW92ZXJCb3VuZGFyeSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JvbGxlci5tb3ZlKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IGRpcmVjdGlvblxuICAgICAqIEBhcGlcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmxvdyBBIGRpcmVjdGlvbiBvZiByb2xsaW5nXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiByb2xsaW5nLnNldEZsb3coJ2hvcml6b250YWwnKTtcbiAgICAgKi9cbiAgICBzZXRGbG93OiBmdW5jdGlvbihmbG93KSB7XG4gICAgICAgIHRoaXMuX2Zsb3cgPSBmbG93O1xuICAgICAgICB0aGlzLl9yb2xsZXIuc2V0RmxvdyhmbG93KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTW92ZSB0byB0YXJnZXQgcGFnZVxuICAgICAqIEBhcGlcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcGFnZSBBIHRhcmdldCBwYWdlXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiByb2xsaW5nLm1vdmVUbygzKTtcbiAgICAgKi9cbiAgICBtb3ZlVG86IGZ1bmN0aW9uKHBhZ2UpIHtcblxuICAgICAgICBpZiAodGhpcy5faXNEcmF3bikge1xuICAgICAgICAgICAgdGhpcy5fcm9sbGVyLm1vdmVUbyhwYWdlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsZW4gPSB0aGlzLl9tb2RlbC5nZXREYXRhTGlzdExlbmd0aCgpLFxuICAgICAgICAgICAgbWF4ID0gTWF0aC5taW4obGVuLCBwYWdlKSxcbiAgICAgICAgICAgIG1pbiA9IE1hdGgubWF4KDEsIHBhZ2UpLFxuICAgICAgICAgICAgY3VycmVudCA9IHRoaXMuX21vZGVsLmdldEN1cnJlbnQoKSxcbiAgICAgICAgICAgIGR1cmF0aW9uLFxuICAgICAgICAgICAgYWJzSW50ZXJ2YWwsXG4gICAgICAgICAgICBpc1ByZXYsXG4gICAgICAgICAgICBmbG93LFxuICAgICAgICAgICAgaTtcblxuICAgICAgICBpZiAoaXNOYU4oTnVtYmVyKHBhZ2UpKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCcjUGFnZUVycm9yIG1vdmVUbyBtZXRob2QgaGF2ZSB0byBydW4gd2l0aCBwYWdlJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX29wdGlvbi5pc1ZhcmlhYmxlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJyNEYXRhRXJyb3IgOiBWYXJpYWJsZSBSb2xsaW5nIGNhblxcJ3QgdXNlIG1vdmVUbycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaXNQcmV2ID0gdGhpcy5pc05lZ2F0aXZlKHBhZ2UgLSBjdXJyZW50KTtcbiAgICAgICAgcGFnZSA9IGlzUHJldiA/IG1pbiA6IG1heDtcbiAgICAgICAgZmxvdyA9IGlzUHJldiA/ICdwcmV2JyA6ICduZXh0JztcbiAgICAgICAgYWJzSW50ZXJ2YWwgPSBNYXRoLmFicyhwYWdlIC0gY3VycmVudCk7XG4gICAgICAgIGR1cmF0aW9uID0gdGhpcy5fb3B0aW9uLmR1cmF0aW9uIC8gYWJzSW50ZXJ2YWw7XG5cbiAgICAgICAgdGhpcy5zZXRGbG93KGZsb3cpO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBhYnNJbnRlcnZhbDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9tb2RlbC5jaGFuZ2VDdXJyZW50KGZsb3cpO1xuICAgICAgICAgICAgdGhpcy5fcm9sbGVyLm1vdmUodGhpcy5fbW9kZWwuZ2V0RGF0YSgpLCBkdXJhdGlvbik7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayB0aGUgbnVtYmVyIGlzIG5lZ2F0aXZlIG9yIG5vdFxuICAgICAqIEBwYXJhbSBudW1iZXIgQSBudW1iZXIgdG8gZmlndXJlIG91dFxuICAgICAqL1xuICAgIGlzTmVnYXRpdmU6IGZ1bmN0aW9uKG51bWJlcikge1xuICAgICAgICByZXR1cm4gIWlzTmFOKG51bWJlcikgJiYgbnVtYmVyIDwgMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU3RvcCBhdXRvIHJvbGxpbmdcbiAgICAgKi9cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5fdGltZXIpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTdGFydCBhdXRvIHJvbGxpbmdcbiAgICAgKiBAYXBpXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiByb2xsaW5nLmF1dG8oKTtcbiAgICAgKi9cbiAgICBhdXRvOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgIHRoaXMuX3RpbWVyID0gd2luZG93LnNldEludGVydmFsKHR1aS51dGlsLmJpbmQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLl9tb2RlbC5jaGFuZ2VDdXJyZW50KHRoaXMuX2Zsb3cpO1xuICAgICAgICAgICAgdGhpcy5fcm9sbGVyLm1vdmUodGhpcy5fbW9kZWwuZ2V0RGF0YSgpKTtcblxuICAgICAgICB9LCB0aGlzKSwgdGhpcy5kZWxheVRpbWUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2ggY3VzdG9tIGV2ZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgQSBldmVudCB0eXBlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQSBjYWxsYmFjayBmdW5jdGlvbiBmb3IgY3VzdG9tIGV2ZW50IFxuICAgICAqL1xuICAgIGF0dGFjaDogZnVuY3Rpb24odHlwZSwgY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5fcm9sbGVyLm9uKHR5cGUsIGNhbGxiYWNrKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUnVuIGN1c3RvbSBldmVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIEEgZXZlbnQgdHlwZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gQSBkYXRhIGZyb20gZmlyZSBldmVudFxuICAgICAqL1xuICAgIGZpcmU6IGZ1bmN0aW9uKHR5cGUsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fcm9sbGVyLmZpcmUodHlwZSwgb3B0aW9ucyk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUm9sbGluZztcbiJdfQ==

/**
 * tui-component-rolling
 * @author NHNEnt FE Development Lab <dl_javascript@nhnent.com>
 * @version v1.0.2
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
 * @ignore
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
 * @ignore
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
 * @ignore
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
 * @ignore
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
 * @class
 */
var Rolling = tui.util.defineClass(/** @lends Rolling.prototype */{
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInNyYy9qcy9tb3Rpb24uanMiLCJzcmMvanMvcm9sbGRhdGEuanMiLCJzcmMvanMvcm9sbGVyLmpzIiwic3JjL2pzL3JvbGxpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJvbGxpbmcgPSByZXF1aXJlKCcuL3NyYy9qcy9yb2xsaW5nJyk7XG5cbnR1aS51dGlsLmRlZmluZU5hbWVzcGFjZSgndHVpLmNvbXBvbmVudCcsIHtcbiAgUm9sbGluZzogUm9sbGluZ1xufSk7XG4iLCIvKipcbiAqIFJvbGxpbmcgbW90aW9uIGNvbGxlY3Rpb24gXG4gKiBAbmFtZXNwYWNlIG1vdGlvblxuICogQGlnbm9yZVxuICovXG52YXIgbW90aW9uID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBxdWFkRWFzZUluLFxuICAgICAgICBjaXJjRWFzZUluLFxuICAgICAgICBxdWFkRWFzZU91dCxcbiAgICAgICAgY2lyY0Vhc2VPdXQsXG4gICAgICAgIHF1YWRFYXNlSW5PdXQsXG4gICAgICAgIGNpcmNFYXNlSW5PdXQ7XG5cbiAgICAvKipcbiAgICAgKiBlYXNlSW5cbiAgICAgKiBAcGFyYW0gZGVsdGFcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gICAgICovXG4gICAgZnVuY3Rpb24gbWFrZUVhc2VJbihkZWx0YSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24ocHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWx0YShwcm9ncmVzcyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGVhc2VPdXRcbiAgICAgKiBAcGFyYW0gZGVsdGFcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gICAgICovXG4gICAgZnVuY3Rpb24gbWFrZUVhc2VPdXQoZGVsdGEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHByb2dyZXNzKSB7XG4gICAgICAgICAgICByZXR1cm4gMSAtIGRlbHRhKDEgLSBwcm9ncmVzcyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZWFzZUluT3V0XG4gICAgICogQHBhcmFtIGRlbHRhXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1ha2VFYXNlSW5PdXQoZGVsdGEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHByb2dyZXNzKSB7XG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MgPCAwLjUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVsdGEoMiAqIHByb2dyZXNzKSAvIDI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAoMiAtIGRlbHRhKDIgKiAoMSAtIHByb2dyZXNzKSkpIC8gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTGluZWFyXG4gICAgICogQG1lbWJlcm9mIG1vdGlvblxuICAgICAqIEBtZXRob2QgbGluZWFyXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxpbmVhcihwcm9ncmVzcykge1xuICAgICAgICByZXR1cm4gcHJvZ3Jlc3M7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHF1YWQocHJvZ3Jlc3MpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucG93KHByb2dyZXNzLCAyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2lyYyhwcm9ncmVzcykge1xuICAgICAgICByZXR1cm4gMSAtIE1hdGguc2luKE1hdGguYWNvcyhwcm9ncmVzcykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHF1ZWQgKyBlYXNlSW5cbiAgICAgKiBAbWVtYmVyb2YgbW90aW9uXG4gICAgICogQG1ldGhvZCBxdWFkRWFzZUluXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHF1YWRFYXNlSW4gPSBtYWtlRWFzZUluKHF1YWQpO1xuICAgIC8qKlxuICAgICAqIGNpcmMgKyBlYXNlSW5cbiAgICAgKiBAbWVtYmVyb2YgbW90aW9uXG4gICAgICogQG1ldGhvZCBjaXJjRWFzZUluXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgICAgICBjaXJjRWFzZUluID0gbWFrZUVhc2VJbihjaXJjKTtcbiAgICAvKipcbiAgICAgKiBxdWFkICsgZWFzZU91dFxuICAgICAqIEBtZW1iZXJvZiBtb3Rpb25cbiAgICAgKiBAbWV0aG9kIHF1YWRFYXNlT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgICAgICBxdWFkRWFzZU91dCA9IG1ha2VFYXNlT3V0KHF1YWQpO1xuICAgIC8qKlxuICAgICAqIGNpcmMgKyBlYXNlT3V0XG4gICAgICogQG1lbWJlcm9mIG1vdGlvblxuICAgICAqIEBtZXRob2QgY2lyY0Vhc2VPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgY2lyY0Vhc2VPdXQgPSBtYWtlRWFzZU91dChjaXJjKTtcbiAgICAvKipcbiAgICAgKiBxdWFkICsgZWFzZUluT3V0XG4gICAgICogQG1lbWJlcm9mIG1vdGlvblxuICAgICAqIEBtZXRob2QgcXVhZEVhc2VJbk91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBxdWFkRWFzZUluT3V0ID0gbWFrZUVhc2VJbk91dChxdWFkKTtcbiAgICAvKipcbiAgICAgKiBjaXJjICsgZWFzZUluT3V0XG4gICAgICogQG1lbWJlcm9mIG1vdGlvblxuICAgICAqIEBtZXRob2QgY2lyY0Vhc2VJbk91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBjaXJjRWFzZUluT3V0ID0gbWFrZUVhc2VJbk91dChjaXJjKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxpbmVhcjogbGluZWFyLFxuICAgICAgICBlYXNlSW46IHF1YWRFYXNlSW4sXG4gICAgICAgIGVhc2VPdXQ6IHF1YWRFYXNlT3V0LFxuICAgICAgICBlYXNlSW5PdXQ6IHF1YWRFYXNlSW5PdXQsXG4gICAgICAgIHF1YWRFYXNlSW46IHF1YWRFYXNlSW4sXG4gICAgICAgIHF1YWRFYXNlT3V0OiBxdWFkRWFzZU91dCxcbiAgICAgICAgcXVhZEVhc2VJbk91dDogcXVhZEVhc2VJbk91dCxcbiAgICAgICAgY2lyY0Vhc2VJbjogY2lyY0Vhc2VJbixcbiAgICAgICAgY2lyY0Vhc2VPdXQ6IGNpcmNFYXNlT3V0LFxuICAgICAgICBjaXJjRWFzZUluT3V0OiBjaXJjRWFzZUluT3V0XG4gICAgfTtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gbW90aW9uO1xuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IEEgZGF0YSBmb3IgbW92ZVxuICogQGF1dGhvciBOSE4gRW50LiBGRSBkZXYgdGVhbS48ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICogQGRlcGVuZGVuY3kgbmUtY29kZS1zbmlwcGV0XG4gKi9cblxuXG5cbi8qKiBcbiAqIERhdGEgbW9kZWwgZm9yIHJvbGxpbmdcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb24gQSBjb21wb25lbnQgb3B0aW9uc1xuICogQHBhcmFtIHsoQXJyYXl8T2JqZWN0KX0gZGF0YSBBIGRhdGEgb2Ygcm9sbGluZ1xuICogQGNvbnN0cnVjdG9yXG4gKiBAaWdub3JlXG4gKi9cbnZhciBEYXRhID0gdHVpLnV0aWwuZGVmaW5lQ2xhc3MoLyoqIEBsZW5kcyBEYXRhLnByb3RvdHlwZSAqL3tcbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb24sIGRhdGEpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZXRoZXIgY2hhbmdhYmxlIGRhdGFcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmlzVmFyaWFibGUgPSAhIW9wdGlvbi5pc1ZhcmlhYmxlO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBkYXRhIGxpc3RcbiAgICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fZGF0YWxpc3QgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBkYXRhXG4gICAgICAgICAqIEB0eXBlIHtOb2RlfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fZGF0YSA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGluaXQgbnVtYmVyXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9jdXJyZW50ID0gb3B0aW9uLmluaXROdW0gfHwgMTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZWh0ZXIgY2lyY3VsYXJcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9pc0NpcmN1bGFyID0gdHVpLnV0aWwuaXNCb29sZWFuKG9wdGlvbi5pc0NpcmN1bGFyKSA/IG9wdGlvbi5pc0NpcmN1bGFyIDogdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMuaXNWYXJpYWJsZSkge1xuICAgICAgICAgICAgdGhpcy5taXhpbihyZW1vdGVEYXRhTWV0aG9kcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1peGluKHN0YXRpY0RhdGFNZXRob2RzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2luaXREYXRhKGRhdGEpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogTWl4aW5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbWV0aG9kcyBBIG1ldGhvZCBzZXQgW3N0YXRpY0RhdGFNZXRob2RzfHJlbW90ZURhdGFNZXRob2RzXVxuICAgICAqL1xuICAgIG1peGluOiBmdW5jdGlvbihtZXRob2RzKSB7XG4gICAgICAgIHR1aS51dGlsLmV4dGVuZCh0aGlzLCBtZXRob2RzKTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBTdGF0aWMgZGF0YSBtZXRob2Qgc2V0XG4gKiBAbmFtZXNwYWNlIHN0YXRpY0RhdGFNZXRob2RzXG4gKiBAaWdub3JlXG4gKi9cbnZhciBzdGF0aWNEYXRhTWV0aG9kcyA9IHtcbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplIGRhdGFcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhbGlzdCBBIGxpc3QgdGhhdCBpcyBub3QgY29ubmVjdGVkIHdpdGggZWFjaCBvdGhlclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gX2RhdGFsaXN0XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaW5pdERhdGE6IGZ1bmN0aW9uKGRhdGFsaXN0KSB7XG4gICAgICAgIHZhciBiZWZvcmUgPSBudWxsLFxuICAgICAgICAgICAgZmlyc3QsXG4gICAgICAgICAgICBub2RlbGlzdDtcblxuICAgICAgICBub2RlbGlzdCA9IHR1aS51dGlsLm1hcChkYXRhbGlzdCwgZnVuY3Rpb24oZGF0YSwgaW5kZXgpIHtcblxuICAgICAgICAgICAgdmFyIG5vZGUgPSBuZXcgTm9kZShkYXRhKTtcbiAgICAgICAgICAgIG5vZGUucHJldiA9IGJlZm9yZTtcblxuICAgICAgICAgICAgaWYgKGJlZm9yZSkge1xuICAgICAgICAgICAgICAgIGJlZm9yZS5uZXh0ID0gbm9kZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmlyc3QgPSBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSAoZGF0YWxpc3QubGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgICAgICAgICBub2RlLm5leHQgPSBmaXJzdDtcbiAgICAgICAgICAgICAgICBmaXJzdC5wcmV2ID0gbm9kZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYmVmb3JlID0gbm9kZTtcblxuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG5cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIG5vZGVsaXN0LnVuc2hpZnQobnVsbCk7XG4gICAgICAgIHRoaXMuX2RhdGFsaXN0ID0gbm9kZWxpc3Q7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBpbmRleCBkYXRhXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IEEgaW5kZXggdG8gZ2V0XG4gICAgICogQHJldHVybnMge1N0cmluZ31cbiAgICAgKi9cbiAgICBnZXREYXRhOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YWxpc3RbaW5kZXggfHwgdGhpcy5fY3VycmVudF0uZGF0YTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGxpc3QgbGVuZ3RoXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIGdldERhdGFMaXN0TGVuZ3RoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFsaXN0Lmxlbmd0aCAtIDE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBuZXh0IGRhdGFcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggQSBuZXh0IGluZGV4XG4gICAgICogQHJldHVybnMge1N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldFByZXZEYXRhOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YWxpc3RbaW5kZXggfHwgdGhpcy5fY3VycmVudF0ucHJldi5kYXRhO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgcHJldiBkYXRhXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IEEgcHJldiBpbmRleFxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBnZXROZXh0RGF0YTogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFsaXN0W2luZGV4IHx8IHRoaXMuX2N1cnJlbnRdLm5leHQuZGF0YTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlIGN1cnJlbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmxvdyBBIGRpcmVjdGlvblxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgY2hhbmdlQ3VycmVudDogZnVuY3Rpb24oZmxvdykge1xuICAgICAgICB2YXIgbGVuZ3RoID0gdGhpcy5nZXREYXRhTGlzdExlbmd0aCgpO1xuICAgICAgICBpZiAoZmxvdyA9PT0gJ3ByZXYnKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50IC09IDE7XG4gICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudCA8IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50ID0gdGhpcy5faXNDaXJjdWxhciA/IGxlbmd0aCA6IDE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50ICs9IDE7XG4gICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudCA+IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQgPSB0aGlzLl9pc0NpcmN1bGFyID8gMSA6IGxlbmd0aDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogR2V0IGN1cnJlbnRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldEN1cnJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudDtcbiAgICB9XG59O1xuXG4vKipcbiAqIENoYW5nYWJsZSBkYXRhIG1ldGhvZCBzZXRcbiAqIEBuYW1lc3BhY2UgcmVtb3RlRGF0YU1ldGhvZHNcbiAqIEBzdGF0aWNcbiAqIEBpZ25vcmVcbiAqL1xudmFyIHJlbW90ZURhdGFNZXRob2RzID0ge1xuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgZGF0YVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhIEEgZGF0YSB0byBkcmF3XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaW5pdERhdGE6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdGhpcy5fZGF0YSA9IG5ldyBOb2RlKGRhdGEpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgY3VycmVudCBkYXRhIG9yIHNvbWUgZGF0YSBieSBpbmRleFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBBIGluZGV4IG9mIGRhdGFcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgICAqL1xuICAgIGdldERhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YS5kYXRhO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgZGF0YVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFsncHJldnxuZXh0J10gQSBkYXRhIGluZGV4XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGEgQSBkYXRhIGluIHJvbGxpbmcgY29tcG9uZW50XG4gICAgICovXG4gICAgc2V0RGF0YTogZnVuY3Rpb24odHlwZSwgZGF0YSkge1xuICAgICAgICB0aGlzLl9kYXRhW3R5cGVdID0gbmV3IE5vZGUoZGF0YSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERpc2Nvbm5lY3QgZGF0YVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFsncHJldnxuZXh0J10gUmV3cml0ZSBkYXRhXG4gICAgICovXG4gICAgc2V2ZXJMaW5rOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5fZGF0YTtcbiAgICAgICAgdGhpcy5fZGF0YSA9IHRoaXMuX2RhdGFbdHlwZV07XG4gICAgICAgIGRhdGFbdHlwZV0gPSBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgcHJldmlvdXMgRGF0YVxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBnZXRQcmV2RGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhLnByZXYgJiYgdGhpcy5fZGF0YS5wcmV2LmRhdGE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBuZXh0IGRhdGFcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZ2V0TmV4dERhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YS5uZXh0ICYmIHRoaXMuX2RhdGEubmV4dC5kYXRhO1xuICAgIH1cbn07XG5cbi8qKlxuICogTm9kZSBmb3IgZWFjaCBkYXRhIHBhbmVsXG4gKiBAbmFtZXNwYWNlIE5vZGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIG5vZGUgZGF0YSBvciBodG1sIHZhbHVlXG4gKiBAaWdub3JlXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIE5vZGUgPSBmdW5jdGlvbihkYXRhKSB7XG5cbiAgICB0aGlzLnByZXYgPSBudWxsO1xuICAgIHRoaXMubmV4dCA9IG51bGw7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRhO1xuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFJvbGxlciBcbiAqIEBhdXRob3IgTkhOIEVudC4gRkUgZGV2IHRlYW0uPGRsX2phdmFzY3JpcHRAbmhuZW50LmNvbT5cbiAqIEBkZXBlbmRlbmN5IG5lLWNvZGUtc25pcHBldFxuICovXG52YXIgbW90aW9uID0gcmVxdWlyZSgnLi9tb3Rpb24nKTtcbi8qKlxuICogUm9sbGVyIHRoYXQgbW92ZSByb2xsaW5nIHBhbmVsXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbiBUaGUgb3B0aW9uIG9mIHJvbGxpbmcgY29tcG9uZW50XG4gKiBAY29uc3RydWN0b3JcbiAqIEBpZ25vcmVcbiAqL1xudmFyIFJvbGxlciA9IHR1aS51dGlsLmRlZmluZUNsYXNzKC8qKiBAbGVuZHMgUm9sbGVyLnByb3RvdHlwZSAqL3tcbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb24sIGluaXREYXRhKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIG9wdGlvbnNcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX29wdGlvbiA9IG9wdGlvbjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgcm9vdCBlbGVtZW50XG4gICAgICAgICAqIEB0eXBlIHsoSFRNTEVsZW1lbnR8U3RyaW5nKX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSB0dWkudXRpbC5pc1N0cmluZyhvcHRpb24uZWxlbWVudCkgPyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvcHRpb24uZWxlbWVudCkgOiBvcHRpb24uZWxlbWVudDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgZGlyZWN0aW9uIG9mIHJvbGxpbmcgKHZlcnRpY2FsfGhvcml6b250YWwpXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSBvcHRpb24uZGlyZWN0aW9uIHx8ICdob3Jpem9udGFsJztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgc3R5bGUgYXR0cmlidXRlIHRvIG1vdmUoJ2xlZnQgfCB0b3AnKVxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fcmFuZ2UgPSB0aGlzLl9kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/ICdsZWZ0JyA6ICd0b3AnO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgdG8gbW92ZVxuICAgICAgICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9tb3Rpb24gPSBtb3Rpb25bb3B0aW9uLm1vdGlvbiB8fCAnbm9lZmZlY3QnXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgcm9sbGluZyB1bml0XG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9yb2xsdW5pdCA9IG9wdGlvbi51bml0IHx8ICdwYWdlJztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZXRoZXIgaHRtbCBpcyBkcmF3biBvciBub3RcbiAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9pc0RyYXduID0gISFvcHRpb24uaXNEcmF3bjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgaXRlbSBwZXIgcGFnZVxuICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2l0ZW1jb3VudCA9IG9wdGlvbi5pdGVtY291bnQ7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGRpcmVjdGlvbiB0byBuZXh0IHJvbGxpbmdcbiAgICAgICAgICogQHR5cGUge1N0cmluZ3xzdHJpbmd9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9mbG93ID0gb3B0aW9uLmZsb3cgfHwgJ25leHQnO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBhbmltYXRpb24gZHVyYXRpb25cbiAgICAgICAgICogQHR5cGUgeyp8bnVtYmVyfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fZHVyYXRpb24gPSBvcHRpb24uZHVyYXRpb24gfHwgMTAwMDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZXRoZXIgY2lyY3VsYXIgb3Igbm90XG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5faXNDaXJjdWxhciA9IHR1aS51dGlsLmlzRXhpc3R5KG9wdGlvbi5pc0NpcmN1bGFyKSA/IG9wdGlvbi5pc0NpcmN1bGFyIDogdHJ1ZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgcm9sbGVyIHN0YXRlXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnN0YXR1cyA9ICdpZGxlJztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgY29udGFpbmVyIHRoYXQgd2lsbCBiZSBtb3ZlZFxuICAgICAgICAgKiBAdHlwZSB7SFRNTEVsZW1lbnR9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9jb250YWluZXIgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogQ2hhbmdhYmxlIGRhdGEgcGFuZWxcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucGFuZWwgPSB7IHByZXY6IG51bGwsIGNlbnRlcjogbnVsbCwgbmV4dDogbnVsbCB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogRml4ZWQgcm9sbGVyIHBhbmVscywgdGhhdCBoYXZlIG5vZGUgbGlzdCBieSBhcnJheVxuICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9wYW5lbHMgPSBbXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJhc2UgZWxlbWVudCBcbiAgICAgICAgICogQHR5cGUge0hUTUxFbGVtZW50fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fYmFzaXMgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogUm9vdCBlbGVtZW50IHdpZHRoLCBpZiBtb3ZlIHVuaXQgaXMgcGFnZSB0aGlzIGlzIG1vdmUgd2lkdGhcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2Rpc3RhbmNlID0gMDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vdmVkIHBhbmVsIHRhcmdldFxuICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl90YXJnZXRzID0gW107XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBRdWV1ZSBmb3Igb3JkZXIgdGhhdCBpcyByZXF1ZXN0ZWQgZHVyaW5nIG1vdmluZyBcbiAgICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fcXVldWUgPSBbXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgbW92ZSB1bml0IGNvdW50XG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl91bml0Q291bnQgPSBvcHRpb24ucm9sbHVuaXQgPT09ICdwYWdlJyA/IDEgOiAob3B0aW9uLnVuaXRDb3VudCB8fCAxKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEN1c3RvbSBldmVudFxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgICAgICAgaWYgKCF0aGlzLl9pc0RyYXduKSB7XG4gICAgICAgICAgICB0aGlzLm1peGluKG1vdmVQYW5lbFNldCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1peGluKG1vdmVDb250YWluZXJTZXQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NldENvbnRhaW5lcigpO1xuICAgICAgICB0aGlzLl9tYXNraW5nKCk7XG4gICAgICAgIHRoaXMuX3NldFVuaXREaXN0YW5jZSgpO1xuXG4gICAgICAgIGlmICh0aGlzLl9pc0RyYXduKSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0UGFuZWwoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZXRQYW5lbChpbml0RGF0YSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE1peGluXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG1ldGhvZHMgQSBtZXRob2Qgc2V0IFtzdGF0aWNEYXRhTWV0aG9kc3xyZW1vdGVEYXRhTWV0aG9kc11cbiAgICAgKi9cbiAgICBtaXhpbjogZnVuY3Rpb24obWV0aG9kcykge1xuICAgICAgICB0dWkudXRpbC5leHRlbmQodGhpcywgbWV0aG9kcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE1hc2tpbmcgXG4gICAgICogQG1ldGhvZFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX21hc2tpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnQsXG4gICAgICAgICAgICBlbGVtZW50U3R5bGUgPSBlbGVtZW50LnN0eWxlO1xuICAgICAgICBlbGVtZW50U3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgICAgICBlbGVtZW50U3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgICAgZWxlbWVudFN0eWxlLndpZHRoID0gZWxlbWVudFN0eWxlLndpZHRoIHx8IChlbGVtZW50LmNsaWVudFdpZHRoICsgJ3B4Jyk7XG4gICAgICAgIGVsZW1lbnRTdHlsZS5oZWlnaHQgPSBlbGVtZW50U3R5bGUuaGVpZ2h0IHx8IChlbGVtZW50LmNsaWVudEhlaWdodCArICdweCcpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgdW5pdCBtb3ZlIGRpc3RhbmNlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0VW5pdERpc3RhbmNlOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgZGlzdCxcbiAgICAgICAgICAgIGVsZW1lbnRTdHlsZSA9IHRoaXMuX2VsZW1lbnQuc3R5bGU7XG5cbiAgICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgICBkaXN0ID0gZWxlbWVudFN0eWxlLndpZHRoLnJlcGxhY2UoJ3B4JywgJycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGlzdCA9IGVsZW1lbnRTdHlsZS5oZWlnaHQucmVwbGFjZSgncHgnLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fcm9sbHVuaXQgIT09ICdwYWdlJyAmJiB0aGlzLl9pc0RyYXduKSB7XG4gICAgICAgICAgICBkaXN0ID0gTWF0aC5jZWlsKGRpc3QgLyB0aGlzLl9pdGVtY291bnQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2Rpc3RhbmNlID0gcGFyc2VJbnQoZGlzdCwgMTApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBRdWV1ZSBtb3ZlIG9yZGVyICAgIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhIEEgcGFnZSBkYXRhXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIEEgZHVhcnRpb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmxvdyBBIGRpcmVjdGlvbiB0byBtb3ZlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfcXVldWVpbmc6IGZ1bmN0aW9uKGRhdGEsIGR1cmF0aW9uLCBmbG93KSB7XG4gICAgICAgIHRoaXMuX3F1ZXVlLnB1c2goe1xuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgIGZsb3c6IGZsb3dcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEEgZGVmYXVsdCBkaXJlY3Rpb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmxvdyBBIGZsb3cgdGhhdCB3aWxsIGJlIGRlZnVhbHQgdmFsdWVcbiAgICAgKi9cbiAgICBzZXRGbG93OiBmdW5jdGlvbihmbG93KSB7XG4gICAgICAgIHRoaXMuX2Zsb3cgPSBmbG93IHx8IHRoaXMuX2Zsb3cgfHwgJ25leHQnO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBjaGFuZ2UgYW5pbWF0aW9uIGVmZmVjdFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIEEgbmFtZSBvZiBlZmZlY3RcbiAgICAgKi9cbiAgICBjaGFuZ2VNb3Rpb246IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgdGhpcy5fbW90aW9uID0gbW90aW9uW3R5cGVdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBbmltYXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbiBBIG9wdGlvbnMgZm9yIGFuaW1hdGluZ1xuICAgICAqL1xuICAgIF9hbmltYXRlOiBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgdmFyIHN0YXJ0ID0gbmV3IERhdGUoKSxcbiAgICAgICAgICAgIGlkID0gd2luZG93LnNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciB0aW1lUGFzc2VkID0gbmV3IERhdGUoKSAtIHN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzcyA9IHRpbWVQYXNzZWQgLyBvcHRpb24uZHVyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgIGRlbHRhO1xuICAgICAgICAgICAgICAgIGlmIChwcm9ncmVzcyA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3MgPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWx0YSA9IG9wdGlvbi5kZWx0YShwcm9ncmVzcyk7XG5cbiAgICAgICAgICAgICAgICBvcHRpb24uc3RlcChkZWx0YSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJvZ3Jlc3MgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwoaWQpO1xuICAgICAgICAgICAgICAgICAgICBvcHRpb24uY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBvcHRpb24uZGVsYXkgfHwgMTApO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIEEgcm9sbGVyIG1ldGhvZCBzZXQgZm9yIGZpeGVkIHBhbmVsXG4gKiBAbmFtZXNwYWNlIG1vdmVQYW5lbFNldFxuICogQHN0YXRpY1xuICogQGlnbm9yZVxuICovXG52YXIgbW92ZVBhbmVsU2V0ID0ge1xuICAgIC8qKlxuICAgICAqIFNldCByb2xsaW5nIGNvbnRhaW5lclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldENvbnRhaW5lcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvcHRpb24gPSB0aGlzLl9vcHRpb24sXG4gICAgICAgICAgICBlbGVtZW50ID0gdGhpcy5fZWxlbWVudCxcbiAgICAgICAgICAgIGZpcnN0Q2hpbGQgPSBlbGVtZW50LmZpcnN0Q2hpbGQsXG4gICAgICAgICAgICB3cmFwLFxuICAgICAgICAgICAgbmV4dCxcbiAgICAgICAgICAgIHRhZyxcbiAgICAgICAgICAgIGNsYXNzTmFtZTtcblxuICAgICAgICBpZiAob3B0aW9uLndyYXBwZXJUYWcpIHtcbiAgICAgICAgICAgIHRhZyA9IG9wdGlvbi53cmFwcGVyVGFnICYmIG9wdGlvbi53cmFwcGVyVGFnLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgICBjbGFzc05hbWUgPSBvcHRpb24ud3JhcHBlclRhZyAmJiBvcHRpb24ud3JhcHBlclRhZy5zcGxpdCgnLicpWzFdIHx8ICcnO1xuICAgICAgICAgICAgd3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgICAgICAgICAgIGlmIChjbGFzc05hbWUpIHtcbiAgICAgICAgICAgIHdyYXAuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQod3JhcCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodHVpLnV0aWwuaXNIVE1MVGFnKGZpcnN0Q2hpbGQpKSB7XG4gICAgICAgICAgICAgICAgd3JhcCA9IGZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXh0ID0gZmlyc3RDaGlsZCAmJiBmaXJzdENoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgaWYgKHR1aS51dGlsLmlzSFRNTFRhZyhuZXh0KSkge1xuICAgICAgICAgICAgICAgIHdyYXAgPSBuZXh0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3cmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LmFwcGVuZENoaWxkKHdyYXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lciA9IHdyYXA7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBNYWtlIHJvbGxpbmcgcGFuZWxcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRQYW5lbDogZnVuY3Rpb24oaW5pdERhdGEpIHtcbiAgICAgICAgdmFyIHBhbmVsID0gdGhpcy5fY29udGFpbmVyLmZpcnN0Q2hpbGQsXG4gICAgICAgICAgICBwYW5lbFNldCA9IHRoaXMucGFuZWwsXG4gICAgICAgICAgICBvcHRpb24gPSB0aGlzLl9vcHRpb24sXG4gICAgICAgICAgICB0YWcsXG4gICAgICAgICAgICBjbGFzc05hbWUsXG4gICAgICAgICAgICBrZXk7XG5cbiAgICAgICAgaWYgKHR1aS51dGlsLmlzU3RyaW5nKG9wdGlvbi5wYW5lbFRhZykpIHtcbiAgICAgICAgICAgIHRhZyA9IChvcHRpb24ucGFuZWxUYWcpLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgICBjbGFzc05hbWUgPSAob3B0aW9uLnBhbmVsVGFnKS5zcGxpdCgnLicpWzFdIHx8ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF0dWkudXRpbC5pc0hUTUxUYWcocGFuZWwpKSB7XG4gICAgICAgICAgICAgICAgcGFuZWwgPSBwYW5lbCAmJiBwYW5lbC5uZXh0U2libGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhZyA9IHR1aS51dGlsLmlzSFRNTFRhZyhwYW5lbCkgPyBwYW5lbC50YWdOYW1lIDogJ2xpJztcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IChwYW5lbCAmJiBwYW5lbC5jbGFzc05hbWUpIHx8ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXG4gICAgICAgIGZvciAoa2V5IGluIHBhbmVsU2V0KSB7XG4gICAgICAgICAgICBwYW5lbFNldFtrZXldID0gdGhpcy5fbWFrZUVsZW1lbnQodGFnLCBjbGFzc05hbWUsIGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICBwYW5lbFNldC5jZW50ZXIuaW5uZXJIVE1MID0gaW5pdERhdGE7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5hcHBlbmRDaGlsZChwYW5lbFNldC5jZW50ZXIpO1xuXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBNYWtlIEhUTUwgRWxlbWVudCAgICAgXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRhZyBBIHRhZyBuYW1lXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZSBBIGNsYXNzIG5hbWVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IEEgY2xhc3Mga2V5IG5hbWVcbiAgICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfbWFrZUVsZW1lbnQ6IGZ1bmN0aW9uKHRhZywgY2xhc3NOYW1lLCBrZXkpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgZWxlbWVudC5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAgICAgZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9ICcwcHgnO1xuICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnO1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHBhbmVsIGRhdGFcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSBBIGRhdGEgZm9yIHJlcGxhY2UgcGFuZWxcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF91cGRhdGVQYW5lbDogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGlzLnBhbmVsW3RoaXMuX2Zsb3cgfHwgJ2NlbnRlciddLmlubmVySFRNTCA9IGRhdGE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFwcGVuZCBtb3ZlIHBhbmVsXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfYXBwZW5kTW92ZURhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZmxvdyA9IHRoaXMuX2Zsb3csXG4gICAgICAgICAgICBtb3ZlUGFuZWwgPSB0aGlzLnBhbmVsW2Zsb3ddLFxuICAgICAgICAgICAgc3R5bGUgPSBtb3ZlUGFuZWwuc3R5bGUsXG4gICAgICAgICAgICBkZXN0ID0gKGZsb3cgPT09ICdwcmV2JyA/IC10aGlzLl9kaXN0YW5jZSA6IHRoaXMuX2Rpc3RhbmNlKSArICdweCc7XG5cbiAgICAgICAgc3R5bGVbdGhpcy5fcmFuZ2VdID0gZGVzdDtcblxuICAgICAgICB0aGlzLm1vdmVQYW5lbCA9IG1vdmVQYW5lbDtcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLmFwcGVuZENoaWxkKG1vdmVQYW5lbCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBlYWNoIHBhbmVscycgbW92ZSBkaXN0YW5jZXNcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZXRNb3ZlU2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZsb3cgPSB0aGlzLl9mbG93O1xuICAgICAgICBpZiAoZmxvdyA9PT0gJ3ByZXYnKSB7XG4gICAgICAgICAgICByZXR1cm4gWzAsIHRoaXMuX2Rpc3RhbmNlXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbLXRoaXMuX2Rpc3RhbmNlLCAwXTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgc3RhcnQgcG9pbnRzXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2dldFN0YXJ0U2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHBhbmVsID0gdGhpcy5wYW5lbCxcbiAgICAgICAgICAgIGZsb3cgPSB0aGlzLl9mbG93LFxuICAgICAgICAgICAgcmFuZ2UgPSB0aGlzLl9yYW5nZSxcbiAgICAgICAgICAgIGlzUHJldiA9IGZsb3cgPT09ICdwcmV2JyxcbiAgICAgICAgICAgIGZpcnN0ID0gaXNQcmV2ID8gcGFuZWxbJ3ByZXYnXSA6IHBhbmVsWydjZW50ZXInXSxcbiAgICAgICAgICAgIHNlY29uZCA9IGlzUHJldiA/IHBhbmVsWydjZW50ZXInXSA6IHBhbmVsWyduZXh0J107XG4gICAgICAgIHJldHVybiBbcGFyc2VJbnQoZmlyc3Quc3R5bGVbcmFuZ2VdLCAxMCksIHBhcnNlSW50KHNlY29uZC5zdHlsZVtyYW5nZV0sIDEwKV07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBtb3ZlIHRhcmdldFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmbG93IEEgZmxvdyB0byBtb3ZlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0VGFyZ2V0OiBmdW5jdGlvbihmbG93KSB7XG4gICAgICAgIHRoaXMuX3RhcmdldHMgPSBbdGhpcy5wYW5lbFsnY2VudGVyJ11dO1xuICAgICAgICBpZiAoZmxvdyA9PT0gJ3ByZXYnKSB7XG4gICAgICAgICAgICB0aGlzLl90YXJnZXRzLnVuc2hpZnQodGhpcy5wYW5lbFtmbG93XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl90YXJnZXRzLnB1c2godGhpcy5wYW5lbFtmbG93XSk7XG4gICAgICAgIH1cblxuICAgIH0sXG4gICAgLyoqXG4gICAgICogQSBwYW5lbCBtb3ZlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgQSBkYXRhIHRvIHVwZGF0ZSBwYW5lbFxuICAgICAqL1xuICAgIG1vdmU6IGZ1bmN0aW9uKGRhdGEsIGR1cmF0aW9uLCBmbG93KSB7XG4gICAgICAgIGZsb3cgPSBmbG93IHx8IHRoaXMuX2Zsb3c7XG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gJ2lkbGUnKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9ICdydW4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcXVldWVpbmcoZGF0YSwgZHVyYXRpb24sIGZsb3cpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJlZm9yZSBtb3ZlIGN1c3RvbSBldmVudCBmaXJlXG4gICAgICAgICAqIEBmaXJlcyBiZWZvcmVNb3ZlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhIElubmVyIEhUTUxcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogdHVpLmNvbXBvbmVudC5Sb2xsaW5nSW5zdGFuY2UuYXR0YWNoKCdiZWZvcmVNb3ZlJywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgKiAgICAvLyAuLi4uLiBydW4gY29kZVxuICAgICAgICAgKiB9KTtcbiAgICAgICAgICovXG4gICAgICAgIHZhciByZXMgPSB0aGlzLmludm9rZSgnYmVmb3JlTW92ZScsIHtkYXRhOiBkYXRhfSk7XG5cbiAgICAgICAgaWYgKCFyZXMpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gJ2lkbGUnO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IG5leHQgcGFuZWxcbiAgICAgICAgdGhpcy5fdXBkYXRlUGFuZWwoZGF0YSk7XG4gICAgICAgIHRoaXMuX2FwcGVuZE1vdmVEYXRhKCk7XG4gICAgICAgIHRoaXMuX3NldFRhcmdldChmbG93KTtcblxuICAgICAgICBpZiAoIXRoaXMuX21vdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fbW92ZVdpdGhvdXRNb3Rpb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX21vdmVXaXRoTW90aW9uKGR1cmF0aW9uKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgcG9zaXRpb25cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9tb3ZlV2l0aG91dE1vdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmbG93ID0gdGhpcy5fZmxvdyxcbiAgICAgICAgICAgIHBvcyA9IHRoaXMuX2dldE1vdmVTZXQoZmxvdyksXG4gICAgICAgICAgICByYW5nZSA9IHRoaXMuX3JhbmdlO1xuICAgICAgICB0dWkudXRpbC5mb3JFYWNoKHRoaXMuX3RhcmdldHMsIGZ1bmN0aW9uKGVsZW1lbnQsIGluZGV4KSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlW3JhbmdlXSA9IHBvc1tpbmRleF0gKyAncHgnO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jb21wbGV0ZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSdW4gYW5pbWF0aW9uXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfbW92ZVdpdGhNb3Rpb246IGZ1bmN0aW9uKGR1cmF0aW9uKSB7XG4gICAgICAgIHZhciBmbG93ID0gdGhpcy5fZmxvdyxcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5fZ2V0U3RhcnRTZXQoZmxvdyksXG4gICAgICAgICAgICBkaXN0YW5jZSA9IHRoaXMuX2Rpc3RhbmNlLFxuICAgICAgICAgICAgcmFuZ2UgPSB0aGlzLl9yYW5nZTtcblxuICAgICAgICBkdXJhdGlvbiA9IGR1cmF0aW9uIHx8IHRoaXMuX2R1cmF0aW9uO1xuXG4gICAgICAgIHRoaXMuX2FuaW1hdGUoe1xuICAgICAgICAgICAgZGVsYXk6IDEwLFxuICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uIHx8IDEwMDAsXG4gICAgICAgICAgICBkZWx0YTogdGhpcy5fbW90aW9uLFxuICAgICAgICAgICAgc3RlcDogdHVpLnV0aWwuYmluZChmdW5jdGlvbihkZWx0YSkge1xuICAgICAgICAgICAgICAgIHR1aS51dGlsLmZvckVhY2godGhpcy5fdGFyZ2V0cywgZnVuY3Rpb24oZWxlbWVudCwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlc3QgPSAoZmxvdyA9PT0gJ3ByZXYnKSA/IGRpc3RhbmNlICogZGVsdGEgOiAtKGRpc3RhbmNlICogZGVsdGEpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlW3JhbmdlXSA9IHN0YXJ0W2luZGV4XSArIGRlc3QgKyAncHgnO1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCB0aGlzKSxcbiAgICAgICAgICAgIGNvbXBsZXRlOiB0dWkudXRpbC5iaW5kKHRoaXMuY29tcGxldGUsIHRoaXMpXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDb21wbGF0ZSBjYWxsYmFja1xuICAgICAqL1xuICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHBhbmVsID0gdGhpcy5wYW5lbCxcbiAgICAgICAgICAgIHRlbXBQYW5lbCxcbiAgICAgICAgICAgIGZsb3cgPSB0aGlzLl9mbG93O1xuXG4gICAgICAgIHRlbXBQYW5lbCA9IHBhbmVsWydjZW50ZXInXTtcbiAgICAgICAgcGFuZWxbJ2NlbnRlciddID0gcGFuZWxbZmxvd107XG4gICAgICAgIHBhbmVsW2Zsb3ddID0gdGVtcFBhbmVsO1xuXG4gICAgICAgIHRoaXMuX3RhcmdldHMgPSBudWxsO1xuICAgICAgICB0aGlzLl9jb250YWluZXIucmVtb3ZlQ2hpbGQodGVtcFBhbmVsKTtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSAnaWRsZSc7XG5cbiAgICAgICAgaWYgKHR1aS51dGlsLmlzTm90RW1wdHkodGhpcy5fcXVldWUpKSB7XG4gICAgICAgICAgICB2YXIgZmlyc3QgPSB0aGlzLl9xdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgdGhpcy5tb3ZlKGZpcnN0LmRhdGEsIGZpcnN0LmR1cmF0aW9uLCBmaXJzdC5mbG93KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQWZ0ZXIgY3VzdG9tIGV2ZW50IHJ1blxuICAgICAgICAgICAgICogQGZpcmVzIGFmdGVyTW92ZVxuICAgICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAgICAqIHR1aS5jb21wb25lbnQuUm9sbGluZ0luc3RhbmNlLmF0dGFjaCgnYWZ0ZXJNb3ZlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgKiAgICAvLyAuLi4uLiBydW4gY29kZVxuICAgICAgICAgICAgICogfSk7XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuZmlyZSgnYWZ0ZXJNb3ZlJyk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIENvbnRhaW5lciBtb3ZlIG1ldGhvZHNcbiAqIEBuYW1lc3BhY2UgbW92ZUNvbnRhaW5lclNldFxuICogQHN0YXRpY1xuICogQGlnbm9yZVxuICovXG52YXIgbW92ZUNvbnRhaW5lclNldCA9IHtcbiAgICAvKipcbiAgICAgKiBTZXQgY29udGFpbmVyXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0Q29udGFpbmVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50LFxuICAgICAgICAgICAgZmlyc3RDaGlsZCA9IGVsZW1lbnQuZmlyc3RDaGlsZCxcbiAgICAgICAgICAgIHdyYXA7XG4gICAgICAgIGlmICh0aGlzLl9pc0RyYXduKSB7XG4gICAgICAgICAgICB3cmFwID0gdHVpLnV0aWwuaXNIVE1MVGFnKGZpcnN0Q2hpbGQpID8gZmlyc3RDaGlsZCA6IGZpcnN0Q2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIgPSB3cmFwO1xuICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyLnN0eWxlW3RoaXMuX3JhbmdlXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2V0SXRlbUNvdW50KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE1vdmUgYXJlYSBjaGVja1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmbG93IEEgZGlyZWN0aW9uIHRvIG1vdmVcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pc0xpbWl0UG9pbnQ6IGZ1bmN0aW9uKGZsb3cpIHtcbiAgICAgICAgdmFyIG1vdmVkID0gdGhpcy5fZ2V0Q3VycmVudFBvc2l0aW9uKCk7XG4gICAgICAgIGlmIChmbG93ID09PSAnbmV4dCcpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxpbWl0ID4gLW1vdmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKG1vdmVkIDwgMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGN1cnJlbnQgcG9zaXRpb25cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZXRDdXJyZW50UG9zaXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5fY29udGFpbmVyLnN0eWxlW3RoaXMuX3JhbmdlXSwgMTApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBNb3ZlIHBhbmVsc1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIEEgZGF0YSB0byB1cGRhdGUgcGFuZWxcbiAgICAgKi9cbiAgICBtb3ZlOiBmdW5jdGlvbihkdXJhdGlvbiwgZmxvdykge1xuICAgICAgICBmbG93ID0gZmxvdyB8fCB0aGlzLl9mbG93O1xuXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gJ2lkbGUnKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9ICdydW4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcXVldWVpbmcoZHVyYXRpb24sIGZsb3cpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpcmUgYmVmb3JlIGN1c3RvbSBldmVudFxuICAgICAgICAgKiBAZmlyZXMgYmVmb3JlTW92ZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSBpbm5lciBIVE1MXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIHR1aS5jb21wb25lbnQuUm9sbGluZ0luc3RhbmNlLmF0dGFjaCgnYmVmb3JlTW92ZScsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICogICAgLy8gLi4uLi4gcnVuIGNvZGVcbiAgICAgICAgICogfSk7XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgcmVzID0gdGhpcy5pbnZva2UoJ2JlZm9yZU1vdmUnKTtcbiAgICAgICAgaWYgKCFyZXMpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gJ2lkbGUnO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIXRoaXMuX2lzQ2lyY3VsYXIgJiYgdGhpcy5faXNMaW1pdFBvaW50KGZsb3cpKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9ICdpZGxlJztcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9pc0NpcmN1bGFyKSB7XG4gICAgICAgICAgICB0aGlzLl9yb3RhdGVQYW5lbChmbG93KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5fbW90aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlV2l0aG91dE1vdGlvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbW92ZVdpdGhNb3Rpb24oZHVyYXRpb24pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBGaXggcGFuZWxzXG4gICAgICovXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5faXNDaXJjdWxhcikge1xuICAgICAgICAgICAgdGhpcy5fc2V0UGFuZWwoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXR1cyA9ICdpZGxlJztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IG1vdmUgZGlzdGFuY2VcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmxvdyBBIGRpcmVjdGlvblxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0TW92ZURpc3RhbmNlOiBmdW5jdGlvbihmbG93KSB7XG4gICAgICAgIHZhciBtb3ZlZCA9IHRoaXMuX2dldEN1cnJlbnRQb3NpdGlvbigpLFxuICAgICAgICAgICAgY2FzdERpc3QgPSB0aGlzLl9kaXN0YW5jZSAqIHRoaXMuX3VuaXRDb3VudDtcbiAgICAgICAgaWYgKGZsb3cgPT09ICdwcmV2Jykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2lzQ2lyY3VsYXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGlzdGFuY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKG1vdmVkICsgY2FzdERpc3QpID4gMCA/IC1tb3ZlZCA6IGNhc3REaXN0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2lzQ2lyY3VsYXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLXRoaXMuX2Rpc3RhbmNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNhc3REaXN0ID4gKHRoaXMubGltaXQgKyBtb3ZlZCk/ICgtdGhpcy5saW1pdCAtIG1vdmVkKSA6IC1jYXN0RGlzdDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgcG9zdGlvblxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX21vdmVXaXRob3V0TW90aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZsb3cgPSB0aGlzLl9mbG93LFxuICAgICAgICAgICAgcG9zID0gdGhpcy5fZ2V0TW92ZURpc3RhbmNlKGZsb3cpLFxuICAgICAgICAgICAgcmFuZ2UgPSB0aGlzLl9yYW5nZSxcbiAgICAgICAgICAgIHN0YXJ0ID0gcGFyc2VJbnQodGhpcy5fY29udGFpbmVyLnN0eWxlW3JhbmdlXSwgMTApO1xuICAgICAgICB0aGlzLl9jb250YWluZXIuc3R5bGVbcmFuZ2VdID0gc3RhcnQgKyBwb3MgKyAncHgnO1xuICAgICAgICB0aGlzLmNvbXBsZXRlKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJ1biBhbmltYXRpb25cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9tb3ZlV2l0aE1vdGlvbjogZnVuY3Rpb24oZHVyYXRpb24pIHtcbiAgICAgICAgdmFyIGZsb3cgPSB0aGlzLl9mbG93LFxuICAgICAgICAgICAgY29udGFpbmVyID0gdGhpcy5fY29udGFpbmVyLFxuICAgICAgICAgICAgcmFuZ2UgPSB0aGlzLl9yYW5nZSxcbiAgICAgICAgICAgIHN0YXJ0ID0gcGFyc2VJbnQoY29udGFpbmVyLnN0eWxlW3JhbmdlXSwgMTApLFxuICAgICAgICAgICAgZGlzdGFuY2UgPSB0aGlzLl9nZXRNb3ZlRGlzdGFuY2UoZmxvdyk7XG4gICAgICAgIGR1cmF0aW9uID0gZHVyYXRpb24gfHwgdGhpcy5fZHVyYXRpb247XG5cbiAgICAgICAgdGhpcy5fYW5pbWF0ZSh7XG4gICAgICAgICAgICBkZWxheTogMTAsXG4gICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24gfHwgMTAwMCxcbiAgICAgICAgICAgIGRlbHRhOiB0aGlzLl9tb3Rpb24sXG4gICAgICAgICAgICBzdGVwOiB0dWkudXRpbC5iaW5kKGZ1bmN0aW9uKGRlbHRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlc3QgPSBkaXN0YW5jZSAqIGRlbHRhO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5zdHlsZVtyYW5nZV0gPSBzdGFydCArIGRlc3QgKyAncHgnO1xuICAgICAgICAgICAgfSwgdGhpcyksXG4gICAgICAgICAgICBjb21wbGV0ZTogdHVpLnV0aWwuYmluZCh0aGlzLmNvbXBsZXRlLCB0aGlzKVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUm90YXRlIHBhbmVsXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZsb3cgQSBmbG93IHRvIHJvdGF0ZSBwYW5lbFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3JvdGF0ZVBhbmVsOiBmdW5jdGlvbihmbG93KSB7XG5cbiAgICAgICAgZmxvdyA9IGZsb3cgfHwgdGhpcy5fZmxvdztcblxuICAgICAgICB2YXIgc3RhbmRhcmQsXG4gICAgICAgICAgICBtb3Zlc2V0LFxuICAgICAgICAgICAgbW92ZXNldExlbmd0aCxcbiAgICAgICAgICAgIHJhbmdlID0gdGhpcy5fcmFuZ2UsXG4gICAgICAgICAgICBjb250YWluZXJNb3ZlRGlzdCxcbiAgICAgICAgICAgIGlzUHJldiA9IGZsb3cgPT09ICdwcmV2JyxcbiAgICAgICAgICAgIGJhc2lzID0gdGhpcy5fYmFzaXM7XG5cbiAgICAgICAgdGhpcy5fc2V0UGFydE9mUGFuZWxzKGZsb3cpO1xuXG4gICAgICAgIG1vdmVzZXQgPSB0aGlzLl9tb3ZlUGFuZWxTZXQ7XG4gICAgICAgIG1vdmVzZXRMZW5ndGggPSBtb3Zlc2V0Lmxlbmd0aDtcbiAgICAgICAgY29udGFpbmVyTW92ZURpc3QgPSB0aGlzLl9nZXRNb3ZlRGlzdGFuY2UoZmxvdyk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2lzSW5jbHVkZSh0aGlzLl9wYW5lbHNbdGhpcy5fYmFzaXNdLCBtb3Zlc2V0KSkge1xuICAgICAgICAgICAgdGhpcy5fYmFzaXMgPSBpc1ByZXYgPyBiYXNpcyAtIG1vdmVzZXRMZW5ndGggOiBiYXNpcyArIG1vdmVzZXRMZW5ndGg7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzUHJldikge1xuICAgICAgICAgICAgc3RhbmRhcmQgPSB0aGlzLl9wYW5lbHNbMF07XG4gICAgICAgICAgICB0dWkudXRpbC5mb3JFYWNoKG1vdmVzZXQsIGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250YWluZXIuaW5zZXJ0QmVmb3JlKGVsZW1lbnQsIHN0YW5kYXJkKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHVpLnV0aWwuZm9yRWFjaChtb3Zlc2V0LCBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY29udGFpbmVyLnN0eWxlW3JhbmdlXSA9IHBhcnNlSW50KHRoaXMuX2NvbnRhaW5lci5zdHlsZVtyYW5nZV0sIDEwKSAtIGNvbnRhaW5lck1vdmVEaXN0ICsgJ3B4JztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgY3VycmVudCBwYW5lbCBpcyBpbmNsdWRlZCByb3RhdGUgcGFuZWxzXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gaXRlbSBBIHRhcmdldCBlbGVtZW50XG4gICAgICogQHBhcmFtIHtBcnJheX0gY29sbGVjaXRvbiBBIGFycmF5IHRvIGNvbXBhcmVcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pc0luY2x1ZGU6IGZ1bmN0aW9uKGl0ZW0sIGNvbGxlY2l0b24pIHtcbiAgICAgICAgdmFyIGksXG4gICAgICAgICAgICBsZW47XG4gICAgICAgIGZvcihpID0gMCwgbGVuID0gY29sbGVjaXRvbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKGNvbGxlY2l0b25baV0gPT09IGl0ZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBGaW5kIHJvdGF0ZSBwYW5lbCBieSBkaXJlY3Rpb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmxvdyBBIGRpcmVjdGlvblxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldFBhcnRPZlBhbmVsczogZnVuY3Rpb24oZmxvdykge1xuICAgICAgICB2YXIgaXRlbWNvdW50ID0gdGhpcy5faXRlbWNvdW50LFxuICAgICAgICAgICAgaXNQcmV2ID0gKGZsb3cgPT09ICdwcmV2JyksXG4gICAgICAgICAgICBjb3VudCA9ICh0aGlzLl9yb2xsdW5pdCAhPT0gJ3BhZ2UnKSA/IDEgOiBpdGVtY291bnQsXG4gICAgICAgICAgICBkaXN0ID0gaXNQcmV2ID8gLWNvdW50IDogY291bnQsXG4gICAgICAgICAgICBwb2ludCA9IGlzUHJldiA/IFtkaXN0XSA6IFswLCBkaXN0XTtcblxuICAgICAgICB0aGlzLl9tb3ZlUGFuZWxTZXQgPSB0aGlzLl9wYW5lbHMuc2xpY2UuYXBwbHkodGhpcy5fcGFuZWxzLCBwb2ludCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBkaXNwbGF5IGl0ZW0gY291bnRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRJdGVtQ291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnQsXG4gICAgICAgICAgICBlbGVtZW50U3R5bGUgPSBlbGVtZW50LnN0eWxlLFxuICAgICAgICAgICAgZWxlbWVudFdpZHRoID0gcGFyc2VJbnQoZWxlbWVudFN0eWxlLndpZHRoIHx8IGVsZW1lbnQuY2xpZW50V2lkdGgsIDEwKSxcbiAgICAgICAgICAgIGVsZW1lbnRIZWlnaHQgPSBwYXJzZUludChlbGVtZW50U3R5bGUuaGVpZ2h0IHx8IGVsZW1lbnQuY2xpZW50SGVpZ2h0LCAxMCksXG4gICAgICAgICAgICBpdGVtID0gdGhpcy5fZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGknKVswXSwgLy8g66eI7YGs7JeF7J2AIGxp66GcIO2UveyKpFxuICAgICAgICAgICAgaXRlbVN0eWxlID0gaXRlbS5zdHlsZSxcbiAgICAgICAgICAgIGl0ZW1XaWR0aCA9IHBhcnNlSW50KGl0ZW1TdHlsZS53aWR0aCB8fCBpdGVtLmNsaWVudFdpZHRoLCAxMCksXG4gICAgICAgICAgICBpdGVtSGVpZ2h0ID0gcGFyc2VJbnQoaXRlbVN0eWxlLmhlaWdodCB8fCBpdGVtLmNsaWVudEhlaWdodCwgMTApO1xuXG4gICAgICAgIGlmICh0aGlzLl9yYW5nZSA9PT0gJ2xlZnQnKSB7XG4gICAgICAgICAgICB0aGlzLl9pdGVtY291bnQgPSBNYXRoLnJvdW5kKGVsZW1lbnRXaWR0aCAvIGl0ZW1XaWR0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9pdGVtY291bnQgPSBNYXRoLnJvdW5kKGVsZW1lbnRIZWlnaHQgLyBpdGVtSGVpZ2h0KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbml0YWxpemUgcGFuZWxzIFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2luaXRQYW5lbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLl9jb250YWluZXIsXG4gICAgICAgICAgICBwYW5lbHMgPSBjb250YWluZXIuY2hpbGROb2RlcyxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBhcnI7XG5cbiAgICAgICAgcGFuZWxzID0gdHVpLnV0aWwudG9BcnJheShwYW5lbHMpO1xuXG4gICAgICAgIHRoaXMuX3BhbmVscyA9IHR1aS51dGlsLmZpbHRlcihwYW5lbHMsIGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0dWkudXRpbC5pc0hUTUxUYWcoZWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0dWkudXRpbC5mb3JFYWNoKHRoaXMuX3BhbmVscywgZnVuY3Rpb24ocGFuZWwsIGluZGV4KSB7XG4gICAgICAgICAgICBwYW5lbC5jbGFzc05hbWUgKz0gJyBfX2luZGV4JyArIGluZGV4ICsgJ19fJztcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBwYW5lbCBsaXN0XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0UGFuZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY29udGFpbmVyID0gdGhpcy5fY29udGFpbmVyLFxuICAgICAgICAgICAgcGFuZWxzID0gY29udGFpbmVyLmNoaWxkTm9kZXMsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgYXJyO1xuXG4gICAgICAgIHBhbmVscyA9IHR1aS51dGlsLnRvQXJyYXkocGFuZWxzKTtcblxuICAgICAgICB0aGlzLl9wYW5lbHMgPSB0dWkudXRpbC5maWx0ZXIocGFuZWxzLCBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdHVpLnV0aWwuaXNIVE1MVGFnKGVsZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fYmFzaXMgPSB0aGlzLl9iYXNpcyB8fCAwO1xuICAgICAgICB0aGlzLl9zZXRCb3VuZGFyeSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgZml4ZWQgYXJlYSBpbmNpcmN1bGFyIHJvbGxpbmdcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmxvdyBBIGRpcmVjdGlvblxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldEJvdW5kYXJ5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHBhbmVscyA9IHRoaXMuX3BhbmVscyxcbiAgICAgICAgICAgIGRpc3RhbmNlID0gdGhpcy5fZGlzdGFuY2UsXG4gICAgICAgICAgICByYW5nZSA9IHRoaXMuX3JhbmdlLFxuICAgICAgICAgICAgcmFuZ2VEaXN0YW5jZSA9IHBhcnNlSW50KHRoaXMuX2VsZW1lbnQuc3R5bGVbcmFuZ2UgPT09ICdsZWZ0JyA/ICd3aWR0aCcgOiAnaGVpZ2h0J10sIDEwKSxcbiAgICAgICAgICAgIHdyYXBBcmVhID0gdGhpcy5fcm9sbHVuaXQgPT09ICdwYWdlJyA/IChkaXN0YW5jZSAvIHRoaXMuX2l0ZW1jb3VudCkgOiBkaXN0YW5jZSAqIHBhbmVscy5sZW5ndGgsXG4gICAgICAgICAgICBsaW1pdERpc3QgPSB3cmFwQXJlYSAtIHJhbmdlRGlzdGFuY2U7XG4gICAgICAgIHRoaXMubGltaXQgPSBsaW1pdERpc3Q7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBjdXJyZW50IGluZGV4IG9uIHNlbGVjdGVkIHBhZ2VcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcGFnZSBBIG1vdmUgcGFuZWwgbnVtYmVyXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9jaGVja1BhZ2VQb3NpdGlvbjogZnVuY3Rpb24ocGFnZSkge1xuICAgICAgICB2YXIgZGlzdCA9IG51bGwsXG4gICAgICAgICAgICBwYW5lbHMgPSB0aGlzLl9wYW5lbHM7XG4gICAgICAgIHR1aS51dGlsLmZvckVhY2gocGFuZWxzLCBmdW5jdGlvbihwYW5lbCwgaW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChwYW5lbC5jbGFzc05hbWUuaW5kZXhPZignX19pbmRleCcgKyBwYWdlKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXR1aS51dGlsLmlzRXhpc3R5KGRpc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3QgPSBpbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGlzdDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQSBtb3ZlIHRvIHNvbWUgcGFuZWwuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHBhZ2UgQSBudW1iZXIgb2YgcGFuZWxcbiAgICAgKi9cbiAgICBtb3ZlVG86IGZ1bmN0aW9uKHBhZ2UpIHtcbiAgICAgICAgcGFnZSA9IE1hdGgubWF4KHBhZ2UsIDApO1xuICAgICAgICBwYWdlID0gTWF0aC5taW4ocGFnZSwgdGhpcy5fcGFuZWxzLmxlbmd0aCAtIDEpO1xuXG4gICAgICAgIHZhciBwb3MgPSB0aGlzLl9jaGVja1BhZ2VQb3NpdGlvbihwYWdlKSxcbiAgICAgICAgICAgIGl0ZW1Db3VudCA9IHRoaXMuX2l0ZW1jb3VudCxcbiAgICAgICAgICAgIHBhbmVsQ291bnQgPSB0aGlzLl9wYW5lbHMubGVuZ3RoLFxuICAgICAgICAgICAgZGlzdGFuY2UgPSB0aGlzLl9kaXN0YW5jZSxcbiAgICAgICAgICAgIGl0ZW1EaXN0ID0gdGhpcy5fcm9sbHVuaXQgPT09ICdwYWdlJyA/IGRpc3RhbmNlIC8gaXRlbUNvdW50IDogZGlzdGFuY2UsXG4gICAgICAgICAgICB1bml0RGlzdCA9IC1wb3MgKiBpdGVtRGlzdDtcblxuICAgICAgICBpZiAoIXRoaXMuX2lzQ2lyY3VsYXIpIHtcbiAgICAgICAgICAgIHVuaXREaXN0ID0gTWF0aC5tYXgodW5pdERpc3QsIC10aGlzLmxpbWl0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVuaXREaXN0ID0gTWF0aC5tYXgodW5pdERpc3QsIC0oaXRlbURpc3QgKiAocGFuZWxDb3VudCAtIGl0ZW1Db3VudCkpKTtcbiAgICAgICAgICAgIHRoaXMuX2Jhc2lzID0gcG9zO1xuICAgICAgICAgICAgdGhpcy5fc2V0UGFuZWwoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jb250YWluZXIuc3R5bGVbdGhpcy5fcmFuZ2VdID0gdW5pdERpc3QgKyAncHgnO1xuICAgIH1cbn07XG5cbnR1aS51dGlsLkN1c3RvbUV2ZW50cy5taXhpbihSb2xsZXIpO1xubW9kdWxlLmV4cG9ydHMgPSBSb2xsZXI7XG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgUm9sbGluZyBjb21wb25lbnQgY29yZS5cbiAqIEBhdXRob3IgTkhOIEVudC4gRkUgZGV2IHRlYW0uPGRsX2phdmFzY3JpcHRAbmhuZW50LmNvbT5cbiAqIEBkZXBlbmRlbmN5IHR1aS1jb2RlLXNuaXBwZXQgfnYuMS4xLjBcbiAqL1xuXG52YXIgUm9sbGVyID0gcmVxdWlyZSgnLi9yb2xsZXInKTtcbnZhciBEYXRhID0gcmVxdWlyZSgnLi9yb2xsZGF0YScpO1xuLyoqXG4gKiBSb2xsaW5nIGNvcmUgb2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uIFRoZSBvcHRpb25zIFxuICogICAgICBAcGFyYW0ge0hUTUxFbGVtZW50fFN0cmluZ30gb3B0aW9uLmVsZW1lbnQgQSByb290IGVsZW1lbnQgb3IgaWQgdGhhdCB3aWxsIGJlY29tZSByb290IGVsZW1lbnQnc1xuICogICAgICBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb24uaXNWYXJpYWJsZT10cnVlfGZhbHNlXSBXaGV0aGVyIHRoZSBkYXRhIGlzIGNoYW5nYWJsZSBvciBub3QgW2RlZmF1bHQgdmFsdWUgaXMgZmFsc2VdXG4gKiAgICAgIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbi5pc0NpcmN1bGFyPXRydWV8ZmFsc2VdIFdoZXRoZXIgY2lyY3VsYXIgb3Igbm90IFtkZWZhdWx0IHZhbHVlIGlzIHRydWUgYnV0IGlzVmFyaWFibGUgdHJ1ZSBjYXNlXVxuICogICAgICBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb24uYXV0bz10cnVlfGZhbHNlXSBXaGV0aGVyIGF1dG8gcm9sbGluZyBvciBub3QgW2RlZmF1bHQgdmFsdWUgaXMgZmFsc2VdXG4gKiAgICAgIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9uLmRlbGF5VGltZT0xMDAwfC4uLl0gRGlzdGFuY2UgdGltZSBvZiBhdXRvIHJvbGxpbmcuIFtkZWZ1bGF0IDMgc2Vjb25kXVxuICogICAgICBAcGFyYW0ge051bWJlcn0gW29wdGlvbi5kaXJlY3Rpb249J2hvcml6b250YWx8dmVydGljYWwnXSBUaGUgZmxvdyBkaXJlY3Rpb24gcGFuZWwgW2RlZmF1bHQgdmFsdWUgaXMgaG9yaXpvbnRhbF1cbiAqICAgICAgQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb24uZHVyYXRpb249JzEwMDB8Li4uXSBBIG1vdmUgZHVyYXRpb25cbiAqICAgICAgQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb24uaW5pdE51bT0nMHwuLi5dIEluaXRhbGl6ZSBzZWxlY3RlZCByb2xsaW5nIHBhbmVsIG51bWJlclxuICogICAgICBAcGFyYW0ge1N0cmluZ30gW29wdGlvbi5tb3Rpb249J2xpbmVhcnxbcXVhZF1lYXNlSW58W3F1YWRdZWFzZU91dHxbcXVhZF1lYXNlSW5PdXR8Y2lyY0Vhc2VJbnxjaXJjRWFzZU91dHxjaXJjRWFzZUluT3V0XSBBIGVmZmVjdCBuYW1lIFtkZWZhdWx0IHZhbHVlIGlzIG5vZWZmZWN0XVxuICogICAgICBAcGFyYW0ge1N0cmluZ30gW29wdGlvbi51bml0PSdpdGVtfHBhZ2UnXSBBIHVuaXQgb2Ygcm9sbGluZ1xuICogICAgICBAcGFyYW0ge1N0cmluZ30gW29wdGlvbi53cmFwcGVyVGFnPSd1bC5jbGFzc05hbWV8ZGl2LmNsYXNzTmFtZSddIEEgdGFnIG5hbWUgZm9yIHBhbmVsIHdhcnBwZXIsIGNvbm5lY3QgdGFnIG5hbWUgd2l0aCBjbGFzcyBuYW1lIGJ5IGRvdHMuIFtkZWZ1YWx0IHZhbHVlIGlzIHVsXVxuICogICAgICBAcGFyYW0ge1N0cmluZ30gW29wdGlvbi5wYW5lbFRhZz0nbGkuY2xhc3NOYW1lJ10gQSB0YWcgbmFtZSBmb3IgcGFuZWwsIGNvbm5lY3QgdGFnIG5hbWUgd2l0aCBjbGFzcyBieSBkb3RzIFtkZWZhdWx0IHZhbHVlIGlzIGxpXVxuICogQHBhcmFtIHtBcnJheXxTdHJpbmd9IGRhdGEgQSBkYXRhIG9mIHJvbGxpbmcgcGFuZWxzXG4gKlxuICogQGV4YW1wbGVcbiAqIHZhciByb2xsID0gbmV3IHR1aS5jb21wb25lbnQuUm9sbGluZyh7XG4gKiAgICAgIGVsZW1lbnQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb2xsaW5nJyksXG4gKiAgICAgIGluaXROdW06IDAsXG4gKiAgICAgIGRpcmVjdGlvbjogJ2hvcml6b250YWwnLFxuICogICAgICBpc1ZhcmlhYmxlOiB0cnVlLFxuICogICAgICB1bml0OiAncGFnZScsXG4gKiAgICAgIGlzQXV0bzogZmFsc2UsXG4gKiAgICAgIG1vdGlvbjogJ2Vhc2VJbk91dCcsXG4gKiAgICAgIGR1cmF0aW9uOjIwMDBcbiAqIH0sIFsnPGRpdj5kYXRhMTwvZGl2PicsJzxkaXY+ZGF0YTI8L2Rpdj4nLCAnPGRpdj5kYXRhMzwvZGl2PiddKTtcbiAqIEBjbGFzc1xuICovXG52YXIgUm9sbGluZyA9IHR1aS51dGlsLmRlZmluZUNsYXNzKC8qKiBAbGVuZHMgUm9sbGluZy5wcm90b3R5cGUgKi97XG4gICAgaW5pdDogZnVuY3Rpb24ob3B0aW9uLCBkYXRhKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPcHRpb24gb2JqZWN0XG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9vcHRpb24gPSBvcHRpb247XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgZmxvdyBvZiBuZXh0IG1vdmVcbiAgICAgICAgICogQHR5cGUge1N0cmluZ3xzdHJpbmd9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9mbG93ID0gb3B0aW9uLmZsb3cgfHwgJ25leHQnO1xuICAgICAgICAvKipcbiAgICAgICAgICogV2hldGhlciBodG1sIGlzIGRyYXduIG9yIG5vdFxuICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2lzRHJhd24gPSAhIW9wdGlvbi5pc0RyYXduO1xuICAgICAgICAvKipcbiAgICAgICAgICogQXV0byByb2xsaW5nIHRpbWVyXG4gICAgICAgICAqIEB0eXBlIHtudWxsfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fdGltZXIgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogQXV0byByb2xsaW5nIGRlbGF5IHRpbWVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZGVsYXlUaW1lID0gdGhpcy5kZWxheVRpbWUgfHwgMzAwMDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgbW9kZWwgZm9yIHJvbGxpbmcgZGF0YVxuICAgICAgICAgKiBAdHlwZSB7RGF0YX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX21vZGVsID0gIW9wdGlvbi5pc0RyYXduID8gbmV3IERhdGEob3B0aW9uLCBkYXRhKSA6IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHJvbGxpbmcgYWN0aW9uIG9iamVjdFxuICAgICAgICAgKiBAdHlwZSB7Um9sbGVyfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fcm9sbGVyID0gbmV3IFJvbGxlcihvcHRpb24sIHRoaXMuX21vZGVsICYmIHRoaXMuX21vZGVsLmdldERhdGEoKSk7XG5cbiAgICAgICAgaWYgKG9wdGlvbi5pbml0TnVtKSB7XG4gICAgICAgICAgICB0aGlzLm1vdmVUbyhvcHRpb24uaW5pdE51bSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEhb3B0aW9uLmlzQXV0bykge1xuICAgICAgICAgICAgdGhpcy5hdXRvKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUm9sbCB0aGUgcm9sbGluZyBjb21wb25lbnQuIElmIHRoZXJlIGlzIG5vIGRhdGEsIHRoZSBjb21wb25lbnQgaGF2ZSB0byBoYXZlIHdpdGggZml4ZWQgZGF0YVxuICAgICAqIEBhcGlcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSBBIHJvbGxpbmcgZGF0YVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbZmxvd10gQSBkaXJlY3Rpb24gcm9sbGluZ1xuICAgICAqIEBleGFtcGxlXG4gICAgICogcm9sbGluZy5yb2xsKCc8ZGl2PmRhdGE8L2Rpdj4nLCAnaG9yaXpvbnRhbCcpO1xuICAgICAqL1xuICAgIHJvbGw6IGZ1bmN0aW9uKGRhdGEsIGZsb3cpIHtcbiAgICAgICAgZmxvdyA9IGZsb3cgfHwgdGhpcy5fZmxvdztcblxuICAgICAgICAvLyBJZiByb2xsaW5nIHN0YXR1cyBpcyBub3QgaWRsZSwgcmV0dXJuXG4gICAgICAgIGlmICh0aGlzLl9yb2xsZXIuc3RhdHVzICE9PSAnaWRsZScpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9vcHRpb24uaXNWYXJpYWJsZSkge1xuICAgICAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdyb2xsIG11c3QgcnVuIHdpdGggZGF0YScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNldEZsb3coZmxvdyk7XG4gICAgICAgICAgICB0aGlzLl9yb2xsZXIubW92ZShkYXRhKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG92ZXJCb3VuZGFyeTtcbiAgICAgICAgICAgIHRoaXMuc2V0RmxvdyhmbG93KTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9tb2RlbCkge1xuICAgICAgICAgICAgICAgIG92ZXJCb3VuZGFyeSA9IHRoaXMuX21vZGVsLmNoYW5nZUN1cnJlbnQoZmxvdyk7XG4gICAgICAgICAgICAgICAgZGF0YSA9IHRoaXMuX21vZGVsLmdldERhdGEoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCFvdmVyQm91bmRhcnkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yb2xsZXIubW92ZShkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBkaXJlY3Rpb25cbiAgICAgKiBAYXBpXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZsb3cgQSBkaXJlY3Rpb24gb2Ygcm9sbGluZ1xuICAgICAqIEBleGFtcGxlXG4gICAgICogcm9sbGluZy5zZXRGbG93KCdob3Jpem9udGFsJyk7XG4gICAgICovXG4gICAgc2V0RmxvdzogZnVuY3Rpb24oZmxvdykge1xuICAgICAgICB0aGlzLl9mbG93ID0gZmxvdztcbiAgICAgICAgdGhpcy5fcm9sbGVyLnNldEZsb3coZmxvdyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE1vdmUgdG8gdGFyZ2V0IHBhZ2VcbiAgICAgKiBAYXBpXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHBhZ2UgQSB0YXJnZXQgcGFnZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogcm9sbGluZy5tb3ZlVG8oMyk7XG4gICAgICovXG4gICAgbW92ZVRvOiBmdW5jdGlvbihwYWdlKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuX2lzRHJhd24pIHtcbiAgICAgICAgICAgIHRoaXMuX3JvbGxlci5tb3ZlVG8ocGFnZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbGVuID0gdGhpcy5fbW9kZWwuZ2V0RGF0YUxpc3RMZW5ndGgoKSxcbiAgICAgICAgICAgIG1heCA9IE1hdGgubWluKGxlbiwgcGFnZSksXG4gICAgICAgICAgICBtaW4gPSBNYXRoLm1heCgxLCBwYWdlKSxcbiAgICAgICAgICAgIGN1cnJlbnQgPSB0aGlzLl9tb2RlbC5nZXRDdXJyZW50KCksXG4gICAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICAgIGFic0ludGVydmFsLFxuICAgICAgICAgICAgaXNQcmV2LFxuICAgICAgICAgICAgZmxvdyxcbiAgICAgICAgICAgIGk7XG5cbiAgICAgICAgaWYgKGlzTmFOKE51bWJlcihwYWdlKSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignI1BhZ2VFcnJvciBtb3ZlVG8gbWV0aG9kIGhhdmUgdG8gcnVuIHdpdGggcGFnZScpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9vcHRpb24uaXNWYXJpYWJsZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCcjRGF0YUVycm9yIDogVmFyaWFibGUgUm9sbGluZyBjYW5cXCd0IHVzZSBtb3ZlVG8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlzUHJldiA9IHRoaXMuaXNOZWdhdGl2ZShwYWdlIC0gY3VycmVudCk7XG4gICAgICAgIHBhZ2UgPSBpc1ByZXYgPyBtaW4gOiBtYXg7XG4gICAgICAgIGZsb3cgPSBpc1ByZXYgPyAncHJldicgOiAnbmV4dCc7XG4gICAgICAgIGFic0ludGVydmFsID0gTWF0aC5hYnMocGFnZSAtIGN1cnJlbnQpO1xuICAgICAgICBkdXJhdGlvbiA9IHRoaXMuX29wdGlvbi5kdXJhdGlvbiAvIGFic0ludGVydmFsO1xuXG4gICAgICAgIHRoaXMuc2V0RmxvdyhmbG93KTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYWJzSW50ZXJ2YWw7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5fbW9kZWwuY2hhbmdlQ3VycmVudChmbG93KTtcbiAgICAgICAgICAgIHRoaXMuX3JvbGxlci5tb3ZlKHRoaXMuX21vZGVsLmdldERhdGEoKSwgZHVyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgdGhlIG51bWJlciBpcyBuZWdhdGl2ZSBvciBub3RcbiAgICAgKiBAcGFyYW0gbnVtYmVyIEEgbnVtYmVyIHRvIGZpZ3VyZSBvdXRcbiAgICAgKi9cbiAgICBpc05lZ2F0aXZlOiBmdW5jdGlvbihudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuICFpc05hTihudW1iZXIpICYmIG51bWJlciA8IDA7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN0b3AgYXV0byByb2xsaW5nXG4gICAgICovXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuX3RpbWVyKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU3RhcnQgYXV0byByb2xsaW5nXG4gICAgICogQGFwaVxuICAgICAqIEBleGFtcGxlXG4gICAgICogcm9sbGluZy5hdXRvKCk7XG4gICAgICovXG4gICAgYXV0bzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICB0aGlzLl90aW1lciA9IHdpbmRvdy5zZXRJbnRlcnZhbCh0dWkudXRpbC5iaW5kKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fbW9kZWwuY2hhbmdlQ3VycmVudCh0aGlzLl9mbG93KTtcbiAgICAgICAgICAgIHRoaXMuX3JvbGxlci5tb3ZlKHRoaXMuX21vZGVsLmdldERhdGEoKSk7XG5cbiAgICAgICAgfSwgdGhpcyksIHRoaXMuZGVsYXlUaW1lKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQXR0YWNoIGN1c3RvbSBldmVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIEEgZXZlbnQgdHlwZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIEEgY2FsbGJhY2sgZnVuY3Rpb24gZm9yIGN1c3RvbSBldmVudCBcbiAgICAgKi9cbiAgICBhdHRhY2g6IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX3JvbGxlci5vbih0eXBlLCBjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJ1biBjdXN0b20gZXZlbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBBIGV2ZW50IHR5cGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIEEgZGF0YSBmcm9tIGZpcmUgZXZlbnRcbiAgICAgKi9cbiAgICBmaXJlOiBmdW5jdGlvbih0eXBlLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX3JvbGxlci5maXJlKHR5cGUsIG9wdGlvbnMpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJvbGxpbmc7XG4iXX0=

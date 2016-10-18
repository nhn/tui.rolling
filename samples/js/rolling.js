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
     * Set rooling container
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
        var res = this.fire('beforeMove', { data: data });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInNyYy9qcy9tb3Rpb24uanMiLCJzcmMvanMvcm9sbGRhdGEuanMiLCJzcmMvanMvcm9sbGVyLmpzIiwic3JjL2pzL3JvbGxpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcjNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBSb2xsaW5nID0gcmVxdWlyZSgnLi9zcmMvanMvcm9sbGluZycpO1xuXG50dWkudXRpbC5kZWZpbmVOYW1lc3BhY2UoJ3R1aS5jb21wb25lbnQnLCB7XG4gIFJvbGxpbmc6IFJvbGxpbmdcbn0pO1xuIiwiLyoqXG4gKiBSb2xsaW5nIG1vdGlvbiBjb2xsZWN0aW9uIFxuICogQG5hbWVzcGFjZSBtb3Rpb25cbiAqL1xudmFyIG1vdGlvbiA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgcXVhZEVhc2VJbixcbiAgICAgICAgY2lyY0Vhc2VJbixcbiAgICAgICAgcXVhZEVhc2VPdXQsXG4gICAgICAgIGNpcmNFYXNlT3V0LFxuICAgICAgICBxdWFkRWFzZUluT3V0LFxuICAgICAgICBjaXJjRWFzZUluT3V0O1xuXG4gICAgLyoqXG4gICAgICogZWFzZUluXG4gICAgICogQHBhcmFtIGRlbHRhXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1ha2VFYXNlSW4oZGVsdGEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHByb2dyZXNzKSB7XG4gICAgICAgICAgICByZXR1cm4gZGVsdGEocHJvZ3Jlc3MpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBlYXNlT3V0XG4gICAgICogQHBhcmFtIGRlbHRhXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1ha2VFYXNlT3V0KGRlbHRhKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihwcm9ncmVzcykge1xuICAgICAgICAgICAgcmV0dXJuIDEgLSBkZWx0YSgxIC0gcHJvZ3Jlc3MpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGVhc2VJbk91dFxuICAgICAqIEBwYXJhbSBkZWx0YVxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtYWtlRWFzZUluT3V0KGRlbHRhKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihwcm9ncmVzcykge1xuICAgICAgICAgICAgaWYgKHByb2dyZXNzIDwgMC41KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlbHRhKDIgKiBwcm9ncmVzcykgLyAyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKDIgLSBkZWx0YSgyICogKDEgLSBwcm9ncmVzcykpKSAvIDI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIExpbmVhclxuICAgICAqIEBtZW1iZXJvZiBtb3Rpb25cbiAgICAgKiBAbWV0aG9kIGxpbmVhclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsaW5lYXIocHJvZ3Jlc3MpIHtcbiAgICAgICAgcmV0dXJuIHByb2dyZXNzO1xuICAgIH1cbiAgICBmdW5jdGlvbiBxdWFkKHByb2dyZXNzKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnBvdyhwcm9ncmVzcywgMik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNpcmMocHJvZ3Jlc3MpIHtcbiAgICAgICAgcmV0dXJuIDEgLSBNYXRoLnNpbihNYXRoLmFjb3MocHJvZ3Jlc3MpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBxdWVkICsgZWFzZUluXG4gICAgICogQG1lbWJlcm9mIG1vdGlvblxuICAgICAqIEBtZXRob2QgcXVhZEVhc2VJblxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBxdWFkRWFzZUluID0gbWFrZUVhc2VJbihxdWFkKTtcbiAgICAvKipcbiAgICAgKiBjaXJjICsgZWFzZUluXG4gICAgICogQG1lbWJlcm9mIG1vdGlvblxuICAgICAqIEBtZXRob2QgY2lyY0Vhc2VJblxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICAgICAgY2lyY0Vhc2VJbiA9IG1ha2VFYXNlSW4oY2lyYyk7XG4gICAgLyoqXG4gICAgICogcXVhZCArIGVhc2VPdXRcbiAgICAgKiBAbWVtYmVyb2YgbW90aW9uXG4gICAgICogQG1ldGhvZCBxdWFkRWFzZU91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICAgICAgcXVhZEVhc2VPdXQgPSBtYWtlRWFzZU91dChxdWFkKTtcbiAgICAvKipcbiAgICAgKiBjaXJjICsgZWFzZU91dFxuICAgICAqIEBtZW1iZXJvZiBtb3Rpb25cbiAgICAgKiBAbWV0aG9kIGNpcmNFYXNlT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIGNpcmNFYXNlT3V0ID0gbWFrZUVhc2VPdXQoY2lyYyk7XG4gICAgLyoqXG4gICAgICogcXVhZCArIGVhc2VJbk91dFxuICAgICAqIEBtZW1iZXJvZiBtb3Rpb25cbiAgICAgKiBAbWV0aG9kIHF1YWRFYXNlSW5PdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcXVhZEVhc2VJbk91dCA9IG1ha2VFYXNlSW5PdXQocXVhZCk7XG4gICAgLyoqXG4gICAgICogY2lyYyArIGVhc2VJbk91dFxuICAgICAqIEBtZW1iZXJvZiBtb3Rpb25cbiAgICAgKiBAbWV0aG9kIGNpcmNFYXNlSW5PdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgY2lyY0Vhc2VJbk91dCA9IG1ha2VFYXNlSW5PdXQoY2lyYyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBsaW5lYXI6IGxpbmVhcixcbiAgICAgICAgZWFzZUluOiBxdWFkRWFzZUluLFxuICAgICAgICBlYXNlT3V0OiBxdWFkRWFzZU91dCxcbiAgICAgICAgZWFzZUluT3V0OiBxdWFkRWFzZUluT3V0LFxuICAgICAgICBxdWFkRWFzZUluOiBxdWFkRWFzZUluLFxuICAgICAgICBxdWFkRWFzZU91dDogcXVhZEVhc2VPdXQsXG4gICAgICAgIHF1YWRFYXNlSW5PdXQ6IHF1YWRFYXNlSW5PdXQsXG4gICAgICAgIGNpcmNFYXNlSW46IGNpcmNFYXNlSW4sXG4gICAgICAgIGNpcmNFYXNlT3V0OiBjaXJjRWFzZU91dCxcbiAgICAgICAgY2lyY0Vhc2VJbk91dDogY2lyY0Vhc2VJbk91dFxuICAgIH07XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1vdGlvbjtcbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBBIGRhdGEgZm9yIG1vdmVcbiAqIEBhdXRob3IgTkhOIEVudC4gRkUgZGV2IHRlYW0uPGRsX2phdmFzY3JpcHRAbmhuZW50LmNvbT5cbiAqIEBkZXBlbmRlbmN5IG5lLWNvZGUtc25pcHBldFxuICovXG5cblxuXG4vKiogXG4gKiBEYXRhIG1vZGVsIGZvciByb2xsaW5nXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uIEEgY29tcG9uZW50IG9wdGlvbnNcbiAqIEBwYXJhbSB7KEFycmF5fE9iamVjdCl9IGRhdGEgQSBkYXRhIG9mIHJvbGxpbmdcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgRGF0YSA9IHR1aS51dGlsLmRlZmluZUNsYXNzKC8qKiBAbGVuZHMgRGF0YS5wcm90b3R5cGUgKi97XG4gICAgaW5pdDogZnVuY3Rpb24ob3B0aW9uLCBkYXRhKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaGV0aGVyIGNoYW5nYWJsZSBkYXRhXG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5pc1ZhcmlhYmxlID0gISFvcHRpb24uaXNWYXJpYWJsZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgZGF0YSBsaXN0XG4gICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2RhdGFsaXN0ID0gbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgZGF0YVxuICAgICAgICAgKiBAdHlwZSB7Tm9kZX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2RhdGEgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBpbml0IG51bWJlclxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fY3VycmVudCA9IG9wdGlvbi5pbml0TnVtIHx8IDE7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaGVodGVyIGNpcmN1bGFyXG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5faXNDaXJjdWxhciA9IHR1aS51dGlsLmlzQm9vbGVhbihvcHRpb24uaXNDaXJjdWxhcikgPyBvcHRpb24uaXNDaXJjdWxhciA6IHRydWU7XG4gICAgICAgIGlmICh0aGlzLmlzVmFyaWFibGUpIHtcbiAgICAgICAgICAgIHRoaXMubWl4aW4ocmVtb3RlRGF0YU1ldGhvZHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5taXhpbihzdGF0aWNEYXRhTWV0aG9kcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9pbml0RGF0YShkYXRhKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIE1peGluXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG1ldGhvZHMgQSBtZXRob2Qgc2V0IFtzdGF0aWNEYXRhTWV0aG9kc3xyZW1vdGVEYXRhTWV0aG9kc11cbiAgICAgKi9cbiAgICBtaXhpbjogZnVuY3Rpb24obWV0aG9kcykge1xuICAgICAgICB0dWkudXRpbC5leHRlbmQodGhpcywgbWV0aG9kcyk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogU3RhdGljIGRhdGEgbWV0aG9kIHNldFxuICogQG5hbWVzcGFjZSBzdGF0aWNEYXRhTWV0aG9kc1xuICovXG52YXIgc3RhdGljRGF0YU1ldGhvZHMgPSB7XG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZSBkYXRhXG4gICAgICogQHBhcmFtIHtBcnJheX0gZGF0YWxpc3QgQSBsaXN0IHRoYXQgaXMgbm90IGNvbm5lY3RlZCB3aXRoIGVhY2ggb3RoZXJcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IF9kYXRhbGlzdFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2luaXREYXRhOiBmdW5jdGlvbihkYXRhbGlzdCkge1xuICAgICAgICB2YXIgYmVmb3JlID0gbnVsbCxcbiAgICAgICAgICAgIGZpcnN0LFxuICAgICAgICAgICAgbm9kZWxpc3Q7XG5cbiAgICAgICAgbm9kZWxpc3QgPSB0dWkudXRpbC5tYXAoZGF0YWxpc3QsIGZ1bmN0aW9uKGRhdGEsIGluZGV4KSB7XG5cbiAgICAgICAgICAgIHZhciBub2RlID0gbmV3IE5vZGUoZGF0YSk7XG4gICAgICAgICAgICBub2RlLnByZXYgPSBiZWZvcmU7XG5cbiAgICAgICAgICAgIGlmIChiZWZvcmUpIHtcbiAgICAgICAgICAgICAgICBiZWZvcmUubmV4dCA9IG5vZGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpcnN0ID0gbm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gKGRhdGFsaXN0Lmxlbmd0aCAtIDEpKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5uZXh0ID0gZmlyc3Q7XG4gICAgICAgICAgICAgICAgZmlyc3QucHJldiA9IG5vZGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJlZm9yZSA9IG5vZGU7XG5cbiAgICAgICAgICAgIHJldHVybiBub2RlO1xuXG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICBub2RlbGlzdC51bnNoaWZ0KG51bGwpO1xuICAgICAgICB0aGlzLl9kYXRhbGlzdCA9IG5vZGVsaXN0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgaW5kZXggZGF0YVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBBIGluZGV4IHRvIGdldFxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAgICovXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFsaXN0W2luZGV4IHx8IHRoaXMuX2N1cnJlbnRdLmRhdGE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBsaXN0IGxlbmd0aFxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXREYXRhTGlzdExlbmd0aDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhbGlzdC5sZW5ndGggLSAxO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgbmV4dCBkYXRhXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IEEgbmV4dCBpbmRleFxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBnZXRQcmV2RGF0YTogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFsaXN0W2luZGV4IHx8IHRoaXMuX2N1cnJlbnRdLnByZXYuZGF0YTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IHByZXYgZGF0YVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBBIHByZXYgaW5kZXhcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZ2V0TmV4dERhdGE6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhbGlzdFtpbmRleCB8fCB0aGlzLl9jdXJyZW50XS5uZXh0LmRhdGE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENoYW5nZSBjdXJyZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZsb3cgQSBkaXJlY3Rpb25cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGNoYW5nZUN1cnJlbnQ6IGZ1bmN0aW9uKGZsb3cpIHtcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMuZ2V0RGF0YUxpc3RMZW5ndGgoKTtcbiAgICAgICAgaWYgKGZsb3cgPT09ICdwcmV2Jykge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudCAtPSAxO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnQgPCAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudCA9IHRoaXMuX2lzQ2lyY3VsYXIgPyBsZW5ndGggOiAxO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudCArPSAxO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnQgPiBsZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50ID0gdGhpcy5faXNDaXJjdWxhciA/IDEgOiBsZW5ndGg7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEdldCBjdXJyZW50XG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXRDdXJyZW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnQ7XG4gICAgfVxufTtcblxuLyoqXG4gKiBDaGFuZ2FibGUgZGF0YSBtZXRob2Qgc2V0XG4gKiBAbmFtZXNwYWNlIHJlbW90ZURhdGFNZXRob2RzXG4gKiBAc3RhdGljXG4gKi9cbnZhciByZW1vdGVEYXRhTWV0aG9kcyA9IHtcbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplIGRhdGFcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSBBIGRhdGEgdG8gZHJhd1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2luaXREYXRhOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHRoaXMuX2RhdGEgPSBuZXcgTm9kZShkYXRhKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGN1cnJlbnQgZGF0YSBvciBzb21lIGRhdGEgYnkgaW5kZXhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggQSBpbmRleCBvZiBkYXRhXG4gICAgICogQHJldHVybnMge1N0cmluZ31cbiAgICAgKi9cbiAgICBnZXREYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGEuZGF0YTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IGRhdGFcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBbJ3ByZXZ8bmV4dCddIEEgZGF0YSBpbmRleFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhIEEgZGF0YSBpbiByb2xsaW5nIGNvbXBvbmVudFxuICAgICAqL1xuICAgIHNldERhdGE6IGZ1bmN0aW9uKHR5cGUsIGRhdGEpIHtcbiAgICAgICAgdGhpcy5fZGF0YVt0eXBlXSA9IG5ldyBOb2RlKGRhdGEpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBEaXNjb25uZWN0IGRhdGFcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBbJ3ByZXZ8bmV4dCddIFJld3JpdGUgZGF0YVxuICAgICAqL1xuICAgIHNldmVyTGluazogZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuX2RhdGE7XG4gICAgICAgIHRoaXMuX2RhdGEgPSB0aGlzLl9kYXRhW3R5cGVdO1xuICAgICAgICBkYXRhW3R5cGVdID0gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IHByZXZpb3VzIERhdGFcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZ2V0UHJldkRhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YS5wcmV2ICYmIHRoaXMuX2RhdGEucHJldi5kYXRhO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgbmV4dCBkYXRhXG4gICAgICogQHJldHVybnMge1N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldE5leHREYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGEubmV4dCAmJiB0aGlzLl9kYXRhLm5leHQuZGF0YTtcbiAgICB9XG59O1xuXG4vKipcbiAqIE5vZGUgZm9yIGVhY2ggZGF0YSBwYW5lbFxuICogQG5hbWVzcGFjZSBOb2RlXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSBub2RlIGRhdGEgb3IgaHRtbCB2YWx1ZVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBOb2RlID0gZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgdGhpcy5wcmV2ID0gbnVsbDtcbiAgICB0aGlzLm5leHQgPSBudWxsO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0YTtcbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBSb2xsZXIgXG4gKiBAYXV0aG9yIE5ITiBFbnQuIEZFIGRldiB0ZWFtLjxkbF9qYXZhc2NyaXB0QG5obmVudC5jb20+XG4gKiBAZGVwZW5kZW5jeSBuZS1jb2RlLXNuaXBwZXRcbiAqL1xudmFyIG1vdGlvbiA9IHJlcXVpcmUoJy4vbW90aW9uJyk7XG4vKipcbiAqIFJvbGxlciB0aGF0IG1vdmUgcm9sbGluZyBwYW5lbFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb24gVGhlIG9wdGlvbiBvZiByb2xsaW5nIGNvbXBvbmVudFxuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBSb2xsZXIgPSB0dWkudXRpbC5kZWZpbmVDbGFzcygvKiogQGxlbmRzIFJvbGxlci5wcm90b3R5cGUgKi97XG4gICAgaW5pdDogZnVuY3Rpb24ob3B0aW9uLCBpbml0RGF0YSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBvcHRpb25zXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9vcHRpb24gPSBvcHRpb247XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHJvb3QgZWxlbWVudFxuICAgICAgICAgKiBAdHlwZSB7KEhUTUxFbGVtZW50fFN0cmluZyl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9lbGVtZW50ID0gdHVpLnV0aWwuaXNTdHJpbmcob3B0aW9uLmVsZW1lbnQpID8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob3B0aW9uLmVsZW1lbnQpIDogb3B0aW9uLmVsZW1lbnQ7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGRpcmVjdGlvbiBvZiByb2xsaW5nICh2ZXJ0aWNhbHxob3Jpem9udGFsKVxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gb3B0aW9uLmRpcmVjdGlvbiB8fCAnaG9yaXpvbnRhbCc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHN0eWxlIGF0dHJpYnV0ZSB0byBtb3ZlKCdsZWZ0IHwgdG9wJylcbiAgICAgICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3JhbmdlID0gdGhpcy5fZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyAnbGVmdCcgOiAndG9wJztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIHRvIG1vdmVcbiAgICAgICAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fbW90aW9uID0gbW90aW9uW29wdGlvbi5tb3Rpb24gfHwgJ25vZWZmZWN0J107XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHJvbGxpbmcgdW5pdFxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fcm9sbHVuaXQgPSBvcHRpb24udW5pdCB8fCAncGFnZSc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaGV0aGVyIGh0bWwgaXMgZHJhd24gb3Igbm90XG4gICAgICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5faXNEcmF3biA9ICEhb3B0aW9uLmlzRHJhd247XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGl0ZW0gcGVyIHBhZ2VcbiAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9pdGVtY291bnQgPSBvcHRpb24uaXRlbWNvdW50O1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBkaXJlY3Rpb24gdG8gbmV4dCByb2xsaW5nXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd8c3RyaW5nfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fZmxvdyA9IG9wdGlvbi5mbG93IHx8ICduZXh0JztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgYW5pbWF0aW9uIGR1cmF0aW9uXG4gICAgICAgICAqIEB0eXBlIHsqfG51bWJlcn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2R1cmF0aW9uID0gb3B0aW9uLmR1cmF0aW9uIHx8IDEwMDA7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaGV0aGVyIGNpcmN1bGFyIG9yIG5vdFxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2lzQ2lyY3VsYXIgPSB0dWkudXRpbC5pc0V4aXN0eShvcHRpb24uaXNDaXJjdWxhcikgPyBvcHRpb24uaXNDaXJjdWxhciA6IHRydWU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHJvbGxlciBzdGF0ZVxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zdGF0dXMgPSAnaWRsZSc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGNvbnRhaW5lciB0aGF0IHdpbGwgYmUgbW92ZWRcbiAgICAgICAgICogQHR5cGUge0hUTUxFbGVtZW50fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fY29udGFpbmVyID0gbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoYW5nYWJsZSBkYXRhIHBhbmVsXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnBhbmVsID0geyBwcmV2OiBudWxsLCBjZW50ZXI6IG51bGwsIG5leHQ6IG51bGwgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpeGVkIHJvbGxlciBwYW5lbHMsIHRoYXQgaGF2ZSBub2RlIGxpc3QgYnkgYXJyYXlcbiAgICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fcGFuZWxzID0gW107XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCYXNlIGVsZW1lbnQgXG4gICAgICAgICAqIEB0eXBlIHtIVE1MRWxlbWVudH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2Jhc2lzID0gbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJvb3QgZWxlbWVudCB3aWR0aCwgaWYgbW92ZSB1bml0IGlzIHBhZ2UgdGhpcyBpcyBtb3ZlIHdpZHRoXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9kaXN0YW5jZSA9IDA7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb3ZlZCBwYW5lbCB0YXJnZXRcbiAgICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fdGFyZ2V0cyA9IFtdO1xuICAgICAgICAvKipcbiAgICAgICAgICogUXVldWUgZm9yIG9yZGVyIHRoYXQgaXMgcmVxdWVzdGVkIGR1cmluZyBtb3ZpbmcgXG4gICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3F1ZXVlID0gW107XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIG1vdmUgdW5pdCBjb3VudFxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fdW5pdENvdW50ID0gb3B0aW9uLnJvbGx1bml0ID09PSAncGFnZScgPyAxIDogKG9wdGlvbi51bml0Q291bnQgfHwgMSk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDdXN0b20gZXZlbnRcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gICAgICAgIGlmICghdGhpcy5faXNEcmF3bikge1xuICAgICAgICAgICAgdGhpcy5taXhpbihtb3ZlUGFuZWxTZXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5taXhpbihtb3ZlQ29udGFpbmVyU2V0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZXRDb250YWluZXIoKTtcbiAgICAgICAgdGhpcy5fbWFza2luZygpO1xuICAgICAgICB0aGlzLl9zZXRVbml0RGlzdGFuY2UoKTtcblxuICAgICAgICBpZiAodGhpcy5faXNEcmF3bikge1xuICAgICAgICAgICAgdGhpcy5faW5pdFBhbmVsKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2V0UGFuZWwoaW5pdERhdGEpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBNaXhpblxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBtZXRob2RzIEEgbWV0aG9kIHNldCBbc3RhdGljRGF0YU1ldGhvZHN8cmVtb3RlRGF0YU1ldGhvZHNdXG4gICAgICovXG4gICAgbWl4aW46IGZ1bmN0aW9uKG1ldGhvZHMpIHtcbiAgICAgICAgdHVpLnV0aWwuZXh0ZW5kKHRoaXMsIG1ldGhvZHMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBNYXNraW5nIFxuICAgICAqIEBtZXRob2RcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9tYXNraW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50LFxuICAgICAgICAgICAgZWxlbWVudFN0eWxlID0gZWxlbWVudC5zdHlsZTtcbiAgICAgICAgZWxlbWVudFN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAgICAgZWxlbWVudFN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICAgIGVsZW1lbnRTdHlsZS53aWR0aCA9IGVsZW1lbnRTdHlsZS53aWR0aCB8fCAoZWxlbWVudC5jbGllbnRXaWR0aCArICdweCcpO1xuICAgICAgICBlbGVtZW50U3R5bGUuaGVpZ2h0ID0gZWxlbWVudFN0eWxlLmhlaWdodCB8fCAoZWxlbWVudC5jbGllbnRIZWlnaHQgKyAncHgnKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IHVuaXQgbW92ZSBkaXN0YW5jZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldFVuaXREaXN0YW5jZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIGRpc3QsXG4gICAgICAgICAgICBlbGVtZW50U3R5bGUgPSB0aGlzLl9lbGVtZW50LnN0eWxlO1xuXG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgZGlzdCA9IGVsZW1lbnRTdHlsZS53aWR0aC5yZXBsYWNlKCdweCcsICcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpc3QgPSBlbGVtZW50U3R5bGUuaGVpZ2h0LnJlcGxhY2UoJ3B4JywgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX3JvbGx1bml0ICE9PSAncGFnZScgJiYgdGhpcy5faXNEcmF3bikge1xuICAgICAgICAgICAgZGlzdCA9IE1hdGguY2VpbChkaXN0IC8gdGhpcy5faXRlbWNvdW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9kaXN0YW5jZSA9IHBhcnNlSW50KGRpc3QsIDEwKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUXVldWUgbW92ZSBvcmRlciAgICBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSBBIHBhZ2UgZGF0YVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBBIGR1YXJ0aW9uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZsb3cgQSBkaXJlY3Rpb24gdG8gbW92ZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3F1ZXVlaW5nOiBmdW5jdGlvbihkYXRhLCBkdXJhdGlvbiwgZmxvdykge1xuICAgICAgICB0aGlzLl9xdWV1ZS5wdXNoKHtcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgICAgICBmbG93OiBmbG93XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBIGRlZmF1bHQgZGlyZWN0aW9uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZsb3cgQSBmbG93IHRoYXQgd2lsbCBiZSBkZWZ1YWx0IHZhbHVlXG4gICAgICovXG4gICAgc2V0RmxvdzogZnVuY3Rpb24oZmxvdykge1xuICAgICAgICB0aGlzLl9mbG93ID0gZmxvdyB8fCB0aGlzLl9mbG93IHx8ICduZXh0JztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogY2hhbmdlIGFuaW1hdGlvbiBlZmZlY3RcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBBIG5hbWUgb2YgZWZmZWN0XG4gICAgICovXG4gICAgY2hhbmdlTW90aW9uOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgIHRoaXMuX21vdGlvbiA9IG1vdGlvblt0eXBlXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQW5pbWF0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb24gQSBvcHRpb25zIGZvciBhbmltYXRpbmdcbiAgICAgKi9cbiAgICBfYW5pbWF0ZTogZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIHZhciBzdGFydCA9IG5ldyBEYXRlKCksXG4gICAgICAgICAgICBpZCA9IHdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGltZVBhc3NlZCA9IG5ldyBEYXRlKCkgLSBzdGFydCxcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3MgPSB0aW1lUGFzc2VkIC8gb3B0aW9uLmR1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICBkZWx0YTtcbiAgICAgICAgICAgICAgICBpZiAocHJvZ3Jlc3MgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2dyZXNzID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVsdGEgPSBvcHRpb24uZGVsdGEocHJvZ3Jlc3MpO1xuXG4gICAgICAgICAgICAgICAgb3B0aW9uLnN0ZXAoZGVsdGEpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHByb2dyZXNzID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKGlkKTtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgb3B0aW9uLmRlbGF5IHx8IDEwKTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBBIHJvbGxlciBtZXRob2Qgc2V0IGZvciBmaXhlZCBwYW5lbFxuICogQG5hbWVzcGFjZSBtb3ZlUGFuZWxTZXRcbiAqIEBzdGF0aWNcbiAqL1xudmFyIG1vdmVQYW5lbFNldCA9IHtcbiAgICAvKipcbiAgICAgKiBTZXQgcm9vbGluZyBjb250YWluZXJcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRDb250YWluZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3B0aW9uID0gdGhpcy5fb3B0aW9uLFxuICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnQsXG4gICAgICAgICAgICBmaXJzdENoaWxkID0gZWxlbWVudC5maXJzdENoaWxkLFxuICAgICAgICAgICAgd3JhcCxcbiAgICAgICAgICAgIG5leHQsXG4gICAgICAgICAgICB0YWcsXG4gICAgICAgICAgICBjbGFzc05hbWU7XG5cbiAgICAgICAgaWYgKG9wdGlvbi53cmFwcGVyVGFnKSB7XG4gICAgICAgICAgICB0YWcgPSBvcHRpb24ud3JhcHBlclRhZyAmJiBvcHRpb24ud3JhcHBlclRhZy5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgICAgY2xhc3NOYW1lID0gb3B0aW9uLndyYXBwZXJUYWcgJiYgb3B0aW9uLndyYXBwZXJUYWcuc3BsaXQoJy4nKVsxXSB8fCAnJztcbiAgICAgICAgICAgIHdyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gICAgICAgICAgICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICB3cmFwLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LmFwcGVuZENoaWxkKHdyYXApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR1aS51dGlsLmlzSFRNTFRhZyhmaXJzdENoaWxkKSkge1xuICAgICAgICAgICAgICAgIHdyYXAgPSBmaXJzdENoaWxkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV4dCA9IGZpcnN0Q2hpbGQgJiYgZmlyc3RDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgIGlmICh0dWkudXRpbC5pc0hUTUxUYWcobmV4dCkpIHtcbiAgICAgICAgICAgICAgICB3cmFwID0gbmV4dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgd3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZCh3cmFwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jb250YWluZXIgPSB3cmFwO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogTWFrZSByb2xsaW5nIHBhbmVsXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0UGFuZWw6IGZ1bmN0aW9uKGluaXREYXRhKSB7XG4gICAgICAgIHZhciBwYW5lbCA9IHRoaXMuX2NvbnRhaW5lci5maXJzdENoaWxkLFxuICAgICAgICAgICAgcGFuZWxTZXQgPSB0aGlzLnBhbmVsLFxuICAgICAgICAgICAgb3B0aW9uID0gdGhpcy5fb3B0aW9uLFxuICAgICAgICAgICAgdGFnLFxuICAgICAgICAgICAgY2xhc3NOYW1lLFxuICAgICAgICAgICAga2V5O1xuXG4gICAgICAgIGlmICh0dWkudXRpbC5pc1N0cmluZyhvcHRpb24ucGFuZWxUYWcpKSB7XG4gICAgICAgICAgICB0YWcgPSAob3B0aW9uLnBhbmVsVGFnKS5zcGxpdCgnLicpWzBdO1xuICAgICAgICAgICAgY2xhc3NOYW1lID0gKG9wdGlvbi5wYW5lbFRhZykuc3BsaXQoJy4nKVsxXSB8fCAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdHVpLnV0aWwuaXNIVE1MVGFnKHBhbmVsKSkge1xuICAgICAgICAgICAgICAgIHBhbmVsID0gcGFuZWwgJiYgcGFuZWwubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YWcgPSB0dWkudXRpbC5pc0hUTUxUYWcocGFuZWwpID8gcGFuZWwudGFnTmFtZSA6ICdsaSc7XG4gICAgICAgICAgICBjbGFzc05hbWUgPSAocGFuZWwgJiYgcGFuZWwuY2xhc3NOYW1lKSB8fCAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblxuICAgICAgICBmb3IgKGtleSBpbiBwYW5lbFNldCkge1xuICAgICAgICAgICAgcGFuZWxTZXRba2V5XSA9IHRoaXMuX21ha2VFbGVtZW50KHRhZywgY2xhc3NOYW1lLCBrZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFuZWxTZXQuY2VudGVyLmlubmVySFRNTCA9IGluaXREYXRhO1xuICAgICAgICB0aGlzLl9jb250YWluZXIuYXBwZW5kQ2hpbGQocGFuZWxTZXQuY2VudGVyKTtcblxuICAgIH0sXG4gICAgLyoqXG4gICAgICogTWFrZSBIVE1MIEVsZW1lbnQgICAgIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0YWcgQSB0YWcgbmFtZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWUgQSBjbGFzcyBuYW1lXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBBIGNsYXNzIGtleSBuYW1lXG4gICAgICogQHJldHVybnMge0hUTUxFbGVtZW50fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX21ha2VFbGVtZW50OiBmdW5jdGlvbih0YWcsIGNsYXNzTmFtZSwga2V5KSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuICAgICAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSAnMHB4JztcbiAgICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSAnMHB4JztcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBwYW5lbCBkYXRhXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGEgQSBkYXRhIGZvciByZXBsYWNlIHBhbmVsXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfdXBkYXRlUGFuZWw6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdGhpcy5wYW5lbFt0aGlzLl9mbG93IHx8ICdjZW50ZXInXS5pbm5lckhUTUwgPSBkYXRhO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBcHBlbmQgbW92ZSBwYW5lbFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2FwcGVuZE1vdmVEYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZsb3cgPSB0aGlzLl9mbG93LFxuICAgICAgICAgICAgbW92ZVBhbmVsID0gdGhpcy5wYW5lbFtmbG93XSxcbiAgICAgICAgICAgIHN0eWxlID0gbW92ZVBhbmVsLnN0eWxlLFxuICAgICAgICAgICAgZGVzdCA9IChmbG93ID09PSAncHJldicgPyAtdGhpcy5fZGlzdGFuY2UgOiB0aGlzLl9kaXN0YW5jZSkgKyAncHgnO1xuXG4gICAgICAgIHN0eWxlW3RoaXMuX3JhbmdlXSA9IGRlc3Q7XG5cbiAgICAgICAgdGhpcy5tb3ZlUGFuZWwgPSBtb3ZlUGFuZWw7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5hcHBlbmRDaGlsZChtb3ZlUGFuZWwpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgZWFjaCBwYW5lbHMnIG1vdmUgZGlzdGFuY2VzXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0TW92ZVNldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmbG93ID0gdGhpcy5fZmxvdztcbiAgICAgICAgaWYgKGZsb3cgPT09ICdwcmV2Jykge1xuICAgICAgICAgICAgcmV0dXJuIFswLCB0aGlzLl9kaXN0YW5jZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gWy10aGlzLl9kaXN0YW5jZSwgMF07XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IHN0YXJ0IHBvaW50c1xuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZXRTdGFydFNldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBwYW5lbCA9IHRoaXMucGFuZWwsXG4gICAgICAgICAgICBmbG93ID0gdGhpcy5fZmxvdyxcbiAgICAgICAgICAgIHJhbmdlID0gdGhpcy5fcmFuZ2UsXG4gICAgICAgICAgICBpc1ByZXYgPSBmbG93ID09PSAncHJldicsXG4gICAgICAgICAgICBmaXJzdCA9IGlzUHJldiA/IHBhbmVsWydwcmV2J10gOiBwYW5lbFsnY2VudGVyJ10sXG4gICAgICAgICAgICBzZWNvbmQgPSBpc1ByZXYgPyBwYW5lbFsnY2VudGVyJ10gOiBwYW5lbFsnbmV4dCddO1xuICAgICAgICByZXR1cm4gW3BhcnNlSW50KGZpcnN0LnN0eWxlW3JhbmdlXSwgMTApLCBwYXJzZUludChzZWNvbmQuc3R5bGVbcmFuZ2VdLCAxMCldO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgbW92ZSB0YXJnZXRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmxvdyBBIGZsb3cgdG8gbW92ZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldFRhcmdldDogZnVuY3Rpb24oZmxvdykge1xuICAgICAgICB0aGlzLl90YXJnZXRzID0gW3RoaXMucGFuZWxbJ2NlbnRlciddXTtcbiAgICAgICAgaWYgKGZsb3cgPT09ICdwcmV2Jykge1xuICAgICAgICAgICAgdGhpcy5fdGFyZ2V0cy51bnNoaWZ0KHRoaXMucGFuZWxbZmxvd10pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdGFyZ2V0cy5wdXNoKHRoaXMucGFuZWxbZmxvd10pO1xuICAgICAgICB9XG5cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEEgcGFuZWwgbW92ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIEEgZGF0YSB0byB1cGRhdGUgcGFuZWxcbiAgICAgKi9cbiAgICBtb3ZlOiBmdW5jdGlvbihkYXRhLCBkdXJhdGlvbiwgZmxvdykge1xuICAgICAgICBmbG93ID0gZmxvdyB8fCB0aGlzLl9mbG93O1xuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09ICdpZGxlJykge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAncnVuJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3F1ZXVlaW5nKGRhdGEsIGR1cmF0aW9uLCBmbG93KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCZWZvcmUgbW92ZSBjdXN0b20gZXZlbnQgZmlyZVxuICAgICAgICAgKiBAZmlyZXMgYmVmb3JlTW92ZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSBJbm5lciBIVE1MXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIHR1aS5jb21wb25lbnQuUm9sbGluZ0luc3RhbmNlLmF0dGFjaCgnYmVmb3JlTW92ZScsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICogICAgLy8gLi4uLi4gcnVuIGNvZGVcbiAgICAgICAgICogfSk7XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgcmVzID0gdGhpcy5maXJlKCdiZWZvcmVNb3ZlJywgeyBkYXRhOiBkYXRhIH0pO1xuXG4gICAgICAgIGlmICghcmVzKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9ICdpZGxlJztcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldCBuZXh0IHBhbmVsXG4gICAgICAgIHRoaXMuX3VwZGF0ZVBhbmVsKGRhdGEpO1xuICAgICAgICB0aGlzLl9hcHBlbmRNb3ZlRGF0YSgpO1xuICAgICAgICB0aGlzLl9zZXRUYXJnZXQoZmxvdyk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9tb3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX21vdmVXaXRob3V0TW90aW9uKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlV2l0aE1vdGlvbihkdXJhdGlvbik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHBvc2l0aW9uXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfbW92ZVdpdGhvdXRNb3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZmxvdyA9IHRoaXMuX2Zsb3csXG4gICAgICAgICAgICBwb3MgPSB0aGlzLl9nZXRNb3ZlU2V0KGZsb3cpLFxuICAgICAgICAgICAgcmFuZ2UgPSB0aGlzLl9yYW5nZTtcbiAgICAgICAgdHVpLnV0aWwuZm9yRWFjaCh0aGlzLl90YXJnZXRzLCBmdW5jdGlvbihlbGVtZW50LCBpbmRleCkge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtyYW5nZV0gPSBwb3NbaW5kZXhdICsgJ3B4JztcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY29tcGxldGUoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUnVuIGFuaW1hdGlvblxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX21vdmVXaXRoTW90aW9uOiBmdW5jdGlvbihkdXJhdGlvbikge1xuICAgICAgICB2YXIgZmxvdyA9IHRoaXMuX2Zsb3csXG4gICAgICAgICAgICBzdGFydCA9IHRoaXMuX2dldFN0YXJ0U2V0KGZsb3cpLFxuICAgICAgICAgICAgZGlzdGFuY2UgPSB0aGlzLl9kaXN0YW5jZSxcbiAgICAgICAgICAgIHJhbmdlID0gdGhpcy5fcmFuZ2U7XG5cbiAgICAgICAgZHVyYXRpb24gPSBkdXJhdGlvbiB8fCB0aGlzLl9kdXJhdGlvbjtcblxuICAgICAgICB0aGlzLl9hbmltYXRlKHtcbiAgICAgICAgICAgIGRlbGF5OiAxMCxcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbiB8fCAxMDAwLFxuICAgICAgICAgICAgZGVsdGE6IHRoaXMuX21vdGlvbixcbiAgICAgICAgICAgIHN0ZXA6IHR1aS51dGlsLmJpbmQoZnVuY3Rpb24oZGVsdGEpIHtcbiAgICAgICAgICAgICAgICB0dWkudXRpbC5mb3JFYWNoKHRoaXMuX3RhcmdldHMsIGZ1bmN0aW9uKGVsZW1lbnQsIGluZGV4KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGRlc3QgPSAoZmxvdyA9PT0gJ3ByZXYnKSA/IGRpc3RhbmNlICogZGVsdGEgOiAtKGRpc3RhbmNlICogZGVsdGEpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlW3JhbmdlXSA9IHN0YXJ0W2luZGV4XSArIGRlc3QgKyAncHgnO1xuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCB0aGlzKSxcbiAgICAgICAgICAgIGNvbXBsZXRlOiB0dWkudXRpbC5iaW5kKHRoaXMuY29tcGxldGUsIHRoaXMpXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDb21wbGF0ZSBjYWxsYmFja1xuICAgICAqL1xuICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHBhbmVsID0gdGhpcy5wYW5lbCxcbiAgICAgICAgICAgIHRlbXBQYW5lbCxcbiAgICAgICAgICAgIGZsb3cgPSB0aGlzLl9mbG93O1xuXG4gICAgICAgIHRlbXBQYW5lbCA9IHBhbmVsWydjZW50ZXInXTtcbiAgICAgICAgcGFuZWxbJ2NlbnRlciddID0gcGFuZWxbZmxvd107XG4gICAgICAgIHBhbmVsW2Zsb3ddID0gdGVtcFBhbmVsO1xuXG4gICAgICAgIHRoaXMuX3RhcmdldHMgPSBudWxsO1xuICAgICAgICB0aGlzLl9jb250YWluZXIucmVtb3ZlQ2hpbGQodGVtcFBhbmVsKTtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSAnaWRsZSc7XG5cbiAgICAgICAgaWYgKHR1aS51dGlsLmlzTm90RW1wdHkodGhpcy5fcXVldWUpKSB7XG4gICAgICAgICAgICB2YXIgZmlyc3QgPSB0aGlzLl9xdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgdGhpcy5tb3ZlKGZpcnN0LmRhdGEsIGZpcnN0LmR1cmF0aW9uLCBmaXJzdC5mbG93KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQWZ0ZXIgY3VzdG9tIGV2ZW50IHJ1blxuICAgICAgICAgICAgICogQGZpcmVzIGFmdGVyTW92ZVxuICAgICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAgICAqIHR1aS5jb21wb25lbnQuUm9sbGluZ0luc3RhbmNlLmF0dGFjaCgnYWZ0ZXJNb3ZlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgKiAgICAvLyAuLi4uLiBydW4gY29kZVxuICAgICAgICAgICAgICogfSk7XG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuZmlyZSgnYWZ0ZXJNb3ZlJyk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIENvbnRhaW5lciBtb3ZlIG1ldGhvZHNcbiAqIEBuYW1lc3BhY2UgbW92ZUNvbnRhaW5lclNldFxuICogQHN0YXRpY1xuICovXG52YXIgbW92ZUNvbnRhaW5lclNldCA9IHtcbiAgICAvKipcbiAgICAgKiBTZXQgY29udGFpbmVyXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0Q29udGFpbmVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50LFxuICAgICAgICAgICAgZmlyc3RDaGlsZCA9IGVsZW1lbnQuZmlyc3RDaGlsZCxcbiAgICAgICAgICAgIHdyYXA7XG4gICAgICAgIGlmICh0aGlzLl9pc0RyYXduKSB7XG4gICAgICAgICAgICB3cmFwID0gdHVpLnV0aWwuaXNIVE1MVGFnKGZpcnN0Q2hpbGQpID8gZmlyc3RDaGlsZCA6IGZpcnN0Q2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIgPSB3cmFwO1xuICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyLnN0eWxlW3RoaXMuX3JhbmdlXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2V0SXRlbUNvdW50KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE1vdmUgYXJlYSBjaGVja1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmbG93IEEgZGlyZWN0aW9uIHRvIG1vdmVcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pc0xpbWl0UG9pbnQ6IGZ1bmN0aW9uKGZsb3cpIHtcbiAgICAgICAgdmFyIG1vdmVkID0gdGhpcy5fZ2V0Q3VycmVudFBvc2l0aW9uKCk7XG4gICAgICAgIGlmIChmbG93ID09PSAnbmV4dCcpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxpbWl0ID4gLW1vdmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKG1vdmVkIDwgMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGN1cnJlbnQgcG9zaXRpb25cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZXRDdXJyZW50UG9zaXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodGhpcy5fY29udGFpbmVyLnN0eWxlW3RoaXMuX3JhbmdlXSwgMTApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBNb3ZlIHBhbmVsc1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIEEgZGF0YSB0byB1cGRhdGUgcGFuZWxcbiAgICAgKi9cbiAgICBtb3ZlOiBmdW5jdGlvbihkdXJhdGlvbiwgZmxvdykge1xuICAgICAgICBmbG93ID0gZmxvdyB8fCB0aGlzLl9mbG93O1xuXG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gJ2lkbGUnKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9ICdydW4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcXVldWVpbmcoZHVyYXRpb24sIGZsb3cpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZpcmUgYmVmb3JlIGN1c3RvbSBldmVudFxuICAgICAgICAgKiBAZmlyZXMgYmVmb3JlTW92ZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSBpbm5lciBIVE1MXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIHR1aS5jb21wb25lbnQuUm9sbGluZ0luc3RhbmNlLmF0dGFjaCgnYmVmb3JlTW92ZScsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICogICAgLy8gLi4uLi4gcnVuIGNvZGVcbiAgICAgICAgICogfSk7XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgcmVzID0gdGhpcy5pbnZva2UoJ2JlZm9yZU1vdmUnKTtcbiAgICAgICAgaWYgKCFyZXMpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gJ2lkbGUnO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKCF0aGlzLl9pc0NpcmN1bGFyICYmIHRoaXMuX2lzTGltaXRQb2ludChmbG93KSkge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAnaWRsZSc7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2lzQ2lyY3VsYXIpIHtcbiAgICAgICAgICAgIHRoaXMuX3JvdGF0ZVBhbmVsKGZsb3cpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fbW90aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlV2l0aG91dE1vdGlvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbW92ZVdpdGhNb3Rpb24oZHVyYXRpb24pO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBGaXggcGFuZWxzXG4gICAgICovXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5faXNDaXJjdWxhcikge1xuICAgICAgICAgICAgdGhpcy5fc2V0UGFuZWwoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXR1cyA9ICdpZGxlJztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IG1vdmUgZGlzdGFuY2VcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmxvdyBBIGRpcmVjdGlvblxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0TW92ZURpc3RhbmNlOiBmdW5jdGlvbihmbG93KSB7XG4gICAgICAgIHZhciBtb3ZlZCA9IHRoaXMuX2dldEN1cnJlbnRQb3NpdGlvbigpLFxuICAgICAgICAgICAgY2FzdERpc3QgPSB0aGlzLl9kaXN0YW5jZSAqIHRoaXMuX3VuaXRDb3VudDtcbiAgICAgICAgaWYgKGZsb3cgPT09ICdwcmV2Jykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2lzQ2lyY3VsYXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGlzdGFuY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKG1vdmVkICsgY2FzdERpc3QpID4gMCA/IC1tb3ZlZCA6IGNhc3REaXN0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2lzQ2lyY3VsYXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLXRoaXMuX2Rpc3RhbmNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNhc3REaXN0ID4gKHRoaXMubGltaXQgKyBtb3ZlZCk/ICgtdGhpcy5saW1pdCAtIG1vdmVkKSA6IC1jYXN0RGlzdDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgcG9zdGlvblxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX21vdmVXaXRob3V0TW90aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZsb3cgPSB0aGlzLl9mbG93LFxuICAgICAgICAgICAgcG9zID0gdGhpcy5fZ2V0TW92ZURpc3RhbmNlKGZsb3cpLFxuICAgICAgICAgICAgcmFuZ2UgPSB0aGlzLl9yYW5nZSxcbiAgICAgICAgICAgIHN0YXJ0ID0gcGFyc2VJbnQodGhpcy5fY29udGFpbmVyLnN0eWxlW3JhbmdlXSwgMTApO1xuICAgICAgICB0aGlzLl9jb250YWluZXIuc3R5bGVbcmFuZ2VdID0gc3RhcnQgKyBwb3MgKyAncHgnO1xuICAgICAgICB0aGlzLmNvbXBsZXRlKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJ1biBhbmltYXRpb25cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9tb3ZlV2l0aE1vdGlvbjogZnVuY3Rpb24oZHVyYXRpb24pIHtcbiAgICAgICAgdmFyIGZsb3cgPSB0aGlzLl9mbG93LFxuICAgICAgICAgICAgY29udGFpbmVyID0gdGhpcy5fY29udGFpbmVyLFxuICAgICAgICAgICAgcmFuZ2UgPSB0aGlzLl9yYW5nZSxcbiAgICAgICAgICAgIHN0YXJ0ID0gcGFyc2VJbnQoY29udGFpbmVyLnN0eWxlW3JhbmdlXSwgMTApLFxuICAgICAgICAgICAgZGlzdGFuY2UgPSB0aGlzLl9nZXRNb3ZlRGlzdGFuY2UoZmxvdyk7XG4gICAgICAgIGR1cmF0aW9uID0gZHVyYXRpb24gfHwgdGhpcy5fZHVyYXRpb247XG5cbiAgICAgICAgdGhpcy5fYW5pbWF0ZSh7XG4gICAgICAgICAgICBkZWxheTogMTAsXG4gICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24gfHwgMTAwMCxcbiAgICAgICAgICAgIGRlbHRhOiB0aGlzLl9tb3Rpb24sXG4gICAgICAgICAgICBzdGVwOiB0dWkudXRpbC5iaW5kKGZ1bmN0aW9uKGRlbHRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlc3QgPSBkaXN0YW5jZSAqIGRlbHRhO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5zdHlsZVtyYW5nZV0gPSBzdGFydCArIGRlc3QgKyAncHgnO1xuICAgICAgICAgICAgfSwgdGhpcyksXG4gICAgICAgICAgICBjb21wbGV0ZTogdHVpLnV0aWwuYmluZCh0aGlzLmNvbXBsZXRlLCB0aGlzKVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUm90YXRlIHBhbmVsXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZsb3cgQSBmbG93IHRvIHJvdGF0ZSBwYW5lbFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3JvdGF0ZVBhbmVsOiBmdW5jdGlvbihmbG93KSB7XG5cbiAgICAgICAgZmxvdyA9IGZsb3cgfHwgdGhpcy5fZmxvdztcblxuICAgICAgICB2YXIgc3RhbmRhcmQsXG4gICAgICAgICAgICBtb3Zlc2V0LFxuICAgICAgICAgICAgbW92ZXNldExlbmd0aCxcbiAgICAgICAgICAgIHJhbmdlID0gdGhpcy5fcmFuZ2UsXG4gICAgICAgICAgICBjb250YWluZXJNb3ZlRGlzdCxcbiAgICAgICAgICAgIGlzUHJldiA9IGZsb3cgPT09ICdwcmV2JyxcbiAgICAgICAgICAgIGJhc2lzID0gdGhpcy5fYmFzaXM7XG5cbiAgICAgICAgdGhpcy5fc2V0UGFydE9mUGFuZWxzKGZsb3cpO1xuXG4gICAgICAgIG1vdmVzZXQgPSB0aGlzLl9tb3ZlUGFuZWxTZXQ7XG4gICAgICAgIG1vdmVzZXRMZW5ndGggPSBtb3Zlc2V0Lmxlbmd0aDtcbiAgICAgICAgY29udGFpbmVyTW92ZURpc3QgPSB0aGlzLl9nZXRNb3ZlRGlzdGFuY2UoZmxvdyk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2lzSW5jbHVkZSh0aGlzLl9wYW5lbHNbdGhpcy5fYmFzaXNdLCBtb3Zlc2V0KSkge1xuICAgICAgICAgICAgdGhpcy5fYmFzaXMgPSBpc1ByZXYgPyBiYXNpcyAtIG1vdmVzZXRMZW5ndGggOiBiYXNpcyArIG1vdmVzZXRMZW5ndGg7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzUHJldikge1xuICAgICAgICAgICAgc3RhbmRhcmQgPSB0aGlzLl9wYW5lbHNbMF07XG4gICAgICAgICAgICB0dWkudXRpbC5mb3JFYWNoKG1vdmVzZXQsIGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250YWluZXIuaW5zZXJ0QmVmb3JlKGVsZW1lbnQsIHN0YW5kYXJkKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHVpLnV0aWwuZm9yRWFjaChtb3Zlc2V0LCBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY29udGFpbmVyLnN0eWxlW3JhbmdlXSA9IHBhcnNlSW50KHRoaXMuX2NvbnRhaW5lci5zdHlsZVtyYW5nZV0sIDEwKSAtIGNvbnRhaW5lck1vdmVEaXN0ICsgJ3B4JztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgY3VycmVudCBwYW5lbCBpcyBpbmNsdWRlZCByb3RhdGUgcGFuZWxzXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gaXRlbSBBIHRhcmdldCBlbGVtZW50XG4gICAgICogQHBhcmFtIHtBcnJheX0gY29sbGVjaXRvbiBBIGFycmF5IHRvIGNvbXBhcmVcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pc0luY2x1ZGU6IGZ1bmN0aW9uKGl0ZW0sIGNvbGxlY2l0b24pIHtcbiAgICAgICAgdmFyIGksXG4gICAgICAgICAgICBsZW47XG4gICAgICAgIGZvcihpID0gMCwgbGVuID0gY29sbGVjaXRvbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKGNvbGxlY2l0b25baV0gPT09IGl0ZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBGaW5kIHJvdGF0ZSBwYW5lbCBieSBkaXJlY3Rpb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmxvdyBBIGRpcmVjdGlvblxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldFBhcnRPZlBhbmVsczogZnVuY3Rpb24oZmxvdykge1xuICAgICAgICB2YXIgaXRlbWNvdW50ID0gdGhpcy5faXRlbWNvdW50LFxuICAgICAgICAgICAgaXNQcmV2ID0gKGZsb3cgPT09ICdwcmV2JyksXG4gICAgICAgICAgICBjb3VudCA9ICh0aGlzLl9yb2xsdW5pdCAhPT0gJ3BhZ2UnKSA/IDEgOiBpdGVtY291bnQsXG4gICAgICAgICAgICBkaXN0ID0gaXNQcmV2ID8gLWNvdW50IDogY291bnQsXG4gICAgICAgICAgICBwb2ludCA9IGlzUHJldiA/IFtkaXN0XSA6IFswLCBkaXN0XTtcblxuICAgICAgICB0aGlzLl9tb3ZlUGFuZWxTZXQgPSB0aGlzLl9wYW5lbHMuc2xpY2UuYXBwbHkodGhpcy5fcGFuZWxzLCBwb2ludCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBkaXNwbGF5IGl0ZW0gY291bnRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRJdGVtQ291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnQsXG4gICAgICAgICAgICBlbGVtZW50U3R5bGUgPSBlbGVtZW50LnN0eWxlLFxuICAgICAgICAgICAgZWxlbWVudFdpZHRoID0gcGFyc2VJbnQoZWxlbWVudFN0eWxlLndpZHRoIHx8IGVsZW1lbnQuY2xpZW50V2lkdGgsIDEwKSxcbiAgICAgICAgICAgIGVsZW1lbnRIZWlnaHQgPSBwYXJzZUludChlbGVtZW50U3R5bGUuaGVpZ2h0IHx8IGVsZW1lbnQuY2xpZW50SGVpZ2h0LCAxMCksXG4gICAgICAgICAgICBpdGVtID0gdGhpcy5fZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGknKVswXSwgLy8g66eI7YGs7JeF7J2AIGxp66GcIO2UveyKpFxuICAgICAgICAgICAgaXRlbVN0eWxlID0gaXRlbS5zdHlsZSxcbiAgICAgICAgICAgIGl0ZW1XaWR0aCA9IHBhcnNlSW50KGl0ZW1TdHlsZS53aWR0aCB8fCBpdGVtLmNsaWVudFdpZHRoLCAxMCksXG4gICAgICAgICAgICBpdGVtSGVpZ2h0ID0gcGFyc2VJbnQoaXRlbVN0eWxlLmhlaWdodCB8fCBpdGVtLmNsaWVudEhlaWdodCwgMTApO1xuXG4gICAgICAgIGlmICh0aGlzLl9yYW5nZSA9PT0gJ2xlZnQnKSB7XG4gICAgICAgICAgICB0aGlzLl9pdGVtY291bnQgPSBNYXRoLnJvdW5kKGVsZW1lbnRXaWR0aCAvIGl0ZW1XaWR0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9pdGVtY291bnQgPSBNYXRoLnJvdW5kKGVsZW1lbnRIZWlnaHQgLyBpdGVtSGVpZ2h0KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbml0YWxpemUgcGFuZWxzIFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2luaXRQYW5lbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLl9jb250YWluZXIsXG4gICAgICAgICAgICBwYW5lbHMgPSBjb250YWluZXIuY2hpbGROb2RlcyxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBhcnI7XG5cbiAgICAgICAgcGFuZWxzID0gdHVpLnV0aWwudG9BcnJheShwYW5lbHMpO1xuXG4gICAgICAgIHRoaXMuX3BhbmVscyA9IHR1aS51dGlsLmZpbHRlcihwYW5lbHMsIGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0dWkudXRpbC5pc0hUTUxUYWcoZWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0dWkudXRpbC5mb3JFYWNoKHRoaXMuX3BhbmVscywgZnVuY3Rpb24ocGFuZWwsIGluZGV4KSB7XG4gICAgICAgICAgICBwYW5lbC5jbGFzc05hbWUgKz0gJyBfX2luZGV4JyArIGluZGV4ICsgJ19fJztcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBwYW5lbCBsaXN0XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0UGFuZWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY29udGFpbmVyID0gdGhpcy5fY29udGFpbmVyLFxuICAgICAgICAgICAgcGFuZWxzID0gY29udGFpbmVyLmNoaWxkTm9kZXMsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgYXJyO1xuXG4gICAgICAgIHBhbmVscyA9IHR1aS51dGlsLnRvQXJyYXkocGFuZWxzKTtcblxuICAgICAgICB0aGlzLl9wYW5lbHMgPSB0dWkudXRpbC5maWx0ZXIocGFuZWxzLCBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdHVpLnV0aWwuaXNIVE1MVGFnKGVsZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fYmFzaXMgPSB0aGlzLl9iYXNpcyB8fCAwO1xuICAgICAgICB0aGlzLl9zZXRCb3VuZGFyeSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgZml4ZWQgYXJlYSBpbmNpcmN1bGFyIHJvbGxpbmdcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmxvdyBBIGRpcmVjdGlvblxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldEJvdW5kYXJ5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHBhbmVscyA9IHRoaXMuX3BhbmVscyxcbiAgICAgICAgICAgIGRpc3RhbmNlID0gdGhpcy5fZGlzdGFuY2UsXG4gICAgICAgICAgICByYW5nZSA9IHRoaXMuX3JhbmdlLFxuICAgICAgICAgICAgcmFuZ2VEaXN0YW5jZSA9IHBhcnNlSW50KHRoaXMuX2VsZW1lbnQuc3R5bGVbcmFuZ2UgPT09ICdsZWZ0JyA/ICd3aWR0aCcgOiAnaGVpZ2h0J10sIDEwKSxcbiAgICAgICAgICAgIHdyYXBBcmVhID0gdGhpcy5fcm9sbHVuaXQgPT09ICdwYWdlJyA/IChkaXN0YW5jZSAvIHRoaXMuX2l0ZW1jb3VudCkgOiBkaXN0YW5jZSAqIHBhbmVscy5sZW5ndGgsXG4gICAgICAgICAgICBsaW1pdERpc3QgPSB3cmFwQXJlYSAtIHJhbmdlRGlzdGFuY2U7XG4gICAgICAgIHRoaXMubGltaXQgPSBsaW1pdERpc3Q7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBjdXJyZW50IGluZGV4IG9uIHNlbGVjdGVkIHBhZ2VcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcGFnZSBBIG1vdmUgcGFuZWwgbnVtYmVyXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9jaGVja1BhZ2VQb3NpdGlvbjogZnVuY3Rpb24ocGFnZSkge1xuICAgICAgICB2YXIgZGlzdCA9IG51bGwsXG4gICAgICAgICAgICBwYW5lbHMgPSB0aGlzLl9wYW5lbHM7XG4gICAgICAgIHR1aS51dGlsLmZvckVhY2gocGFuZWxzLCBmdW5jdGlvbihwYW5lbCwgaW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChwYW5lbC5jbGFzc05hbWUuaW5kZXhPZignX19pbmRleCcgKyBwYWdlKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXR1aS51dGlsLmlzRXhpc3R5KGRpc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3QgPSBpbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGlzdDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQSBtb3ZlIHRvIHNvbWUgcGFuZWwuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHBhZ2UgQSBudW1iZXIgb2YgcGFuZWxcbiAgICAgKi9cbiAgICBtb3ZlVG86IGZ1bmN0aW9uKHBhZ2UpIHtcbiAgICAgICAgcGFnZSA9IE1hdGgubWF4KHBhZ2UsIDApO1xuICAgICAgICBwYWdlID0gTWF0aC5taW4ocGFnZSwgdGhpcy5fcGFuZWxzLmxlbmd0aCAtIDEpO1xuXG4gICAgICAgIHZhciBwb3MgPSB0aGlzLl9jaGVja1BhZ2VQb3NpdGlvbihwYWdlKSxcbiAgICAgICAgICAgIGl0ZW1Db3VudCA9IHRoaXMuX2l0ZW1jb3VudCxcbiAgICAgICAgICAgIHBhbmVsQ291bnQgPSB0aGlzLl9wYW5lbHMubGVuZ3RoLFxuICAgICAgICAgICAgZGlzdGFuY2UgPSB0aGlzLl9kaXN0YW5jZSxcbiAgICAgICAgICAgIGl0ZW1EaXN0ID0gdGhpcy5fcm9sbHVuaXQgPT09ICdwYWdlJyA/IGRpc3RhbmNlIC8gaXRlbUNvdW50IDogZGlzdGFuY2UsXG4gICAgICAgICAgICB1bml0RGlzdCA9IC1wb3MgKiBpdGVtRGlzdDtcblxuICAgICAgICBpZiAoIXRoaXMuX2lzQ2lyY3VsYXIpIHtcbiAgICAgICAgICAgIHVuaXREaXN0ID0gTWF0aC5tYXgodW5pdERpc3QsIC10aGlzLmxpbWl0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVuaXREaXN0ID0gTWF0aC5tYXgodW5pdERpc3QsIC0oaXRlbURpc3QgKiAocGFuZWxDb3VudCAtIGl0ZW1Db3VudCkpKTtcbiAgICAgICAgICAgIHRoaXMuX2Jhc2lzID0gcG9zO1xuICAgICAgICAgICAgdGhpcy5fc2V0UGFuZWwoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jb250YWluZXIuc3R5bGVbdGhpcy5fcmFuZ2VdID0gdW5pdERpc3QgKyAncHgnO1xuICAgIH1cbn07XG5cbnR1aS51dGlsLkN1c3RvbUV2ZW50cy5taXhpbihSb2xsZXIpO1xubW9kdWxlLmV4cG9ydHMgPSBSb2xsZXI7XG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgUm9sbGluZyBjb21wb25lbnQgY29yZS5cbiAqIEBhdXRob3IgTkhOIEVudC4gRkUgZGV2IHRlYW0uPGRsX2phdmFzY3JpcHRAbmhuZW50LmNvbT5cbiAqIEBkZXBlbmRlbmN5IHR1aS1jb2RlLXNuaXBwZXQgfnYuMS4xLjBcbiAqL1xuXG52YXIgUm9sbGVyID0gcmVxdWlyZSgnLi9yb2xsZXInKTtcbnZhciBEYXRhID0gcmVxdWlyZSgnLi9yb2xsZGF0YScpO1xuLyoqXG4gKiBSb2xsaW5nIGNvcmUgb2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uIFRoZSBvcHRpb25zIFxuICogICAgICBAcGFyYW0ge0hUTUxFbGVtZW50fFN0cmluZ30gb3B0aW9uLmVsZW1lbnQgQSByb290IGVsZW1lbnQgb3IgaWQgdGhhdCB3aWxsIGJlY29tZSByb290IGVsZW1lbnQnc1xuICogICAgICBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb24uaXNWYXJpYWJsZT10cnVlfGZhbHNlXSBXaGV0aGVyIHRoZSBkYXRhIGlzIGNoYW5nYWJsZSBvciBub3QgW2RlZmF1bHQgdmFsdWUgaXMgZmFsc2VdXG4gKiAgICAgIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbi5pc0NpcmN1bGFyPXRydWV8ZmFsc2VdIFdoZXRoZXIgY2lyY3VsYXIgb3Igbm90IFtkZWZhdWx0IHZhbHVlIGlzIHRydWUgYnV0IGlzVmFyaWFibGUgdHJ1ZSBjYXNlXVxuICogICAgICBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb24uYXV0bz10cnVlfGZhbHNlXSBXaGV0aGVyIGF1dG8gcm9sbGluZyBvciBub3QgW2RlZmF1bHQgdmFsdWUgaXMgZmFsc2VdXG4gKiAgICAgIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9uLmRlbGF5VGltZT0xMDAwfC4uLl0gRGlzdGFuY2UgdGltZSBvZiBhdXRvIHJvbGxpbmcuIFtkZWZ1bGF0IDMgc2Vjb25kXVxuICogICAgICBAcGFyYW0ge051bWJlcn0gW29wdGlvbi5kaXJlY3Rpb249J2hvcml6b250YWx8dmVydGljYWwnXSBUaGUgZmxvdyBkaXJlY3Rpb24gcGFuZWwgW2RlZmF1bHQgdmFsdWUgaXMgaG9yaXpvbnRhbF1cbiAqICAgICAgQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb24uZHVyYXRpb249JzEwMDB8Li4uXSBBIG1vdmUgZHVyYXRpb25cbiAqICAgICAgQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb24uaW5pdE51bT0nMHwuLi5dIEluaXRhbGl6ZSBzZWxlY3RlZCByb2xsaW5nIHBhbmVsIG51bWJlclxuICogICAgICBAcGFyYW0ge1N0cmluZ30gW29wdGlvbi5tb3Rpb249J2xpbmVhcnxbcXVhZF1lYXNlSW58W3F1YWRdZWFzZU91dHxbcXVhZF1lYXNlSW5PdXR8Y2lyY0Vhc2VJbnxjaXJjRWFzZU91dHxjaXJjRWFzZUluT3V0XSBBIGVmZmVjdCBuYW1lIFtkZWZhdWx0IHZhbHVlIGlzIG5vZWZmZWN0XVxuICogICAgICBAcGFyYW0ge1N0cmluZ30gW29wdGlvbi51bml0PSdpdGVtfHBhZ2UnXSBBIHVuaXQgb2Ygcm9sbGluZ1xuICogICAgICBAcGFyYW0ge1N0cmluZ30gW29wdGlvbi53cmFwcGVyVGFnPSd1bC5jbGFzc05hbWV8ZGl2LmNsYXNzTmFtZSddIEEgdGFnIG5hbWUgZm9yIHBhbmVsIHdhcnBwZXIsIGNvbm5lY3QgdGFnIG5hbWUgd2l0aCBjbGFzcyBuYW1lIGJ5IGRvdHMuIFtkZWZ1YWx0IHZhbHVlIGlzIHVsXVxuICogICAgICBAcGFyYW0ge1N0cmluZ30gW29wdGlvbi5wYW5lbFRhZz0nbGkuY2xhc3NOYW1lJ10gQSB0YWcgbmFtZSBmb3IgcGFuZWwsIGNvbm5lY3QgdGFnIG5hbWUgd2l0aCBjbGFzcyBieSBkb3RzIFtkZWZhdWx0IHZhbHVlIGlzIGxpXVxuICogQHBhcmFtIHtBcnJheXxTdHJpbmd9IGRhdGEgQSBkYXRhIG9mIHJvbGxpbmcgcGFuZWxzXG4gKlxuICogQGV4YW1wbGVcbiAqIHZhciByb2xsID0gbmV3IHR1aS5jb21wb25lbnQuUm9sbGluZyh7XG4gKiAgICAgIGVsZW1lbnQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb2xsaW5nJyksXG4gKiAgICAgIGluaXROdW06IDAsXG4gKiAgICAgIGRpcmVjdGlvbjogJ2hvcml6b250YWwnLFxuICogICAgICBpc1ZhcmlhYmxlOiB0cnVlLFxuICogICAgICB1bml0OiAncGFnZScsXG4gKiAgICAgIGlzQXV0bzogZmFsc2UsXG4gKiAgICAgIG1vdGlvbjogJ2Vhc2VJbk91dCcsXG4gKiAgICAgIGR1cmF0aW9uOjIwMDBcbiAqIH0sIFsnPGRpdj5kYXRhMTwvZGl2PicsJzxkaXY+ZGF0YTI8L2Rpdj4nLCAnPGRpdj5kYXRhMzwvZGl2PiddKTtcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgUm9sbGluZyA9IHR1aS51dGlsLmRlZmluZUNsYXNzKC8qKiBAbGVuZHMgUm9sbGluZy5wcm90b3R5cGUgKi97XG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZVxuICAgICAqICovXG4gICAgaW5pdDogZnVuY3Rpb24ob3B0aW9uLCBkYXRhKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPcHRpb24gb2JqZWN0XG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9vcHRpb24gPSBvcHRpb247XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgZmxvdyBvZiBuZXh0IG1vdmVcbiAgICAgICAgICogQHR5cGUge1N0cmluZ3xzdHJpbmd9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9mbG93ID0gb3B0aW9uLmZsb3cgfHwgJ25leHQnO1xuICAgICAgICAvKipcbiAgICAgICAgICogV2hldGhlciBodG1sIGlzIGRyYXduIG9yIG5vdFxuICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2lzRHJhd24gPSAhIW9wdGlvbi5pc0RyYXduO1xuICAgICAgICAvKipcbiAgICAgICAgICogQXV0byByb2xsaW5nIHRpbWVyXG4gICAgICAgICAqIEB0eXBlIHtudWxsfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fdGltZXIgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogQXV0byByb2xsaW5nIGRlbGF5IHRpbWVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZGVsYXlUaW1lID0gdGhpcy5kZWxheVRpbWUgfHwgMzAwMDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgbW9kZWwgZm9yIHJvbGxpbmcgZGF0YVxuICAgICAgICAgKiBAdHlwZSB7RGF0YX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX21vZGVsID0gIW9wdGlvbi5pc0RyYXduID8gbmV3IERhdGEob3B0aW9uLCBkYXRhKSA6IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHJvbGxpbmcgYWN0aW9uIG9iamVjdFxuICAgICAgICAgKiBAdHlwZSB7Um9sbGVyfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fcm9sbGVyID0gbmV3IFJvbGxlcihvcHRpb24sIHRoaXMuX21vZGVsICYmIHRoaXMuX21vZGVsLmdldERhdGEoKSk7XG5cbiAgICAgICAgaWYgKG9wdGlvbi5pbml0TnVtKSB7XG4gICAgICAgICAgICB0aGlzLm1vdmVUbyhvcHRpb24uaW5pdE51bSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEhb3B0aW9uLmlzQXV0bykge1xuICAgICAgICAgICAgdGhpcy5hdXRvKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUm9sbCB0aGUgcm9sbGluZyBjb21wb25lbnQuIElmIHRoZXJlIGlzIG5vIGRhdGEsIHRoZSBjb21wb25lbnQgaGF2ZSB0byBoYXZlIHdpdGggZml4ZWQgZGF0YVxuICAgICAqIEBhcGlcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSBBIHJvbGxpbmcgZGF0YVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbZmxvd10gQSBkaXJlY3Rpb24gcm9sbGluZ1xuICAgICAqIEBleGFtcGxlXG4gICAgICogcm9sbGluZy5yb2xsKCc8ZGl2PmRhdGE8L2Rpdj4nLCAnaG9yaXpvbnRhbCcpO1xuICAgICAqL1xuICAgIHJvbGw6IGZ1bmN0aW9uKGRhdGEsIGZsb3cpIHtcbiAgICAgICAgZmxvdyA9IGZsb3cgfHwgdGhpcy5fZmxvdztcblxuICAgICAgICAvLyBJZiByb2xsaW5nIHN0YXR1cyBpcyBub3QgaWRsZSwgcmV0dXJuXG4gICAgICAgIGlmICh0aGlzLl9yb2xsZXIuc3RhdHVzICE9PSAnaWRsZScpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9vcHRpb24uaXNWYXJpYWJsZSkge1xuICAgICAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdyb2xsIG11c3QgcnVuIHdpdGggZGF0YScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNldEZsb3coZmxvdyk7XG4gICAgICAgICAgICB0aGlzLl9yb2xsZXIubW92ZShkYXRhKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG92ZXJCb3VuZGFyeTtcbiAgICAgICAgICAgIHRoaXMuc2V0RmxvdyhmbG93KTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9tb2RlbCkge1xuICAgICAgICAgICAgICAgIG92ZXJCb3VuZGFyeSA9IHRoaXMuX21vZGVsLmNoYW5nZUN1cnJlbnQoZmxvdyk7XG4gICAgICAgICAgICAgICAgZGF0YSA9IHRoaXMuX21vZGVsLmdldERhdGEoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCFvdmVyQm91bmRhcnkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yb2xsZXIubW92ZShkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBkaXJlY3Rpb25cbiAgICAgKiBAYXBpXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZsb3cgQSBkaXJlY3Rpb24gb2Ygcm9sbGluZ1xuICAgICAqIEBleGFtcGxlXG4gICAgICogcm9sbGluZy5zZXRGbG93KCdob3Jpem9udGFsJyk7XG4gICAgICovXG4gICAgc2V0RmxvdzogZnVuY3Rpb24oZmxvdykge1xuICAgICAgICB0aGlzLl9mbG93ID0gZmxvdztcbiAgICAgICAgdGhpcy5fcm9sbGVyLnNldEZsb3coZmxvdyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE1vdmUgdG8gdGFyZ2V0IHBhZ2VcbiAgICAgKiBAYXBpXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHBhZ2UgQSB0YXJnZXQgcGFnZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogcm9sbGluZy5tb3ZlVG8oMyk7XG4gICAgICovXG4gICAgbW92ZVRvOiBmdW5jdGlvbihwYWdlKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuX2lzRHJhd24pIHtcbiAgICAgICAgICAgIHRoaXMuX3JvbGxlci5tb3ZlVG8ocGFnZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbGVuID0gdGhpcy5fbW9kZWwuZ2V0RGF0YUxpc3RMZW5ndGgoKSxcbiAgICAgICAgICAgIG1heCA9IE1hdGgubWluKGxlbiwgcGFnZSksXG4gICAgICAgICAgICBtaW4gPSBNYXRoLm1heCgxLCBwYWdlKSxcbiAgICAgICAgICAgIGN1cnJlbnQgPSB0aGlzLl9tb2RlbC5nZXRDdXJyZW50KCksXG4gICAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICAgIGFic0ludGVydmFsLFxuICAgICAgICAgICAgaXNQcmV2LFxuICAgICAgICAgICAgZmxvdyxcbiAgICAgICAgICAgIGk7XG5cbiAgICAgICAgaWYgKGlzTmFOKE51bWJlcihwYWdlKSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignI1BhZ2VFcnJvciBtb3ZlVG8gbWV0aG9kIGhhdmUgdG8gcnVuIHdpdGggcGFnZScpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9vcHRpb24uaXNWYXJpYWJsZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCcjRGF0YUVycm9yIDogVmFyaWFibGUgUm9sbGluZyBjYW5cXCd0IHVzZSBtb3ZlVG8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlzUHJldiA9IHRoaXMuaXNOZWdhdGl2ZShwYWdlIC0gY3VycmVudCk7XG4gICAgICAgIHBhZ2UgPSBpc1ByZXYgPyBtaW4gOiBtYXg7XG4gICAgICAgIGZsb3cgPSBpc1ByZXYgPyAncHJldicgOiAnbmV4dCc7XG4gICAgICAgIGFic0ludGVydmFsID0gTWF0aC5hYnMocGFnZSAtIGN1cnJlbnQpO1xuICAgICAgICBkdXJhdGlvbiA9IHRoaXMuX29wdGlvbi5kdXJhdGlvbiAvIGFic0ludGVydmFsO1xuXG4gICAgICAgIHRoaXMuc2V0RmxvdyhmbG93KTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYWJzSW50ZXJ2YWw7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5fbW9kZWwuY2hhbmdlQ3VycmVudChmbG93KTtcbiAgICAgICAgICAgIHRoaXMuX3JvbGxlci5tb3ZlKHRoaXMuX21vZGVsLmdldERhdGEoKSwgZHVyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgdGhlIG51bWJlciBpcyBuZWdhdGl2ZSBvciBub3RcbiAgICAgKiBAcGFyYW0gbnVtYmVyIEEgbnVtYmVyIHRvIGZpZ3VyZSBvdXRcbiAgICAgKi9cbiAgICBpc05lZ2F0aXZlOiBmdW5jdGlvbihudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuICFpc05hTihudW1iZXIpICYmIG51bWJlciA8IDA7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN0b3AgYXV0byByb2xsaW5nXG4gICAgICovXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuX3RpbWVyKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU3RhcnQgYXV0byByb2xsaW5nXG4gICAgICogQGFwaVxuICAgICAqIEBleGFtcGxlXG4gICAgICogcm9sbGluZy5hdXRvKCk7XG4gICAgICovXG4gICAgYXV0bzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgICB0aGlzLl90aW1lciA9IHdpbmRvdy5zZXRJbnRlcnZhbCh0dWkudXRpbC5iaW5kKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fbW9kZWwuY2hhbmdlQ3VycmVudCh0aGlzLl9mbG93KTtcbiAgICAgICAgICAgIHRoaXMuX3JvbGxlci5tb3ZlKHRoaXMuX21vZGVsLmdldERhdGEoKSk7XG5cbiAgICAgICAgfSwgdGhpcyksIHRoaXMuZGVsYXlUaW1lKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQXR0YWNoIGN1c3RvbSBldmVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIEEgZXZlbnQgdHlwZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIEEgY2FsbGJhY2sgZnVuY3Rpb24gZm9yIGN1c3RvbSBldmVudCBcbiAgICAgKi9cbiAgICBhdHRhY2g6IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX3JvbGxlci5vbih0eXBlLCBjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJ1biBjdXN0b20gZXZlbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBBIGV2ZW50IHR5cGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIEEgZGF0YSBmcm9tIGZpcmUgZXZlbnRcbiAgICAgKi9cbiAgICBmaXJlOiBmdW5jdGlvbih0eXBlLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX3JvbGxlci5maXJlKHR5cGUsIG9wdGlvbnMpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJvbGxpbmc7XG4iXX0=

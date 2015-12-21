(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
tui.util.defineNamespace('tui.component.Rolling', require('./src/js/rolling'));

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
         * @type {(HTMLelement|String)}
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
 * @dependency ne-code-snippet
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInNyYy9qcy9tb3Rpb24uanMiLCJzcmMvanMvcm9sbGRhdGEuanMiLCJzcmMvanMvcm9sbGVyLmpzIiwic3JjL2pzL3JvbGxpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3IzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ0dWkudXRpbC5kZWZpbmVOYW1lc3BhY2UoJ3R1aS5jb21wb25lbnQuUm9sbGluZycsIHJlcXVpcmUoJy4vc3JjL2pzL3JvbGxpbmcnKSk7XG4iLCIvKipcbiAqIFJvbGxpbmcgbW90aW9uIGNvbGxlY3Rpb24gXG4gKiBAbmFtZXNwYWNlIG1vdGlvblxuICovXG52YXIgbW90aW9uID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBxdWFkRWFzZUluLFxuICAgICAgICBjaXJjRWFzZUluLFxuICAgICAgICBxdWFkRWFzZU91dCxcbiAgICAgICAgY2lyY0Vhc2VPdXQsXG4gICAgICAgIHF1YWRFYXNlSW5PdXQsXG4gICAgICAgIGNpcmNFYXNlSW5PdXQ7XG5cbiAgICAvKipcbiAgICAgKiBlYXNlSW5cbiAgICAgKiBAcGFyYW0gZGVsdGFcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gICAgICovXG4gICAgZnVuY3Rpb24gbWFrZUVhc2VJbihkZWx0YSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24ocHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWx0YShwcm9ncmVzcyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGVhc2VPdXRcbiAgICAgKiBAcGFyYW0gZGVsdGFcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gICAgICovXG4gICAgZnVuY3Rpb24gbWFrZUVhc2VPdXQoZGVsdGEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHByb2dyZXNzKSB7XG4gICAgICAgICAgICByZXR1cm4gMSAtIGRlbHRhKDEgLSBwcm9ncmVzcyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZWFzZUluT3V0XG4gICAgICogQHBhcmFtIGRlbHRhXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1ha2VFYXNlSW5PdXQoZGVsdGEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHByb2dyZXNzKSB7XG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MgPCAwLjUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVsdGEoMiAqIHByb2dyZXNzKSAvIDI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAoMiAtIGRlbHRhKDIgKiAoMSAtIHByb2dyZXNzKSkpIC8gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTGluZWFyXG4gICAgICogQG1lbWJlcm9mIG1vdGlvblxuICAgICAqIEBtZXRob2QgbGluZWFyXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxpbmVhcihwcm9ncmVzcykge1xuICAgICAgICByZXR1cm4gcHJvZ3Jlc3M7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHF1YWQocHJvZ3Jlc3MpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucG93KHByb2dyZXNzLCAyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2lyYyhwcm9ncmVzcykge1xuICAgICAgICByZXR1cm4gMSAtIE1hdGguc2luKE1hdGguYWNvcyhwcm9ncmVzcykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHF1ZWQgKyBlYXNlSW5cbiAgICAgKiBAbWVtYmVyb2YgbW90aW9uXG4gICAgICogQG1ldGhvZCBxdWFkRWFzZUluXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHF1YWRFYXNlSW4gPSBtYWtlRWFzZUluKHF1YWQpO1xuICAgIC8qKlxuICAgICAqIGNpcmMgKyBlYXNlSW5cbiAgICAgKiBAbWVtYmVyb2YgbW90aW9uXG4gICAgICogQG1ldGhvZCBjaXJjRWFzZUluXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgICAgICBjaXJjRWFzZUluID0gbWFrZUVhc2VJbihjaXJjKTtcbiAgICAvKipcbiAgICAgKiBxdWFkICsgZWFzZU91dFxuICAgICAqIEBtZW1iZXJvZiBtb3Rpb25cbiAgICAgKiBAbWV0aG9kIHF1YWRFYXNlT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgICAgICBxdWFkRWFzZU91dCA9IG1ha2VFYXNlT3V0KHF1YWQpO1xuICAgIC8qKlxuICAgICAqIGNpcmMgKyBlYXNlT3V0XG4gICAgICogQG1lbWJlcm9mIG1vdGlvblxuICAgICAqIEBtZXRob2QgY2lyY0Vhc2VPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgY2lyY0Vhc2VPdXQgPSBtYWtlRWFzZU91dChjaXJjKTtcbiAgICAvKipcbiAgICAgKiBxdWFkICsgZWFzZUluT3V0XG4gICAgICogQG1lbWJlcm9mIG1vdGlvblxuICAgICAqIEBtZXRob2QgcXVhZEVhc2VJbk91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBxdWFkRWFzZUluT3V0ID0gbWFrZUVhc2VJbk91dChxdWFkKTtcbiAgICAvKipcbiAgICAgKiBjaXJjICsgZWFzZUluT3V0XG4gICAgICogQG1lbWJlcm9mIG1vdGlvblxuICAgICAqIEBtZXRob2QgY2lyY0Vhc2VJbk91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBjaXJjRWFzZUluT3V0ID0gbWFrZUVhc2VJbk91dChjaXJjKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxpbmVhcjogbGluZWFyLFxuICAgICAgICBlYXNlSW46IHF1YWRFYXNlSW4sXG4gICAgICAgIGVhc2VPdXQ6IHF1YWRFYXNlT3V0LFxuICAgICAgICBlYXNlSW5PdXQ6IHF1YWRFYXNlSW5PdXQsXG4gICAgICAgIHF1YWRFYXNlSW46IHF1YWRFYXNlSW4sXG4gICAgICAgIHF1YWRFYXNlT3V0OiBxdWFkRWFzZU91dCxcbiAgICAgICAgcXVhZEVhc2VJbk91dDogcXVhZEVhc2VJbk91dCxcbiAgICAgICAgY2lyY0Vhc2VJbjogY2lyY0Vhc2VJbixcbiAgICAgICAgY2lyY0Vhc2VPdXQ6IGNpcmNFYXNlT3V0LFxuICAgICAgICBjaXJjRWFzZUluT3V0OiBjaXJjRWFzZUluT3V0XG4gICAgfTtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gbW90aW9uO1xuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IEEgZGF0YSBmb3IgbW92ZVxuICogQGF1dGhvciBOSE4gRW50LiBGRSBkZXYgdGVhbS48ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICogQGRlcGVuZGVuY3kgbmUtY29kZS1zbmlwcGV0XG4gKi9cblxuXG5cbi8qKiBcbiAqIERhdGEgbW9kZWwgZm9yIHJvbGxpbmdcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb24gQSBjb21wb25lbnQgb3B0aW9uc1xuICogQHBhcmFtIHsoQXJyYXl8T2JqZWN0KX0gZGF0YSBBIGRhdGEgb2Ygcm9sbGluZ1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBEYXRhID0gdHVpLnV0aWwuZGVmaW5lQ2xhc3MoLyoqIEBsZW5kcyBEYXRhLnByb3RvdHlwZSAqL3tcbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb24sIGRhdGEpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZXRoZXIgY2hhbmdhYmxlIGRhdGFcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmlzVmFyaWFibGUgPSAhIW9wdGlvbi5pc1ZhcmlhYmxlO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBkYXRhIGxpc3RcbiAgICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fZGF0YWxpc3QgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBkYXRhXG4gICAgICAgICAqIEB0eXBlIHtOb2RlfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fZGF0YSA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGluaXQgbnVtYmVyXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9jdXJyZW50ID0gb3B0aW9uLmluaXROdW0gfHwgMTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZWh0ZXIgY2lyY3VsYXJcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9pc0NpcmN1bGFyID0gdHVpLnV0aWwuaXNCb29sZWFuKG9wdGlvbi5pc0NpcmN1bGFyKSA/IG9wdGlvbi5pc0NpcmN1bGFyIDogdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMuaXNWYXJpYWJsZSkge1xuICAgICAgICAgICAgdGhpcy5taXhpbihyZW1vdGVEYXRhTWV0aG9kcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1peGluKHN0YXRpY0RhdGFNZXRob2RzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2luaXREYXRhKGRhdGEpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogTWl4aW5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbWV0aG9kcyBBIG1ldGhvZCBzZXQgW3N0YXRpY0RhdGFNZXRob2RzfHJlbW90ZURhdGFNZXRob2RzXVxuICAgICAqL1xuICAgIG1peGluOiBmdW5jdGlvbihtZXRob2RzKSB7XG4gICAgICAgIHR1aS51dGlsLmV4dGVuZCh0aGlzLCBtZXRob2RzKTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBTdGF0aWMgZGF0YSBtZXRob2Qgc2V0XG4gKiBAbmFtZXNwYWNlIHN0YXRpY0RhdGFNZXRob2RzXG4gKi9cbnZhciBzdGF0aWNEYXRhTWV0aG9kcyA9IHtcbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplIGRhdGFcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhbGlzdCBBIGxpc3QgdGhhdCBpcyBub3QgY29ubmVjdGVkIHdpdGggZWFjaCBvdGhlclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gX2RhdGFsaXN0XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaW5pdERhdGE6IGZ1bmN0aW9uKGRhdGFsaXN0KSB7XG4gICAgICAgIHZhciBiZWZvcmUgPSBudWxsLFxuICAgICAgICAgICAgZmlyc3QsXG4gICAgICAgICAgICBub2RlbGlzdDtcblxuICAgICAgICBub2RlbGlzdCA9IHR1aS51dGlsLm1hcChkYXRhbGlzdCwgZnVuY3Rpb24oZGF0YSwgaW5kZXgpIHtcblxuICAgICAgICAgICAgdmFyIG5vZGUgPSBuZXcgTm9kZShkYXRhKTtcbiAgICAgICAgICAgIG5vZGUucHJldiA9IGJlZm9yZTtcblxuICAgICAgICAgICAgaWYgKGJlZm9yZSkge1xuICAgICAgICAgICAgICAgIGJlZm9yZS5uZXh0ID0gbm9kZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmlyc3QgPSBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSAoZGF0YWxpc3QubGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgICAgICAgICBub2RlLm5leHQgPSBmaXJzdDtcbiAgICAgICAgICAgICAgICBmaXJzdC5wcmV2ID0gbm9kZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYmVmb3JlID0gbm9kZTtcblxuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG5cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIG5vZGVsaXN0LnVuc2hpZnQobnVsbCk7XG4gICAgICAgIHRoaXMuX2RhdGFsaXN0ID0gbm9kZWxpc3Q7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBpbmRleCBkYXRhXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IEEgaW5kZXggdG8gZ2V0XG4gICAgICogQHJldHVybnMge1N0cmluZ31cbiAgICAgKi9cbiAgICBnZXREYXRhOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YWxpc3RbaW5kZXggfHwgdGhpcy5fY3VycmVudF0uZGF0YTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGxpc3QgbGVuZ3RoXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIGdldERhdGFMaXN0TGVuZ3RoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFsaXN0Lmxlbmd0aCAtIDE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBuZXh0IGRhdGFcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggQSBuZXh0IGluZGV4XG4gICAgICogQHJldHVybnMge1N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldFByZXZEYXRhOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YWxpc3RbaW5kZXggfHwgdGhpcy5fY3VycmVudF0ucHJldi5kYXRhO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgcHJldiBkYXRhXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IEEgcHJldiBpbmRleFxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBnZXROZXh0RGF0YTogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFsaXN0W2luZGV4IHx8IHRoaXMuX2N1cnJlbnRdLm5leHQuZGF0YTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlIGN1cnJlbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmxvdyBBIGRpcmVjdGlvblxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgY2hhbmdlQ3VycmVudDogZnVuY3Rpb24oZmxvdykge1xuICAgICAgICB2YXIgbGVuZ3RoID0gdGhpcy5nZXREYXRhTGlzdExlbmd0aCgpO1xuICAgICAgICBpZiAoZmxvdyA9PT0gJ3ByZXYnKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50IC09IDE7XG4gICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudCA8IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50ID0gdGhpcy5faXNDaXJjdWxhciA/IGxlbmd0aCA6IDE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50ICs9IDE7XG4gICAgICAgICAgICBpZiAodGhpcy5fY3VycmVudCA+IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQgPSB0aGlzLl9pc0NpcmN1bGFyID8gMSA6IGxlbmd0aDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogR2V0IGN1cnJlbnRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldEN1cnJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudDtcbiAgICB9XG59O1xuXG4vKipcbiAqIENoYW5nYWJsZSBkYXRhIG1ldGhvZCBzZXRcbiAqIEBuYW1lc3BhY2UgcmVtb3RlRGF0YU1ldGhvZHNcbiAqIEBzdGF0aWNcbiAqL1xudmFyIHJlbW90ZURhdGFNZXRob2RzID0ge1xuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgZGF0YVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhIEEgZGF0YSB0byBkcmF3XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaW5pdERhdGE6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdGhpcy5fZGF0YSA9IG5ldyBOb2RlKGRhdGEpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgY3VycmVudCBkYXRhIG9yIHNvbWUgZGF0YSBieSBpbmRleFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBBIGluZGV4IG9mIGRhdGFcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgICAqL1xuICAgIGdldERhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YS5kYXRhO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgZGF0YVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFsncHJldnxuZXh0J10gQSBkYXRhIGluZGV4XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGEgQSBkYXRhIGluIHJvbGxpbmcgY29tcG9uZW50XG4gICAgICovXG4gICAgc2V0RGF0YTogZnVuY3Rpb24odHlwZSwgZGF0YSkge1xuICAgICAgICB0aGlzLl9kYXRhW3R5cGVdID0gbmV3IE5vZGUoZGF0YSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIERpc2Nvbm5lY3QgZGF0YVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFsncHJldnxuZXh0J10gUmV3cml0ZSBkYXRhXG4gICAgICovXG4gICAgc2V2ZXJMaW5rOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5fZGF0YTtcbiAgICAgICAgdGhpcy5fZGF0YSA9IHRoaXMuX2RhdGFbdHlwZV07XG4gICAgICAgIGRhdGFbdHlwZV0gPSBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgcHJldmlvdXMgRGF0YVxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBnZXRQcmV2RGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhLnByZXYgJiYgdGhpcy5fZGF0YS5wcmV2LmRhdGE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBuZXh0IGRhdGFcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZ2V0TmV4dERhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YS5uZXh0ICYmIHRoaXMuX2RhdGEubmV4dC5kYXRhO1xuICAgIH1cbn07XG5cbi8qKlxuICogTm9kZSBmb3IgZWFjaCBkYXRhIHBhbmVsXG4gKiBAbmFtZXNwYWNlIE5vZGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIG5vZGUgZGF0YSBvciBodG1sIHZhbHVlXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIE5vZGUgPSBmdW5jdGlvbihkYXRhKSB7XG5cbiAgICB0aGlzLnByZXYgPSBudWxsO1xuICAgIHRoaXMubmV4dCA9IG51bGw7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRhO1xuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFJvbGxlciBcbiAqIEBhdXRob3IgTkhOIEVudC4gRkUgZGV2IHRlYW0uPGRsX2phdmFzY3JpcHRAbmhuZW50LmNvbT5cbiAqIEBkZXBlbmRlbmN5IG5lLWNvZGUtc25pcHBldFxuICovXG52YXIgbW90aW9uID0gcmVxdWlyZSgnLi9tb3Rpb24nKTtcbi8qKlxuICogUm9sbGVyIHRoYXQgbW92ZSByb2xsaW5nIHBhbmVsXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbiBUaGUgb3B0aW9uIG9mIHJvbGxpbmcgY29tcG9uZW50XG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIFJvbGxlciA9IHR1aS51dGlsLmRlZmluZUNsYXNzKC8qKiBAbGVuZHMgUm9sbGVyLnByb3RvdHlwZSAqL3tcbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb24sIGluaXREYXRhKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIG9wdGlvbnNcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX29wdGlvbiA9IG9wdGlvbjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgcm9vdCBlbGVtZW50XG4gICAgICAgICAqIEB0eXBlIHsoSFRNTGVsZW1lbnR8U3RyaW5nKX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSB0dWkudXRpbC5pc1N0cmluZyhvcHRpb24uZWxlbWVudCkgPyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvcHRpb24uZWxlbWVudCkgOiBvcHRpb24uZWxlbWVudDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgZGlyZWN0aW9uIG9mIHJvbGxpbmcgKHZlcnRpY2FsfGhvcml6b250YWwpXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSBvcHRpb24uZGlyZWN0aW9uIHx8ICdob3Jpem9udGFsJztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgc3R5bGUgYXR0cmlidXRlIHRvIG1vdmUoJ2xlZnQgfCB0b3AnKVxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fcmFuZ2UgPSB0aGlzLl9kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/ICdsZWZ0JyA6ICd0b3AnO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgdG8gbW92ZVxuICAgICAgICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9tb3Rpb24gPSBtb3Rpb25bb3B0aW9uLm1vdGlvbiB8fCAnbm9lZmZlY3QnXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgcm9sbGluZyB1bml0XG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9yb2xsdW5pdCA9IG9wdGlvbi51bml0IHx8ICdwYWdlJztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZXRoZXIgaHRtbCBpcyBkcmF3biBvciBub3RcbiAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9pc0RyYXduID0gISFvcHRpb24uaXNEcmF3bjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgaXRlbSBwZXIgcGFnZVxuICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2l0ZW1jb3VudCA9IG9wdGlvbi5pdGVtY291bnQ7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGRpcmVjdGlvbiB0byBuZXh0IHJvbGxpbmdcbiAgICAgICAgICogQHR5cGUge1N0cmluZ3xzdHJpbmd9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9mbG93ID0gb3B0aW9uLmZsb3cgfHwgJ25leHQnO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBhbmltYXRpb24gZHVyYXRpb25cbiAgICAgICAgICogQHR5cGUgeyp8bnVtYmVyfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fZHVyYXRpb24gPSBvcHRpb24uZHVyYXRpb24gfHwgMTAwMDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZXRoZXIgY2lyY3VsYXIgb3Igbm90XG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5faXNDaXJjdWxhciA9IHR1aS51dGlsLmlzRXhpc3R5KG9wdGlvbi5pc0NpcmN1bGFyKSA/IG9wdGlvbi5pc0NpcmN1bGFyIDogdHJ1ZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgcm9sbGVyIHN0YXRlXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnN0YXR1cyA9ICdpZGxlJztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgY29udGFpbmVyIHRoYXQgd2lsbCBiZSBtb3ZlZFxuICAgICAgICAgKiBAdHlwZSB7SFRNTEVsZW1lbnR9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9jb250YWluZXIgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogQ2hhbmdhYmxlIGRhdGEgcGFuZWxcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucGFuZWwgPSB7IHByZXY6IG51bGwsIGNlbnRlcjogbnVsbCwgbmV4dDogbnVsbCB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogRml4ZWQgcm9sbGVyIHBhbmVscywgdGhhdCBoYXZlIG5vZGUgbGlzdCBieSBhcnJheVxuICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9wYW5lbHMgPSBbXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJhc2UgZWxlbWVudCBcbiAgICAgICAgICogQHR5cGUge0hUTUxFbGVtZW50fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fYmFzaXMgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogUm9vdCBlbGVtZW50IHdpZHRoLCBpZiBtb3ZlIHVuaXQgaXMgcGFnZSB0aGlzIGlzIG1vdmUgd2lkdGhcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2Rpc3RhbmNlID0gMDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vdmVkIHBhbmVsIHRhcmdldFxuICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl90YXJnZXRzID0gW107XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBRdWV1ZSBmb3Igb3JkZXIgdGhhdCBpcyByZXF1ZXN0ZWQgZHVyaW5nIG1vdmluZyBcbiAgICAgICAgICogQHR5cGUge0FycmF5fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fcXVldWUgPSBbXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgbW92ZSB1bml0IGNvdW50XG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl91bml0Q291bnQgPSBvcHRpb24ucm9sbHVuaXQgPT09ICdwYWdlJyA/IDEgOiAob3B0aW9uLnVuaXRDb3VudCB8fCAxKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEN1c3RvbSBldmVudFxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgICAgICAgaWYgKCF0aGlzLl9pc0RyYXduKSB7XG4gICAgICAgICAgICB0aGlzLm1peGluKG1vdmVQYW5lbFNldCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1peGluKG1vdmVDb250YWluZXJTZXQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NldENvbnRhaW5lcigpO1xuICAgICAgICB0aGlzLl9tYXNraW5nKCk7XG4gICAgICAgIHRoaXMuX3NldFVuaXREaXN0YW5jZSgpO1xuXG4gICAgICAgIGlmICh0aGlzLl9pc0RyYXduKSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0UGFuZWwoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZXRQYW5lbChpbml0RGF0YSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE1peGluXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG1ldGhvZHMgQSBtZXRob2Qgc2V0IFtzdGF0aWNEYXRhTWV0aG9kc3xyZW1vdGVEYXRhTWV0aG9kc11cbiAgICAgKi9cbiAgICBtaXhpbjogZnVuY3Rpb24obWV0aG9kcykge1xuICAgICAgICB0dWkudXRpbC5leHRlbmQodGhpcywgbWV0aG9kcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE1hc2tpbmcgXG4gICAgICogQG1ldGhvZFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX21hc2tpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnQsXG4gICAgICAgICAgICBlbGVtZW50U3R5bGUgPSBlbGVtZW50LnN0eWxlO1xuICAgICAgICBlbGVtZW50U3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgICAgICBlbGVtZW50U3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgICAgZWxlbWVudFN0eWxlLndpZHRoID0gZWxlbWVudFN0eWxlLndpZHRoIHx8IChlbGVtZW50LmNsaWVudFdpZHRoICsgJ3B4Jyk7XG4gICAgICAgIGVsZW1lbnRTdHlsZS5oZWlnaHQgPSBlbGVtZW50U3R5bGUuaGVpZ2h0IHx8IChlbGVtZW50LmNsaWVudEhlaWdodCArICdweCcpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgdW5pdCBtb3ZlIGRpc3RhbmNlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0VW5pdERpc3RhbmNlOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgZGlzdCxcbiAgICAgICAgICAgIGVsZW1lbnRTdHlsZSA9IHRoaXMuX2VsZW1lbnQuc3R5bGU7XG5cbiAgICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgICBkaXN0ID0gZWxlbWVudFN0eWxlLndpZHRoLnJlcGxhY2UoJ3B4JywgJycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGlzdCA9IGVsZW1lbnRTdHlsZS5oZWlnaHQucmVwbGFjZSgncHgnLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fcm9sbHVuaXQgIT09ICdwYWdlJyAmJiB0aGlzLl9pc0RyYXduKSB7XG4gICAgICAgICAgICBkaXN0ID0gTWF0aC5jZWlsKGRpc3QgLyB0aGlzLl9pdGVtY291bnQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2Rpc3RhbmNlID0gcGFyc2VJbnQoZGlzdCwgMTApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBRdWV1ZSBtb3ZlIG9yZGVyICAgIFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhIEEgcGFnZSBkYXRhXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uIEEgZHVhcnRpb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmxvdyBBIGRpcmVjdGlvbiB0byBtb3ZlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfcXVldWVpbmc6IGZ1bmN0aW9uKGRhdGEsIGR1cmF0aW9uLCBmbG93KSB7XG4gICAgICAgIHRoaXMuX3F1ZXVlLnB1c2goe1xuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgIGZsb3c6IGZsb3dcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEEgZGVmYXVsdCBkaXJlY3Rpb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmxvdyBBIGZsb3cgdGhhdCB3aWxsIGJlIGRlZnVhbHQgdmFsdWVcbiAgICAgKi9cbiAgICBzZXRGbG93OiBmdW5jdGlvbihmbG93KSB7XG4gICAgICAgIHRoaXMuX2Zsb3cgPSBmbG93IHx8IHRoaXMuX2Zsb3cgfHwgJ25leHQnO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBjaGFuZ2UgYW5pbWF0aW9uIGVmZmVjdFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIEEgbmFtZSBvZiBlZmZlY3RcbiAgICAgKi9cbiAgICBjaGFuZ2VNb3Rpb246IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgdGhpcy5fbW90aW9uID0gbW90aW9uW3R5cGVdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBbmltYXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbiBBIG9wdGlvbnMgZm9yIGFuaW1hdGluZ1xuICAgICAqL1xuICAgIF9hbmltYXRlOiBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgdmFyIHN0YXJ0ID0gbmV3IERhdGUoKSxcbiAgICAgICAgICAgIGlkID0gd2luZG93LnNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciB0aW1lUGFzc2VkID0gbmV3IERhdGUoKSAtIHN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzcyA9IHRpbWVQYXNzZWQgLyBvcHRpb24uZHVyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgIGRlbHRhO1xuICAgICAgICAgICAgICAgIGlmIChwcm9ncmVzcyA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3MgPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWx0YSA9IG9wdGlvbi5kZWx0YShwcm9ncmVzcyk7XG5cbiAgICAgICAgICAgICAgICBvcHRpb24uc3RlcChkZWx0YSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJvZ3Jlc3MgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwoaWQpO1xuICAgICAgICAgICAgICAgICAgICBvcHRpb24uY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBvcHRpb24uZGVsYXkgfHwgMTApO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIEEgcm9sbGVyIG1ldGhvZCBzZXQgZm9yIGZpeGVkIHBhbmVsXG4gKiBAbmFtZXNwYWNlIG1vdmVQYW5lbFNldFxuICogQHN0YXRpY1xuICovXG52YXIgbW92ZVBhbmVsU2V0ID0ge1xuICAgIC8qKlxuICAgICAqIFNldCByb29saW5nIGNvbnRhaW5lclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldENvbnRhaW5lcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvcHRpb24gPSB0aGlzLl9vcHRpb24sXG4gICAgICAgICAgICBlbGVtZW50ID0gdGhpcy5fZWxlbWVudCxcbiAgICAgICAgICAgIGZpcnN0Q2hpbGQgPSBlbGVtZW50LmZpcnN0Q2hpbGQsXG4gICAgICAgICAgICB3cmFwLFxuICAgICAgICAgICAgbmV4dCxcbiAgICAgICAgICAgIHRhZyxcbiAgICAgICAgICAgIGNsYXNzTmFtZTtcblxuICAgICAgICBpZiAob3B0aW9uLndyYXBwZXJUYWcpIHtcbiAgICAgICAgICAgIHRhZyA9IG9wdGlvbi53cmFwcGVyVGFnICYmIG9wdGlvbi53cmFwcGVyVGFnLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgICBjbGFzc05hbWUgPSBvcHRpb24ud3JhcHBlclRhZyAmJiBvcHRpb24ud3JhcHBlclRhZy5zcGxpdCgnLicpWzFdIHx8ICcnO1xuICAgICAgICAgICAgd3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgICAgICAgICAgIGlmIChjbGFzc05hbWUpIHtcbiAgICAgICAgICAgIHdyYXAuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQod3JhcCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodHVpLnV0aWwuaXNIVE1MVGFnKGZpcnN0Q2hpbGQpKSB7XG4gICAgICAgICAgICAgICAgd3JhcCA9IGZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXh0ID0gZmlyc3RDaGlsZCAmJiBmaXJzdENoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgaWYgKHR1aS51dGlsLmlzSFRNTFRhZyhuZXh0KSkge1xuICAgICAgICAgICAgICAgIHdyYXAgPSBuZXh0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3cmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LmFwcGVuZENoaWxkKHdyYXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lciA9IHdyYXA7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBNYWtlIHJvbGxpbmcgcGFuZWxcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRQYW5lbDogZnVuY3Rpb24oaW5pdERhdGEpIHtcbiAgICAgICAgdmFyIHBhbmVsID0gdGhpcy5fY29udGFpbmVyLmZpcnN0Q2hpbGQsXG4gICAgICAgICAgICBwYW5lbFNldCA9IHRoaXMucGFuZWwsXG4gICAgICAgICAgICBvcHRpb24gPSB0aGlzLl9vcHRpb24sXG4gICAgICAgICAgICB0YWcsXG4gICAgICAgICAgICBjbGFzc05hbWUsXG4gICAgICAgICAgICBrZXk7XG5cbiAgICAgICAgaWYgKHR1aS51dGlsLmlzU3RyaW5nKG9wdGlvbi5wYW5lbFRhZykpIHtcbiAgICAgICAgICAgIHRhZyA9IChvcHRpb24ucGFuZWxUYWcpLnNwbGl0KCcuJylbMF07XG4gICAgICAgICAgICBjbGFzc05hbWUgPSAob3B0aW9uLnBhbmVsVGFnKS5zcGxpdCgnLicpWzFdIHx8ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF0dWkudXRpbC5pc0hUTUxUYWcocGFuZWwpKSB7XG4gICAgICAgICAgICAgICAgcGFuZWwgPSBwYW5lbCAmJiBwYW5lbC5uZXh0U2libGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRhZyA9IHR1aS51dGlsLmlzSFRNTFRhZyhwYW5lbCkgPyBwYW5lbC50YWdOYW1lIDogJ2xpJztcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IChwYW5lbCAmJiBwYW5lbC5jbGFzc05hbWUpIHx8ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXG4gICAgICAgIGZvciAoa2V5IGluIHBhbmVsU2V0KSB7XG4gICAgICAgICAgICBwYW5lbFNldFtrZXldID0gdGhpcy5fbWFrZUVsZW1lbnQodGFnLCBjbGFzc05hbWUsIGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICBwYW5lbFNldC5jZW50ZXIuaW5uZXJIVE1MID0gaW5pdERhdGE7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5hcHBlbmRDaGlsZChwYW5lbFNldC5jZW50ZXIpO1xuXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBNYWtlIEhUTUwgRWxlbWVudCAgICAgXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRhZyBBIHRhZyBuYW1lXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZSBBIGNsYXNzIG5hbWVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IEEgY2xhc3Mga2V5IG5hbWVcbiAgICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfbWFrZUVsZW1lbnQ6IGZ1bmN0aW9uKHRhZywgY2xhc3NOYW1lLCBrZXkpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgZWxlbWVudC5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAgICAgZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9ICcwcHgnO1xuICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnO1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHBhbmVsIGRhdGFcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSBBIGRhdGEgZm9yIHJlcGxhY2UgcGFuZWxcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF91cGRhdGVQYW5lbDogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGlzLnBhbmVsW3RoaXMuX2Zsb3cgfHwgJ2NlbnRlciddLmlubmVySFRNTCA9IGRhdGE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFwcGVuZCBtb3ZlIHBhbmVsXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfYXBwZW5kTW92ZURhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZmxvdyA9IHRoaXMuX2Zsb3csXG4gICAgICAgICAgICBtb3ZlUGFuZWwgPSB0aGlzLnBhbmVsW2Zsb3ddLFxuICAgICAgICAgICAgc3R5bGUgPSBtb3ZlUGFuZWwuc3R5bGUsXG4gICAgICAgICAgICBkZXN0ID0gKGZsb3cgPT09ICdwcmV2JyA/IC10aGlzLl9kaXN0YW5jZSA6IHRoaXMuX2Rpc3RhbmNlKSArICdweCc7XG5cbiAgICAgICAgc3R5bGVbdGhpcy5fcmFuZ2VdID0gZGVzdDtcblxuICAgICAgICB0aGlzLm1vdmVQYW5lbCA9IG1vdmVQYW5lbDtcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLmFwcGVuZENoaWxkKG1vdmVQYW5lbCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBlYWNoIHBhbmVscycgbW92ZSBkaXN0YW5jZXNcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZXRNb3ZlU2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZsb3cgPSB0aGlzLl9mbG93O1xuICAgICAgICBpZiAoZmxvdyA9PT0gJ3ByZXYnKSB7XG4gICAgICAgICAgICByZXR1cm4gWzAsIHRoaXMuX2Rpc3RhbmNlXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbLXRoaXMuX2Rpc3RhbmNlLCAwXTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgc3RhcnQgcG9pbnRzXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2dldFN0YXJ0U2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHBhbmVsID0gdGhpcy5wYW5lbCxcbiAgICAgICAgICAgIGZsb3cgPSB0aGlzLl9mbG93LFxuICAgICAgICAgICAgcmFuZ2UgPSB0aGlzLl9yYW5nZSxcbiAgICAgICAgICAgIGlzUHJldiA9IGZsb3cgPT09ICdwcmV2JyxcbiAgICAgICAgICAgIGZpcnN0ID0gaXNQcmV2ID8gcGFuZWxbJ3ByZXYnXSA6IHBhbmVsWydjZW50ZXInXSxcbiAgICAgICAgICAgIHNlY29uZCA9IGlzUHJldiA/IHBhbmVsWydjZW50ZXInXSA6IHBhbmVsWyduZXh0J107XG4gICAgICAgIHJldHVybiBbcGFyc2VJbnQoZmlyc3Quc3R5bGVbcmFuZ2VdLCAxMCksIHBhcnNlSW50KHNlY29uZC5zdHlsZVtyYW5nZV0sIDEwKV07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBtb3ZlIHRhcmdldFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmbG93IEEgZmxvdyB0byBtb3ZlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0VGFyZ2V0OiBmdW5jdGlvbihmbG93KSB7XG4gICAgICAgIHRoaXMuX3RhcmdldHMgPSBbdGhpcy5wYW5lbFsnY2VudGVyJ11dO1xuICAgICAgICBpZiAoZmxvdyA9PT0gJ3ByZXYnKSB7XG4gICAgICAgICAgICB0aGlzLl90YXJnZXRzLnVuc2hpZnQodGhpcy5wYW5lbFtmbG93XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl90YXJnZXRzLnB1c2godGhpcy5wYW5lbFtmbG93XSk7XG4gICAgICAgIH1cblxuICAgIH0sXG4gICAgLyoqXG4gICAgICogQSBwYW5lbCBtb3ZlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgQSBkYXRhIHRvIHVwZGF0ZSBwYW5lbFxuICAgICAqL1xuICAgIG1vdmU6IGZ1bmN0aW9uKGRhdGEsIGR1cmF0aW9uLCBmbG93KSB7XG4gICAgICAgIGZsb3cgPSBmbG93IHx8IHRoaXMuX2Zsb3c7XG4gICAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gJ2lkbGUnKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9ICdydW4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcXVldWVpbmcoZGF0YSwgZHVyYXRpb24sIGZsb3cpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJlZm9yZSBtb3ZlIGN1c3RvbSBldmVudCBmaXJlXG4gICAgICAgICAqIEBmaXJlcyBiZWZvcmVNb3ZlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhIElubmVyIEhUTUxcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogdHVpLmNvbXBvbmVudC5Sb2xsaW5nSW5zdGFuY2UuYXR0YWNoKCdiZWZvcmVNb3ZlJywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgKiAgICAvLyAuLi4uLiBydW4gY29kZVxuICAgICAgICAgKiB9KTtcbiAgICAgICAgICovXG4gICAgICAgIHZhciByZXMgPSB0aGlzLmZpcmUoJ2JlZm9yZU1vdmUnLCB7IGRhdGE6IGRhdGEgfSk7XG5cbiAgICAgICAgaWYgKCFyZXMpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gJ2lkbGUnO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IG5leHQgcGFuZWxcbiAgICAgICAgdGhpcy5fdXBkYXRlUGFuZWwoZGF0YSk7XG4gICAgICAgIHRoaXMuX2FwcGVuZE1vdmVEYXRhKCk7XG4gICAgICAgIHRoaXMuX3NldFRhcmdldChmbG93KTtcblxuICAgICAgICBpZiAoIXRoaXMuX21vdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fbW92ZVdpdGhvdXRNb3Rpb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX21vdmVXaXRoTW90aW9uKGR1cmF0aW9uKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgcG9zaXRpb25cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9tb3ZlV2l0aG91dE1vdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmbG93ID0gdGhpcy5fZmxvdyxcbiAgICAgICAgICAgIHBvcyA9IHRoaXMuX2dldE1vdmVTZXQoZmxvdyksXG4gICAgICAgICAgICByYW5nZSA9IHRoaXMuX3JhbmdlO1xuICAgICAgICB0dWkudXRpbC5mb3JFYWNoKHRoaXMuX3RhcmdldHMsIGZ1bmN0aW9uKGVsZW1lbnQsIGluZGV4KSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlW3JhbmdlXSA9IHBvc1tpbmRleF0gKyAncHgnO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jb21wbGV0ZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSdW4gYW5pbWF0aW9uXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfbW92ZVdpdGhNb3Rpb246IGZ1bmN0aW9uKGR1cmF0aW9uKSB7XG4gICAgICAgIHZhciBmbG93ID0gdGhpcy5fZmxvdyxcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5fZ2V0U3RhcnRTZXQoZmxvdyksXG4gICAgICAgICAgICBkaXN0YW5jZSA9IHRoaXMuX2Rpc3RhbmNlLFxuICAgICAgICAgICAgcmFuZ2UgPSB0aGlzLl9yYW5nZTtcblxuICAgICAgICBkdXJhdGlvbiA9IGR1cmF0aW9uIHx8IHRoaXMuX2R1cmF0aW9uO1xuXG4gICAgICAgIHRoaXMuX2FuaW1hdGUoe1xuICAgICAgICAgICAgZGVsYXk6IDEwLFxuICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uIHx8IDEwMDAsXG4gICAgICAgICAgICBkZWx0YTogdGhpcy5fbW90aW9uLFxuICAgICAgICAgICAgc3RlcDogdHVpLnV0aWwuYmluZChmdW5jdGlvbihkZWx0YSkge1xuICAgICAgICAgICAgICAgIHR1aS51dGlsLmZvckVhY2godGhpcy5fdGFyZ2V0cywgZnVuY3Rpb24oZWxlbWVudCwgaW5kZXgpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZGVzdCA9IChmbG93ID09PSAncHJldicpID8gZGlzdGFuY2UgKiBkZWx0YSA6IC0oZGlzdGFuY2UgKiBkZWx0YSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbcmFuZ2VdID0gc3RhcnRbaW5kZXhdICsgZGVzdCArICdweCc7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIHRoaXMpLFxuICAgICAgICAgICAgY29tcGxldGU6IHR1aS51dGlsLmJpbmQodGhpcy5jb21wbGV0ZSwgdGhpcylcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENvbXBsYXRlIGNhbGxiYWNrXG4gICAgICovXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcGFuZWwgPSB0aGlzLnBhbmVsLFxuICAgICAgICAgICAgdGVtcFBhbmVsLFxuICAgICAgICAgICAgZmxvdyA9IHRoaXMuX2Zsb3c7XG5cbiAgICAgICAgdGVtcFBhbmVsID0gcGFuZWxbJ2NlbnRlciddO1xuICAgICAgICBwYW5lbFsnY2VudGVyJ10gPSBwYW5lbFtmbG93XTtcbiAgICAgICAgcGFuZWxbZmxvd10gPSB0ZW1wUGFuZWw7XG5cbiAgICAgICAgdGhpcy5fdGFyZ2V0cyA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5yZW1vdmVDaGlsZCh0ZW1wUGFuZWwpO1xuICAgICAgICB0aGlzLnN0YXR1cyA9ICdpZGxlJztcblxuICAgICAgICBpZiAodHVpLnV0aWwuaXNOb3RFbXB0eSh0aGlzLl9xdWV1ZSkpIHtcbiAgICAgICAgICAgIHZhciBmaXJzdCA9IHRoaXMuX3F1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICB0aGlzLm1vdmUoZmlyc3QuZGF0YSwgZmlyc3QuZHVyYXRpb24sIGZpcnN0LmZsb3cpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBBZnRlciBjdXN0b20gZXZlbnQgcnVuXG4gICAgICAgICAgICAgKiBAZmlyZXMgYWZ0ZXJNb3ZlXG4gICAgICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgICAgICogdHVpLmNvbXBvbmVudC5Sb2xsaW5nSW5zdGFuY2UuYXR0YWNoKCdhZnRlck1vdmUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAqICAgIC8vIC4uLi4uIHJ1biBjb2RlXG4gICAgICAgICAgICAgKiB9KTtcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5maXJlKCdhZnRlck1vdmUnKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogQ29udGFpbmVyIG1vdmUgbWV0aG9kc1xuICogQG5hbWVzcGFjZSBtb3ZlQ29udGFpbmVyU2V0XG4gKiBAc3RhdGljXG4gKi9cbnZhciBtb3ZlQ29udGFpbmVyU2V0ID0ge1xuICAgIC8qKlxuICAgICAqIFNldCBjb250YWluZXJcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRDb250YWluZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnQsXG4gICAgICAgICAgICBmaXJzdENoaWxkID0gZWxlbWVudC5maXJzdENoaWxkLFxuICAgICAgICAgICAgd3JhcDtcbiAgICAgICAgaWYgKHRoaXMuX2lzRHJhd24pIHtcbiAgICAgICAgICAgIHdyYXAgPSB0dWkudXRpbC5pc0hUTUxUYWcoZmlyc3RDaGlsZCkgPyBmaXJzdENoaWxkIDogZmlyc3RDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lciA9IHdyYXA7XG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXIuc3R5bGVbdGhpcy5fcmFuZ2VdID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZXRJdGVtQ291bnQoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTW92ZSBhcmVhIGNoZWNrXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZsb3cgQSBkaXJlY3Rpb24gdG8gbW92ZVxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2lzTGltaXRQb2ludDogZnVuY3Rpb24oZmxvdykge1xuICAgICAgICB2YXIgbW92ZWQgPSB0aGlzLl9nZXRDdXJyZW50UG9zaXRpb24oKTtcbiAgICAgICAgaWYgKGZsb3cgPT09ICduZXh0Jykge1xuICAgICAgICAgICAgaWYgKHRoaXMubGltaXQgPiAtbW92ZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYobW92ZWQgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgY3VycmVudCBwb3NpdGlvblxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2dldEN1cnJlbnRQb3NpdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLl9jb250YWluZXIuc3R5bGVbdGhpcy5fcmFuZ2VdLCAxMCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE1vdmUgcGFuZWxzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgQSBkYXRhIHRvIHVwZGF0ZSBwYW5lbFxuICAgICAqL1xuICAgIG1vdmU6IGZ1bmN0aW9uKGR1cmF0aW9uLCBmbG93KSB7XG4gICAgICAgIGZsb3cgPSBmbG93IHx8IHRoaXMuX2Zsb3c7XG5cbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAnaWRsZScpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gJ3J1bic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9xdWV1ZWluZyhkdXJhdGlvbiwgZmxvdyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlyZSBiZWZvcmUgY3VzdG9tIGV2ZW50XG4gICAgICAgICAqIEBmaXJlcyBiZWZvcmVNb3ZlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhIGlubmVyIEhUTUxcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogdHVpLmNvbXBvbmVudC5Sb2xsaW5nSW5zdGFuY2UuYXR0YWNoKCdiZWZvcmVNb3ZlJywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgKiAgICAvLyAuLi4uLiBydW4gY29kZVxuICAgICAgICAgKiB9KTtcbiAgICAgICAgICovXG4gICAgICAgIHZhciByZXMgPSB0aGlzLmludm9rZSgnYmVmb3JlTW92ZScpO1xuICAgICAgICBpZiAoIXJlcykge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAnaWRsZSc7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoIXRoaXMuX2lzQ2lyY3VsYXIgJiYgdGhpcy5faXNMaW1pdFBvaW50KGZsb3cpKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9ICdpZGxlJztcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5faXNDaXJjdWxhcikge1xuICAgICAgICAgICAgdGhpcy5fcm90YXRlUGFuZWwoZmxvdyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9tb3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX21vdmVXaXRob3V0TW90aW9uKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9tb3ZlV2l0aE1vdGlvbihkdXJhdGlvbik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEZpeCBwYW5lbHNcbiAgICAgKi9cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLl9pc0NpcmN1bGFyKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXRQYW5lbCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhdHVzID0gJ2lkbGUnO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgbW92ZSBkaXN0YW5jZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmbG93IEEgZGlyZWN0aW9uXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZXRNb3ZlRGlzdGFuY2U6IGZ1bmN0aW9uKGZsb3cpIHtcbiAgICAgICAgdmFyIG1vdmVkID0gdGhpcy5fZ2V0Q3VycmVudFBvc2l0aW9uKCksXG4gICAgICAgICAgICBjYXN0RGlzdCA9IHRoaXMuX2Rpc3RhbmNlICogdGhpcy5fdW5pdENvdW50O1xuICAgICAgICBpZiAoZmxvdyA9PT0gJ3ByZXYnKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5faXNDaXJjdWxhcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9kaXN0YW5jZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAobW92ZWQgKyBjYXN0RGlzdCkgPiAwID8gLW1vdmVkIDogY2FzdERpc3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5faXNDaXJjdWxhcikge1xuICAgICAgICAgICAgICAgIHJldHVybiAtdGhpcy5fZGlzdGFuY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2FzdERpc3QgPiAodGhpcy5saW1pdCArIG1vdmVkKT8gKC10aGlzLmxpbWl0IC0gbW92ZWQpIDogLWNhc3REaXN0O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBwb3N0aW9uXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfbW92ZVdpdGhvdXRNb3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZmxvdyA9IHRoaXMuX2Zsb3csXG4gICAgICAgICAgICBwb3MgPSB0aGlzLl9nZXRNb3ZlRGlzdGFuY2UoZmxvdyksXG4gICAgICAgICAgICByYW5nZSA9IHRoaXMuX3JhbmdlLFxuICAgICAgICAgICAgc3RhcnQgPSBwYXJzZUludCh0aGlzLl9jb250YWluZXIuc3R5bGVbcmFuZ2VdLCAxMCk7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZVtyYW5nZV0gPSBzdGFydCArIHBvcyArICdweCc7XG4gICAgICAgIHRoaXMuY29tcGxldGUoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUnVuIGFuaW1hdGlvblxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX21vdmVXaXRoTW90aW9uOiBmdW5jdGlvbihkdXJhdGlvbikge1xuICAgICAgICB2YXIgZmxvdyA9IHRoaXMuX2Zsb3csXG4gICAgICAgICAgICBjb250YWluZXIgPSB0aGlzLl9jb250YWluZXIsXG4gICAgICAgICAgICByYW5nZSA9IHRoaXMuX3JhbmdlLFxuICAgICAgICAgICAgc3RhcnQgPSBwYXJzZUludChjb250YWluZXIuc3R5bGVbcmFuZ2VdLCAxMCksXG4gICAgICAgICAgICBkaXN0YW5jZSA9IHRoaXMuX2dldE1vdmVEaXN0YW5jZShmbG93KTtcbiAgICAgICAgZHVyYXRpb24gPSBkdXJhdGlvbiB8fCB0aGlzLl9kdXJhdGlvbjtcblxuICAgICAgICB0aGlzLl9hbmltYXRlKHtcbiAgICAgICAgICAgIGRlbGF5OiAxMCxcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbiB8fCAxMDAwLFxuICAgICAgICAgICAgZGVsdGE6IHRoaXMuX21vdGlvbixcbiAgICAgICAgICAgIHN0ZXA6IHR1aS51dGlsLmJpbmQoZnVuY3Rpb24oZGVsdGEpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVzdCA9IGRpc3RhbmNlICogZGVsdGE7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnN0eWxlW3JhbmdlXSA9IHN0YXJ0ICsgZGVzdCArICdweCc7XG4gICAgICAgICAgICB9LCB0aGlzKSxcbiAgICAgICAgICAgIGNvbXBsZXRlOiB0dWkudXRpbC5iaW5kKHRoaXMuY29tcGxldGUsIHRoaXMpXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSb3RhdGUgcGFuZWxcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmxvdyBBIGZsb3cgdG8gcm90YXRlIHBhbmVsXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfcm90YXRlUGFuZWw6IGZ1bmN0aW9uKGZsb3cpIHtcblxuICAgICAgICBmbG93ID0gZmxvdyB8fCB0aGlzLl9mbG93O1xuXG4gICAgICAgIHZhciBzdGFuZGFyZCxcbiAgICAgICAgICAgIG1vdmVzZXQsXG4gICAgICAgICAgICBtb3Zlc2V0TGVuZ3RoLFxuICAgICAgICAgICAgcmFuZ2UgPSB0aGlzLl9yYW5nZSxcbiAgICAgICAgICAgIGNvbnRhaW5lck1vdmVEaXN0LFxuICAgICAgICAgICAgaXNQcmV2ID0gZmxvdyA9PT0gJ3ByZXYnLFxuICAgICAgICAgICAgYmFzaXMgPSB0aGlzLl9iYXNpcztcblxuICAgICAgICB0aGlzLl9zZXRQYXJ0T2ZQYW5lbHMoZmxvdyk7XG5cbiAgICAgICAgbW92ZXNldCA9IHRoaXMuX21vdmVQYW5lbFNldDtcbiAgICAgICAgbW92ZXNldExlbmd0aCA9IG1vdmVzZXQubGVuZ3RoO1xuICAgICAgICBjb250YWluZXJNb3ZlRGlzdCA9IHRoaXMuX2dldE1vdmVEaXN0YW5jZShmbG93KTtcblxuICAgICAgICBpZiAodGhpcy5faXNJbmNsdWRlKHRoaXMuX3BhbmVsc1t0aGlzLl9iYXNpc10sIG1vdmVzZXQpKSB7XG4gICAgICAgICAgICB0aGlzLl9iYXNpcyA9IGlzUHJldiA/IGJhc2lzIC0gbW92ZXNldExlbmd0aCA6IGJhc2lzICsgbW92ZXNldExlbmd0aDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNQcmV2KSB7XG4gICAgICAgICAgICBzdGFuZGFyZCA9IHRoaXMuX3BhbmVsc1swXTtcbiAgICAgICAgICAgIHR1aS51dGlsLmZvckVhY2gobW92ZXNldCwgZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lci5pbnNlcnRCZWZvcmUoZWxlbWVudCwgc3RhbmRhcmQpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0dWkudXRpbC5mb3JFYWNoKG1vdmVzZXQsIGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250YWluZXIuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jb250YWluZXIuc3R5bGVbcmFuZ2VdID0gcGFyc2VJbnQodGhpcy5fY29udGFpbmVyLnN0eWxlW3JhbmdlXSwgMTApIC0gY29udGFpbmVyTW92ZURpc3QgKyAncHgnO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBjdXJyZW50IHBhbmVsIGlzIGluY2x1ZGVkIHJvdGF0ZSBwYW5lbHNcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBpdGVtIEEgdGFyZ2V0IGVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBjb2xsZWNpdG9uIEEgYXJyYXkgdG8gY29tcGFyZVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2lzSW5jbHVkZTogZnVuY3Rpb24oaXRlbSwgY29sbGVjaXRvbikge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIGxlbjtcbiAgICAgICAgZm9yKGkgPSAwLCBsZW4gPSBjb2xsZWNpdG9uLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY29sbGVjaXRvbltpXSA9PT0gaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEZpbmQgcm90YXRlIHBhbmVsIGJ5IGRpcmVjdGlvblxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmbG93IEEgZGlyZWN0aW9uXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0UGFydE9mUGFuZWxzOiBmdW5jdGlvbihmbG93KSB7XG4gICAgICAgIHZhciBpdGVtY291bnQgPSB0aGlzLl9pdGVtY291bnQsXG4gICAgICAgICAgICBpc1ByZXYgPSAoZmxvdyA9PT0gJ3ByZXYnKSxcbiAgICAgICAgICAgIGNvdW50ID0gKHRoaXMuX3JvbGx1bml0ICE9PSAncGFnZScpID8gMSA6IGl0ZW1jb3VudCxcbiAgICAgICAgICAgIGRpc3QgPSBpc1ByZXYgPyAtY291bnQgOiBjb3VudCxcbiAgICAgICAgICAgIHBvaW50ID0gaXNQcmV2ID8gW2Rpc3RdIDogWzAsIGRpc3RdO1xuXG4gICAgICAgIHRoaXMuX21vdmVQYW5lbFNldCA9IHRoaXMuX3BhbmVscy5zbGljZS5hcHBseSh0aGlzLl9wYW5lbHMsIHBvaW50KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGRpc3BsYXkgaXRlbSBjb3VudFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldEl0ZW1Db3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5fZWxlbWVudCxcbiAgICAgICAgICAgIGVsZW1lbnRTdHlsZSA9IGVsZW1lbnQuc3R5bGUsXG4gICAgICAgICAgICBlbGVtZW50V2lkdGggPSBwYXJzZUludChlbGVtZW50U3R5bGUud2lkdGggfHwgZWxlbWVudC5jbGllbnRXaWR0aCwgMTApLFxuICAgICAgICAgICAgZWxlbWVudEhlaWdodCA9IHBhcnNlSW50KGVsZW1lbnRTdHlsZS5oZWlnaHQgfHwgZWxlbWVudC5jbGllbnRIZWlnaHQsIDEwKSxcbiAgICAgICAgICAgIGl0ZW0gPSB0aGlzLl9lbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdsaScpWzBdLCAvLyDrp4jtgazsl4XsnYAgbGnroZwg7ZS97IqkXG4gICAgICAgICAgICBpdGVtU3R5bGUgPSBpdGVtLnN0eWxlLFxuICAgICAgICAgICAgaXRlbVdpZHRoID0gcGFyc2VJbnQoaXRlbVN0eWxlLndpZHRoIHx8IGl0ZW0uY2xpZW50V2lkdGgsIDEwKSxcbiAgICAgICAgICAgIGl0ZW1IZWlnaHQgPSBwYXJzZUludChpdGVtU3R5bGUuaGVpZ2h0IHx8IGl0ZW0uY2xpZW50SGVpZ2h0LCAxMCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX3JhbmdlID09PSAnbGVmdCcpIHtcbiAgICAgICAgICAgIHRoaXMuX2l0ZW1jb3VudCA9IE1hdGgucm91bmQoZWxlbWVudFdpZHRoIC8gaXRlbVdpZHRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2l0ZW1jb3VudCA9IE1hdGgucm91bmQoZWxlbWVudEhlaWdodCAvIGl0ZW1IZWlnaHQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEluaXRhbGl6ZSBwYW5lbHMgXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaW5pdFBhbmVsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuX2NvbnRhaW5lcixcbiAgICAgICAgICAgIHBhbmVscyA9IGNvbnRhaW5lci5jaGlsZE5vZGVzLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGFycjtcblxuICAgICAgICBwYW5lbHMgPSB0dWkudXRpbC50b0FycmF5KHBhbmVscyk7XG5cbiAgICAgICAgdGhpcy5fcGFuZWxzID0gdHVpLnV0aWwuZmlsdGVyKHBhbmVscywgZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHR1aS51dGlsLmlzSFRNTFRhZyhlbGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHR1aS51dGlsLmZvckVhY2godGhpcy5fcGFuZWxzLCBmdW5jdGlvbihwYW5lbCwgaW5kZXgpIHtcbiAgICAgICAgICAgIHBhbmVsLmNsYXNzTmFtZSArPSAnIF9faW5kZXgnICsgaW5kZXggKyAnX18nO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHBhbmVsIGxpc3RcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRQYW5lbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLl9jb250YWluZXIsXG4gICAgICAgICAgICBwYW5lbHMgPSBjb250YWluZXIuY2hpbGROb2RlcyxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBhcnI7XG5cbiAgICAgICAgcGFuZWxzID0gdHVpLnV0aWwudG9BcnJheShwYW5lbHMpO1xuXG4gICAgICAgIHRoaXMuX3BhbmVscyA9IHR1aS51dGlsLmZpbHRlcihwYW5lbHMsIGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0dWkudXRpbC5pc0hUTUxUYWcoZWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9iYXNpcyA9IHRoaXMuX2Jhc2lzIHx8IDA7XG4gICAgICAgIHRoaXMuX3NldEJvdW5kYXJ5KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBmaXhlZCBhcmVhIGluY2lyY3VsYXIgcm9sbGluZ1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmbG93IEEgZGlyZWN0aW9uXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0Qm91bmRhcnk6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcGFuZWxzID0gdGhpcy5fcGFuZWxzLFxuICAgICAgICAgICAgZGlzdGFuY2UgPSB0aGlzLl9kaXN0YW5jZSxcbiAgICAgICAgICAgIHJhbmdlID0gdGhpcy5fcmFuZ2UsXG4gICAgICAgICAgICByYW5nZURpc3RhbmNlID0gcGFyc2VJbnQodGhpcy5fZWxlbWVudC5zdHlsZVtyYW5nZSA9PT0gJ2xlZnQnID8gJ3dpZHRoJyA6ICdoZWlnaHQnXSwgMTApLFxuICAgICAgICAgICAgd3JhcEFyZWEgPSB0aGlzLl9yb2xsdW5pdCA9PT0gJ3BhZ2UnID8gKGRpc3RhbmNlIC8gdGhpcy5faXRlbWNvdW50KSA6IGRpc3RhbmNlICogcGFuZWxzLmxlbmd0aCxcbiAgICAgICAgICAgIGxpbWl0RGlzdCA9IHdyYXBBcmVhIC0gcmFuZ2VEaXN0YW5jZTtcbiAgICAgICAgdGhpcy5saW1pdCA9IGxpbWl0RGlzdDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGN1cnJlbnQgaW5kZXggb24gc2VsZWN0ZWQgcGFnZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwYWdlIEEgbW92ZSBwYW5lbCBudW1iZXJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2NoZWNrUGFnZVBvc2l0aW9uOiBmdW5jdGlvbihwYWdlKSB7XG4gICAgICAgIHZhciBkaXN0ID0gbnVsbCxcbiAgICAgICAgICAgIHBhbmVscyA9IHRoaXMuX3BhbmVscztcbiAgICAgICAgdHVpLnV0aWwuZm9yRWFjaChwYW5lbHMsIGZ1bmN0aW9uKHBhbmVsLCBpbmRleCkge1xuICAgICAgICAgICAgaWYgKHBhbmVsLmNsYXNzTmFtZS5pbmRleE9mKCdfX2luZGV4JyArIHBhZ2UpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGlmICghdHVpLnV0aWwuaXNFeGlzdHkoZGlzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzdCA9IGluZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkaXN0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBIG1vdmUgdG8gc29tZSBwYW5lbC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcGFnZSBBIG51bWJlciBvZiBwYW5lbFxuICAgICAqL1xuICAgIG1vdmVUbzogZnVuY3Rpb24ocGFnZSkge1xuICAgICAgICBwYWdlID0gTWF0aC5tYXgocGFnZSwgMCk7XG4gICAgICAgIHBhZ2UgPSBNYXRoLm1pbihwYWdlLCB0aGlzLl9wYW5lbHMubGVuZ3RoIC0gMSk7XG5cbiAgICAgICAgdmFyIHBvcyA9IHRoaXMuX2NoZWNrUGFnZVBvc2l0aW9uKHBhZ2UpLFxuICAgICAgICAgICAgaXRlbUNvdW50ID0gdGhpcy5faXRlbWNvdW50LFxuICAgICAgICAgICAgcGFuZWxDb3VudCA9IHRoaXMuX3BhbmVscy5sZW5ndGgsXG4gICAgICAgICAgICBkaXN0YW5jZSA9IHRoaXMuX2Rpc3RhbmNlLFxuICAgICAgICAgICAgaXRlbURpc3QgPSB0aGlzLl9yb2xsdW5pdCA9PT0gJ3BhZ2UnID8gZGlzdGFuY2UgLyBpdGVtQ291bnQgOiBkaXN0YW5jZSxcbiAgICAgICAgICAgIHVuaXREaXN0ID0gLXBvcyAqIGl0ZW1EaXN0O1xuXG4gICAgICAgIGlmICghdGhpcy5faXNDaXJjdWxhcikge1xuICAgICAgICAgICAgdW5pdERpc3QgPSBNYXRoLm1heCh1bml0RGlzdCwgLXRoaXMubGltaXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdW5pdERpc3QgPSBNYXRoLm1heCh1bml0RGlzdCwgLShpdGVtRGlzdCAqIChwYW5lbENvdW50IC0gaXRlbUNvdW50KSkpO1xuICAgICAgICAgICAgdGhpcy5fYmFzaXMgPSBwb3M7XG4gICAgICAgICAgICB0aGlzLl9zZXRQYW5lbCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZVt0aGlzLl9yYW5nZV0gPSB1bml0RGlzdCArICdweCc7XG4gICAgfVxufTtcblxudHVpLnV0aWwuQ3VzdG9tRXZlbnRzLm1peGluKFJvbGxlcik7XG5tb2R1bGUuZXhwb3J0cyA9IFJvbGxlcjtcbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBSb2xsaW5nIGNvbXBvbmVudCBjb3JlLlxuICogQGF1dGhvciBOSE4gRW50LiBGRSBkZXYgdGVhbS48ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICogQGRlcGVuZGVuY3kgbmUtY29kZS1zbmlwcGV0XG4gKi9cblxudmFyIFJvbGxlciA9IHJlcXVpcmUoJy4vcm9sbGVyJyk7XG52YXIgRGF0YSA9IHJlcXVpcmUoJy4vcm9sbGRhdGEnKTtcbi8qKlxuICogUm9sbGluZyBjb3JlIG9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbiBUaGUgb3B0aW9ucyBcbiAqICAgICAgQHBhcmFtIHtIVE1MRWxlbWVudHxTdHJpbmd9IG9wdGlvbi5lbGVtZW50IEEgcm9vdCBlbGVtZW50IG9yIGlkIHRoYXQgd2lsbCBiZWNvbWUgcm9vdCBlbGVtZW50J3NcbiAqICAgICAgQHBhcmFtIHtCb29sZWFufSBbb3B0aW9uLmlzVmFyaWFibGU9dHJ1ZXxmYWxzZV0gV2hldGhlciB0aGUgZGF0YSBpcyBjaGFuZ2FibGUgb3Igbm90IFtkZWZhdWx0IHZhbHVlIGlzIGZhbHNlXVxuICogICAgICBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb24uaXNDaXJjdWxhcj10cnVlfGZhbHNlXSBXaGV0aGVyIGNpcmN1bGFyIG9yIG5vdCBbZGVmYXVsdCB2YWx1ZSBpcyB0cnVlIGJ1dCBpc1ZhcmlhYmxlIHRydWUgY2FzZV1cbiAqICAgICAgQHBhcmFtIHtCb29sZWFufSBbb3B0aW9uLmF1dG89dHJ1ZXxmYWxzZV0gV2hldGhlciBhdXRvIHJvbGxpbmcgb3Igbm90IFtkZWZhdWx0IHZhbHVlIGlzIGZhbHNlXVxuICogICAgICBAcGFyYW0ge051bWJlcn0gW29wdGlvbi5kZWxheVRpbWU9MTAwMHwuLi5dIERpc3RhbmNlIHRpbWUgb2YgYXV0byByb2xsaW5nLiBbZGVmdWxhdCAzIHNlY29uZF1cbiAqICAgICAgQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb24uZGlyZWN0aW9uPSdob3Jpem9udGFsfHZlcnRpY2FsJ10gVGhlIGZsb3cgZGlyZWN0aW9uIHBhbmVsIFtkZWZhdWx0IHZhbHVlIGlzIGhvcml6b250YWxdXG4gKiAgICAgIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9uLmR1cmF0aW9uPScxMDAwfC4uLl0gQSBtb3ZlIGR1cmF0aW9uXG4gKiAgICAgIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9uLmluaXROdW09JzB8Li4uXSBJbml0YWxpemUgc2VsZWN0ZWQgcm9sbGluZyBwYW5lbCBudW1iZXJcbiAqICAgICAgQHBhcmFtIHtTdHJpbmd9IFtvcHRpb24ubW90aW9uPSdsaW5lYXJ8W3F1YWRdZWFzZUlufFtxdWFkXWVhc2VPdXR8W3F1YWRdZWFzZUluT3V0fGNpcmNFYXNlSW58Y2lyY0Vhc2VPdXR8Y2lyY0Vhc2VJbk91dF0gQSBlZmZlY3QgbmFtZSBbZGVmYXVsdCB2YWx1ZSBpcyBub2VmZmVjdF1cbiAqICAgICAgQHBhcmFtIHtTdHJpbmd9IFtvcHRpb24udW5pdD0naXRlbXxwYWdlJ10gQSB1bml0IG9mIHJvbGxpbmdcbiAqICAgICAgQHBhcmFtIHtTdHJpbmd9IFtvcHRpb24ud3JhcHBlclRhZz0ndWwuY2xhc3NOYW1lfGRpdi5jbGFzc05hbWUnXSBBIHRhZyBuYW1lIGZvciBwYW5lbCB3YXJwcGVyLCBjb25uZWN0IHRhZyBuYW1lIHdpdGggY2xhc3MgbmFtZSBieSBkb3RzLiBbZGVmdWFsdCB2YWx1ZSBpcyB1bF1cbiAqICAgICAgQHBhcmFtIHtTdHJpbmd9IFtvcHRpb24ucGFuZWxUYWc9J2xpLmNsYXNzTmFtZSddIEEgdGFnIG5hbWUgZm9yIHBhbmVsLCBjb25uZWN0IHRhZyBuYW1lIHdpdGggY2xhc3MgYnkgZG90cyBbZGVmYXVsdCB2YWx1ZSBpcyBsaV1cbiAqIEBwYXJhbSB7QXJyYXl8U3RyaW5nfSBkYXRhIEEgZGF0YSBvZiByb2xsaW5nIHBhbmVsc1xuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIgcm9sbCA9IG5ldyB0dWkuY29tcG9uZW50LlJvbGxpbmcoe1xuICogICAgICBlbGVtZW50OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9sbGluZycpLFxuICogICAgICBpbml0TnVtOiAwLFxuICogICAgICBkaXJlY3Rpb246ICdob3Jpem9udGFsJyxcbiAqICAgICAgaXNWYXJpYWJsZTogdHJ1ZSxcbiAqICAgICAgdW5pdDogJ3BhZ2UnLFxuICogICAgICBpc0F1dG86IGZhbHNlLFxuICogICAgICBtb3Rpb246ICdlYXNlSW5PdXQnLFxuICogICAgICBkdXJhdGlvbjoyMDAwXG4gKiB9LCBbJzxkaXY+ZGF0YTE8L2Rpdj4nLCc8ZGl2PmRhdGEyPC9kaXY+JywgJzxkaXY+ZGF0YTM8L2Rpdj4nXSk7XG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIFJvbGxpbmcgPSB0dWkudXRpbC5kZWZpbmVDbGFzcygvKiogQGxlbmRzIFJvbGxpbmcucHJvdG90eXBlICove1xuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVcbiAgICAgKiAqL1xuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbiwgZGF0YSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogT3B0aW9uIG9iamVjdFxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fb3B0aW9uID0gb3B0aW9uO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGZsb3cgb2YgbmV4dCBtb3ZlXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd8c3RyaW5nfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fZmxvdyA9IG9wdGlvbi5mbG93IHx8ICduZXh0JztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZXRoZXIgaHRtbCBpcyBkcmF3biBvciBub3RcbiAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9pc0RyYXduID0gISFvcHRpb24uaXNEcmF3bjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEF1dG8gcm9sbGluZyB0aW1lclxuICAgICAgICAgKiBAdHlwZSB7bnVsbH1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3RpbWVyID0gbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEF1dG8gcm9sbGluZyBkZWxheSB0aW1lXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmRlbGF5VGltZSA9IHRoaXMuZGVsYXlUaW1lIHx8IDMwMDA7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIG1vZGVsIGZvciByb2xsaW5nIGRhdGFcbiAgICAgICAgICogQHR5cGUge0RhdGF9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9tb2RlbCA9ICFvcHRpb24uaXNEcmF3biA/IG5ldyBEYXRhKG9wdGlvbiwgZGF0YSkgOiBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSByb2xsaW5nIGFjdGlvbiBvYmplY3RcbiAgICAgICAgICogQHR5cGUge1JvbGxlcn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3JvbGxlciA9IG5ldyBSb2xsZXIob3B0aW9uLCB0aGlzLl9tb2RlbCAmJiB0aGlzLl9tb2RlbC5nZXREYXRhKCkpO1xuXG4gICAgICAgIGlmIChvcHRpb24uaW5pdE51bSkge1xuICAgICAgICAgICAgdGhpcy5tb3ZlVG8ob3B0aW9uLmluaXROdW0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghIW9wdGlvbi5pc0F1dG8pIHtcbiAgICAgICAgICAgIHRoaXMuYXV0bygpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJvbGwgdGhlIHJvbGxpbmcgY29tcG9uZW50LiBJZiB0aGVyZSBpcyBubyBkYXRhLCB0aGUgY29tcG9uZW50IGhhdmUgdG8gaGF2ZSB3aXRoIGZpeGVkIGRhdGFcbiAgICAgKiBAYXBpXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGEgQSByb2xsaW5nIGRhdGFcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW2Zsb3ddIEEgZGlyZWN0aW9uIHJvbGxpbmdcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJvbGxpbmcucm9sbCgnPGRpdj5kYXRhPC9kaXY+JywgJ2hvcml6b250YWwnKTtcbiAgICAgKi9cbiAgICByb2xsOiBmdW5jdGlvbihkYXRhLCBmbG93KSB7XG4gICAgICAgIGZsb3cgPSBmbG93IHx8IHRoaXMuX2Zsb3c7XG5cbiAgICAgICAgLy8gSWYgcm9sbGluZyBzdGF0dXMgaXMgbm90IGlkbGUsIHJldHVyblxuICAgICAgICBpZiAodGhpcy5fcm9sbGVyLnN0YXR1cyAhPT0gJ2lkbGUnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fb3B0aW9uLmlzVmFyaWFibGUpIHtcbiAgICAgICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncm9sbCBtdXN0IHJ1biB3aXRoIGRhdGEnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zZXRGbG93KGZsb3cpO1xuICAgICAgICAgICAgdGhpcy5fcm9sbGVyLm1vdmUoZGF0YSk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBvdmVyQm91bmRhcnk7XG4gICAgICAgICAgICB0aGlzLnNldEZsb3coZmxvdyk7XG4gICAgICAgICAgICBpZiAodGhpcy5fbW9kZWwpIHtcbiAgICAgICAgICAgICAgICBvdmVyQm91bmRhcnkgPSB0aGlzLl9tb2RlbC5jaGFuZ2VDdXJyZW50KGZsb3cpO1xuICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLl9tb2RlbC5nZXREYXRhKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZighb3ZlckJvdW5kYXJ5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcm9sbGVyLm1vdmUoZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgZGlyZWN0aW9uXG4gICAgICogQGFwaVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmbG93IEEgZGlyZWN0aW9uIG9mIHJvbGxpbmdcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJvbGxpbmcuc2V0RmxvdygnaG9yaXpvbnRhbCcpO1xuICAgICAqL1xuICAgIHNldEZsb3c6IGZ1bmN0aW9uKGZsb3cpIHtcbiAgICAgICAgdGhpcy5fZmxvdyA9IGZsb3c7XG4gICAgICAgIHRoaXMuX3JvbGxlci5zZXRGbG93KGZsb3cpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBNb3ZlIHRvIHRhcmdldCBwYWdlXG4gICAgICogQGFwaVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwYWdlIEEgdGFyZ2V0IHBhZ2VcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJvbGxpbmcubW92ZVRvKDMpO1xuICAgICAqL1xuICAgIG1vdmVUbzogZnVuY3Rpb24ocGFnZSkge1xuXG4gICAgICAgIGlmICh0aGlzLl9pc0RyYXduKSB7XG4gICAgICAgICAgICB0aGlzLl9yb2xsZXIubW92ZVRvKHBhZ2UpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxlbiA9IHRoaXMuX21vZGVsLmdldERhdGFMaXN0TGVuZ3RoKCksXG4gICAgICAgICAgICBtYXggPSBNYXRoLm1pbihsZW4sIHBhZ2UpLFxuICAgICAgICAgICAgbWluID0gTWF0aC5tYXgoMSwgcGFnZSksXG4gICAgICAgICAgICBjdXJyZW50ID0gdGhpcy5fbW9kZWwuZ2V0Q3VycmVudCgpLFxuICAgICAgICAgICAgZHVyYXRpb24sXG4gICAgICAgICAgICBhYnNJbnRlcnZhbCxcbiAgICAgICAgICAgIGlzUHJldixcbiAgICAgICAgICAgIGZsb3csXG4gICAgICAgICAgICBpO1xuXG4gICAgICAgIGlmIChpc05hTihOdW1iZXIocGFnZSkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJyNQYWdlRXJyb3IgbW92ZVRvIG1ldGhvZCBoYXZlIHRvIHJ1biB3aXRoIHBhZ2UnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fb3B0aW9uLmlzVmFyaWFibGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignI0RhdGFFcnJvciA6IFZhcmlhYmxlIFJvbGxpbmcgY2FuXFwndCB1c2UgbW92ZVRvJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpc1ByZXYgPSB0aGlzLmlzTmVnYXRpdmUocGFnZSAtIGN1cnJlbnQpO1xuICAgICAgICBwYWdlID0gaXNQcmV2ID8gbWluIDogbWF4O1xuICAgICAgICBmbG93ID0gaXNQcmV2ID8gJ3ByZXYnIDogJ25leHQnO1xuICAgICAgICBhYnNJbnRlcnZhbCA9IE1hdGguYWJzKHBhZ2UgLSBjdXJyZW50KTtcbiAgICAgICAgZHVyYXRpb24gPSB0aGlzLl9vcHRpb24uZHVyYXRpb24gLyBhYnNJbnRlcnZhbDtcblxuICAgICAgICB0aGlzLnNldEZsb3coZmxvdyk7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGFic0ludGVydmFsOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuX21vZGVsLmNoYW5nZUN1cnJlbnQoZmxvdyk7XG4gICAgICAgICAgICB0aGlzLl9yb2xsZXIubW92ZSh0aGlzLl9tb2RlbC5nZXREYXRhKCksIGR1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENoZWNrIHRoZSBudW1iZXIgaXMgbmVnYXRpdmUgb3Igbm90XG4gICAgICogQHBhcmFtIG51bWJlciBBIG51bWJlciB0byBmaWd1cmUgb3V0XG4gICAgICovXG4gICAgaXNOZWdhdGl2ZTogZnVuY3Rpb24obnVtYmVyKSB7XG4gICAgICAgIHJldHVybiAhaXNOYU4obnVtYmVyKSAmJiBudW1iZXIgPCAwO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTdG9wIGF1dG8gcm9sbGluZ1xuICAgICAqL1xuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLl90aW1lcik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN0YXJ0IGF1dG8gcm9sbGluZ1xuICAgICAqIEBhcGlcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJvbGxpbmcuYXV0bygpO1xuICAgICAqL1xuICAgIGF1dG86IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgdGhpcy5fdGltZXIgPSB3aW5kb3cuc2V0SW50ZXJ2YWwodHVpLnV0aWwuYmluZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuX21vZGVsLmNoYW5nZUN1cnJlbnQodGhpcy5fZmxvdyk7XG4gICAgICAgICAgICB0aGlzLl9yb2xsZXIubW92ZSh0aGlzLl9tb2RlbC5nZXREYXRhKCkpO1xuXG4gICAgICAgIH0sIHRoaXMpLCB0aGlzLmRlbGF5VGltZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEF0dGFjaCBjdXN0b20gZXZlbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBBIGV2ZW50IHR5cGVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBBIGNhbGxiYWNrIGZ1bmN0aW9uIGZvciBjdXN0b20gZXZlbnQgXG4gICAgICovXG4gICAgYXR0YWNoOiBmdW5jdGlvbih0eXBlLCBjYWxsYmFjaykge1xuICAgICAgICB0aGlzLl9yb2xsZXIub24odHlwZSwgY2FsbGJhY2spO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSdW4gY3VzdG9tIGV2ZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgQSBldmVudCB0eXBlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBBIGRhdGEgZnJvbSBmaXJlIGV2ZW50XG4gICAgICovXG4gICAgZmlyZTogZnVuY3Rpb24odHlwZSwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLl9yb2xsZXIuZmlyZSh0eXBlLCBvcHRpb25zKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSb2xsaW5nO1xuIl19

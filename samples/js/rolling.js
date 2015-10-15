(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
ne.util.defineNamespace('ne.component.Rolling', require('./src/js/rolling'));

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
var Data = ne.util.defineClass(/** @lends Data.prototype */{
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
        this._isCircular = ne.util.isBoolean(option.isCircular) ? option.isCircular : true;
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
        ne.util.extend(this, methods);
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

        nodelist = ne.util.map(datalist, function(data, index) {

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
var Roller = ne.util.defineClass(/** @lends Roller.prototype */{
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
        this._element = ne.util.isString(option.element) ? document.getElementById(option.element) : option.element;
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
        this._isCircular = ne.util.isExisty(option.isCircular) ? option.isCircular : true;
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
        ne.util.extend(this, methods);
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
        this._motion = ne.component.Rolling.Roller.motion[type];
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
            if (ne.util.isHTMLTag(firstChild)) {
                wrap = firstChild;
            }
            next = firstChild && firstChild.nextSibling;
            if (ne.util.isHTMLTag(next)) {
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

        if (ne.util.isString(option.panelTag)) {
            tag = (option.panelTag).split('.')[0];
            className = (option.panelTag).split('.')[1] || '';
        } else {
            if (!ne.util.isHTMLTag(panel)) {
                panel = panel && panel.nextSibling;
            }
            tag = ne.util.isHTMLTag(panel) ? panel.tagName : 'li';
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
         * ne.component.RollingInstance.attach('beforeMove', function(data) {
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
        ne.util.forEach(this._targets, function(element, index) {
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
            step: ne.util.bind(function(delta) {
                ne.util.forEach(this._targets, function(element, index) {

                    var dest = (flow === 'prev') ? distance * delta : -(distance * delta);
                    element.style[range] = start[index] + dest + 'px';

                });
            }, this),
            complete: ne.util.bind(this.complete, this)
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

        if (ne.util.isNotEmpty(this._queue)) {
            var first = this._queue.shift();
            this.move(first.data, first.duration, first.flow);
        } else {
            /**
             * After custom event run
             * @fires afterMove
             * @example
             * ne.component.RollingInstance.attach('afterMove', function() {
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
            wrap = ne.util.isHTMLTag(firstChild) ? firstChild : firstChild.nextSibling;
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
         * ne.component.RollingInstance.attach('beforeMove', function(data) {
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
            step: ne.util.bind(function(delta) {
                var dest = distance * delta;
                container.style[range] = start + dest + 'px';
            }, this),
            complete: ne.util.bind(this.complete, this)
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
            ne.util.forEach(moveset, function(element) {
                this._container.insertBefore(element, standard);
            }, this);
        } else {
            ne.util.forEach(moveset, function(element) {
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

        panels = ne.util.toArray(panels);

        this._panels = ne.util.filter(panels, function(element) {
            return ne.util.isHTMLTag(element);
        });
        ne.util.forEach(this._panels, function(panel, index) {
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

        panels = ne.util.toArray(panels);

        this._panels = ne.util.filter(panels, function(element) {
            return ne.util.isHTMLTag(element);
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
        ne.util.forEach(panels, function(panel, index) {
            if (panel.className.indexOf('__index' + page) !== -1) {
                if (!ne.util.isExisty(dist)) {
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

ne.util.CustomEvents.mixin(Roller);
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
 * var roll = new ne.component.Rolling({
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
var Rolling = ne.util.defineClass(/** @lends Rolling.prototype */{
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
     * @param {String} data A rolling data
     * @param {String} [flow] A direction rolling
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
     * @param {String} flow A direction of rolling
     */
    setFlow: function(flow) {
        this._flow = flow;
        this._roller.setFlow(flow);
    },
    /**
     * Move to target page
     * @param {Number} page A target page
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
     */
    auto: function() {
        this.stop();
        this._timer = window.setInterval(ne.util.bind(function() {
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInNyYy9qcy9tb3Rpb24uanMiLCJzcmMvanMvcm9sbGRhdGEuanMiLCJzcmMvanMvcm9sbGVyLmpzIiwic3JjL2pzL3JvbGxpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbjNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm5lLnV0aWwuZGVmaW5lTmFtZXNwYWNlKCduZS5jb21wb25lbnQuUm9sbGluZycsIHJlcXVpcmUoJy4vc3JjL2pzL3JvbGxpbmcnKSk7XG4iLCIvKipcbiAqIFJvbGxpbmcgbW90aW9uIGNvbGxlY3Rpb24gXG4gKiBAbmFtZXNwYWNlIG1vdGlvblxuICovXG52YXIgbW90aW9uID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBxdWFkRWFzZUluLFxuICAgICAgICBjaXJjRWFzZUluLFxuICAgICAgICBxdWFkRWFzZU91dCxcbiAgICAgICAgY2lyY0Vhc2VPdXQsXG4gICAgICAgIHF1YWRFYXNlSW5PdXQsXG4gICAgICAgIGNpcmNFYXNlSW5PdXQ7XG5cbiAgICAvKipcbiAgICAgKiBlYXNlSW5cbiAgICAgKiBAcGFyYW0gZGVsdGFcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gICAgICovXG4gICAgZnVuY3Rpb24gbWFrZUVhc2VJbihkZWx0YSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24ocHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWx0YShwcm9ncmVzcyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGVhc2VPdXRcbiAgICAgKiBAcGFyYW0gZGVsdGFcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gICAgICovXG4gICAgZnVuY3Rpb24gbWFrZUVhc2VPdXQoZGVsdGEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHByb2dyZXNzKSB7XG4gICAgICAgICAgICByZXR1cm4gMSAtIGRlbHRhKDEgLSBwcm9ncmVzcyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZWFzZUluT3V0XG4gICAgICogQHBhcmFtIGRlbHRhXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1ha2VFYXNlSW5PdXQoZGVsdGEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHByb2dyZXNzKSB7XG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3MgPCAwLjUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVsdGEoMiAqIHByb2dyZXNzKSAvIDI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAoMiAtIGRlbHRhKDIgKiAoMSAtIHByb2dyZXNzKSkpIC8gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTGluZWFyXG4gICAgICogQG1lbWJlcm9mIG1vdGlvblxuICAgICAqIEBtZXRob2QgbGluZWFyXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxpbmVhcihwcm9ncmVzcykge1xuICAgICAgICByZXR1cm4gcHJvZ3Jlc3M7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHF1YWQocHJvZ3Jlc3MpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucG93KHByb2dyZXNzLCAyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2lyYyhwcm9ncmVzcykge1xuICAgICAgICByZXR1cm4gMSAtIE1hdGguc2luKE1hdGguYWNvcyhwcm9ncmVzcykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHF1ZWQgKyBlYXNlSW5cbiAgICAgKiBAbWVtYmVyb2YgbW90aW9uXG4gICAgICogQG1ldGhvZCBxdWFkRWFzZUluXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHF1YWRFYXNlSW4gPSBtYWtlRWFzZUluKHF1YWQpO1xuICAgIC8qKlxuICAgICAqIGNpcmMgKyBlYXNlSW5cbiAgICAgKiBAbWVtYmVyb2YgbW90aW9uXG4gICAgICogQG1ldGhvZCBjaXJjRWFzZUluXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgICAgICBjaXJjRWFzZUluID0gbWFrZUVhc2VJbihjaXJjKTtcbiAgICAvKipcbiAgICAgKiBxdWFkICsgZWFzZU91dFxuICAgICAqIEBtZW1iZXJvZiBtb3Rpb25cbiAgICAgKiBAbWV0aG9kIHF1YWRFYXNlT3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgICAgICBxdWFkRWFzZU91dCA9IG1ha2VFYXNlT3V0KHF1YWQpO1xuICAgIC8qKlxuICAgICAqIGNpcmMgKyBlYXNlT3V0XG4gICAgICogQG1lbWJlcm9mIG1vdGlvblxuICAgICAqIEBtZXRob2QgY2lyY0Vhc2VPdXRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgY2lyY0Vhc2VPdXQgPSBtYWtlRWFzZU91dChjaXJjKTtcbiAgICAvKipcbiAgICAgKiBxdWFkICsgZWFzZUluT3V0XG4gICAgICogQG1lbWJlcm9mIG1vdGlvblxuICAgICAqIEBtZXRob2QgcXVhZEVhc2VJbk91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBxdWFkRWFzZUluT3V0ID0gbWFrZUVhc2VJbk91dChxdWFkKTtcbiAgICAvKipcbiAgICAgKiBjaXJjICsgZWFzZUluT3V0XG4gICAgICogQG1lbWJlcm9mIG1vdGlvblxuICAgICAqIEBtZXRob2QgY2lyY0Vhc2VJbk91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBjaXJjRWFzZUluT3V0ID0gbWFrZUVhc2VJbk91dChjaXJjKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGxpbmVhcjogbGluZWFyLFxuICAgICAgICBlYXNlSW46IHF1YWRFYXNlSW4sXG4gICAgICAgIGVhc2VPdXQ6IHF1YWRFYXNlT3V0LFxuICAgICAgICBlYXNlSW5PdXQ6IHF1YWRFYXNlSW5PdXQsXG4gICAgICAgIHF1YWRFYXNlSW46IHF1YWRFYXNlSW4sXG4gICAgICAgIHF1YWRFYXNlT3V0OiBxdWFkRWFzZU91dCxcbiAgICAgICAgcXVhZEVhc2VJbk91dDogcXVhZEVhc2VJbk91dCxcbiAgICAgICAgY2lyY0Vhc2VJbjogY2lyY0Vhc2VJbixcbiAgICAgICAgY2lyY0Vhc2VPdXQ6IGNpcmNFYXNlT3V0LFxuICAgICAgICBjaXJjRWFzZUluT3V0OiBjaXJjRWFzZUluT3V0XG4gICAgfTtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gbW90aW9uO1xuIiwiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IEEgZGF0YSBmb3IgbW92ZVxuICogQGF1dGhvciBOSE4gRW50LiBGRSBkZXYgdGVhbS48ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICogQGRlcGVuZGVuY3kgbmUtY29kZS1zbmlwcGV0XG4gKi9cblxuXG5cbi8qKiBcbiAqIERhdGEgbW9kZWwgZm9yIHJvbGxpbmdcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb24gQSBjb21wb25lbnQgb3B0aW9uc1xuICogQHBhcmFtIHsoQXJyYXl8T2JqZWN0KX0gZGF0YSBBIGRhdGEgb2Ygcm9sbGluZ1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBEYXRhID0gbmUudXRpbC5kZWZpbmVDbGFzcygvKiogQGxlbmRzIERhdGEucHJvdG90eXBlICove1xuICAgIGluaXQ6IGZ1bmN0aW9uKG9wdGlvbiwgZGF0YSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogV2hldGhlciBjaGFuZ2FibGUgZGF0YVxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaXNWYXJpYWJsZSA9ICEhb3B0aW9uLmlzVmFyaWFibGU7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGRhdGEgbGlzdFxuICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9kYXRhbGlzdCA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGRhdGFcbiAgICAgICAgICogQHR5cGUge05vZGV9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9kYXRhID0gbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgaW5pdCBudW1iZXJcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2N1cnJlbnQgPSBvcHRpb24uaW5pdE51bSB8fCAxO1xuICAgICAgICAvKipcbiAgICAgICAgICogV2hlaHRlciBjaXJjdWxhclxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2lzQ2lyY3VsYXIgPSBuZS51dGlsLmlzQm9vbGVhbihvcHRpb24uaXNDaXJjdWxhcikgPyBvcHRpb24uaXNDaXJjdWxhciA6IHRydWU7XG4gICAgICAgIGlmICh0aGlzLmlzVmFyaWFibGUpIHtcbiAgICAgICAgICAgIHRoaXMubWl4aW4ocmVtb3RlRGF0YU1ldGhvZHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5taXhpbihzdGF0aWNEYXRhTWV0aG9kcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9pbml0RGF0YShkYXRhKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIE1peGluXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG1ldGhvZHMgQSBtZXRob2Qgc2V0IFtzdGF0aWNEYXRhTWV0aG9kc3xyZW1vdGVEYXRhTWV0aG9kc11cbiAgICAgKi9cbiAgICBtaXhpbjogZnVuY3Rpb24obWV0aG9kcykge1xuICAgICAgICBuZS51dGlsLmV4dGVuZCh0aGlzLCBtZXRob2RzKTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBTdGF0aWMgZGF0YSBtZXRob2Qgc2V0XG4gKiBAbmFtZXNwYWNlIHN0YXRpY0RhdGFNZXRob2RzXG4gKi9cbnZhciBzdGF0aWNEYXRhTWV0aG9kcyA9IHtcbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplIGRhdGFcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhbGlzdCBBIGxpc3QgdGhhdCBpcyBub3QgY29ubmVjdGVkIHdpdGggZWFjaCBvdGhlclxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gX2RhdGFsaXN0XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaW5pdERhdGE6IGZ1bmN0aW9uKGRhdGFsaXN0KSB7XG4gICAgICAgIHZhciBiZWZvcmUgPSBudWxsLFxuICAgICAgICAgICAgZmlyc3QsXG4gICAgICAgICAgICBub2RlbGlzdDtcblxuICAgICAgICBub2RlbGlzdCA9IG5lLnV0aWwubWFwKGRhdGFsaXN0LCBmdW5jdGlvbihkYXRhLCBpbmRleCkge1xuXG4gICAgICAgICAgICB2YXIgbm9kZSA9IG5ldyBOb2RlKGRhdGEpO1xuICAgICAgICAgICAgbm9kZS5wcmV2ID0gYmVmb3JlO1xuXG4gICAgICAgICAgICBpZiAoYmVmb3JlKSB7XG4gICAgICAgICAgICAgICAgYmVmb3JlLm5leHQgPSBub2RlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmaXJzdCA9IG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IChkYXRhbGlzdC5sZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgICAgIG5vZGUubmV4dCA9IGZpcnN0O1xuICAgICAgICAgICAgICAgIGZpcnN0LnByZXYgPSBub2RlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBiZWZvcmUgPSBub2RlO1xuXG4gICAgICAgICAgICByZXR1cm4gbm9kZTtcblxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgbm9kZWxpc3QudW5zaGlmdChudWxsKTtcbiAgICAgICAgdGhpcy5fZGF0YWxpc3QgPSBub2RlbGlzdDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGluZGV4IGRhdGFcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggQSBpbmRleCB0byBnZXRcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgICAqL1xuICAgIGdldERhdGE6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhbGlzdFtpbmRleCB8fCB0aGlzLl9jdXJyZW50XS5kYXRhO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgbGlzdCBsZW5ndGhcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0RGF0YUxpc3RMZW5ndGg6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YWxpc3QubGVuZ3RoIC0gMTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IG5leHQgZGF0YVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBBIG5leHQgaW5kZXhcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZ2V0UHJldkRhdGE6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhbGlzdFtpbmRleCB8fCB0aGlzLl9jdXJyZW50XS5wcmV2LmRhdGE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBwcmV2IGRhdGFcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggQSBwcmV2IGluZGV4XG4gICAgICogQHJldHVybnMge1N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldE5leHREYXRhOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YWxpc3RbaW5kZXggfHwgdGhpcy5fY3VycmVudF0ubmV4dC5kYXRhO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2UgY3VycmVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmbG93IEEgZGlyZWN0aW9uXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBjaGFuZ2VDdXJyZW50OiBmdW5jdGlvbihmbG93KSB7XG4gICAgICAgIHZhciBsZW5ndGggPSB0aGlzLmdldERhdGFMaXN0TGVuZ3RoKCk7XG4gICAgICAgIGlmIChmbG93ID09PSAncHJldicpIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQgLT0gMTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50IDwgMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQgPSB0aGlzLl9pc0NpcmN1bGFyID8gbGVuZ3RoIDogMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQgKz0gMTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50ID4gbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudCA9IHRoaXMuX2lzQ2lyY3VsYXIgPyAxIDogbGVuZ3RoO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBHZXQgY3VycmVudFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0Q3VycmVudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50O1xuICAgIH1cbn07XG5cbi8qKlxuICogQ2hhbmdhYmxlIGRhdGEgbWV0aG9kIHNldFxuICogQG5hbWVzcGFjZSByZW1vdGVEYXRhTWV0aG9kc1xuICogQHN0YXRpY1xuICovXG52YXIgcmVtb3RlRGF0YU1ldGhvZHMgPSB7XG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZSBkYXRhXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGEgQSBkYXRhIHRvIGRyYXdcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pbml0RGF0YTogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGlzLl9kYXRhID0gbmV3IE5vZGUoZGF0YSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBjdXJyZW50IGRhdGEgb3Igc29tZSBkYXRhIGJ5IGluZGV4XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IEEgaW5kZXggb2YgZGF0YVxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAgICovXG4gICAgZ2V0RGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhLmRhdGE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBkYXRhXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgWydwcmV2fG5leHQnXSBBIGRhdGEgaW5kZXhcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSBBIGRhdGEgaW4gcm9sbGluZyBjb21wb25lbnRcbiAgICAgKi9cbiAgICBzZXREYXRhOiBmdW5jdGlvbih0eXBlLCBkYXRhKSB7XG4gICAgICAgIHRoaXMuX2RhdGFbdHlwZV0gPSBuZXcgTm9kZShkYXRhKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRGlzY29ubmVjdCBkYXRhXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgWydwcmV2fG5leHQnXSBSZXdyaXRlIGRhdGFcbiAgICAgKi9cbiAgICBzZXZlckxpbms6IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLl9kYXRhO1xuICAgICAgICB0aGlzLl9kYXRhID0gdGhpcy5fZGF0YVt0eXBlXTtcbiAgICAgICAgZGF0YVt0eXBlXSA9IG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBwcmV2aW91cyBEYXRhXG4gICAgICogQHJldHVybnMge1N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldFByZXZEYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGEucHJldiAmJiB0aGlzLl9kYXRhLnByZXYuZGF0YTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IG5leHQgZGF0YVxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBnZXROZXh0RGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhLm5leHQgJiYgdGhpcy5fZGF0YS5uZXh0LmRhdGE7XG4gICAgfVxufTtcblxuLyoqXG4gKiBOb2RlIGZvciBlYWNoIGRhdGEgcGFuZWxcbiAqIEBuYW1lc3BhY2UgTm9kZVxuICogQHBhcmFtIHtPYmplY3R9IGRhdGEgbm9kZSBkYXRhIG9yIGh0bWwgdmFsdWVcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgTm9kZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgIHRoaXMucHJldiA9IG51bGw7XG4gICAgdGhpcy5uZXh0ID0gbnVsbDtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGE7XG4iLCIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgUm9sbGVyIFxuICogQGF1dGhvciBOSE4gRW50LiBGRSBkZXYgdGVhbS48ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICogQGRlcGVuZGVuY3kgbmUtY29kZS1zbmlwcGV0XG4gKi9cbnZhciBtb3Rpb24gPSByZXF1aXJlKCcuL21vdGlvbicpO1xuLyoqXG4gKiBSb2xsZXIgdGhhdCBtb3ZlIHJvbGxpbmcgcGFuZWxcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uIFRoZSBvcHRpb24gb2Ygcm9sbGluZyBjb21wb25lbnRcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgUm9sbGVyID0gbmUudXRpbC5kZWZpbmVDbGFzcygvKiogQGxlbmRzIFJvbGxlci5wcm90b3R5cGUgKi97XG4gICAgaW5pdDogZnVuY3Rpb24ob3B0aW9uLCBpbml0RGF0YSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBvcHRpb25zXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9vcHRpb24gPSBvcHRpb247XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHJvb3QgZWxlbWVudFxuICAgICAgICAgKiBAdHlwZSB7KEhUTUxlbGVtZW50fFN0cmluZyl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9lbGVtZW50ID0gbmUudXRpbC5pc1N0cmluZyhvcHRpb24uZWxlbWVudCkgPyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvcHRpb24uZWxlbWVudCkgOiBvcHRpb24uZWxlbWVudDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgZGlyZWN0aW9uIG9mIHJvbGxpbmcgKHZlcnRpY2FsfGhvcml6b250YWwpXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSBvcHRpb24uZGlyZWN0aW9uIHx8ICdob3Jpem9udGFsJztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgc3R5bGUgYXR0cmlidXRlIHRvIG1vdmUoJ2xlZnQgfCB0b3AnKVxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fcmFuZ2UgPSB0aGlzLl9kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJyA/ICdsZWZ0JyA6ICd0b3AnO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgdG8gbW92ZVxuICAgICAgICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9tb3Rpb24gPSBtb3Rpb25bb3B0aW9uLm1vdGlvbiB8fCAnbm9lZmZlY3QnXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgcm9sbGluZyB1bml0XG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9yb2xsdW5pdCA9IG9wdGlvbi51bml0IHx8ICdwYWdlJztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZXRoZXIgaHRtbCBpcyBkcmF3biBvciBub3RcbiAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9pc0RyYXduID0gISFvcHRpb24uaXNEcmF3bjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgaXRlbSBwZXIgcGFnZVxuICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2l0ZW1jb3VudCA9IG9wdGlvbi5pdGVtY291bnQ7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGRpcmVjdGlvbiB0byBuZXh0IHJvbGxpbmdcbiAgICAgICAgICogQHR5cGUge1N0cmluZ3xzdHJpbmd9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9mbG93ID0gb3B0aW9uLmZsb3cgfHwgJ25leHQnO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBhbmltYXRpb24gZHVyYXRpb25cbiAgICAgICAgICogQHR5cGUgeyp8bnVtYmVyfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fZHVyYXRpb24gPSBvcHRpb24uZHVyYXRpb24gfHwgMTAwMDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdoZXRoZXIgY2lyY3VsYXIgb3Igbm90XG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5faXNDaXJjdWxhciA9IG5lLnV0aWwuaXNFeGlzdHkob3B0aW9uLmlzQ2lyY3VsYXIpID8gb3B0aW9uLmlzQ2lyY3VsYXIgOiB0cnVlO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSByb2xsZXIgc3RhdGVcbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc3RhdHVzID0gJ2lkbGUnO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBjb250YWluZXIgdGhhdCB3aWxsIGJlIG1vdmVkXG4gICAgICAgICAqIEB0eXBlIHtIVE1MRWxlbWVudH1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lciA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGFuZ2FibGUgZGF0YSBwYW5lbFxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5wYW5lbCA9IHsgcHJldjogbnVsbCwgY2VudGVyOiBudWxsLCBuZXh0OiBudWxsIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGaXhlZCByb2xsZXIgcGFuZWxzLCB0aGF0IGhhdmUgbm9kZSBsaXN0IGJ5IGFycmF5XG4gICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3BhbmVscyA9IFtdO1xuICAgICAgICAvKipcbiAgICAgICAgICogQmFzZSBlbGVtZW50IFxuICAgICAgICAgKiBAdHlwZSB7SFRNTEVsZW1lbnR9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9iYXNpcyA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSb290IGVsZW1lbnQgd2lkdGgsIGlmIG1vdmUgdW5pdCBpcyBwYWdlIHRoaXMgaXMgbW92ZSB3aWR0aFxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fZGlzdGFuY2UgPSAwO1xuICAgICAgICAvKipcbiAgICAgICAgICogTW92ZWQgcGFuZWwgdGFyZ2V0XG4gICAgICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3RhcmdldHMgPSBbXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFF1ZXVlIGZvciBvcmRlciB0aGF0IGlzIHJlcXVlc3RlZCBkdXJpbmcgbW92aW5nIFxuICAgICAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9xdWV1ZSA9IFtdO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBtb3ZlIHVuaXQgY291bnRcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3VuaXRDb3VudCA9IG9wdGlvbi5yb2xsdW5pdCA9PT0gJ3BhZ2UnID8gMSA6IChvcHRpb24udW5pdENvdW50IHx8IDEpO1xuICAgICAgICAvKipcbiAgICAgICAgICogQ3VzdG9tIGV2ZW50XG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAgICAgICBpZiAoIXRoaXMuX2lzRHJhd24pIHtcbiAgICAgICAgICAgIHRoaXMubWl4aW4obW92ZVBhbmVsU2V0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubWl4aW4obW92ZUNvbnRhaW5lclNldCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc2V0Q29udGFpbmVyKCk7XG4gICAgICAgIHRoaXMuX21hc2tpbmcoKTtcbiAgICAgICAgdGhpcy5fc2V0VW5pdERpc3RhbmNlKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2lzRHJhd24pIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRQYW5lbCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NldFBhbmVsKGluaXREYXRhKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTWl4aW5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbWV0aG9kcyBBIG1ldGhvZCBzZXQgW3N0YXRpY0RhdGFNZXRob2RzfHJlbW90ZURhdGFNZXRob2RzXVxuICAgICAqL1xuICAgIG1peGluOiBmdW5jdGlvbihtZXRob2RzKSB7XG4gICAgICAgIG5lLnV0aWwuZXh0ZW5kKHRoaXMsIG1ldGhvZHMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBNYXNraW5nIFxuICAgICAqIEBtZXRob2RcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9tYXNraW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50LFxuICAgICAgICAgICAgZWxlbWVudFN0eWxlID0gZWxlbWVudC5zdHlsZTtcbiAgICAgICAgZWxlbWVudFN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAgICAgZWxlbWVudFN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgICAgIGVsZW1lbnRTdHlsZS53aWR0aCA9IGVsZW1lbnRTdHlsZS53aWR0aCB8fCAoZWxlbWVudC5jbGllbnRXaWR0aCArICdweCcpO1xuICAgICAgICBlbGVtZW50U3R5bGUuaGVpZ2h0ID0gZWxlbWVudFN0eWxlLmhlaWdodCB8fCAoZWxlbWVudC5jbGllbnRIZWlnaHQgKyAncHgnKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IHVuaXQgbW92ZSBkaXN0YW5jZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldFVuaXREaXN0YW5jZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIGRpc3QsXG4gICAgICAgICAgICBlbGVtZW50U3R5bGUgPSB0aGlzLl9lbGVtZW50LnN0eWxlO1xuXG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgZGlzdCA9IGVsZW1lbnRTdHlsZS53aWR0aC5yZXBsYWNlKCdweCcsICcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRpc3QgPSBlbGVtZW50U3R5bGUuaGVpZ2h0LnJlcGxhY2UoJ3B4JywgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX3JvbGx1bml0ICE9PSAncGFnZScgJiYgdGhpcy5faXNEcmF3bikge1xuICAgICAgICAgICAgZGlzdCA9IE1hdGguY2VpbChkaXN0IC8gdGhpcy5faXRlbWNvdW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9kaXN0YW5jZSA9IHBhcnNlSW50KGRpc3QsIDEwKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUXVldWUgbW92ZSBvcmRlciAgICBcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSBBIHBhZ2UgZGF0YVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdXJhdGlvbiBBIGR1YXJ0aW9uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZsb3cgQSBkaXJlY3Rpb24gdG8gbW92ZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3F1ZXVlaW5nOiBmdW5jdGlvbihkYXRhLCBkdXJhdGlvbiwgZmxvdykge1xuICAgICAgICB0aGlzLl9xdWV1ZS5wdXNoKHtcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgICAgICBmbG93OiBmbG93XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBIGRlZmF1bHQgZGlyZWN0aW9uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZsb3cgQSBmbG93IHRoYXQgd2lsbCBiZSBkZWZ1YWx0IHZhbHVlXG4gICAgICovXG4gICAgc2V0RmxvdzogZnVuY3Rpb24oZmxvdykge1xuICAgICAgICB0aGlzLl9mbG93ID0gZmxvdyB8fCB0aGlzLl9mbG93IHx8ICduZXh0JztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogY2hhbmdlIGFuaW1hdGlvbiBlZmZlY3RcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBBIG5hbWUgb2YgZWZmZWN0XG4gICAgICovXG4gICAgY2hhbmdlTW90aW9uOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgIHRoaXMuX21vdGlvbiA9IG5lLmNvbXBvbmVudC5Sb2xsaW5nLlJvbGxlci5tb3Rpb25bdHlwZV07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFuaW1hdGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uIEEgb3B0aW9ucyBmb3IgYW5pbWF0aW5nXG4gICAgICovXG4gICAgX2FuaW1hdGU6IGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICB2YXIgc3RhcnQgPSBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgaWQgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRpbWVQYXNzZWQgPSBuZXcgRGF0ZSgpIC0gc3RhcnQsXG4gICAgICAgICAgICAgICAgICAgIHByb2dyZXNzID0gdGltZVBhc3NlZCAvIG9wdGlvbi5kdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgZGVsdGE7XG4gICAgICAgICAgICAgICAgaWYgKHByb2dyZXNzID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzcyA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlbHRhID0gb3B0aW9uLmRlbHRhKHByb2dyZXNzKTtcblxuICAgICAgICAgICAgICAgIG9wdGlvbi5zdGVwKGRlbHRhKTtcblxuICAgICAgICAgICAgICAgIGlmIChwcm9ncmVzcyA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbChpZCk7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbi5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIG9wdGlvbi5kZWxheSB8fCAxMCk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogQSByb2xsZXIgbWV0aG9kIHNldCBmb3IgZml4ZWQgcGFuZWxcbiAqIEBuYW1lc3BhY2UgbW92ZVBhbmVsU2V0XG4gKiBAc3RhdGljXG4gKi9cbnZhciBtb3ZlUGFuZWxTZXQgPSB7XG4gICAgLyoqXG4gICAgICogU2V0IHJvb2xpbmcgY29udGFpbmVyXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0Q29udGFpbmVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG9wdGlvbiA9IHRoaXMuX29wdGlvbixcbiAgICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50LFxuICAgICAgICAgICAgZmlyc3RDaGlsZCA9IGVsZW1lbnQuZmlyc3RDaGlsZCxcbiAgICAgICAgICAgIHdyYXAsXG4gICAgICAgICAgICBuZXh0LFxuICAgICAgICAgICAgdGFnLFxuICAgICAgICAgICAgY2xhc3NOYW1lO1xuXG4gICAgICAgIGlmIChvcHRpb24ud3JhcHBlclRhZykge1xuICAgICAgICAgICAgdGFnID0gb3B0aW9uLndyYXBwZXJUYWcgJiYgb3B0aW9uLndyYXBwZXJUYWcuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IG9wdGlvbi53cmFwcGVyVGFnICYmIG9wdGlvbi53cmFwcGVyVGFnLnNwbGl0KCcuJylbMV0gfHwgJyc7XG4gICAgICAgICAgICB3cmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICAgICAgICAgICAgaWYgKGNsYXNzTmFtZSkge1xuICAgICAgICAgICAgd3JhcC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZCh3cmFwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChuZS51dGlsLmlzSFRNTFRhZyhmaXJzdENoaWxkKSkge1xuICAgICAgICAgICAgICAgIHdyYXAgPSBmaXJzdENoaWxkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV4dCA9IGZpcnN0Q2hpbGQgJiYgZmlyc3RDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgIGlmIChuZS51dGlsLmlzSFRNTFRhZyhuZXh0KSkge1xuICAgICAgICAgICAgICAgIHdyYXAgPSBuZXh0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3cmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50LmFwcGVuZENoaWxkKHdyYXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lciA9IHdyYXA7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBNYWtlIHJvbGxpbmcgcGFuZWxcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRQYW5lbDogZnVuY3Rpb24oaW5pdERhdGEpIHtcbiAgICAgICAgdmFyIHBhbmVsID0gdGhpcy5fY29udGFpbmVyLmZpcnN0Q2hpbGQsXG4gICAgICAgICAgICBwYW5lbFNldCA9IHRoaXMucGFuZWwsXG4gICAgICAgICAgICBvcHRpb24gPSB0aGlzLl9vcHRpb24sXG4gICAgICAgICAgICB0YWcsXG4gICAgICAgICAgICBjbGFzc05hbWUsXG4gICAgICAgICAgICBrZXk7XG5cbiAgICAgICAgaWYgKG5lLnV0aWwuaXNTdHJpbmcob3B0aW9uLnBhbmVsVGFnKSkge1xuICAgICAgICAgICAgdGFnID0gKG9wdGlvbi5wYW5lbFRhZykuc3BsaXQoJy4nKVswXTtcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IChvcHRpb24ucGFuZWxUYWcpLnNwbGl0KCcuJylbMV0gfHwgJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIW5lLnV0aWwuaXNIVE1MVGFnKHBhbmVsKSkge1xuICAgICAgICAgICAgICAgIHBhbmVsID0gcGFuZWwgJiYgcGFuZWwubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YWcgPSBuZS51dGlsLmlzSFRNTFRhZyhwYW5lbCkgPyBwYW5lbC50YWdOYW1lIDogJ2xpJztcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IChwYW5lbCAmJiBwYW5lbC5jbGFzc05hbWUpIHx8ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXG4gICAgICAgIGZvciAoa2V5IGluIHBhbmVsU2V0KSB7XG4gICAgICAgICAgICBwYW5lbFNldFtrZXldID0gdGhpcy5fbWFrZUVsZW1lbnQodGFnLCBjbGFzc05hbWUsIGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICBwYW5lbFNldC5jZW50ZXIuaW5uZXJIVE1MID0gaW5pdERhdGE7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5hcHBlbmRDaGlsZChwYW5lbFNldC5jZW50ZXIpO1xuXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBNYWtlIEhUTUwgRWxlbWVudCAgICAgXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRhZyBBIHRhZyBuYW1lXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZSBBIGNsYXNzIG5hbWVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IEEgY2xhc3Mga2V5IG5hbWVcbiAgICAgKiBAcmV0dXJucyB7SFRNTEVsZW1lbnR9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfbWFrZUVsZW1lbnQ6IGZ1bmN0aW9uKHRhZywgY2xhc3NOYW1lLCBrZXkpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgICAgICBlbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgZWxlbWVudC5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAgICAgZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9ICcwcHgnO1xuICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnO1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHBhbmVsIGRhdGFcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSBBIGRhdGEgZm9yIHJlcGxhY2UgcGFuZWxcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF91cGRhdGVQYW5lbDogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGlzLnBhbmVsW3RoaXMuX2Zsb3cgfHwgJ2NlbnRlciddLmlubmVySFRNTCA9IGRhdGE7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEFwcGVuZCBtb3ZlIHBhbmVsXG4gICAgICovXG4gICAgX2FwcGVuZE1vdmVEYXRhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZsb3cgPSB0aGlzLl9mbG93LFxuICAgICAgICAgICAgbW92ZVBhbmVsID0gdGhpcy5wYW5lbFtmbG93XSxcbiAgICAgICAgICAgIHN0eWxlID0gbW92ZVBhbmVsLnN0eWxlLFxuICAgICAgICAgICAgZGVzdCA9IChmbG93ID09PSAncHJldicgPyAtdGhpcy5fZGlzdGFuY2UgOiB0aGlzLl9kaXN0YW5jZSkgKyAncHgnO1xuXG4gICAgICAgIHN0eWxlW3RoaXMuX3JhbmdlXSA9IGRlc3Q7XG5cbiAgICAgICAgdGhpcy5tb3ZlUGFuZWwgPSBtb3ZlUGFuZWw7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5hcHBlbmRDaGlsZChtb3ZlUGFuZWwpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgZWFjaCBwYW5lbHMnIG1vdmUgZGlzdGFuY2VzXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0TW92ZVNldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmbG93ID0gdGhpcy5fZmxvdztcbiAgICAgICAgaWYgKGZsb3cgPT09ICdwcmV2Jykge1xuICAgICAgICAgICAgcmV0dXJuIFswLCB0aGlzLl9kaXN0YW5jZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gWy10aGlzLl9kaXN0YW5jZSwgMF07XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IHN0YXJ0IHBvaW50c1xuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZXRTdGFydFNldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBwYW5lbCA9IHRoaXMucGFuZWwsXG4gICAgICAgICAgICBmbG93ID0gdGhpcy5fZmxvdyxcbiAgICAgICAgICAgIHJhbmdlID0gdGhpcy5fcmFuZ2UsXG4gICAgICAgICAgICBpc1ByZXYgPSBmbG93ID09PSAncHJldicsXG4gICAgICAgICAgICBmaXJzdCA9IGlzUHJldiA/IHBhbmVsWydwcmV2J10gOiBwYW5lbFsnY2VudGVyJ10sXG4gICAgICAgICAgICBzZWNvbmQgPSBpc1ByZXYgPyBwYW5lbFsnY2VudGVyJ10gOiBwYW5lbFsnbmV4dCddO1xuICAgICAgICByZXR1cm4gW3BhcnNlSW50KGZpcnN0LnN0eWxlW3JhbmdlXSwgMTApLCBwYXJzZUludChzZWNvbmQuc3R5bGVbcmFuZ2VdLCAxMCldO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgbW92ZSB0YXJnZXRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmxvdyBBIGZsb3cgdG8gbW92ZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldFRhcmdldDogZnVuY3Rpb24oZmxvdykge1xuICAgICAgICB0aGlzLl90YXJnZXRzID0gW3RoaXMucGFuZWxbJ2NlbnRlciddXTtcbiAgICAgICAgaWYgKGZsb3cgPT09ICdwcmV2Jykge1xuICAgICAgICAgICAgdGhpcy5fdGFyZ2V0cy51bnNoaWZ0KHRoaXMucGFuZWxbZmxvd10pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdGFyZ2V0cy5wdXNoKHRoaXMucGFuZWxbZmxvd10pO1xuICAgICAgICB9XG5cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEEgcGFuZWwgbW92ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIEEgZGF0YSB0byB1cGRhdGUgcGFuZWxcbiAgICAgKi9cbiAgICBtb3ZlOiBmdW5jdGlvbihkYXRhLCBkdXJhdGlvbiwgZmxvdykge1xuICAgICAgICBmbG93ID0gZmxvdyB8fCB0aGlzLl9mbG93O1xuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09ICdpZGxlJykge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAncnVuJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3F1ZXVlaW5nKGRhdGEsIGR1cmF0aW9uLCBmbG93KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCZWZvcmUgbW92ZSBjdXN0b20gZXZlbnQgZmlyZVxuICAgICAgICAgKiBAZmlyZXMgYmVmb3JlTW92ZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YSBJbm5lciBIVE1MXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIG5lLmNvbXBvbmVudC5Sb2xsaW5nSW5zdGFuY2UuYXR0YWNoKCdiZWZvcmVNb3ZlJywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgKiAgICAvLyAuLi4uLiBydW4gY29kZVxuICAgICAgICAgKiB9KTtcbiAgICAgICAgICovXG4gICAgICAgIHZhciByZXMgPSB0aGlzLmZpcmUoJ2JlZm9yZU1vdmUnLCB7IGRhdGE6IGRhdGEgfSk7XG5cbiAgICAgICAgaWYgKCFyZXMpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gJ2lkbGUnO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IG5leHQgcGFuZWxcbiAgICAgICAgdGhpcy5fdXBkYXRlUGFuZWwoZGF0YSk7XG4gICAgICAgIHRoaXMuX2FwcGVuZE1vdmVEYXRhKCk7XG4gICAgICAgIHRoaXMuX3NldFRhcmdldChmbG93KTtcblxuICAgICAgICBpZiAoIXRoaXMuX21vdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fbW92ZVdpdGhvdXRNb3Rpb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX21vdmVXaXRoTW90aW9uKGR1cmF0aW9uKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgcG9zaXRpb25cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9tb3ZlV2l0aG91dE1vdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmbG93ID0gdGhpcy5fZmxvdyxcbiAgICAgICAgICAgIHBvcyA9IHRoaXMuX2dldE1vdmVTZXQoZmxvdyksXG4gICAgICAgICAgICByYW5nZSA9IHRoaXMuX3JhbmdlO1xuICAgICAgICBuZS51dGlsLmZvckVhY2godGhpcy5fdGFyZ2V0cywgZnVuY3Rpb24oZWxlbWVudCwgaW5kZXgpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbcmFuZ2VdID0gcG9zW2luZGV4XSArICdweCc7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmNvbXBsZXRlKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJ1biBhbmltYXRpb25cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9tb3ZlV2l0aE1vdGlvbjogZnVuY3Rpb24oZHVyYXRpb24pIHtcbiAgICAgICAgdmFyIGZsb3cgPSB0aGlzLl9mbG93LFxuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLl9nZXRTdGFydFNldChmbG93KSxcbiAgICAgICAgICAgIGRpc3RhbmNlID0gdGhpcy5fZGlzdGFuY2UsXG4gICAgICAgICAgICByYW5nZSA9IHRoaXMuX3JhbmdlO1xuXG4gICAgICAgIGR1cmF0aW9uID0gZHVyYXRpb24gfHwgdGhpcy5fZHVyYXRpb247XG5cbiAgICAgICAgdGhpcy5fYW5pbWF0ZSh7XG4gICAgICAgICAgICBkZWxheTogMTAsXG4gICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24gfHwgMTAwMCxcbiAgICAgICAgICAgIGRlbHRhOiB0aGlzLl9tb3Rpb24sXG4gICAgICAgICAgICBzdGVwOiBuZS51dGlsLmJpbmQoZnVuY3Rpb24oZGVsdGEpIHtcbiAgICAgICAgICAgICAgICBuZS51dGlsLmZvckVhY2godGhpcy5fdGFyZ2V0cywgZnVuY3Rpb24oZWxlbWVudCwgaW5kZXgpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgZGVzdCA9IChmbG93ID09PSAncHJldicpID8gZGlzdGFuY2UgKiBkZWx0YSA6IC0oZGlzdGFuY2UgKiBkZWx0YSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbcmFuZ2VdID0gc3RhcnRbaW5kZXhdICsgZGVzdCArICdweCc7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIHRoaXMpLFxuICAgICAgICAgICAgY29tcGxldGU6IG5lLnV0aWwuYmluZCh0aGlzLmNvbXBsZXRlLCB0aGlzKVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ29tcGxhdGUgY2FsbGJhY2tcbiAgICAgKi9cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBwYW5lbCA9IHRoaXMucGFuZWwsXG4gICAgICAgICAgICB0ZW1wUGFuZWwsXG4gICAgICAgICAgICBmbG93ID0gdGhpcy5fZmxvdztcblxuICAgICAgICB0ZW1wUGFuZWwgPSBwYW5lbFsnY2VudGVyJ107XG4gICAgICAgIHBhbmVsWydjZW50ZXInXSA9IHBhbmVsW2Zsb3ddO1xuICAgICAgICBwYW5lbFtmbG93XSA9IHRlbXBQYW5lbDtcblxuICAgICAgICB0aGlzLl90YXJnZXRzID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLnJlbW92ZUNoaWxkKHRlbXBQYW5lbCk7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gJ2lkbGUnO1xuXG4gICAgICAgIGlmIChuZS51dGlsLmlzTm90RW1wdHkodGhpcy5fcXVldWUpKSB7XG4gICAgICAgICAgICB2YXIgZmlyc3QgPSB0aGlzLl9xdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgdGhpcy5tb3ZlKGZpcnN0LmRhdGEsIGZpcnN0LmR1cmF0aW9uLCBmaXJzdC5mbG93KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQWZ0ZXIgY3VzdG9tIGV2ZW50IHJ1blxuICAgICAgICAgICAgICogQGZpcmVzIGFmdGVyTW92ZVxuICAgICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAgICAqIG5lLmNvbXBvbmVudC5Sb2xsaW5nSW5zdGFuY2UuYXR0YWNoKCdhZnRlck1vdmUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAqICAgIC8vIC4uLi4uIHJ1biBjb2RlXG4gICAgICAgICAgICAgKiB9KTtcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5maXJlKCdhZnRlck1vdmUnKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogQ29udGFpbmVyIG1vdmUgbWV0aG9kc1xuICogQG5hbWVzcGFjZSBtb3ZlQ29udGFpbmVyU2V0XG4gKiBAc3RhdGljXG4gKi9cbnZhciBtb3ZlQ29udGFpbmVyU2V0ID0ge1xuICAgIC8qKlxuICAgICAqIFNldCBjb250YWluZXJcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRDb250YWluZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnQsXG4gICAgICAgICAgICBmaXJzdENoaWxkID0gZWxlbWVudC5maXJzdENoaWxkLFxuICAgICAgICAgICAgd3JhcDtcbiAgICAgICAgaWYgKHRoaXMuX2lzRHJhd24pIHtcbiAgICAgICAgICAgIHdyYXAgPSBuZS51dGlsLmlzSFRNTFRhZyhmaXJzdENoaWxkKSA/IGZpcnN0Q2hpbGQgOiBmaXJzdENoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyID0gd3JhcDtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZVt0aGlzLl9yYW5nZV0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NldEl0ZW1Db3VudCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBNb3ZlIGFyZWEgY2hlY2tcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmxvdyBBIGRpcmVjdGlvbiB0byBtb3ZlXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaXNMaW1pdFBvaW50OiBmdW5jdGlvbihmbG93KSB7XG4gICAgICAgIHZhciBtb3ZlZCA9IHRoaXMuX2dldEN1cnJlbnRQb3NpdGlvbigpO1xuICAgICAgICBpZiAoZmxvdyA9PT0gJ25leHQnKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5saW1pdCA+IC1tb3ZlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZihtb3ZlZCA8IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBjdXJyZW50IHBvc2l0aW9uXG4gICAgICovXG4gICAgX2dldEN1cnJlbnRQb3NpdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLl9jb250YWluZXIuc3R5bGVbdGhpcy5fcmFuZ2VdLCAxMCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIE1vdmUgcGFuZWxzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgQSBkYXRhIHRvIHVwZGF0ZSBwYW5lbFxuICAgICAqL1xuICAgIG1vdmU6IGZ1bmN0aW9uKGR1cmF0aW9uLCBmbG93KSB7XG4gICAgICAgIGZsb3cgPSBmbG93IHx8IHRoaXMuX2Zsb3c7XG5cbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAnaWRsZScpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gJ3J1bic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9xdWV1ZWluZyhkdXJhdGlvbiwgZmxvdyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRmlyZSBiZWZvcmUgY3VzdG9tIGV2ZW50XG4gICAgICAgICAqIEBmaXJlcyBiZWZvcmVNb3ZlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhIGlubmVyIEhUTUxcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbmUuY29tcG9uZW50LlJvbGxpbmdJbnN0YW5jZS5hdHRhY2goJ2JlZm9yZU1vdmUnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAqICAgIC8vIC4uLi4uIHJ1biBjb2RlXG4gICAgICAgICAqIH0pO1xuICAgICAgICAgKi9cbiAgICAgICAgdmFyIHJlcyA9IHRoaXMuaW52b2tlKCdiZWZvcmVNb3ZlJyk7XG4gICAgICAgIGlmICghcmVzKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9ICdpZGxlJztcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZighdGhpcy5faXNDaXJjdWxhciAmJiB0aGlzLl9pc0xpbWl0UG9pbnQoZmxvdykpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gJ2lkbGUnO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9pc0NpcmN1bGFyKSB7XG4gICAgICAgICAgICB0aGlzLl9yb3RhdGVQYW5lbChmbG93KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX21vdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fbW92ZVdpdGhvdXRNb3Rpb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX21vdmVXaXRoTW90aW9uKGR1cmF0aW9uKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogRml4IHBhbmVsc1xuICAgICAqL1xuICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzQ2lyY3VsYXIpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldFBhbmVsKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0dXMgPSAnaWRsZSc7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBtb3ZlIGRpc3RhbmNlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZsb3cgQSBkaXJlY3Rpb25cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2dldE1vdmVEaXN0YW5jZTogZnVuY3Rpb24oZmxvdykge1xuICAgICAgICB2YXIgbW92ZWQgPSB0aGlzLl9nZXRDdXJyZW50UG9zaXRpb24oKSxcbiAgICAgICAgICAgIGNhc3REaXN0ID0gdGhpcy5fZGlzdGFuY2UgKiB0aGlzLl91bml0Q291bnQ7XG4gICAgICAgIGlmIChmbG93ID09PSAncHJldicpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc0NpcmN1bGFyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc3RhbmNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIChtb3ZlZCArIGNhc3REaXN0KSA+IDAgPyAtbW92ZWQgOiBjYXN0RGlzdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc0NpcmN1bGFyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC10aGlzLl9kaXN0YW5jZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjYXN0RGlzdCA+ICh0aGlzLmxpbWl0ICsgbW92ZWQpPyAoLXRoaXMubGltaXQgLSBtb3ZlZCkgOiAtY2FzdERpc3Q7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHBvc3Rpb25cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9tb3ZlV2l0aG91dE1vdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmbG93ID0gdGhpcy5fZmxvdyxcbiAgICAgICAgICAgIHBvcyA9IHRoaXMuX2dldE1vdmVEaXN0YW5jZShmbG93KSxcbiAgICAgICAgICAgIHJhbmdlID0gdGhpcy5fcmFuZ2UsXG4gICAgICAgICAgICBzdGFydCA9IHBhcnNlSW50KHRoaXMuX2NvbnRhaW5lci5zdHlsZVtyYW5nZV0sIDEwKTtcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLnN0eWxlW3JhbmdlXSA9IHN0YXJ0ICsgcG9zICsgJ3B4JztcbiAgICAgICAgdGhpcy5jb21wbGV0ZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSdW4gYW5pbWF0aW9uXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfbW92ZVdpdGhNb3Rpb246IGZ1bmN0aW9uKGR1cmF0aW9uKSB7XG4gICAgICAgIHZhciBmbG93ID0gdGhpcy5fZmxvdyxcbiAgICAgICAgICAgIGNvbnRhaW5lciA9IHRoaXMuX2NvbnRhaW5lcixcbiAgICAgICAgICAgIHJhbmdlID0gdGhpcy5fcmFuZ2UsXG4gICAgICAgICAgICBzdGFydCA9IHBhcnNlSW50KGNvbnRhaW5lci5zdHlsZVtyYW5nZV0sIDEwKSxcbiAgICAgICAgICAgIGRpc3RhbmNlID0gdGhpcy5fZ2V0TW92ZURpc3RhbmNlKGZsb3cpO1xuICAgICAgICBkdXJhdGlvbiA9IGR1cmF0aW9uIHx8IHRoaXMuX2R1cmF0aW9uO1xuXG4gICAgICAgIHRoaXMuX2FuaW1hdGUoe1xuICAgICAgICAgICAgZGVsYXk6IDEwLFxuICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uIHx8IDEwMDAsXG4gICAgICAgICAgICBkZWx0YTogdGhpcy5fbW90aW9uLFxuICAgICAgICAgICAgc3RlcDogbmUudXRpbC5iaW5kKGZ1bmN0aW9uKGRlbHRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlc3QgPSBkaXN0YW5jZSAqIGRlbHRhO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5zdHlsZVtyYW5nZV0gPSBzdGFydCArIGRlc3QgKyAncHgnO1xuICAgICAgICAgICAgfSwgdGhpcyksXG4gICAgICAgICAgICBjb21wbGV0ZTogbmUudXRpbC5iaW5kKHRoaXMuY29tcGxldGUsIHRoaXMpXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSb3RhdGUgcGFuZWxcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmxvdyBBIGZsb3cgdG8gcm90YXRlIHBhbmVsXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfcm90YXRlUGFuZWw6IGZ1bmN0aW9uKGZsb3cpIHtcblxuICAgICAgICBmbG93ID0gZmxvdyB8fCB0aGlzLl9mbG93O1xuXG4gICAgICAgIHZhciBzdGFuZGFyZCxcbiAgICAgICAgICAgIG1vdmVzZXQsXG4gICAgICAgICAgICBtb3Zlc2V0TGVuZ3RoLFxuICAgICAgICAgICAgcmFuZ2UgPSB0aGlzLl9yYW5nZSxcbiAgICAgICAgICAgIGNvbnRhaW5lck1vdmVEaXN0LFxuICAgICAgICAgICAgaXNQcmV2ID0gZmxvdyA9PT0gJ3ByZXYnLFxuICAgICAgICAgICAgYmFzaXMgPSB0aGlzLl9iYXNpcztcblxuICAgICAgICB0aGlzLl9zZXRQYXJ0T2ZQYW5lbHMoZmxvdyk7XG5cbiAgICAgICAgbW92ZXNldCA9IHRoaXMuX21vdmVQYW5lbFNldDtcbiAgICAgICAgbW92ZXNldExlbmd0aCA9IG1vdmVzZXQubGVuZ3RoO1xuICAgICAgICBjb250YWluZXJNb3ZlRGlzdCA9IHRoaXMuX2dldE1vdmVEaXN0YW5jZShmbG93KTtcblxuICAgICAgICBpZiAodGhpcy5faXNJbmNsdWRlKHRoaXMuX3BhbmVsc1t0aGlzLl9iYXNpc10sIG1vdmVzZXQpKSB7XG4gICAgICAgICAgICB0aGlzLl9iYXNpcyA9IGlzUHJldiA/IGJhc2lzIC0gbW92ZXNldExlbmd0aCA6IGJhc2lzICsgbW92ZXNldExlbmd0aDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNQcmV2KSB7XG4gICAgICAgICAgICBzdGFuZGFyZCA9IHRoaXMuX3BhbmVsc1swXTtcbiAgICAgICAgICAgIG5lLnV0aWwuZm9yRWFjaChtb3Zlc2V0LCBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyLmluc2VydEJlZm9yZShlbGVtZW50LCBzdGFuZGFyZCk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5lLnV0aWwuZm9yRWFjaChtb3Zlc2V0LCBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY29udGFpbmVyLnN0eWxlW3JhbmdlXSA9IHBhcnNlSW50KHRoaXMuX2NvbnRhaW5lci5zdHlsZVtyYW5nZV0sIDEwKSAtIGNvbnRhaW5lck1vdmVEaXN0ICsgJ3B4JztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgY3VycmVudCBwYW5lbCBpcyBpbmNsdWRlZCByb3RhdGUgcGFuZWxzXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gaXRlbSBBIHRhcmdldCBlbGVtZW50XG4gICAgICogQHBhcmFtIHtBcnJheX0gY29sbGVjaXRvbiBBIGFycmF5IHRvIGNvbXBhcmVcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pc0luY2x1ZGU6IGZ1bmN0aW9uKGl0ZW0sIGNvbGxlY2l0b24pIHtcbiAgICAgICAgdmFyIGksXG4gICAgICAgICAgICBsZW47XG4gICAgICAgIGZvcihpID0gMCwgbGVuID0gY29sbGVjaXRvbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKGNvbGxlY2l0b25baV0gPT09IGl0ZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBGaW5kIHJvdGF0ZSBwYW5lbCBieSBkaXJlY3Rpb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZmxvdyBBIGRpcmVjdGlvblxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldFBhcnRPZlBhbmVsczogZnVuY3Rpb24oZmxvdykge1xuICAgICAgICB2YXIgaXRlbWNvdW50ID0gdGhpcy5faXRlbWNvdW50LFxuICAgICAgICAgICAgaXNQcmV2ID0gKGZsb3cgPT09ICdwcmV2JyksXG4gICAgICAgICAgICBjb3VudCA9ICh0aGlzLl9yb2xsdW5pdCAhPT0gJ3BhZ2UnKSA/IDEgOiBpdGVtY291bnQsXG4gICAgICAgICAgICBkaXN0ID0gaXNQcmV2ID8gLWNvdW50IDogY291bnQsXG4gICAgICAgICAgICBwb2ludCA9IGlzUHJldiA/IFtkaXN0XSA6IFswLCBkaXN0XTtcblxuICAgICAgICB0aGlzLl9tb3ZlUGFuZWxTZXQgPSB0aGlzLl9wYW5lbHMuc2xpY2UuYXBwbHkodGhpcy5fcGFuZWxzLCBwb2ludCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldCBkaXNwbGF5IGl0ZW0gY291bnRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRJdGVtQ291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnQsXG4gICAgICAgICAgICBlbGVtZW50U3R5bGUgPSBlbGVtZW50LnN0eWxlLFxuICAgICAgICAgICAgZWxlbWVudFdpZHRoID0gcGFyc2VJbnQoZWxlbWVudFN0eWxlLndpZHRoIHx8IGVsZW1lbnQuY2xpZW50V2lkdGgsIDEwKSxcbiAgICAgICAgICAgIGVsZW1lbnRIZWlnaHQgPSBwYXJzZUludChlbGVtZW50U3R5bGUuaGVpZ2h0IHx8IGVsZW1lbnQuY2xpZW50SGVpZ2h0LCAxMCksXG4gICAgICAgICAgICBpdGVtID0gdGhpcy5fZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGknKVswXSwgLy8g66eI7YGs7JeF7J2AIGxp66GcIO2UveyKpFxuICAgICAgICAgICAgaXRlbVN0eWxlID0gaXRlbS5zdHlsZSxcbiAgICAgICAgICAgIGl0ZW1XaWR0aCA9IHBhcnNlSW50KGl0ZW1TdHlsZS53aWR0aCB8fCBpdGVtLmNsaWVudFdpZHRoLCAxMCksXG4gICAgICAgICAgICBpdGVtSGVpZ2h0ID0gcGFyc2VJbnQoaXRlbVN0eWxlLmhlaWdodCB8fCBpdGVtLmNsaWVudEhlaWdodCwgMTApO1xuXG4gICAgICAgIGlmICh0aGlzLl9yYW5nZSA9PT0gJ2xlZnQnKSB7XG4gICAgICAgICAgICB0aGlzLl9pdGVtY291bnQgPSBNYXRoLnJvdW5kKGVsZW1lbnRXaWR0aCAvIGl0ZW1XaWR0aCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9pdGVtY291bnQgPSBNYXRoLnJvdW5kKGVsZW1lbnRIZWlnaHQgLyBpdGVtSGVpZ2h0KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbml0YWxpemUgcGFuZWxzIFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2luaXRQYW5lbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLl9jb250YWluZXIsXG4gICAgICAgICAgICBwYW5lbHMgPSBjb250YWluZXIuY2hpbGROb2RlcyxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBhcnI7XG5cbiAgICAgICAgcGFuZWxzID0gbmUudXRpbC50b0FycmF5KHBhbmVscyk7XG5cbiAgICAgICAgdGhpcy5fcGFuZWxzID0gbmUudXRpbC5maWx0ZXIocGFuZWxzLCBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gbmUudXRpbC5pc0hUTUxUYWcoZWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICBuZS51dGlsLmZvckVhY2godGhpcy5fcGFuZWxzLCBmdW5jdGlvbihwYW5lbCwgaW5kZXgpIHtcbiAgICAgICAgICAgIHBhbmVsLmNsYXNzTmFtZSArPSAnIF9faW5kZXgnICsgaW5kZXggKyAnX18nO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0IHBhbmVsIGxpc3RcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXRQYW5lbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLl9jb250YWluZXIsXG4gICAgICAgICAgICBwYW5lbHMgPSBjb250YWluZXIuY2hpbGROb2RlcyxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBhcnI7XG5cbiAgICAgICAgcGFuZWxzID0gbmUudXRpbC50b0FycmF5KHBhbmVscyk7XG5cbiAgICAgICAgdGhpcy5fcGFuZWxzID0gbmUudXRpbC5maWx0ZXIocGFuZWxzLCBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gbmUudXRpbC5pc0hUTUxUYWcoZWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9iYXNpcyA9IHRoaXMuX2Jhc2lzIHx8IDA7XG4gICAgICAgIHRoaXMuX3NldEJvdW5kYXJ5KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFNldCBmaXhlZCBhcmVhIGluY2lyY3VsYXIgcm9sbGluZ1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmbG93IEEgZGlyZWN0aW9uXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0Qm91bmRhcnk6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcGFuZWxzID0gdGhpcy5fcGFuZWxzLFxuICAgICAgICAgICAgZGlzdGFuY2UgPSB0aGlzLl9kaXN0YW5jZSxcbiAgICAgICAgICAgIHJhbmdlID0gdGhpcy5fcmFuZ2UsXG4gICAgICAgICAgICByYW5nZURpc3RhbmNlID0gcGFyc2VJbnQodGhpcy5fZWxlbWVudC5zdHlsZVtyYW5nZSA9PT0gJ2xlZnQnID8gJ3dpZHRoJyA6ICdoZWlnaHQnXSwgMTApLFxuICAgICAgICAgICAgd3JhcEFyZWEgPSB0aGlzLl9yb2xsdW5pdCA9PT0gJ3BhZ2UnID8gKGRpc3RhbmNlIC8gdGhpcy5faXRlbWNvdW50KSA6IGRpc3RhbmNlICogcGFuZWxzLmxlbmd0aCxcbiAgICAgICAgICAgIGxpbWl0RGlzdCA9IHdyYXBBcmVhIC0gcmFuZ2VEaXN0YW5jZTtcbiAgICAgICAgdGhpcy5saW1pdCA9IGxpbWl0RGlzdDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGN1cnJlbnQgaW5kZXggb24gc2VsZWN0ZWQgcGFnZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwYWdlIEEgbW92ZSBwYW5lbCBudW1iZXJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2NoZWNrUGFnZVBvc2l0aW9uOiBmdW5jdGlvbihwYWdlKSB7XG4gICAgICAgIHZhciBkaXN0ID0gbnVsbCxcbiAgICAgICAgICAgIHBhbmVscyA9IHRoaXMuX3BhbmVscztcbiAgICAgICAgbmUudXRpbC5mb3JFYWNoKHBhbmVscywgZnVuY3Rpb24ocGFuZWwsIGluZGV4KSB7XG4gICAgICAgICAgICBpZiAocGFuZWwuY2xhc3NOYW1lLmluZGV4T2YoJ19faW5kZXgnICsgcGFnZSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFuZS51dGlsLmlzRXhpc3R5KGRpc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3QgPSBpbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGlzdDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQSBtb3ZlIHRvIHNvbWUgcGFuZWwuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHBhZ2UgQSBudW1iZXIgb2YgcGFuZWxcbiAgICAgKi9cbiAgICBtb3ZlVG86IGZ1bmN0aW9uKHBhZ2UpIHtcbiAgICAgICAgcGFnZSA9IE1hdGgubWF4KHBhZ2UsIDApO1xuICAgICAgICBwYWdlID0gTWF0aC5taW4ocGFnZSwgdGhpcy5fcGFuZWxzLmxlbmd0aCAtIDEpO1xuXG4gICAgICAgIHZhciBwb3MgPSB0aGlzLl9jaGVja1BhZ2VQb3NpdGlvbihwYWdlKSxcbiAgICAgICAgICAgIGl0ZW1Db3VudCA9IHRoaXMuX2l0ZW1jb3VudCxcbiAgICAgICAgICAgIHBhbmVsQ291bnQgPSB0aGlzLl9wYW5lbHMubGVuZ3RoLFxuICAgICAgICAgICAgZGlzdGFuY2UgPSB0aGlzLl9kaXN0YW5jZSxcbiAgICAgICAgICAgIGl0ZW1EaXN0ID0gdGhpcy5fcm9sbHVuaXQgPT09ICdwYWdlJyA/IGRpc3RhbmNlIC8gaXRlbUNvdW50IDogZGlzdGFuY2UsXG4gICAgICAgICAgICB1bml0RGlzdCA9IC1wb3MgKiBpdGVtRGlzdDtcblxuICAgICAgICBpZiAoIXRoaXMuX2lzQ2lyY3VsYXIpIHtcbiAgICAgICAgICAgIHVuaXREaXN0ID0gTWF0aC5tYXgodW5pdERpc3QsIC10aGlzLmxpbWl0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVuaXREaXN0ID0gTWF0aC5tYXgodW5pdERpc3QsIC0oaXRlbURpc3QgKiAocGFuZWxDb3VudCAtIGl0ZW1Db3VudCkpKTtcbiAgICAgICAgICAgIHRoaXMuX2Jhc2lzID0gcG9zO1xuICAgICAgICAgICAgdGhpcy5fc2V0UGFuZWwoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jb250YWluZXIuc3R5bGVbdGhpcy5fcmFuZ2VdID0gdW5pdERpc3QgKyAncHgnO1xuICAgIH1cbn07XG5cbm5lLnV0aWwuQ3VzdG9tRXZlbnRzLm1peGluKFJvbGxlcik7XG5tb2R1bGUuZXhwb3J0cyA9IFJvbGxlcjtcbiIsIi8qKlxuICogQGZpbGVvdmVydmlldyBSb2xsaW5nIGNvbXBvbmVudCBjb3JlLlxuICogQGF1dGhvciBOSE4gRW50LiBGRSBkZXYgdGVhbS48ZGxfamF2YXNjcmlwdEBuaG5lbnQuY29tPlxuICogQGRlcGVuZGVuY3kgbmUtY29kZS1zbmlwcGV0XG4gKi9cblxudmFyIFJvbGxlciA9IHJlcXVpcmUoJy4vcm9sbGVyJyk7XG52YXIgRGF0YSA9IHJlcXVpcmUoJy4vcm9sbGRhdGEnKTtcbi8qKlxuICogUm9sbGluZyBjb3JlIG9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbiBUaGUgb3B0aW9ucyBcbiAqICAgICAgQHBhcmFtIHtIVE1MRWxlbWVudHxTdHJpbmd9IG9wdGlvbi5lbGVtZW50IEEgcm9vdCBlbGVtZW50IG9yIGlkIHRoYXQgd2lsbCBiZWNvbWUgcm9vdCBlbGVtZW50J3NcbiAqICAgICAgQHBhcmFtIHtCb29sZWFufSBbb3B0aW9uLmlzVmFyaWFibGU9dHJ1ZXxmYWxzZV0gV2hldGhlciB0aGUgZGF0YSBpcyBjaGFuZ2FibGUgb3Igbm90IFtkZWZhdWx0IHZhbHVlIGlzIGZhbHNlXVxuICogICAgICBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb24uaXNDaXJjdWxhcj10cnVlfGZhbHNlXSBXaGV0aGVyIGNpcmN1bGFyIG9yIG5vdCBbZGVmYXVsdCB2YWx1ZSBpcyB0cnVlIGJ1dCBpc1ZhcmlhYmxlIHRydWUgY2FzZV1cbiAqICAgICAgQHBhcmFtIHtCb29sZWFufSBbb3B0aW9uLmF1dG89dHJ1ZXxmYWxzZV0gV2hldGhlciBhdXRvIHJvbGxpbmcgb3Igbm90IFtkZWZhdWx0IHZhbHVlIGlzIGZhbHNlXVxuICogICAgICBAcGFyYW0ge051bWJlcn0gW29wdGlvbi5kZWxheVRpbWU9MTAwMHwuLi5dIERpc3RhbmNlIHRpbWUgb2YgYXV0byByb2xsaW5nLiBbZGVmdWxhdCAzIHNlY29uZF1cbiAqICAgICAgQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb24uZGlyZWN0aW9uPSdob3Jpem9udGFsfHZlcnRpY2FsJ10gVGhlIGZsb3cgZGlyZWN0aW9uIHBhbmVsIFtkZWZhdWx0IHZhbHVlIGlzIGhvcml6b250YWxdXG4gKiAgICAgIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9uLmR1cmF0aW9uPScxMDAwfC4uLl0gQSBtb3ZlIGR1cmF0aW9uXG4gKiAgICAgIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9uLmluaXROdW09JzB8Li4uXSBJbml0YWxpemUgc2VsZWN0ZWQgcm9sbGluZyBwYW5lbCBudW1iZXJcbiAqICAgICAgQHBhcmFtIHtTdHJpbmd9IFtvcHRpb24ubW90aW9uPSdsaW5lYXJ8W3F1YWRdZWFzZUlufFtxdWFkXWVhc2VPdXR8W3F1YWRdZWFzZUluT3V0fGNpcmNFYXNlSW58Y2lyY0Vhc2VPdXR8Y2lyY0Vhc2VJbk91dF0gQSBlZmZlY3QgbmFtZSBbZGVmYXVsdCB2YWx1ZSBpcyBub2VmZmVjdF1cbiAqICAgICAgQHBhcmFtIHtTdHJpbmd9IFtvcHRpb24udW5pdD0naXRlbXxwYWdlJ10gQSB1bml0IG9mIHJvbGxpbmdcbiAqICAgICAgQHBhcmFtIHtTdHJpbmd9IFtvcHRpb24ud3JhcHBlclRhZz0ndWwuY2xhc3NOYW1lfGRpdi5jbGFzc05hbWUnXSBBIHRhZyBuYW1lIGZvciBwYW5lbCB3YXJwcGVyLCBjb25uZWN0IHRhZyBuYW1lIHdpdGggY2xhc3MgbmFtZSBieSBkb3RzLiBbZGVmdWFsdCB2YWx1ZSBpcyB1bF1cbiAqICAgICAgQHBhcmFtIHtTdHJpbmd9IFtvcHRpb24ucGFuZWxUYWc9J2xpLmNsYXNzTmFtZSddIEEgdGFnIG5hbWUgZm9yIHBhbmVsLCBjb25uZWN0IHRhZyBuYW1lIHdpdGggY2xhc3MgYnkgZG90cyBbZGVmYXVsdCB2YWx1ZSBpcyBsaV1cbiAqIEBwYXJhbSB7QXJyYXl8U3RyaW5nfSBkYXRhIEEgZGF0YSBvZiByb2xsaW5nIHBhbmVsc1xuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIgcm9sbCA9IG5ldyBuZS5jb21wb25lbnQuUm9sbGluZyh7XG4gKiAgICAgIGVsZW1lbnQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb2xsaW5nJyksXG4gKiAgICAgIGluaXROdW06IDAsXG4gKiAgICAgIGRpcmVjdGlvbjogJ2hvcml6b250YWwnLFxuICogICAgICBpc1ZhcmlhYmxlOiB0cnVlLFxuICogICAgICB1bml0OiAncGFnZScsXG4gKiAgICAgIGlzQXV0bzogZmFsc2UsXG4gKiAgICAgIG1vdGlvbjogJ2Vhc2VJbk91dCcsXG4gKiAgICAgIGR1cmF0aW9uOjIwMDBcbiAqIH0sIFsnPGRpdj5kYXRhMTwvZGl2PicsJzxkaXY+ZGF0YTI8L2Rpdj4nLCAnPGRpdj5kYXRhMzwvZGl2PiddKTtcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgUm9sbGluZyA9IG5lLnV0aWwuZGVmaW5lQ2xhc3MoLyoqIEBsZW5kcyBSb2xsaW5nLnByb3RvdHlwZSAqL3tcbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplXG4gICAgICogKi9cbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb24sIGRhdGEpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9wdGlvbiBvYmplY3RcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX29wdGlvbiA9IG9wdGlvbjtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBmbG93IG9mIG5leHQgbW92ZVxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfHN0cmluZ31cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2Zsb3cgPSBvcHRpb24uZmxvdyB8fCAnbmV4dCc7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXaGV0aGVyIGh0bWwgaXMgZHJhd24gb3Igbm90XG4gICAgICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5faXNEcmF3biA9ICEhb3B0aW9uLmlzRHJhd247XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBdXRvIHJvbGxpbmcgdGltZXJcbiAgICAgICAgICogQHR5cGUge251bGx9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl90aW1lciA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBdXRvIHJvbGxpbmcgZGVsYXkgdGltZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5kZWxheVRpbWUgPSB0aGlzLmRlbGF5VGltZSB8fCAzMDAwO1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBtb2RlbCBmb3Igcm9sbGluZyBkYXRhXG4gICAgICAgICAqIEB0eXBlIHtEYXRhfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fbW9kZWwgPSAhb3B0aW9uLmlzRHJhd24gPyBuZXcgRGF0YShvcHRpb24sIGRhdGEpIDogbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgcm9sbGluZyBhY3Rpb24gb2JqZWN0XG4gICAgICAgICAqIEB0eXBlIHtSb2xsZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9yb2xsZXIgPSBuZXcgUm9sbGVyKG9wdGlvbiwgdGhpcy5fbW9kZWwgJiYgdGhpcy5fbW9kZWwuZ2V0RGF0YSgpKTtcblxuICAgICAgICBpZiAob3B0aW9uLmluaXROdW0pIHtcbiAgICAgICAgICAgIHRoaXMubW92ZVRvKG9wdGlvbi5pbml0TnVtKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoISFvcHRpb24uaXNBdXRvKSB7XG4gICAgICAgICAgICB0aGlzLmF1dG8oKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSb2xsIHRoZSByb2xsaW5nIGNvbXBvbmVudC4gSWYgdGhlcmUgaXMgbm8gZGF0YSwgdGhlIGNvbXBvbmVudCBoYXZlIHRvIGhhdmUgd2l0aCBmaXhlZCBkYXRhXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGEgQSByb2xsaW5nIGRhdGFcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW2Zsb3ddIEEgZGlyZWN0aW9uIHJvbGxpbmdcbiAgICAgKi9cbiAgICByb2xsOiBmdW5jdGlvbihkYXRhLCBmbG93KSB7XG4gICAgICAgIGZsb3cgPSBmbG93IHx8IHRoaXMuX2Zsb3c7XG5cbiAgICAgICAgLy8gSWYgcm9sbGluZyBzdGF0dXMgaXMgbm90IGlkbGUsIHJldHVyblxuICAgICAgICBpZiAodGhpcy5fcm9sbGVyLnN0YXR1cyAhPT0gJ2lkbGUnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fb3B0aW9uLmlzVmFyaWFibGUpIHtcbiAgICAgICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncm9sbCBtdXN0IHJ1biB3aXRoIGRhdGEnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zZXRGbG93KGZsb3cpO1xuICAgICAgICAgICAgdGhpcy5fcm9sbGVyLm1vdmUoZGF0YSk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBvdmVyQm91bmRhcnk7XG4gICAgICAgICAgICB0aGlzLnNldEZsb3coZmxvdyk7XG4gICAgICAgICAgICBpZiAodGhpcy5fbW9kZWwpIHtcbiAgICAgICAgICAgICAgICBvdmVyQm91bmRhcnkgPSB0aGlzLl9tb2RlbC5jaGFuZ2VDdXJyZW50KGZsb3cpO1xuICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLl9tb2RlbC5nZXREYXRhKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZighb3ZlckJvdW5kYXJ5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcm9sbGVyLm1vdmUoZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTZXQgZGlyZWN0aW9uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGZsb3cgQSBkaXJlY3Rpb24gb2Ygcm9sbGluZ1xuICAgICAqL1xuICAgIHNldEZsb3c6IGZ1bmN0aW9uKGZsb3cpIHtcbiAgICAgICAgdGhpcy5fZmxvdyA9IGZsb3c7XG4gICAgICAgIHRoaXMuX3JvbGxlci5zZXRGbG93KGZsb3cpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogTW92ZSB0byB0YXJnZXQgcGFnZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwYWdlIEEgdGFyZ2V0IHBhZ2VcbiAgICAgKi9cblxuICAgIG1vdmVUbzogZnVuY3Rpb24ocGFnZSkge1xuXG4gICAgICAgIGlmICh0aGlzLl9pc0RyYXduKSB7XG4gICAgICAgICAgICB0aGlzLl9yb2xsZXIubW92ZVRvKHBhZ2UpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxlbiA9IHRoaXMuX21vZGVsLmdldERhdGFMaXN0TGVuZ3RoKCksXG4gICAgICAgICAgICBtYXggPSBNYXRoLm1pbihsZW4sIHBhZ2UpLFxuICAgICAgICAgICAgbWluID0gTWF0aC5tYXgoMSwgcGFnZSksXG4gICAgICAgICAgICBjdXJyZW50ID0gdGhpcy5fbW9kZWwuZ2V0Q3VycmVudCgpLFxuICAgICAgICAgICAgZHVyYXRpb24sXG4gICAgICAgICAgICBhYnNJbnRlcnZhbCxcbiAgICAgICAgICAgIGlzUHJldixcbiAgICAgICAgICAgIGZsb3csXG4gICAgICAgICAgICBpO1xuXG4gICAgICAgIGlmIChpc05hTihOdW1iZXIocGFnZSkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJyNQYWdlRXJyb3IgbW92ZVRvIG1ldGhvZCBoYXZlIHRvIHJ1biB3aXRoIHBhZ2UnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fb3B0aW9uLmlzVmFyaWFibGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignI0RhdGFFcnJvciA6IFZhcmlhYmxlIFJvbGxpbmcgY2FuXFwndCB1c2UgbW92ZVRvJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpc1ByZXYgPSB0aGlzLmlzTmVnYXRpdmUocGFnZSAtIGN1cnJlbnQpO1xuICAgICAgICBwYWdlID0gaXNQcmV2ID8gbWluIDogbWF4O1xuICAgICAgICBmbG93ID0gaXNQcmV2ID8gJ3ByZXYnIDogJ25leHQnO1xuICAgICAgICBhYnNJbnRlcnZhbCA9IE1hdGguYWJzKHBhZ2UgLSBjdXJyZW50KTtcbiAgICAgICAgZHVyYXRpb24gPSB0aGlzLl9vcHRpb24uZHVyYXRpb24gLyBhYnNJbnRlcnZhbDtcblxuICAgICAgICB0aGlzLnNldEZsb3coZmxvdyk7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGFic0ludGVydmFsOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuX21vZGVsLmNoYW5nZUN1cnJlbnQoZmxvdyk7XG4gICAgICAgICAgICB0aGlzLl9yb2xsZXIubW92ZSh0aGlzLl9tb2RlbC5nZXREYXRhKCksIGR1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENoZWNrIHRoZSBudW1iZXIgaXMgbmVnYXRpdmUgb3Igbm90XG4gICAgICogQHBhcmFtIG51bWJlciBBIG51bWJlciB0byBmaWd1cmUgb3V0XG4gICAgICovXG4gICAgaXNOZWdhdGl2ZTogZnVuY3Rpb24obnVtYmVyKSB7XG4gICAgICAgIHJldHVybiAhaXNOYU4obnVtYmVyKSAmJiBudW1iZXIgPCAwO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTdG9wIGF1dG8gcm9sbGluZ1xuICAgICAqL1xuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLl90aW1lcik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN0YXJ0IGF1dG8gcm9sbGluZ1xuICAgICAqL1xuICAgIGF1dG86IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgdGhpcy5fdGltZXIgPSB3aW5kb3cuc2V0SW50ZXJ2YWwobmUudXRpbC5iaW5kKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5fbW9kZWwuY2hhbmdlQ3VycmVudCh0aGlzLl9mbG93KTtcbiAgICAgICAgICAgIHRoaXMuX3JvbGxlci5tb3ZlKHRoaXMuX21vZGVsLmdldERhdGEoKSk7XG5cbiAgICAgICAgfSwgdGhpcyksIHRoaXMuZGVsYXlUaW1lKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQXR0YWNoIGN1c3RvbSBldmVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIEEgZXZlbnQgdHlwZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIEEgY2FsbGJhY2sgZnVuY3Rpb24gZm9yIGN1c3RvbSBldmVudCBcbiAgICAgKi9cbiAgICBhdHRhY2g6IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX3JvbGxlci5vbih0eXBlLCBjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJ1biBjdXN0b20gZXZlbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBBIGV2ZW50IHR5cGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIEEgZGF0YSBmcm9tIGZpcmUgZXZlbnRcbiAgICAgKi9cbiAgICBmaXJlOiBmdW5jdGlvbih0eXBlLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX3JvbGxlci5maXJlKHR5cGUsIG9wdGlvbnMpO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJvbGxpbmc7XG4iXX0=

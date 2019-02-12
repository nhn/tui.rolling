/**
 * @fileoverview Roller
 * @author NHN Ent. FE dev team.<dl_javascript@nhnent.com>
 */

'use strict';

var snippet = require('tui-code-snippet');

var motion = require('./motion');

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

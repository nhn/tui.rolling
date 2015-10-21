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

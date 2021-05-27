/**
 * @fileoverview Rolling component core.
 * @author NHN. FE dev Lab.<dl_javascript@nhn.com>
 */

'use strict';

var CustomEvents = require('tui-code-snippet/customEvents/customEvents');
var defineClass = require('tui-code-snippet/defineClass/defineClass');
var isExisty = require('tui-code-snippet/type/isExisty');
var util = require('./util');

var Roller = require('./roller');
var Data = require('./rolldata');

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
 * import Rolling from 'tui-rolling'; // ES6
 * // const Rolling = require('tui-rolling'); // CommonJS
 * // const Rolling = tui.Rolling;
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

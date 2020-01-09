/**
 * @fileoverview A data for move
 * @author NHN. FE dev Lab.<dl_javascript@nhn.com>
 */

'use strict';

var forEachArray = require('tui-code-snippet/collection/forEachArray');
var defineClass = require('tui-code-snippet/defineClass/defineClass');
var extend = require('tui-code-snippet/object/extend');
var isBoolean = require('tui-code-snippet/type/isBoolean');

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

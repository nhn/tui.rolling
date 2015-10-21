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

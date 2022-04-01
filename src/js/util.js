/**
 * @fileoverview Utils for Rolling component
 */

'use strict';

var forEachArray = require('tui-code-snippet/collection/forEachArray');
var sendHostname = require('tui-code-snippet/request/sendHostname');

var utils = {
  /**
   * Create a new function that, when called, has its this keyword set to the provided value.
   * @param {function} fn A original function before binding
   * @param {Object} obj context of function in arguments[0]
   * @returns {function} A new bound function with context that is in arguments[1]
   */
  bind: function(fn, context) {
    var slice = Array.prototype.slice;
    var args;

    if (fn.bind) {
      return fn.bind.apply(fn, slice.call(arguments, 1));
    }

    args = slice.call(arguments, 2);

    return function() {
      return fn.apply(context, args.length ? args.concat(slice.call(arguments)) : arguments);
    };
  },

  /**
   * Construct a new array with elements that pass the test by the provided callback function.
   * @param {Array|NodeList|Arguments} arr - array to be traversed
   * @param {function} iteratee - callback function
   * @param {Object} context - context of callback function
   * @returns {Array}
   */
  filter: function(arr, iteratee, context) {
    var result = [];

    forEachArray(arr, function(elem) {
      if (iteratee.apply(context || null, arguments)) {
        result.push(elem);
      }
    });

    return result;
  },

  /**
   * send host name
   * @ignore
   */
  sendHostName: function() {
    sendHostname('rolling', 'UA-129987462-1');
  }
};

module.exports = utils;

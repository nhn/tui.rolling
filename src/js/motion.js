/**
 * @fileoverview Module of motions
 */

'use strict';

/**
 * Rolling motion collection
 * @namespace motion
 * @ignore
 */
var motion = (function() {
  var quadEaseIn, circEaseIn, quadEaseOut, circEaseOut, quadEaseInOut, circEaseInOut;

  /**
   * easeIn
   * @param {Number} delta - Delta value
   * @returns {Function}
   */
  function makeEaseIn(delta) {
    return function(progress) {
      return delta(progress);
    };
  }

  /**
   * easeOut
   * @param {Number} delta - Delta value
   * @returns {Function}
   */
  function makeEaseOut(delta) {
    return function(progress) {
      return 1 - delta(1 - progress);
    };
  }

  /**
   * easeInOut
   * @param {Number} delta - Delta value
   * @returns {Function}
   */
  function makeEaseInOut(delta) {
    return function(progress) {
      var result;

      if (progress < 0.5) {
        result = delta(2 * progress) / 2;
      } else {
        result = (2 - delta(2 * (1 - progress))) / 2;
      }

      return result;
    };
  }

  /**
   * Linear
   * @param {Number} progress - Progress value
   * @returns {Number}
   * @memberof motion
   * @method linear
   * @static
   */
  function linear(progress) {
    return progress;
  }

  /**
   * Quad
   * @param {Number} progress - Progress value
   * @returns {Number}
   * @memberof motion
   * @method quad
   * @static
   */
  function quad(progress) {
    return Math.pow(progress, 2);
  }

  /**
   * Circle
   * @param {Number} progress - Progress value
   * @returns {Number}
   * @memberof motion
   * @method circ
   * @static
   */
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

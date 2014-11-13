/**
 * 롤링에 필요한 모션 함수 컬렉션
 *
 * @namespace ne.component.Rolling.Roller.motion
 */
ne.component.Rolling.Roller.motion = (function() {
    var quadEaseIn,
        circEaseIn,
        quadEaseOut,
        circEaseOut,
        quadEaseInOut,
        circEaseInOut;

    /**
     * easeIn
     *
     * @param delta
     * @returns {Function}
     */
    function makeEaseIn(delta) {
        return function(progress) {
            return delta(progress);
        }
    }
    /**
     * easeOut
     *
     * @param delta
     * @returns {Function}
     */
    function makeEaseOut(delta) {
        return function(progress) {
            return 1 - delta(1 - progress);
        }
    }

    /**
     * easeInOut
     *
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
        }
    }
    /**
     * 선형
     *
     * @memberof ne.component.Rolling.Roller.motion
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
     *
     * @memberof ne.component.Rolling.Roller.motion
     * @method quadEaseIn
     * @static
     */
    quadEaseIn = makeEaseIn(quad),
    /**
     * circ + easeIn
     *
     * @memberof ne.component.Rolling.Roller.motion
     * @method circEaseIn
     * @static
     */
        circEaseIn = makeEaseIn(circ),
    /**
     * quad + easeOut
     *
     * @memberof ne.component.Rolling.Roller.motion
     * @method quadEaseOut
     * @static
     */
        quadEaseOut = makeEaseOut(quad),
    /**
     * circ + easeOut
     *
     * @memberof ne.component.Rolling.Roller.motion
     * @method circEaseOut
     * @static
     */
        circEaseOut = makeEaseOut(circ),
    /**
     * quad + easeInOut
     *
     * @memberof ne.component.Rolling.Roller.motion
     * @method quadEaseInOut
     * @static
     */
        quadEaseInOut = makeEaseInOut(quad),
    /**
     * circ + easeInOut
     *
     * @memberof ne.component.Rolling.Roller.motion
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

(function() {
/**
 * @fileoverview 클래스와 비슷한방식으로 생성자를 만들고 상속을 구현할 수 있는 메소드를 제공하는 모듈
 * @author FE개발팀
 * @dependency inheritance.js, object.js
 */

(function(ne) {
    'use strict';
    if (!ne) {
        ne = window.ne = {};
    }
    if (!ne.util) {
        ne.util = window.ne.util = {};
    }

    /**
     * 객체의 생성및 상속을 편하게 도와주는 메소드
     * @param {*} [parent] 상속받을 생성자.
     * @param {Object} props 생성할 생성자의프로토타입에 들어갈 멤버들
     * @param {Function} props.init 인스턴스가 생성될때 실행됨
     * @param {Object} props.static 생성자의 클래스 맴버형태로 들어갈 멤버들
     * @returns {*}
     * @example
     *
     * var Parent = defineClasss({
     *     init: function() {
     *         this.name = 'made by def';
     *     },
     *     method: function() {
     *         //..can do something with this
     *     },
     *     static: {
     *         staticMethod: function() {
     *              //..do something
     *         }
     *     }
     * });
     *
     * var Child = defineClass(Parent, {
     *     method2: function() {}
     * });
     *
     *
     * Parent.staticMethod();
     *
     * var parentInstance = new Parent();
     * console.log(parentInstance.name); //made by def
     * parentInstance.staticMethod(); // Error
     *
     *
     * var childInstance = new Child();
     * childInstance.method();
     * childInstance.method2();
     *
     *
     */
    var defineClass = function(parent, props) {
        var obj;

        if (!props) {
            props = parent;
            parent = null;
        }

        obj = props.init || function(){};

        parent && ne.util.inherit(obj, parent);

        if (props.hasOwnProperty('static')) {
            ne.util.extend(obj, props.static);
            delete props.static;
        }

        ne.util.extend(obj.prototype, props);

        return obj;
    };

    ne.util.defineClass = defineClass;

})(window.ne);
/**
 * @fileoverview 타입체크 모듈
 * @author FE개발팀
 */

(function(ne) {
    'use strict';
    /* istanbul ignore if */
    if (!ne) {
        ne = window.ne = {};
    }
    if (!ne.util) {
        ne.util = window.ne.util = {};
    }

    /**
     * 값이 정의되어 있는지 확인(null과 undefined가 아니면 true를 반환한다)
     * @param {*} obj
     * @param {(String|Array)} [key]
     * @returns {boolean}
     * @example
     *
     * var obj = {a: {b: {c: 1}}};
     * a 가 존재하는지 확인한다(존재함, true반환)
     * ne.util.isExisty(a);
     * => true;
     * a 에 속성 b 가 존재하는지 확인한다.(존재함, true반환)
     * ne.util.isExisty(a, 'b');
     * => true;
     * a 의 속성 b에 c가 존재하는지 확인한다.(존재함, true반환)
     * ne.util.isExisty(a, 'b.c');
     * => true;
     * a 의 속성 b에 d가 존재하는지 확인한다.(존재하지 않음, false반환)
     * ne.util.isExisty(a, 'b.d');
     * => false;
     */
    function isExisty(obj, key) {
        if (arguments.length < 2) {
            return !isNull(obj) && !isUndefined(obj);
        }
        if (!isObject(obj)) {
            return false;
        }

        key = isString(key) ? key.split('.') : key;

        if (!isArray(key)) {
            return false;
        }
        key.unshift(obj);

        var res = ne.util.reduce(key, function(acc, a) {
            if (!acc) {
                return;
            }
            return acc[a];
        });
        return !isNull(res) && !isUndefined(res);
    }

    /**
     * 인자가 undefiend 인지 체크하는 메서드
     * @param obj
     * @returns {boolean}
     */
    function isUndefined(obj) {
        return obj === undefined;
    }

    /**
     * 인자가 null 인지 체크하는 메서드
     * @param {*} obj
     * @returns {boolean}
     */
    function isNull(obj) {
        return obj === null;
    }

    /**
     * 인자가 null, undefined, false가 아닌지 확인하는 메서드
     * (0도 true로 간주한다)
     *
     * @param {*} obj
     * @return {boolean}
     */
    function isTruthy(obj) {
        return isExisty(obj) && obj !== false;
    }

    /**
     * 인자가 null, undefined, false인지 확인하는 메서드
     * (truthy의 반대값)
     * @param {*} obj
     * @return {boolean}
     */
    function isFalsy(obj) {
        return !isTruthy(obj);
    }


    var toString = Object.prototype.toString;

    /**
     * 인자가 arguments 객체인지 확인
     * @param {*} obj
     * @return {boolean}
     */
    function isArguments(obj) {
        var result = isExisty(obj) &&
            ((toString.call(obj) === '[object Arguments]') || 'callee' in obj);

        return result;
    }

    /**
     * 인자가 배열인지 확인
     * @param {*} obj
     * @return {boolean}
     */
    function isArray(obj) {
        return toString.call(obj) === '[object Array]';
    }

    /**
     * 인자가 객체인지 확인하는 메서드
     * @param {*} obj
     * @return {boolean}
     */
    function isObject(obj) {
        return obj === Object(obj);
    }

    /**
     * 인자가 함수인지 확인하는 메서드
     * @param {*} obj
     * @return {boolean}
     */
    function isFunction(obj) {
        return toString.call(obj) === '[object Function]';
    }

    /**
     * 인자가 숫자인지 확인하는 메서드
     * @param {*} obj
     * @return {boolean}
     */
    function isNumber(obj) {
        return toString.call(obj) === '[object Number]';
    }

    /**
     * 인자가 문자열인지 확인하는 메서드
     * @param obj
     * @return {boolean}
     */
    function isString(obj) {
        return toString.call(obj) === '[object String]';
    }

    /**
     * 인자가 불리언 타입인지 확인하는 메서드
     * @param {*} obj
     * @return {boolean}
     */
    function isBoolean(obj) {
        return toString.call(obj) === '[object Boolean]';
    }

    /**
     * 인자가 HTML Node 인지 검사한다. (Text Node 도 포함)
     * @param {HTMLElement} html
     * @return {Boolean} HTMLElement 인지 여부
     */
    function isHTMLNode(html) {
        if (typeof(HTMLElement) === 'object') {
            return (html && (html instanceof HTMLElement || !!html.nodeType));
        }
        return !!(html && html.nodeType);
    }
    /**
     * 인자가 HTML Tag 인지 검사한다. (Text Node 제외)
     * @param {HTMLElement} html
     * @return {Boolean} HTMLElement 인지 여부
     */
    function isHTMLTag(html) {
        if (typeof(HTMLElement) === 'object') {
            return (html && (html instanceof HTMLElement));
        }
        return !!(html && html.nodeType && html.nodeType === 1);
    }
    /**
     * null, undefined 여부와 순회 가능한 객체의 순회가능 갯수가 0인지 체크한다.
     * @param {*} obj 평가할 대상
     * @return {boolean}
     */
    function isEmpty(obj) {
        var key,
            hasKey = false;

        if (!isExisty(obj)) {
            return true;
        }

        if (isArray(obj) || isArguments(obj)) {
            return obj.length === 0;
        }

        if (isObject(obj) && !isFunction(obj)) {
            ne.util.forEachOwnProperties(obj, function() {
                hasKey = true;
                return false;
            });

            return !hasKey;
        }

        return true;

    }

    /**
     * isEmpty 메서드와 반대로 동작한다.
     * @param {*} obj 평가할 대상
     * @return {boolean}
     */
    function isNotEmpty(obj) {
        return !isEmpty(obj);
    }

    ne.util.isExisty = isExisty;
    ne.util.isUndefined = isUndefined;
    ne.util.isNull = isNull;
    ne.util.isTruthy = isTruthy;
    ne.util.isFalsy = isFalsy;
    ne.util.isArguments = isArguments;
    ne.util.isArray = Array.isArray || isArray;
    ne.util.isObject = isObject;
    ne.util.isFunction = isFunction;
    ne.util.isNumber = isNumber;
    ne.util.isString = isString;
    ne.util.isBoolean = isBoolean;
    ne.util.isHTMLNode = isHTMLNode;
    ne.util.isHTMLTag = isHTMLTag;
    ne.util.isEmpty = isEmpty;
    ne.util.isNotEmpty = isNotEmpty;

})(window.ne);
/**
 * @fileoverview
 * @author FE개발팀
 */

(function(ne) {
    'use strict';
    /* istanbul ignore if */
    if (!ne) {
        ne = window.ne = {};
    }
    if (!ne.util) {
        ne.util = window.ne.util = {};
    }

    /**
     * 데이터 객체를 확장하는 메서드 (deep copy 는 하지 않는다)
     * @param {object} target - 확장될 객체
     * @param {...object} objects - 프로퍼티를 복사할 객체들
     * @return {object}
     */
    function extend(target, objects) {
        var source,
            prop,
            hasOwnProp = Object.prototype.hasOwnProperty,
            i,
            len;

        for (i = 1, len = arguments.length; i < len; i++) {
            source = arguments[i];
            for (prop in source) {
                if (hasOwnProp.call(source, prop)) {
                    target[prop] = source[prop];
                }
            }
        }
        return target;
    }

    /**
     * @type {number}
     */
    var lastId = 0;

    /**
     * 객체에 unique한 ID를 프로퍼티로 할당한다.
     * @param {object} obj - ID를 할당할 객체
     * @return {number}
     */
    function stamp(obj) {
        obj.__fe_id = obj.__fe_id || ++lastId;
        return obj.__fe_id;
    }

    function resetLastId() {
        lastId = 0;
    }

    /**
     * 객체를 전달받아 객체의 키목록을 배열로만들어 리턴해준다.
     * @param obj
     * @returns {Array}
     */
    var keys = function(obj) {
        var keys = [],
            key;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key);
            }
        }

        return keys;
    };

    ne.util.extend = extend;
    ne.util.stamp = stamp;
    ne.util._resetLastId = resetLastId;
    ne.util.keys = Object.keys || keys;

})(window.ne);
/**
 * @fileoverview 객체나 배열을 다루기위한 펑션들이 정의 되어있는 모듈
 * @author FE개발팀
 * @dependency type.js, object.js
 */

(function(ne) {
    'use strict';
    if (!ne) {
        ne = window.ne = {};
    }
    if (!ne.util) {
        ne.util = window.ne.util = {};
    }

    /**
     * 배열나 유사배열를 순회하며 콜백함수에 전달한다.
     * 콜백함수가 false를 리턴하면 순회를 종료한다.
     * @param {Array} arr
     * @param {Function} iteratee  값이 전달될 콜백함수
     * @param {*} [context] 콜백함수의 컨텍스트
     * @example
     *
     * var sum = 0;
     *
     * forEachArray([1,2,3], function(value){
     *     sum += value;
     * });
     *
     * => sum == 6
     */
    function forEachArray(arr, iteratee, context) {
        var index = 0,
            len = arr.length;

        for (; index < len; index++) {
            if (iteratee.call(context || null, arr[index], index, arr) === false) {
                break;
            }
        }
    }


    /**
     * obj에 상속된 프로퍼티를 제외한 obj의 고유의 프로퍼티만 순회하며 콜백함수에 전달한다.
     * 콜백함수가 false를 리턴하면 순회를 중료한다.
     * @param {object} obj
     * @param {Function} iteratee  프로퍼티가 전달될 콜백함수
     * @param {*} [context] 콜백함수의 컨텍스트
     * @example
     * var sum = 0;
     *
     * forEachOwnProperties({a:1,b:2,c:3}, function(value){
     *     sum += value;
     * });
     *
     * => sum == 6
     **/
    function forEachOwnProperties(obj, iteratee, context) {
        var key;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (iteratee.call(context || null, obj[key], key, obj) === false) {
                    break;
                }
            }
        }
    }

    /**
     * 파라메터로 전달된 객체나 배열를 순회하며 데이터를 콜백함수에 전달한다.
     * 유사배열의 경우 배열로 전환후 사용해야함.(ex2 참고)
     * 콜백함수가 false를 리턴하면 순회를 종료한다.
     * @param {*} obj 순회할 객체
     * @param {Function} iteratee 데이터가 전달될 콜백함수
     * @param {*} [context] 콜백함수의 컨텍스트
     * @example
     *
     * //ex1)
     * var sum = 0;
     *
     * forEach([1,2,3], function(value){
     *     sum += value;
     * });
     *
     * => sum == 6
     *
     * //ex2) 유사 배열사용
     * function sum(){
     *     var factors = Array.prototype.slice.call(arguments); //arguments를 배열로 변환, arguments와 같은정보를 가진 새 배열 리턴
     *
     *     forEach(factors, function(value){
     *          ......
     *     });
     * }
     *
     **/
    function forEach(obj, iteratee, context) {
        var key,
            len;

        if (ne.util.isArray(obj)) {
            for (key = 0, len = obj.length; key < len; key++) {
                iteratee.call(context || null, obj[key], key, obj);
            }
        } else {
            ne.util.forEachOwnProperties(obj, iteratee, context);
        }
    }

    /**
     * 파라메터로 전달된 객체나 배열를 순회하며 콜백을 실행한 리턴값을 배열로 만들어 리턴한다.
     * 유사배열의 경우 배열로 전환후 사용해야함.(forEach example참고)
     * @param {*} obj 순회할 객체
     * @param {Function} iteratee 데이터가 전달될 콜백함수
     * @param {*} [context] 콜백함수의 컨텍스트
     * @returns {Array}
     * @example
     * map([0,1,2,3], function(value) {
     *     return value + 1;
     * });
     *
     * => [1,2,3,4];
     */
    function map(obj, iteratee, context) {
        var resultArray = [];

        ne.util.forEach(obj, function() {
            resultArray.push(iteratee.apply(context || null, arguments));
        });

        return resultArray;
    }

    /**
     * 파라메터로 전달된 객체나 배열를 순회하며 콜백을 실행한 리턴값을 다음 콜백의 첫번째 인자로 넘겨준다.
     * 유사배열의 경우 배열로 전환후 사용해야함.(forEach example참고)
     * @param {*} obj 순회할 객체
     * @param {Function} iteratee 데이터가 전달될 콜백함수
     * @param {*} [context] 콜백함수의 컨텍스트
     * @returns {*}
     * @example
     * reduce([0,1,2,3], function(stored, value) {
     *     return stored + value;
     * });
     *
     * => 6;
     */
    function reduce(obj, iteratee, context) {
        var keys,
            index = 0,
            length,
            store;


        if (!ne.util.isArray(obj)) {
            keys = ne.util.keys(obj);
        }

        length = keys ? keys.length : obj.length;

        store = obj[keys ? keys[index++] : index++];

        for (; index < length; index++) {
            store = iteratee.call(context || null, store, obj[keys ? keys[index] : index]);
        }

        return store;
    }
    /**
     * 유사배열을 배열 형태로 변환한다.
     * - IE 8 이하 버전에서 Array.prototype.slice.call 이 오류가 나는 경우가 있어 try-catch 로 예외 처리를 한다.
     * @param {*} arrayLike 유사배열
     * @return {Array}
     * @example


     var arrayLike = {
        0: 'one',
        1: 'two',
        2: 'three',
        3: 'four',
        length: 4
    };
     var result = toArray(arrayLike);

     => ['one', 'two', 'three', 'four'];
     */
    function toArray(arrayLike) {
        var arr;
        try {
            arr = Array.prototype.slice.call(arrayLike);
        } catch (e) {
            arr = [];
            forEachArray(arrayLike, function(value) {
                arr.push(value);
            });
        }
        return arr;
    }


    /**
     * 파라메터로 전달된 객체나 어레이를 순회하며 콜백을 실행한 리턴값이 참일 경우의 모음을 만들어서 리턴한다.
     *
     * @param {*} obj 순회할 객체나 배열
     * @param {Function} iteratee 데이터가 전달될 콜백함수
     * @param {*} [context] 콜백함수의 컨텍스트
     * @returns {*}
     * @example
     * filter([0,1,2,3], function(value) {
     *     return (value % 2 === 0);
     * });
     *
     * => [0, 2];
     * filter({a : 1, b: 2, c: 3}, function(value) {
     *     return (value % 2 !== 0);
     * });
     *
     * => {a: 1, c: 3};
     */
    var filter = function(obj, iteratee, context) {
        var result = ne.util.isArray(obj) ? [] : {},
            value,
            key;

        if (!ne.util.isObject(obj) || !ne.util.isFunction(iteratee)) {
            throw new Error('wrong parameter');
        }

        forEach(obj, function() {
            if (iteratee.apply(context || null, arguments)) {
                value = arguments[0];
                key = arguments[1];
                if (ne.util.isArray(obj)) {
                    result.push(value);
                } else {
                    result[key] = value;
                }
            }
        }, context);

        return result;
    };


    ne.util.forEachOwnProperties = forEachOwnProperties;
    ne.util.forEachArray = forEachArray;
    ne.util.forEach = forEach;
    ne.util.toArray = toArray;
    ne.util.map = map;
    ne.util.reduce = reduce;
    ne.util.filter = filter;

})(window.ne);
/**
 * @fileoverview 함수관련 메서드 모음
 * @author FE개발팀
 */

(function(ne) {
    'use strict';
    /* istanbul ignore if */
    if (!ne) {
        ne = window.ne = {};
    }
    if (!ne.util) {
        ne.util = window.ne.util = {};
    }

    /**
     * 커링 메서드
     * @param {function()} fn
     * @param {*} obj - this로 사용될 객체
     * @return {function()}
     */
    function bind(fn, obj) {
        var slice = Array.prototype.slice;

        if (fn.bind) {
            return fn.bind.apply(fn, slice.call(arguments, 1));
        }

        /* istanbul ignore next */
        var args = slice.call(arguments, 2);

        /* istanbul ignore next */
        return function() {
            /* istanbul ignore next */
            return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
        };
    }

    ne.util.bind = bind;

})(window.ne);
/**
 * @fileoverview 옵저버 패턴을 이용하여 객체 간 커스텀 이벤트를 전달할 수 있는 기능을 제공하는 모듈
 * @author FE개발팀
 * @dependency type.js, collection.js object.js
 */

(function(ne) {
    'use strict';
    /* istanbul ignore if */
    if (!ne) {
        ne = window.ne = {};
    }
    if (!ne.util) {
        ne.util = window.ne.util = {};
    }

    /**
     * 이벤트 핸들러에 저장되는 단위
     * @typedef {object} eventItem
     * @property {object.<string, object>} eventObject
     * @property {function()} eventObject.fn 이벤트 핸들러 함수
     * @property {*} [eventObject.ctx] 이벤트 핸들러 실행 시 컨텍스트 지정가능
     */


    /**
     * 커스텀 이벤트 클래스
     * @constructor
     * @exports CustomEvents
     * @class
     */
    function CustomEvents() {

        /**
         * 이벤트 핸들러를 저장하는 객체
         * @type {object.<string, eventItem>}
         * @private
         */
        this._events = {};
    }

    var CustomEventMethod = /** @lends CustomEvents */ {
        /**
         * 인스턴스가 발생하는 이벤트에 핸들러를 등록하는 메서드
         * @param {(object|String)} types - 이벤트 타입 (타입과 함수 쌍으로 된 객체를 전달할 수도 있고 타입만
         * 전달할 수 있다. 후자의 경우 두 번째 인자에 핸들러를 전달해야 한다.)
         * @param {function()=} fn - 이벤트 핸들러 목록
         * @param {*=} context
         * @example
         * // 첫 번째 인자에 이벤트명:핸들러 데이터 객체를 넘긴 경우
         * instance.on({
         *     zoom: function() {},
         *     pan: function() {}
         * }, this);
         *
         * // 여러 이벤트를 한 핸들러로 처리할 수 있도록 함
         * instance.on('zoom pan', function() {});
         */
        on: function(types, fn, context) {
            this._toggle(true, types, fn, context);
        },

        /**
         * 인스턴스에 등록했던 이벤트 핸들러를 해제할 수 있다.
         * @param {(object|string)=} types 등록 해지를 원하는 이벤트 객체 또는 타입명. 아무 인자도 전달하지 않으면 모든 이벤트를 해제한다.
         * @param {Function=} fn
         * @param {*=} context
         * @example
         * // zoom 이벤트만 해제
         * instance.off('zoom', onZoom);
         *
         * // pan 이벤트 해제 (이벤트 바인딩 시에 context를 넘겼으면 그대로 넘겨주어야 한다)
         * instance.off('pan', onPan, this);
         *
         * // 인스턴스 내 모든 이벤트 해제
         * instance.off();
         */
        off: function(types, fn, context) {
            if (!ne.util.isExisty(types)) {
                this._events = null;
                return;
            }

            this._toggle(false, types, fn, context);
        },

        /**
         * on, off 메서드의 중복 코드를 줄이기 위해 만든 on토글 메서드
         * @param {boolean} isOn
         * @param {(Object|String)} types - 이벤트 타입 (타입과 함수 쌍으로 된 객체를 전달할 수도 있고 타입만
         * 전달할 수 있다. 후자의 경우 두 번째 인자에 핸들러를 전달해야 한다.)
         * @param {function()=} fn - 이벤트 핸들러 목록
         * @param {*=} context
         * @private
         */
        _toggle: function(isOn, types, fn, context) {
            var methodName = isOn ? '_on' : '_off',
                method = this[methodName];

            if (ne.util.isObject(types)) {
                ne.util.forEachOwnProperties(types, function(handler, type) {
                    method.call(this, type, handler, fn);
                }, this);
            } else {
                types = types.split(' ');

                ne.util.forEach(types, function(type) {
                    method.call(this, type, fn, context);
                }, this);
            }
        },

        /**
         * 내부적으로 실제로 이벤트를 등록하는 로직을 담는 메서드.
         *
         * 옵션에 따라 이벤트를 배열에 등록하기도 하고 해시에 등록하기도 한다.
         *
         * 두개를 사용하는 기준:
         *
         * 핸들러가 이미 this바인딩이 되어 있고 핸들러를 사용하는 object가 같은 종류가 동시다발적으로 생성/삭제되는 경우에는 context인자를
         * 전달하여 해시의 빠른 접근 속도를 이용하는 것이 좋다.
         *
         * @param {(object.<string, function()>|string)} type - 이벤트 타입 (타입과 함수 쌍으로 된 객체를 전달할 수도 있고 타입만
         * 전달할 수 있다. 후자의 경우 두 번째 인자에 핸들러를 전달해야 한다.)
         * @param {function()} fn - 이벤트 핸들러
         * @param {*=} context
         * @private
         */
        _on: function(type, fn, context) {
            var events = this._events = this._events || {},
                contextId = context && (context !== this) && ne.util.stamp(context);

            if (contextId) {
                /*
                 context가 현재 인스턴스와 다를 때 context의 아이디로 내부의 해시에서 빠르게 해당 핸들러를 컨트롤 하기 위한 로직.
                 이렇게 하면 동시에 많은 이벤트를 발생시키거나 제거할 때 성능면에서 많은 이점을 제공한다.
                 특히 동시에 많은 엘리먼트들이 추가되거나 해제될 때 도움이 될 수 있다.
                 */
                var indexKey = type + '_idx',
                    indexLenKey = type + '_len',
                    typeIndex = events[indexKey] = events[indexKey] || {},
                    id = ne.util.stamp(fn) + '_' + contextId; // 핸들러의 id + context의 id

                if (!typeIndex[id]) {
                    typeIndex[id] = {
                        fn: fn,
                        ctx: context
                    };

                    // 할당된 이벤트의 갯수를 추적해 두고 할당된 핸들러가 없는지 여부를 빠르게 확인하기 위해 사용한다
                    events[indexLenKey] = (events[indexLenKey] || 0) + 1;
                }
            } else {
                // fn이 이미 this 바인딩이 된 상태에서 올 경우 단순하게 처리해준다
                events[type] = events[type] || [];
                events[type].push({fn: fn});
            }
        },

        /**
         * 실제로 구독을 해제하는 메서드
         * @param {(object|string)=} type 등록 해지를 원하는 핸들러명
         * @param {function} fn
         * @param {*} context
         * @private
         */
        _off: function(type, fn, context) {
            var events = this._events,
                indexKey = type + '_idx',
                indexLenKey = type + '_len';

            if (!events) {
                return;
            }

            var contextId = context && (context !== this) && ne.util.stamp(context),
                listeners,
                id;

            if (contextId) {
                id = ne.util.stamp(fn) + '_' + contextId;
                listeners = events[indexKey];

                if (listeners && listeners[id]) {
                    listeners[id] = null;
                    events[indexLenKey] -= 1;
                }

            } else {
                listeners = events[type];

                if (listeners) {
                    ne.util.forEach(listeners, function(listener, index) {
                        if (ne.util.isExisty(listener) && (listener.fn === fn)) {
                            listeners.splice(index, 1);
                            return true;
                        }
                    });
                }
            }
        },

        /**
         * 이벤트를 발생시키는 메서드
         *
         * 등록한 리스너들의 실행 결과를 boolean AND 연산하여
         *
         * 반환한다는 점에서 {@link CustomEvents#fire} 와 차이가 있다
         *
         * 보통 컴포넌트 레벨에서 before 이벤트로 사용자에게
         *
         * 이벤트를 취소할 수 있게 해 주는 기능에서 사용한다.
         * @param {string} type
         * @param {*...} data
         * @returns {*}
         * @example
         * // 확대 기능을 지원하는 컴포넌트 내부 코드라 가정
         * if (this.invoke('beforeZoom')) {    // 사용자가 등록한 리스너 결과 체크
         *     // 리스너의 실행결과가 true 일 경우
         *     // doSomething
         * }
         *
         * //
         * // 아래는 사용자의 서비스 코드
         * map.on({
         *     'beforeZoom': function() {
         *         if (that.disabled && this.getState()) {    //서비스 페이지에서 어떤 조건에 의해 이벤트를 취소해야한다
         *             return false;
         *         }
         *         return true;
         *     }
         * });
         */
        invoke: function(type, data) {
            if (!this.hasListener(type)) {
                return true;
            }

            var args = Array.prototype.slice.call(arguments, 1),
                events = this._events;

            if (!events) {
                return true;
            }

            var typeIndex = events[type + '_idx'],
                listeners,
                result = true;

            if (events[type]) {
                listeners = events[type].slice();

                ne.util.forEach(listeners, function(listener) {
                    if (listener.fn.apply(this, args) === false) {
                        result = false;
                    }
                }, this);
            }

            ne.util.forEachOwnProperties(typeIndex, function(eventItem) {
                if (eventItem.fn.apply(eventItem.ctx, args) === false) {
                    result = false;
                }
            });

            return result;
        },

        /**
         * 이벤트를 발생시키는 메서드
         * @param {string} type 이벤트 타입명
         * @param {(object|string)=} data 발생과 함께 전달할 이벤트 데이터
         * @return {*}
         * @example
         * instance.fire('move', { direction: 'left' });
         *
         * // 이벤트 핸들러 처리
         * instance.on('move', function(moveEvent) {
         *     var direction = moveEvent.direction;
         * });
         */
        fire: function(type, data) {
            this.invoke.apply(this, arguments);
            return this;
        },

        /**
         * 이벤트 핸들러 존재 여부 확인
         * @param {string} type 핸들러명
         * @return {boolean}
         */
        hasListener: function(type) {
            var events = this._events,
                existyFunc = ne.util.isExisty;

            return existyFunc(events) && (existyFunc(events[type]) || events[type + '_len']);
        },

        /**
         * 등록된 이벤트 핸들러의 갯수 반환
         * @param {string} type
         * @returns {number}
         */
        getListenerLength: function(type) {
            var events = this._events,
                lenKey = type + '_len',
                length = 0,
                types,
                len;

            if (!ne.util.isExisty(events)) {
                return 0;
            }

            types = events[type];
            len = events[lenKey];

            length += (ne.util.isExisty(types) && ne.util.isArray(types)) ? types.length : 0;
            length += ne.util.isExisty(len) ? len : 0;

            return length;
        },

        /**
         * 단발성 커스텀 이벤트 핸들러 등록 시 사용
         * @param {(object|string)} types 이벤트명:핸들러 객체 또는 이벤트명
         * @param {function()=} fn 핸들러 함수
         * @param {*=} context
         */
        once: function(types, fn, context) {
            var that = this;

            if (ne.util.isObject(types)) {
                ne.util.forEachOwnProperties(types, function(handler, type) {
                    this.once(type, handler, fn);
                }, this);

                return;
            }

            function onceHandler() {
                fn.apply(context, arguments);
                that.off(types, onceHandler, context);
            }

            this.on(types, onceHandler, context);
        }

    };

    CustomEvents.prototype = CustomEventMethod;
    CustomEvents.prototype.constructor = CustomEvents;

    /**
     * 커스텀 이벤트 기능을 믹스인할 때 사용하는 메서드
     * @param {function()} func 생성자 함수
     * @example
     * // 모델 클래스 변경 시 컨트롤러에게 알림을 주고 싶은데
     * // 그 기능을 모델 클래스 자체에게 주고 싶다
     * function Model() {}
     *
     * // 커스텀 이벤트 믹스인
     * ne.util.CustomEvents.mixin(Model);
     *
     * var model = new Model();
     *
     * model.on('changed', function() {}, this);
     */
    CustomEvents.mixin = function(func) {
        ne.util.extend(func.prototype, CustomEventMethod);
    };

    ne.util.CustomEvents = CustomEvents;

})(window.ne);


/**
 * @fileoverview 롤링컴퍼넌트의 코어
 * @author Jein Yi
 * @dependency common.js[type, object, collection, function, CustomEvents, defineClass]
 *
 * */
/* istanbul ignore if */
if (!ne) {
    ne = window.ne = {};
}
/* istanbul ignore if */
if (!ne.component) {
    ne.component = {};
}
/**
 * 롤링 코어객체
 *
 * @param {Object} option 롤링의 옵션값
 *      @param {HTMLElement|String} option.element 루트 엘리먼트 혹은 엘리먼트 아이디 값
 *      @param {Boolean} [option.isVariable=true|false] 가변성이 있는 데이터 인지여부. (기본값은 false)
 *      @param {Boolean} [option.isCircular=true|false] 순환하는 롤링인지 여부. (기본값은 순환형, isVariable이 true일 경우는 무시된다)
 *      @param {Boolean} [option.auto=true|false] 자동롤링 할 것인지 여부(기본값 false)
 *      @param {Number} [option.delayTime=1000|...] 자동롤링 간격(기본값 3초)
 *      @param {Number} [option.direction='horizontal|vertical'] 패널 이동방향(기본값은 horizontal)
 *      @param {Number} [option.duration='1000|...] 패널의 이동속도
 *      @param {Number} [option.initNum='0|...] 초기 이동페이지
 *      @param {String} [option.motion='linear|[quad]easeIn|[quad]easeOut|[quad]easeInOut|circEaseIn|circEaseOut|circEaseInOut] 패널 이동효과(기본값은 noeffect)
 *      @param {String} [option.unit='item|page'] 롤링을 하는 단위를 설정한다
 *      @param {String} [option.flow='prev|next'] 롤링의 방향을 결정한다. (좌에서 우로, 우에서 좌로이 이동중에 선택, 기본값 next)
 *      @param {String} [option.wrapperTag='ul.className|div.className'] 패널의 래퍼에 사용되는 태그, .으로 클래스 연결(기본값 ul)
 *      @param {String} [option.panelTag='li.className'] 패널에 사용되는 태그, .으로 클래스를 연결(기본값 li)
 * @param {Array|String} data 롤링 데이터값
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
 * */
ne.component.Rolling = ne.util.defineClass(/** @lends ne.component.Rolling.prototype */{
    /**
     * 초기화
     * */
    init: function(option, data) {
        /**
         * 옵션객체
         * @type {Object}
         * @private
         */
        this._option = option;
        /**
         * 패널의 이동방향 정보
         *
         * @type {String|string}
         * @private
         */
        this._flow = option.flow || 'next';
        /**
         * 그려진 html을 돌리는 것인지 확인
         *
         * @type {boolean}
         * @private
         */
        this._isDrawn = !!option.isDrawn;
        /**
         * 자동롤링 타이머
         *
         * @type {null}
         * @private
         */
        this._timer = null;
        /**
         * 자동롤링 간격
         */
        this.delayTime = this.delayTime || 3000;
        /**
         * 롤링 데이터 조작객체
         *
         * @type {ne.component.Rolling.Data}
         * @private
         */
        this._model = !option.isDrawn ? new ne.component.Rolling.Data(option, data) : null;
        /**
         * 롤링 액션 객체
         *
         * @type {ne.component.Rolling.Roller}
         * @private
         */
        this._roller = new ne.component.Rolling.Roller(option, this._model && this._model.getData());

        if (option.initNum) {
            this.moveTo(option.initNum);
        }
        if (!!option.isAuto) {
            this.auto();
        }
    },
    /**
     * 롤러에게 롤링을 요청한다. 가변데이터일 경우 data가 입력되어야 하고,
     * 액션의 방향을 설정하는 flow가 반드시 입력되지 않으면 기본값인 'next'를 따른다
     *
     * @param {String} data 롤링 데이터
     * @param {String} [flow] 롤링 방향
     */
    roll: function(data, flow) {
        flow = flow || this._flow;

        // 롤러가 idle상태가 아니면 외부에서의 입력은 모두 튕겨낸다.
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
            // 모델이 없을 경우는 데이터를 넘기지 않는다.
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
     * 이동방향을 설정한다.
     *
     * @param {String} flow 롤링방향
     */
    setFlow: function(flow) {
        this._flow = flow;
        this._roller.setFlow(flow);
    },
    /**
     * 타겟페이지로 이동한다
     *
     * @param {Number} page 이동할 페이지
     */
    moveTo: function(page) {

        // 만약 fix된 html이면 roller의 moveTo를 진행한다.
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

        // 번호가 입력되지 않았거나, 데이터설정에 문제가 있을 시 에러발생
        if (isNaN(Number(page))) {
            throw new Error('#PageError moveTo method have to run with page');
        }
        if (this._option.isVariable) {
            throw new Error('#DataError : Variable Rolling can\'t use moveTo');
        }

        // 좌우에 따른 최대/최소값 설정
        isPrev = this.isNegative(page - current);
        page = isPrev ? min : max;
        flow = isPrev ? 'prev' : 'next';
        absInterval = Math.abs(page - current);
        // 이동패널 수로 설정된 duration을 나눈다
        duration = this._option.duration / absInterval;

        this.setFlow(flow);

        for (i = 0; i < absInterval; i++) {
            this._model.changeCurrent(flow);
            this._roller.move(this._model.getData(), duration);
        }

    },
    isNegative: function(number) {
        return !isNaN(number) && number < 0;
    },
    /**
     * 자동롤링 멈춤
     */
    stop: function() {
        window.clearInterval(this._timer);
    },
    /**
     * 자동롤링 시작
     */
    auto: function() {
        this.stop();
        this._timer = window.setInterval(ne.util.bind(function() {
            this._model.changeCurrent(this._flow);
            this._roller.move(this._model.getData());

        }, this), this.delayTime);
    },
    /**
     * 커스텀이벤트를 등록한다.
     *
     * @param {String} type 이벤트 타입
     * @param {Function} callback 이벤트 핸들러
     */
    attach: function(type, callback) {
        this._roller.on(type, callback);
    },
    /**
     * 커스텀이벤트를 실행시킨다.
     * @param {String} type 이벤트 타입
     * @param {Object} [options] 이벤트 실행 데이터
     */
    fire: function(type, options) {
        this._roller.fire(type, options);
    }
});





/**
 * @fileoverview 움직임 좌표, 움직이는 방식 위치등을 정하여 액션을 수행함
 * @author Jein Yi
 * @dependency common.js[type, object, collection, function, CustomEvents, defineClass]
 */
/** 롤링 데이터를 조작
 *
 * @param {Object} option 롤링컴포넌트(ne.component.Rolling)의 옵션
 * @param {(Array|Object)} data 롤링 데이터
 * @namespace ne.component.Rolling.Data
 * @constructor
 */
ne.component.Rolling.Data = ne.util.defineClass(/** @lends ne.component.Rolling.Data.prototype */{
    init: function(option, data) {
        /**
         * 가변성 데이터인지?
         * @type {Boolean}
         */
        this.isVariable = !!option.isVariable;
        /**
         * 상호간 연결된 데이터리스트를 갖는다
         * @type {Array}
         */
        this._datalist = null;
        /**
         * 가변데이터 일경우 노드데이터 리스트가 아닌, 데이터를 사용
         * @type {Node}
         * @private
         */
        this._data = null;
        /**
         * 초기 페이지 번호
         * @type {Number}
         */
        this._current = option.initNum || 1;
        /**
         * 순환형인가 여부
         *
         * @type {Boolean}
         * @private
         */
        this._isCircular = ne.util.isBoolean(option.isCircular) ? option.isCircular : true;
        if (this.isVariable) {
            this.mixin(ne.component.Rolling.Data.remoteDataMethods);
        } else {
            this.mixin(ne.component.Rolling.Data.staticDataMethods);
        }

        this._initData(data);
    },
    /**
     * 사용하는 메서드들을 붙인다
     *
     * @param {Object} methods 사용할 메서드셋 [ne.component.Rolling.Data.staticDataMethods|ne.component.Rolling.Data.remoteDataMethods]
     */
    mixin: function(methods) {
        ne.util.extend(this, methods);
    }
});
/**
 * 정적인 데이터일 경우 사용되는 메서드 셋
 * @namespace ne.component.Rolling.Data.staticDataMethods
 */
ne.component.Rolling.Data.staticDataMethods = {
    /**
     * 서로 연결되지 않은 데이터리스트를 서로 연결한다.
     *
     * @param {Array} datalist 서로 연결되지 않은 리스
     * @returns {Array} _datalist
     * @private
     */
    _initData: function(datalist) {
        var before = null,
            first,
            nodelist;

        nodelist = ne.util.map(datalist, function(data, index) {

            var node = new ne.component.Rolling.Data.Node(data);
            node.prev = before;

            // 첫번째 요소일 경우, 마지막 요소와 연결을위해 first에 저장, 아니면 이전요소에 노드를 링크
            if (before) {
                before.next = node;
            } else {
                first = node;
            }
            // 마지막 요소일 경우 처음앨리먼트와 연결한다
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
     * 현재 데이터 또는, 특정인덱스의 데이터를 받아온다.
     *
     * @param {Number} index 받아올 데이터 인덱스값
     * @returns {String}
     */
    getData: function(index) {
        return this._datalist[index || this._current].data;
    },
    /**
     * 데이터 리스트 길이를 반환한다.
     *
     * @returns {Array}
     */
    getDataListLength: function() {
        return this._datalist.length - 1;
    },
    /**
     * 다음데이터를 받아온다.
     *
     * @param {Number} index 받아올 다음 데이터의 기준 인덱스값
     * @returns {String}
     * @private
     */
    getPrevData: function(index) {
        return this._datalist[index || this._current].prev.data;
    },
    /**
     * 이전데이터를 받아온다.
     *
     * @param {Number} index 받아올 이전 데이터의 기준 인덱스값
     * @returns {String}
     * @private
     */
    getNextData: function(index) {
        return this._datalist[index || this._current].next.data;
    },
    /**
     * 현재 페이지를 변경한다.
     *
     * @param {String} flow 방향값
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
     * 현재 위치를 돌려준다.
     *
     * @returns {number}
     */
    getCurrent: function() {
        return this._current;
    }
};
/**
 * 동적인 데이터일 경우 사용되는 메서드 셋.
 * @namespace ne.component.Rolling.Data.remoteDataMethods
 * @static
 */
ne.component.Rolling.Data.remoteDataMethods = {
    /**
     * 가변데이터 일때 데이터 세팅
     *
     * @param {String} data 화면에 그려질 데이터
     * @private
     */
    _initData: function(data) {
        this._data = new ne.component.Rolling.Data.Node(data);
    },
    /**
     * 현재 데이터 또는, 특정인덱스의 데이터를 받아온다.
     *
     * @param {Number} index 받아올 데이터 인덱스값
     * @returns {String}
     */
    getData: function() {
        return this._data.data;
    },
    /**
     * 데이터 세팅
     *
     * @param {String} type ['prev|next'] 선택된 데이터 인덱스
     * @param {String} data 롤링 컴퍼넌트 내부에 사용될 데이터
     */
    setData: function(type, data) {
        this._data[type] = new ne.component.Rolling.Data.Node(data);
    },
    /**
     * 데이터 연결을 끊는다.
     *
     * @param {String} type ['prev|next'] 선택된 데이터로, 현재데이터를 덮는다
     */
    severLink: function(type) {
        var data = this._data;
        this._data = this._data[type];
        data[type] = null;
    },
    /**
     * 다음데이터를 받아온다.
     *
     * @returns {String}
     * @private
     */
    getPrevData: function() {
        return this._data.prev && this._data.prev.data;
    },
    /**
     * 이전데이터를 받아온다.
     *
     * @returns {String}
     * @private
     */
    getNextData: function() {
        return this._data.next && this._data.next.data;
    }
};

/**
 * 데이터끼리 연결하기 위한 노드데이터 형
 *
 * @namespace ne.component.Rolling.Data.Node
 * @param {Object} data 노드데이터/각패널에 들어갈 html값
 * @constructor
 */
ne.component.Rolling.Data.Node = function(data) {

    this.prev = null;
    this.next = null;
    this.data = data;

};
/**
 * @fileoverview 움직임 좌표, 움직이는 방식 위치등을 정하여 액션을 수행함
 * @author Jein Yi
 * @dependency common.js[type, object, collection, function, CustomEvents, defineClass]
 *
 **/

/**
 * 롤링의 움직임을 수행하는 롤러
 *
 * @param {Object} option 롤링컴포넌트(ne.component.Rolling)의 옵션
 * @namespace ne.component.Rolling.Roller
 * @constructor
 */
ne.component.Rolling.Roller = ne.util.defineClass(/** @lends ne.component.Rolling.Roller.prototype */{
    init: function(option, initData) {
        /**
         * 옵션을 저장한다
         * @type {Object}
         */
        this._option = option;
        /**
         * 루트 엘리먼트를 저장한다
         * @type {(HTMLelement|String)}
         * @private
         */
        this._element = ne.util.isString(option.element) ? document.getElementById(option.element) : option.element;
        /**
         * 롤링컴포넌트의 방향 저장(수직, 수평)
         * @type {String}
         * @private
         */
        this._direction = option.direction || 'horizontal';
        /**
         * 이동할 스타일 속성 ('left | top')
         *
         * @type {string}
         * @private
         */
        this._range = this._direction === 'horizontal' ? 'left' : 'top';
        /**
         * 이동에 사용되는 함수
         * @type {Function}
         */
        this._motion = ne.component.Rolling.Roller.motion[option.motion || 'noeffect'];
        /**
         * 롤링을 할 단위
         * @type {Number}
         * @private
         */
        this._rollunit = option.unit || 'page';
        /**
         * 그려진 html을 돌리는 것인지 확인
         *
         * @type {boolean}
         * @private
         */
        this._isDrawn = !!option.isDrawn;
        /**
         * 페이지당 패널 수
         *
         * @type {boolean}
         * @private
         */
        this._itemcount = option.itemcount;
        /**
         * 롤링의 방향을 결정한다(전, 후)
         *
         * @type {String|string}
         * @private
         */
        this._flow = option.flow || 'next';
        /**
         * 애니메이션의 duration
         *
         * @type {*|number}
         * @private
         */
        this._duration = option.duration || 1000;
        /**
         * 순환여부 기본값 true
         * @type {Boolean}
         * @private
         */
        this._isCircular = ne.util.isExisty(option.isCircular) ? option.isCircular : true;
        /**
         * 롤러 상태
         * @type {String}
         */
        this.status = 'idle';
        /**
         * 좌표를 움직일 컨테이너
         * @type {HTMLElement}
         * @private
         */
        this._container = null;
        /**
         * 가변 데이터의 롤러 패널들, 3가지 패널만 갖는다
         * @type {Object}
         */
        this.panel = { prev: null, center: null, next: null };
        /**
         * html 고정의 롤러 패널들, 노드리스트를 배열로 갖는다
         * @type {Array}
         */
        this._panels = [];
        /**
         * 기준 엘리먼트 설정, 롤링 시마다 변경된다.
         *
         * @type {HTMLElement}
         */
        this._basis = null;
        /**
         * 루트 엘리먼트의 너비, 이동단위가 페이지이면 이게 곧 이동 단위가 된다
         * @type {number}
         * @private
         */
        this._distance = 0;
        /**
         * 움직일 패널 타겟들
         *
         * @type {Array}
         * @private
         */
        this._targets = [];
        /**
         * 무브 상태일때 들어오는 명령 저장
         *
         * @type {Array}
         * @private
         */
        this._queue = [];
        /**
         * 아이템 단위로 움직이지 않을 경우, 움직일 카운트
         * @type {number}
         * @private
         */
        this._unitCount = option.rollunit === 'page' ? 1 : (option.unitCount || 1);
        /**
         * 커스텀이벤트
         * @type {Object}
         * @private
         */
        this._events = {};

        if (!this._isDrawn) {
            this.mixin(ne.component.Rolling.Roller.movePanelSet);
        } else {
            this.mixin(ne.component.Rolling.Roller.moveContainerSet);
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
     * 사용하는 메서드들을 붙인다
     *
     * @param {Object} methods 사용할 메서드셋 [ne.component.Rolling.Data.staticDataMethods|ne.component.Rolling.Data.remoteDataMethods]
     */
    mixin: function(methods) {
        ne.util.extend(this, methods);
    },
    /**
     * 롤링을 위해, 루트앨리먼트를 마스크화 한다
     *
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
     * 유닛의 이동거리를 구한다
     *
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

        // 이동단위가 페이지가 아닐경우
        if (this._rollunit !== 'page' && this._isDrawn) {
            dist = Math.ceil(dist / this._itemcount);
        }
        this._distance = parseInt(dist, 10);
    },
    /**
     * 이동 명령 큐잉한다.
     *
     * @param {String} data 페이지 데이터
     * @param {Number} duration 이동속도
     * @param {String} flow 진행방향
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
     * 기본 방향값 설정
     *
     * @param {String} flow 아무값도 넘어오지 않을시, 기본으로 사용될 방향값
     */
    setFlow: function(flow) {
        this._flow = flow || this._flow || 'next';
    },
    /**
     * 애니메이션 효과를 변경한다.
     * @param {String} type 바꿀 모션이름
     */
    changeMotion: function(type) {
        this._motion = ne.component.Rolling.Roller.motion[type];
    },
    /**
     * 애니메이션 수행
     *
     * @param {Object} option 애니메이션 옵션
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
 * 3개의 패널을 돌리는 비정형 롤러 메서드 모음
 *
 * @namespace ne.component.Rolling.Roller.movePanelSet
 * @static
 */
ne.component.Rolling.Roller.movePanelSet = {
    /**
     * 롤링될 컨테이너를 생성 or 구함
     *
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

        // 옵션으로 넘겨받은 태그가 있으면 새로 생성
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
            // 만약 번째 엘리먼트가 존재하면 컨테이너로 인식
            if (ne.util.isHTMLTag(firstChild)) {
                wrap = firstChild;
            }
            // 아닐경우 그 다음앨리먼트를 찾는다
            next = firstChild && firstChild.nextSibling;
            if (ne.util.isHTMLTag(next)) {
                wrap = next;
            } else {
                // 엘리먼트가 존재하지 않을경우 기본값인 ul을 만들어 컨테이너로 리턴
                wrap = document.createElement('ul');
                this._element.appendChild(wrap);
            }
        }
        this._container = wrap;
    },
    /**
     * 롤링될 패널들을 만든다
     *
     * @private
     */
    _setPanel: function(initData) {
        // 데이터 입력
        var panel = this._container.firstChild,
            panelSet = this.panel,
            option = this._option,
            tag,
            className,
            key;

        // 옵션으로 패널 태그가 있으면 옵션사용
        if (ne.util.isString(option.panelTag)) {
            tag = (option.panelTag).split('.')[0];
            className = (option.panelTag).split('.')[1] || '';
        } else {
            // 옵션으로 설정되어 있지 않을 경우 컨테이너 내부에 존재하는 패널 엘리먼트 검색
            // 첫번째가 텍스트 일수 있으므로 다음요소까지 확인한다. 없으면 'li'
            if (!ne.util.isHTMLTag(panel)) {
                panel = panel && panel.nextSibling;
            }
            tag = ne.util.isHTMLTag(panel) ? panel.tagName : 'li';
            className = (panel && panel.className) || '';
        }

        this._container.innerHTML = '';

        // 패널 생성
        for (key in panelSet) {
            panelSet[key] = this._makeElement(tag, className, key);
        }

        // 중앙 패널만 붙임
        panelSet.center.innerHTML = initData;
        this._container.appendChild(panelSet.center);

    },
    /**
     * HTML Element를 만든다
     *
     * @param {String} tag 엘리먼트 태그명
     * @param {String} className 엘리먼트 클래스 명
     * @param {String} key 클래스에 붙는 이름
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
     * 해당 패널 데이터를 설정한다.
     *
     * @param {String} data 패널을 갱신할 데이터
     * @private
     */
    _updatePanel: function(data) {
        this.panel[this._flow || 'center'].innerHTML = data;
    },
    /**
     * 이동할 패널을 붙인다
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
     * 각 패널들이 움직일 값을 구한다
     *
     * @returns {*}
     * @private
     */
    _getMoveSet: function() {
        var flow = this._flow;
        // 좌측이나 위에 붙어있으면 다음패널로 가는 것으로 인식
        if (flow === 'prev') {
            return [0, this._distance];
        } else {
            return [-this._distance, 0];
        }
    },
    /**
     * 이동 시작점들을 구해온다
     *
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
     * 움직일 타겟을 선택한다.
     * @param {String} flow 방향
     * @private
     */
    _setTarget: function(flow) {
        // 움직일 타겟 선
        this._targets = [this.panel['center']];
        if (flow === 'prev') {
            this._targets.unshift(this.panel[flow]);
        } else {
            this._targets.push(this.panel[flow]);
        }

    },
    /**
     * 패널 이동
     *
     * @param {Object} data 이동할 패널의 갱신데이터
     */
    move: function(data, duration, flow) {
        // 상태 체크, idle상태가 아니면 큐잉
        flow = flow || this._flow;
        if (this.status === 'idle') {
            this.status = 'run';
        } else {
            this._queueing(data, duration, flow);
            return;
        }

        /**
         * 무브 시작전에 이벤트 수행
         *
         * @fires beforeMove
         * @param {String} data 내부에 위치한 HTML
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

        // 다음에 중앙에 올 패널 설정
        this._updatePanel(data);
        this._appendMoveData();
        this._setTarget(flow);

        // 모션이 없으면 기본 좌표 움직임
        if (!this._motion) {
            this._moveWithoutMotion();
        } else {
            this._moveWithMotion(duration);
        }
    },
    /**
     * 모션이 없을 경우, 바로 좌표설정을 한다
     *
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
     * 모션이 있을 경우, 모션을 수행한다
     *
     * @private
     */
    _moveWithMotion: function(duration) {
        // 일시적 duration의 변경이 있을땐 인자로 넘어온다.(ex 페이지 한꺼번에 건너 뛸때)
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
     * 러닝상태를 해제한다.
     * 센터를 재설정 한다.
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

        // 큐에 데이터가 있으면 무브를 다시 호출하고 없으면 move의 완료로 간주하고 afterMove를 호출한다
        if (ne.util.isNotEmpty(this._queue)) {
            var first = this._queue.shift();
            this.move(first.data, first.duration, first.flow);
        } else {
            /**
             * 이동이 끝나면 이벤트 수행
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
 * 컨테이너를 움직이는 롤러의 메서드 모음
 *
 * @namespace ne.component.Rolling.Roller.moveContainerSet
 * @static
 */
ne.component.Rolling.Roller.moveContainerSet = {
    /**
     * 컨테이너를 설정한다.
     *
     * @private
     */
    _setContainer: function() {
        var element = this._element,
            firstChild = element.firstChild,
            wrap;
        // 이미 그려진 데이터면, 컨테이너 지정해서 넘김
        if (this._isDrawn) {
            wrap = ne.util.isHTMLTag(firstChild) ? firstChild : firstChild.nextSibling;
            this._container = wrap;
            this._container.style[this._range] = 0;
        }
        this._setItemCount();
    },
    /**
     * 움직일 영역 체크
     *
     * @param {String} flow 이동 방향
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
    _getCurrentPosition: function() {
        return parseInt(this._container.style[this._range], 10);
    },
    /**
     * 패널 이동
     *
     * @param {Object} data 이동할 패널의 갱신데이터
     */
    move: function(duration, flow) {
        // 상태 체크, idle상태가 아니면 큐잉
        flow = flow || this._flow;

        if (this.status === 'idle') {
            this.status = 'run';
        } else {
            this._queueing(duration, flow);
            return;
        }

        /**
         * 무브 시작전에 이벤트 수행
         *
         * @fires beforeMove
         * @param {String} data 내부에 위치한 HTML
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
        // 비순환이고, 영역을 넘어갔으면 움직임 없이 리턴한다.
        if(!this._isCircular && this._isLimitPoint(flow)) {
            this.status = 'idle';
            return;
        }
        // 다음에 중앙에 올 패널 설정
        if (this._isCircular) {
            this._rotatePanel(flow);
        }
        // 모션이 없으면 기본 좌표 움직임
        if (!this._motion) {
            this._moveWithoutMotion();
        } else {
            this._moveWithMotion(duration);
        }
    },
    /**
     * 완료시 패널 재정비
     */
    complete: function() {
        // this._panels 업데이트 this._basis 업데이트
        if (this._isCircular) {
            this._setPanel();
        }
        this.status = 'idle';
    },
    /**
     * 이동거리를 구한다.
     * isCircular일때와 아닐때로 나뉜다.
     *
     * @param {String} flow 방향
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
     * 모션이 없을 경우, 바로 좌표설정을 한다
     *
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
     * 모션이 있을 경우, 모션을 수행한다.
     *
     * @private
     */
    _moveWithMotion: function(duration) {
        // 일시적 duration의 변경이 있을땐 인자로 넘어온다.(ex 페이지 한꺼번에 건너 뛸때)
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
     * 패널을 돌린다.
     *
     * @param {String} flow 방향
     * @private
     */
    _rotatePanel: function(flow) {
        var standard,
            moveset,
            movesetLength,
            range = this._range,
            flow = flow || this._flow,
            containerMoveDist,
            isPrev = flow === 'prev',
            basis = this._basis;

        // 로테이션 될 패널을 설정한다.
        this._setPartOfPanels(flow);

        moveset = this._movePanelSet;
        movesetLength = moveset.length;
        containerMoveDist = this._getMoveDistance(flow);

        // 현재 페이지에 보이는 패널이, 로테이션 패널로 정해지면, 로테이션을 수행하지 않는다.
        if (this._isInclude(this._panels[this._basis], moveset)) {
            this._basis = isPrev ? basis - movesetLength : basis + movesetLength;
            return;
        }
        // 방향에 따른 동작수행
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
        // 로테이션 후, 컨테이너의 위치 재정렬
        this._container.style[range] = parseInt(this._container.style[range], 10) - containerMoveDist + 'px';
    },
    /**
     * 현재 화면에 보여지는 요소가 로테이트 요소에 포함되어 있는지 확인한다.
     *
     * @param {HTMLElement} item 포함되어 있는지 확인하기위한 엘리먼트
     * @param {Array} colleciton 노드배열
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
     * 방향에 따른, move발생 전 로테이션 될 패널들을 찾는다.
     *
     * @param {String} flow 방향
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
     * 한 화면에 보이는 패널 갯수를 구한다.
     *
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
     * 패널들을 초기화 한다.
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
     * 패널리스트를 만든다.
     *
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
     * 비순환 롤링시 fix 되는영역을 설정한다.
     *
     * @param {String} flow 이동 방향
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
     * 선택된 페이지의 현재 인덱스를 가져온다.
     *
     * @param {Number} page 이동할 패널 번호
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
     * 특정 패널로 이동한다.
     *
     * @param {Number} page 이동할 패널 번호
     */
    moveTo: function(page) {
        page = Math.max(page, 0);
        page = Math.min(page, this._panels.length - 1);

        // 이동할 타겟이 현재 몇번째에 위치
        var pos = this._checkPagePosition(page),
            itemCount = this._itemcount,
            panelCount = this._panels.length,
            distance = this._distance,
            itemDist = this._rollunit === 'page' ? distance / itemCount : distance,
            unitDist = -pos * itemDist;

        // 순환 롤링일때는 좌표 이동 후 패널을 다시 묶는다.
        if (!this._isCircular) {
            unitDist = Math.max(unitDist, -this.limit);
        } else {
            // 순환에는 limit이 없기 때문에 패널 너비 * 패널 갯수(보여지는 패널갯수제외)로 최대값을 구한다.
            unitDist = Math.max(unitDist, -(itemDist * (panelCount - itemCount)));
            this._basis = pos;
            this._setPanel();
        }
        this._container.style[this._range] = unitDist + 'px';
    }
};

// 커스텀이벤트 믹스인
ne.util.CustomEvents.mixin(ne.component.Rolling.Roller);

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
        };
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
        };
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
        };
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
    quadEaseIn = makeEaseIn(quad);
    /**
     * circ + easeIn
     *
     * @memberof ne.component.Rolling.Roller.motion
     * @method circEaseIn
     * @static
     */
        circEaseIn = makeEaseIn(circ);
    /**
     * quad + easeOut
     *
     * @memberof ne.component.Rolling.Roller.motion
     * @method quadEaseOut
     * @static
     */
        quadEaseOut = makeEaseOut(quad);
    /**
     * circ + easeOut
     *
     * @memberof ne.component.Rolling.Roller.motion
     * @method circEaseOut
     * @static
     */
    circEaseOut = makeEaseOut(circ);
    /**
     * quad + easeInOut
     *
     * @memberof ne.component.Rolling.Roller.motion
     * @method quadEaseInOut
     * @static
     */
    quadEaseInOut = makeEaseInOut(quad);
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

})();
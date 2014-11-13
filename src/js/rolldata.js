/**
 * @fileoverview 움직임 좌표, 움직이는 방식 위치등을 정하여 액션을 수행함
 * @author Jein Yi
 * @dependency common.js[type, object, collection, function, CustomEvents, defineClass]
 */
/** 롤링 데이터를 조작
 *
 * @param {Object} option 롤링컴포넌트(ne.component.Rolling)의 옵션
 * @param {{Array|Object}} data 롤링 데이터
 * @namespace ne.component.Rolling.Data
 * @constructor
 */
ne.component.Rolling.Data = ne.defineClass(/** @lends ne.component.Rolling.Data.prototype */{
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
        this._isCircular = ne.isBoolean(option.isCircular) ? option.isCircular : true;
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
        ne.extend(this, methods);
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

        nodelist = ne.map(datalist, function(data, index) {

            var node = new ne.component.Rolling.Data.Node(data);
            node.prev = before;

            // 첫번째 요소일 경우, 마지막 요소와 연결을위해 first에 저장, 아니면 이전요소에 노드를 링크
            if (before) {
                before.next = node;
            } else {
                node.first = true;
                first = node;
            }
            // 마지막 요소일 경우 처음앨리먼트와 연결한다
            if (index === datalist.length - 1) {
                node.last = true;
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
            if ((--this._current) < 1) {
                this._current = this._isCircular ? length : 1;
            }
        } else {
            if ((++this._current) > length) {
                this._current = this._isCircular ? 1 : length;
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
    this.last = false;
    this.first = false;
    this.data = data;

};
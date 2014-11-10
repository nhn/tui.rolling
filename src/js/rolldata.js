/**
 * @fileoverview 움직임 좌표, 움직이는 방식 위치등을 정하여 액션을 수행함
 * @author Jein Yi
 *
 * */

if (!ne) {
    ne = window.ne = {};
}
if (!ne.component) {
    ne.component = {};
}
/**
 * 롤링 데이터를 조작
 *
 * @param {Object} option 모델에 사용되는 옵션, 롤링의 옵션과 같다
 * @param {Array|Object} data
 * @constructor
 */
ne.component.RollData = function(option, data) {
    /**
     * 가변성 데이터인지?
     * @type {Boolean}
     */
    this.isVariable = option.isVariable || false;
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
    this._current = option.initNum || 0;
    /**
     * 순환형인가 여부
     *
     * @type {Boolean}
     * @private
     */
    this._isCircle = ne.isBoolean(option.isCircle) ? option.isCircle : true;

    this._init(data);
};

ne.extend(ne.component.RollData.prototype,  /** @lends ne.component.RollData.prototype */{
    /**
     * 가변데이터인지, 아닌지에 따른 사용 메서드 믹스인
     *
     * @param {Array<String>|String} data
     * @private
     */
    _init: function(data) {
        if (this.isVariable) {
            this.mixin(remoteDataMethods);
        } else {
            this.mixin(staticDataMethods);
        }
        this._makeData(data);
    },
    /**
     * 사용하는 메서드들을 붙인다
     *
     * @param {Object} methods
     */
    mixin: function(methods) {
        ne.extend(this, methods);
    }
});

var staticDataMethods = {
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
     * 서로 연결되지 않은 데이터리스트를 서로 연결한다.
     *
     * @param {Array} datalist 서로 연결되지 않은 리스
     * @returns {Array} _datalist
     * @private
     */
    _makeData: function(datalist) {
        var before = null,
            first,
            nodelist;

        nodelist = ne.map(datalist, function(data, index) {

            var node = new ne.component.RollData.Node(data);
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

        this._datalist = nodelist;
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
     * @param {Number} num
     * @private
     */
    changeCurrent: function(flow) {
        if (flow === 'next') {
            if ((++this._current) > (this._datalist.length - 1)) {
                this._current = this._isCircle ? 0 : this._datalist.length - 1;
            }
        } else {
            if ((--this._current) < 0) {
                this._current = this._isCircle ? this._datalist.length - 1 : 0;
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

var remoteDataMethods = {
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
     * 가변데이터 일때 데이터 세팅(최초 데이터는 화면에 보여질 데이터이다)
     *
     * @param {String} data
     * @private
     */
    _makeData: function(data) {
        this._data = new ne.component.RollData.Node(data);
    },
    /**
     * 데이터 세팅
     *
     * @param {String} type ['prev|next'] 선택된 데이터 인덱스
     * @param {String} data 롤링 컴퍼넌트 내부에 사용될 데이터
     */
    setData: function(type, data) {
        this._data[type] = new ne.component.RollData.Node(data);
    },
    /**
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
 * @param {Object} data 노드데이터/각패널에 들어갈 html값
 * @constructor
 */
ne.component.RollData.Node = function(data) {

    this.prev = null;
    this.next = null;
    this.last = false;
    this.first = false;
    this.data = data;

}

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





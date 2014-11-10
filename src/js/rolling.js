/**
 * @fileoverview 롤링컴퍼넌트의 코어
 * @author Jein Yi
 * */
if (!ne) {
    ne = window.ne = {};
}
if (!ne.component) {
    ne.component = {};
}
/**
 * 롤링 코어객체
 *
 * @param option
 * @constructor
 *
 * @param {Object} option
 *      @param {HTMLElement|String} option.element 루트 엘리먼트 혹은 엘리먼트 아이디 값
 *      @param {Boolean} [option.isVariable=true|false] 가변성이 있는 데이터 인지여부. (기본값은 false)
 *      @param {Boolean} [option.isCircle=true|false] 순환하는 롤링인지 여부. (기본값은 순환형, isVariable이 true일 경우는 무시된다)
 *      @param {Boolean} [option.auto=true|false] 자동롤링 할 것인지 여부(기본값 false)
 *      @param {Number} [option.delayTime=1000|...] 자동롤링 간격(기본값 3초)
 *      @param {Number} [option.initNum=0] 초기에 보여질 부분을 정할때 사용한다.
 *      @param {Number} [option.itemcount=1] 한 패널에 보여지는 아이템 수
 *      @param {Number} [option.direction='horizontal|vertical'] 패널 이동방향(기본값은 horizontal)
 *      @param {String} [option.motion='linear|easeIn|easeOut|easeInOut'] 패널 이동효과(기본값은 noeffect)
 *      @param {String} [option.unit='item|page'] 롤링을 하는 단위를 설정한다
 *      @param {String} [option.template='<li class="rollitem {{rollclass}}'>{{rollingItem}}</li>'] 롤러에 쓰일 템플릿, 이부분을 사용하지 않을 시 data에 템플릿을 포함해야한다.
 *      @param {String} [option.flow='prev|next'] 롤링의 방향을 결정한다. (좌에서 우로, 우에서 좌로이 이동중에 선택, 기본값 next)
 *      @param {String} [potion.pannelTag='li.pannelitem'] 패널에 사용되는 태그, .으로 클래스를 연결
 *
 * @example
 * var roll = new ne.component.Rolling({
 *      element: document.getElementById('rolling'),
 *      initNum: 0,
 *      direction: 'horizontal',
 *      isVariable: true,
 *      unit: 'page',
 *      auto: false,
 *      motion: 'easeInOut',
 *      duration:2000
 * });
 * */
ne.component.Rolling = function(option) {
    /**
     * 옵션객체
     * @type {Object}
     * @private
     */
    this._option = option;
    /**
     * 커스텀 이벤트 저장소
     * @type {Object}
     * @private
     */
    this._customEvent = {};
    /**
     * 롤러
     * @type {ne.component.Roller}
     * @private
     */
    this._roller = null;
    /**
     * 현재 페이지
     * @type {null}
     * @private
     */
    this._current = null;
    /**
     * 패널의 이동방향 정보
     *
     * @type {String|string}
     * @private
     */
    this._flow = option.flow || 'next';
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
};

ne.extend(ne.component.Rolling.prototype, /** @lends ne.component.Rolling.prototype */{
    /**
     * 롤링에 필요한 데이터를 세팅한다.
     * @param {Object|Array} data 롤링될 데이터
     *
     * @example
     * roll.init('data1');
     *
     */
    init: function(data) {

        var option = this._option;
        this._model = new ne.component.RollData(option, data);
        this._roller = new ne.component.Roller(option);
        this._roller.init(this._model.getData());

        if (option.auto) {
            this.auto();
        }
    },
    /**
     * 롤러에게 롤링을 요청한다. 가변데이터일 경우 data가 입력되어야 하고,
     * 액션의 방향을 설정하는 flow가 반드시 입력되지 않으면 기본값인 'next'를 따른다
     * @param {String} data
     * @param {String} flow
     */
    roll: function(data, flow) {

        if (this._option.isVariable) {
            if (!data) {
                throw new Error('roll must run with data');
            }
            if (!flow) {
                console.warn('If flow dosen\'t exist motion run with default[next] flow.');
            }
            this._roller.setFlow(flow);
            this._roller.move(data);
        } else {
            this._model.changeCurrent(this._flow);
            this._roller.move(this._model.getData());
        }

    },
    /**
     * 이동방향을 설정한다.
     *
     * @param {String} flow
     */
    setFlow: function(flow) {
        this._flow = flow;
        this._roller.setFlow(flow);
    },
    /**
     * 타겟페이지로 이동한다
     *
     * @param {Number} page
     */
    moveTo: function(page) {
        // 이동할 페이지 선택, 데이터 받아옴
        var i, interval;

        if (isNaN(page) || !ne.isNumber(Number(page))) {
            throw new Error('moveTo method have to run with page');
        }
        if (this._option.isVariable) {
            throw new Error('Variable Rolling can\'t use moveTo');
        }

        interval = page - this._model.getCurrent();
        if (this.isNegative(interval)) {
            this.setFlow('prev');
        } else {
            this.setFlow('next');
        }

        for (i = 0; i < Math.abs(interval); i++) {
            this._model.changeCurrent(this._flow);
            this._roller.move(this._model.getData(), this._option.duration / Math.abs(interval));
        }

    },
    /**
     * 음수인지 확인
     *
     * @param {Number} number
     * @returns {Boolean}
     */
    isNegative: function(number) {
        return ne.isNumber(number) && number < 0;
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
        this._timer = window.setInterval(ne.bind(function() {

            this._model.changeCurrent(this._flow);
            this._roller.move(this._model.getData());

        }, this), this.delayTime);
    },
    //@todo ne.CustomEvent 연결
    attach: function(type, callback) {

    },
    fire: function(type, options) {

    }
});





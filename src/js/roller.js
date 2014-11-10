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
 * 롤링의 움직임을 수행하는 롤러
 *
 * @param {Object} option 롤링컴포넌트의 옵션
 * @constructor
 */
ne.component.Roller = function(option) {
    /**
     * 옵션을 저장한다
     * @type {Object}
     */
    this._option = option;
    /**
     * 루트 엘리먼트를 저장한다
     * @type {element|*}
     * @private
     */
    this._element = ne.isString(option.element) ? document.getElementById(option.element) : option.element;
    /**
     * 롤링컴포넌트의 방향 저장(수직, 수평)
     * @type {String}
     * @private
     */
    this._direction = option.direction || 'horizontal';
    /**
     * 이동에 사용되는 함수
     * @type {Function}
     */
    this._motion = ne.component.Roller.motion[option.motion || 'noeffect'];
    /**
     * 한페이지에 들어있는 롤링 아이템 수
     * @type {Number}
     * @private
     */
    this._itemcount = option.itemcount || 1;
    /**
     * 롤링을 할 단위
     * @type {Number}
     * @private
     */
    this._rollunit = option.unit || 'page';
    /**
     * 자동롤링 여부
     * @type {Boolean}
     * @private
     */
    this._auto = option.auto || false;
    /**
     * 롤링의 방향을 결정한다(전, 후)
     * @type {String|string}
     * @private
     */
    this._flow = option._flow || 'next';
    /**
     * 애니메이션의 duration
     *
     * @type {*|number}
     * @private
     */
    this._duration = option.duration || 1000;
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
    this._container = this._getContainer();
    /**
     * 롤러 패널들, 3가지 패널만 갖는다
     * @type {Object}
     */
    this.pannel = { prev: null, center: null, next: null };
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
};
ne.extend(ne.component.Roller.prototype, /** @lends ne.component.Roller.prototype */{
    init: function(initData) {
        this._masking();
        this._setUnitDistance();
        this._setPannel(initData);
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
        if (this._rollunit !== 'page') {
            dist = Math.ceil(dist / this._itemcount);
        }
        this._distance = dist;
    },
    /**
     * 롤링될 패널들을 만든다
     *
     * @private
     */
    _setPannel: function(initData) {
        // 데이터 입력
        var pannel = this._container.firstChild,
            pannelSet = this.pannel,
            option = this._option,
            tag,
            className,
            key;

        // 옵션으로 패널 태그가 있으면 옵션사용
        if (ne.isString(option.pannelTag)) {
            tag = (option.pannelTag).split('.')[0];
            className = (option.pannelTag).split('.')[1];
        } else {
            // 옵션으로 설정되어 있지 않을 경우 컨테이너 내부에 존재하는 패널 엘리먼트 검색, 없으면 'li'
            tag = ne.isHTMLTag(pannel) ? pannel.tagName : 'li';
            className = (pannel && pannel.className) || '';
        }

        this._container.innerHTML = '';

        // 패널 생성
        for (key in pannelSet) {
            pannelSet[key] = this._makeElement(tag, className, key);
        }

        // 중앙 패널만 붙임
        pannelSet.center.innerHTML = initData;
        this._container.appendChild(pannelSet.center);

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
    _updatePannel: function(data) {
        this.pannel[this._flow || 'center'].innerHTML = data;
    },
    /**
     * 이동할 패널을 붙인다
     */
    _appendMoveData: function() {
        var flow = this._flow,
            movePannel = this.pannel[flow],
            style = movePannel.style,
            dest = (flow === 'prev' ? -this._distance : this._distance) + 'px';

        if (this._direction === 'horizontal') {
            style.left = dest;
        } else {
            style.top = dest;
        }
        this.movePannel = movePannel;
        this._container.appendChild(movePannel);
    },
    /**
     * 롤링될 컨테이너를 생성 or 구함
     *
     * @returns {*}
     * @private
     */
    _getContainer: function() {
        var element = this._element,
            firstChild = element.firstChild,
            wrap,
            next;
        if (ne.isHTMLTag(firstChild)) {
            return firstChild;
        } else {
            next = firstChild && firstChild.nextSibling;
            if (ne.isHTMLTag(next)) {
                wrap = next;
            } else {
                wrap = document.createElement('ul');
                this._element.appendChild(wrap);
            }
            return wrap;
        }
    },
    /**
     * 각 패널들이 움직일 값을 구한다
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
        var pannel = this.pannel,
            flow = this._flow,
            range = this._direction === 'horizontal' ? 'left' : 'top';
        if (flow === 'prev') {
            return [parseInt(pannel['prev'].style[range]), parseInt(pannel['center'].style[range])];
        } else {
            return [parseInt(pannel['center'].style[range]), parseInt(pannel['next'].style[range])];
        }
    },
    _queueing: function(data, duration) {
        this._queue.push({
            data: data,
            duration: duration
        });
    },
    /**
     * 패널 이동
     *
     * @param {Object} data 이동할 패널의 갱신데이터
     */
    move: function(data, duration) {
        // 상태 체크, idle상태가 아니면 큐잉
        var flow = this._flow;
        if (this.status === 'idle') {
            this.status = 'run';
        } else {
            console.log(data, duration);
            this._queueing(data, duration);
            return;
        }

        // 다음에 중앙에 올 패널 설정
        this._updatePannel(data);
        this._appendMoveData();

        // 움직일 타겟 선
        this.targets = [this.pannel['center']];
        if (flow === 'prev') {
            this.targets.unshift(this.pannel[flow]);
        } else {
            this.targets.push(this.pannel[flow]);
        }

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
            direction = this._direction;
        ne.forEach(this.targets, function(element, index) {
            var range = (direction === 'horizontal') ? 'left' : 'top';
            element.style[range] = pos[index] + 'px';
        });
        this.fix();
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
            direction = this._direction,
            duration = duration || this._duration;

        this._animate({
            delay: 10,
            duration: duration || 1000,
            delta: this._motion,
            step: ne.bind(function(delta) {
                ne.forEach(this.targets, function(element, index) {

                    var range = (direction === 'horizontal') ? 'left' : 'top',
                        dest = (flow === 'prev') ? dest = distance * delta : dest = -(distance * delta);
                    element.style[range] = start[index] + dest + 'px';
                });
            }, this),
            complate: ne.bind(this.fix, this)
        });
    },
    /**
     * 러닝상태를 해제한다.
     * 센터를 재설정 한다.
     */
    fix: function() {
        var pannel = this.pannel,
            tempPannel,
            flow = this._flow;

        tempPannel = pannel['center'];
        pannel['center'] = pannel[flow];
        pannel[flow] = tempPannel;

        this.targets = null;
        this._container.removeChild(tempPannel);
        this.status = 'idle';

        if (ne.isNotEmpty(this._queue)) {
            var first = this._queue.splice(0, 1)[0];
            this.move(first.data, first.duration);
        }
    },
    /**
     * 애니메이션 효과를 변경한다.
     * @param {String} type 바꿀 모션이름
     */
    changeMotion: function(type) {
        this._motion = ne.component.Roller.motion[type];
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
                    option.complate();
                }
            }, option.delay || 10);
    },
    setFlow: function(flow) {
        this._flow = flow || this._flow || 'next';
    }
});
/**
 * @todo 효과정리(현재 라파엘 함수들 사용)
 * 롤링에 필요한 모션 함수 컬렉션
 *
 * @type {Object}
 */
ne.component.Roller.motion = {
    linear: function (n) {
        return n;
    },
    easeIn: function (n) {
        return Math.pow(n, 1.7);
    },
    easeOut: function (n) {
        return Math.pow(n, .48);
    },
    easeInOut: function (n) {
        var q = .48 - n / 1.04,
            Q = Math.sqrt(.1734 + q * q),
            x = Q - q,
            X = Math.pow(Math.abs(x), 1 / 3) * (x < 0 ? -1 : 1),
            y = -Q - q,
            Y = Math.pow(Math.abs(y), 1 / 3) * (y < 0 ? -1 : 1),
            t = X + Y + .5;
        return (1 - t) * 3 * t * t + t * t * t;
    }
};

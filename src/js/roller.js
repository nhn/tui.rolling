/**
 * @fileoverview 움직임 좌표, 움직이는 방식 위치등을 정하여 액션을 수행함
 * @author Jein Yi
 * @dependency common.js[type, object, collection, function, CustomEvents, defineClass]
 *
 * */

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
                    option.complate();
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
        this.complate();
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
            complate: ne.util.bind(this.complate, this)
        });
    },
    /**
     * 러닝상태를 해제한다.
     * 센터를 재설정 한다.
     */
    complate: function() {
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
        var res = this.invoke('beforeMove', { data: data });
        if (!res) {
            this.status = 'idle';
            return;
        }
        // 다음에 중앙에 올 패널 설정

        this._rotatePanel(flow);
        // 모션이 없으면 기본 좌표 움직임
        if (!this._motion) {
            this._moveWithoutMotion();
        } else {
            this._moveWithMotion(duration);
        }
    },
    complate: function() {
        // this._panels 업데이트 this._basis 업데이트
        this._setPanel();
        this.status = 'idle';
    },
    /**
     * 이동거리를 구한다.
     *
     * @param {String} flow 방향
     * @returns {number}
     * @private
     */
    _getMoveDistance: function(flow) {
        if (flow === 'prev') {
            return this._distance;
        } else {
            return -this._distance;
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
        this.complate();
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
            complate: ne.util.bind(this.complate, this)
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
     * 패널리스트를 만든다.
     *
     * @private
     */
    _setPanel: function() {
        var container = this._container,
            panels = container.childNodes,
            i,
            arr;

        // toArray에 NodeList케이스가 추가되면 코드 변경 예정
        panels = ne.util.toArray(panels);

        this._panels = ne.util.filter(panels, function(element) {
            return ne.util.isHTMLTag(element);
        });
        this._basis = this._basis || 0;
    }
};

// 커스텀이벤트 믹스인
ne.util.CustomEvents.mixin(ne.component.Rolling.Roller);

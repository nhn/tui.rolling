tui.util.defineNamespace("fedoc.content", {});
fedoc.content["rolling.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Rolling component core.\n * @author NHN Ent. FE dev team.&lt;dl_javascript@nhnent.com>\n * @dependency tui-code-snippet ~v.1.1.0\n */\n\nvar Roller = require('./roller');\nvar Data = require('./rolldata');\n/**\n * Rolling core object\n * @param {Object} option The options \n *      @param {HTMLElement|String} option.element A root element or id that will become root element's\n *      @param {Boolean} [option.isVariable=true|false] Whether the data is changable or not [default value is false]\n *      @param {Boolean} [option.isCircular=true|false] Whether circular or not [default value is true but isVariable true case]\n *      @param {Boolean} [option.auto=true|false] Whether auto rolling or not [default value is false]\n *      @param {Number} [option.delayTime=1000|...] Distance time of auto rolling. [defulat 3 second]\n *      @param {Number} [option.direction='horizontal|vertical'] The flow direction panel [default value is horizontal]\n *      @param {Number} [option.duration='1000|...] A move duration\n *      @param {Number} [option.initNum='0|...] Initalize selected rolling panel number\n *      @param {String} [option.motion='linear|[quad]easeIn|[quad]easeOut|[quad]easeInOut|circEaseIn|circEaseOut|circEaseInOut] A effect name [default value is noeffect]\n *      @param {String} [option.unit='item|page'] A unit of rolling\n *      @param {String} [option.wrapperTag='ul.className|div.className'] A tag name for panel warpper, connect tag name with class name by dots. [defualt value is ul]\n *      @param {String} [option.panelTag='li.className'] A tag name for panel, connect tag name with class by dots [default value is li]\n * @param {Array|String} data A data of rolling panels\n *\n * @example\n * var roll = new tui.component.Rolling({\n *      element: document.getElementById('rolling'),\n *      initNum: 0,\n *      direction: 'horizontal',\n *      isVariable: true,\n *      unit: 'page',\n *      isAuto: false,\n *      motion: 'easeInOut',\n *      duration:2000\n * }, ['&lt;div>data1&lt;/div>','&lt;div>data2&lt;/div>', '&lt;div>data3&lt;/div>']);\n * @constructor\n */\nvar Rolling = tui.util.defineClass(/** @lends Rolling.prototype */{\n    /**\n     * Initialize\n     * */\n    init: function(option, data) {\n        /**\n         * Option object\n         * @type {Object}\n         * @private\n         */\n        this._option = option;\n        /**\n         * The flow of next move\n         * @type {String|string}\n         * @private\n         */\n        this._flow = option.flow || 'next';\n        /**\n         * Whether html is drawn or not\n         * @type {boolean}\n         * @private\n         */\n        this._isDrawn = !!option.isDrawn;\n        /**\n         * Auto rolling timer\n         * @type {null}\n         * @private\n         */\n        this._timer = null;\n        /**\n         * Auto rolling delay time\n         */\n        this.delayTime = this.delayTime || 3000;\n        /**\n         * A model for rolling data\n         * @type {Data}\n         * @private\n         */\n        this._model = !option.isDrawn ? new Data(option, data) : null;\n        /**\n         * A rolling action object\n         * @type {Roller}\n         * @private\n         */\n        this._roller = new Roller(option, this._model &amp;&amp; this._model.getData());\n\n        if (option.initNum) {\n            this.moveTo(option.initNum);\n        }\n        if (!!option.isAuto) {\n            this.auto();\n        }\n    },\n\n    /**\n     * Roll the rolling component. If there is no data, the component have to have with fixed data\n     * @api\n     * @param {String} data A rolling data\n     * @param {String} [flow] A direction rolling\n     * @example\n     * rolling.roll('&lt;div>data&lt;/div>', 'horizontal');\n     */\n    roll: function(data, flow) {\n        flow = flow || this._flow;\n\n        // If rolling status is not idle, return\n        if (this._roller.status !== 'idle') {\n            return;\n        }\n\n        if (this._option.isVariable) {\n            if (!data) {\n                throw new Error('roll must run with data');\n            }\n\n            this.setFlow(flow);\n            this._roller.move(data);\n\n        } else {\n            var overBoundary;\n            this.setFlow(flow);\n            if (this._model) {\n                overBoundary = this._model.changeCurrent(flow);\n                data = this._model.getData();\n            }\n            if(!overBoundary) {\n                this._roller.move(data);\n            }\n        }\n\n    },\n\n    /**\n     * Set direction\n     * @api\n     * @param {String} flow A direction of rolling\n     * @example\n     * rolling.setFlow('horizontal');\n     */\n    setFlow: function(flow) {\n        this._flow = flow;\n        this._roller.setFlow(flow);\n    },\n\n    /**\n     * Move to target page\n     * @api\n     * @param {Number} page A target page\n     * @example\n     * rolling.moveTo(3);\n     */\n    moveTo: function(page) {\n\n        if (this._isDrawn) {\n            this._roller.moveTo(page);\n            return;\n        }\n\n        var len = this._model.getDataListLength(),\n            max = Math.min(len, page),\n            min = Math.max(1, page),\n            current = this._model.getCurrent(),\n            duration,\n            absInterval,\n            isPrev,\n            flow,\n            i;\n\n        if (isNaN(Number(page))) {\n            throw new Error('#PageError moveTo method have to run with page');\n        }\n        if (this._option.isVariable) {\n            throw new Error('#DataError : Variable Rolling can\\'t use moveTo');\n        }\n\n        isPrev = this.isNegative(page - current);\n        page = isPrev ? min : max;\n        flow = isPrev ? 'prev' : 'next';\n        absInterval = Math.abs(page - current);\n        duration = this._option.duration / absInterval;\n\n        this.setFlow(flow);\n\n        for (i = 0; i &lt; absInterval; i++) {\n            this._model.changeCurrent(flow);\n            this._roller.move(this._model.getData(), duration);\n        }\n\n    },\n\n    /**\n     * Check the number is negative or not\n     * @param number A number to figure out\n     */\n    isNegative: function(number) {\n        return !isNaN(number) &amp;&amp; number &lt; 0;\n    },\n\n    /**\n     * Stop auto rolling\n     */\n    stop: function() {\n        window.clearInterval(this._timer);\n    },\n\n    /**\n     * Start auto rolling\n     * @api\n     * @example\n     * rolling.auto();\n     */\n    auto: function() {\n        this.stop();\n        this._timer = window.setInterval(tui.util.bind(function() {\n            this._model.changeCurrent(this._flow);\n            this._roller.move(this._model.getData());\n\n        }, this), this.delayTime);\n    },\n\n    /**\n     * Attach custom event\n     * @param {String} type A event type\n     * @param {Function} callback A callback function for custom event \n     */\n    attach: function(type, callback) {\n        this._roller.on(type, callback);\n    },\n\n    /**\n     * Run custom event\n     * @param {String} type A event type\n     * @param {Object} [options] A data from fire event\n     */\n    fire: function(type, options) {\n        this._roller.fire(type, options);\n    }\n});\n\nmodule.exports = Rolling;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"
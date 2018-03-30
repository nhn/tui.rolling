/**
 * @fileoverview Module of motions
 * @author NHN Ent. FE dev team.<dl_javascript@nhnent.com>
 */

'use strict';

var snippet = require('tui-code-snippet');

/**
 * utils
 * @namespace util
 * @ignore
 */
var util = (function() {
    /**
     * send host name
     * @ignore
     */
    function sendHostName() {
        var hostname = location.hostname;
        snippet.imagePing('https://www.google-analytics.com/collect', {
            v: 1,
            t: 'event',
            tid: 'UA-115377265-9',
            cid: hostname,
            dp: hostname,
            dh: 'rolling'
        });
    }

    return {
        sendHostName: sendHostName
    };
})();

module.exports = util;

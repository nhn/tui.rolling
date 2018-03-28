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
     * @returns {Boolean}
     */
    function sendHostName() {
        var hostname = location.hostname;
        var imgElement = snippet.imagePing('https://www.google-analytics.com/collect', {
            v: 1,
            t: 'event',
            tid: 'UA-115377265-7',
            cid: hostname,
            dp: hostname,
            dh: hostname
        });

        return !!imgElement;
    }

    return {
        sendHostName: sendHostName
    };
})();

module.exports = util;

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
        var trackingUrl = 'https://www.google-analytics.com/collect';
        var trackingID = 'UA-115377265-7';
        var hitType = 'event';
        var hostname = location.hostname;
        var params = {
            v: 1,
            t: hitType,
            tid: trackingID,
            cid: hostname,
            dp: hostname,
            dh: hostname
        };
        var queryString = snippet.map(snippet.keys(params), function(key, index) {
            var startWith = index === 0 ? '' : '&';

            return startWith + key + '=' + params[key];
        }).join('');
        var trackingElement = document.createElement('img');
        trackingElement.className = 'ga-tracking';

        trackingElement.src = trackingUrl + '?' + queryString;
        trackingElement.style.display = 'none';

        document.body.appendChild(trackingElement);
    }

    return {
        sendHostName: sendHostName
    };
})();

module.exports = util;

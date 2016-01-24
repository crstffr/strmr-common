
var request = require('../request');
var format = require('string-format');

module.exports = {
    url: _url,
    get: _get
};

/**
 *
 * @param {String} movieid
 * @returns {String}
 * @private
 */
function _url(movieid) {
    var base = 'https://clmx10y474.execute-api.us-east-1.amazonaws.com/development';
    var url = base + '/movie/{movieid}';
    return format(url, {movieid: movieid});
}

/**
 *
 * @param {String} movieid
 * @returns {Promise}
 * @private
 */
function _get(movieid) {
    return request.get(_url(movieid));
}

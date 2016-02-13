
var request = require('../request');
var format = require('string-format');

module.exports = {
    url: _url,
    get: _get
};

/**
 *
 * @param {String} uid
 * @param {String} movie
 * @param {String} user
 * @param {String} pass
 * @returns {String}
 * @private
 */
function _url(uid, movie, user, pass) {
    var base = 'https://clmx10y474.execute-api.us-east-1.amazonaws.com/development';
    var url = base + '/user/{uid}/{u}/{p}/movies/{movie}';
    return format(url, {uid: uid, movie: movie, u: user, p: pass});
}

/**
 *
 * @param {String} uid
 * @param {String} email
 * @param {String} pass
 * @returns {Promise}
 * @private
 */
function _get(uid, email, pass) {
    return request.get(_url(uid, email, pass));
}

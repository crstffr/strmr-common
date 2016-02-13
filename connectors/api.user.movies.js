
var request = require('../request');
var format = require('string-format');

module.exports = {
    url: _url,
    get: _get
};

function _url(uid, user, pass) {
    var base = 'https://clmx10y474.execute-api.us-east-1.amazonaws.com/development';
    var url = base + '/user/{uid}/{u}/{p}/movies/';
    return format(url, {uid: uid, u: user, p: pass});
}

function _get(uid, user, pass) {
    return request.get(_url(uid, user, pass));
}

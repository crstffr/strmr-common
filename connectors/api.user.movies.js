
var request = require('../request');
var format = require('string-format');

module.exports = {
    url: _url,
    get: _get
};

function _url(uid, user, pass) {
    var base = 'https://clmx10y474.execute-api.us-east-1.amazonaws.com/development';
    var url = base + '/user/{uid}/movies?u={user}&p={pass}';
    return format(url, {uid: uid, user: user, pass: pass});
}

function _get(uid, user, pass) {
    return request.get(_url(uid, user, pass));
}

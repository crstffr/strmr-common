
var request = require('superagent-promise')(require('superagent'), require('promise'));


module.exports = {

    get: function (opts) {
        return request.get(opts).then(function (resp) {
            return resp.body
        });
    },
    post: function (opts) {
        return request.post(opts).then(function (resp) {
            return resp.body
        });
    },
    put: function (opts) {
        return request.put(opts).then(function (resp) {
            return resp.body
        });
    },
    head: function (opts) {
        return request.head(opts).then(function (resp) {
            return resp.body
        });
    }

};

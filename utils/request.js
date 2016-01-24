
var request = require('superagent-promise')(require('superagent'), require('promise'));

module.exports = request;

/*

var request = require('browser-request').defaults({json: true});

module.exports = {

    get: function (opts) {
        return new Promise(function (resolve, reject) {
            request.get(opts, function (err, resp, body) {
                if (err) {
                    reject(err);
                } else {
                    resolve(resp, body);
                }
            });
        });
    },
    post: function (opts) {
        return new Promise(function (resolve, reject) {
            request.post(opts, function (err, resp, body) {
                if (err) {
                    reject(err);
                } else {
                    resolve(resp, body);
                }
            });
        });
    },
    put: function (opts) {
        return new Promise(function (resolve, reject) {
            request.put(opts, function (err, resp, body) {
                if (err) {
                    reject(err);
                } else {
                    resolve(resp, body);
                }
            });
        });
    },
    head: function (opts) {
        return new Promise(function (resolve, reject) {
            request.head(opts, function (err, resp, body) {
                if (err) {
                    reject(err);
                } else {
                    resolve(resp, body);
                }
            });
        });
    }

};

*/

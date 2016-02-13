module.exports = Movie;

var _ = require('lodash');
var Promise = require('promise');
var movies = require('../refs/movies');
var clean = require('../utils/cleanobj');

function Movie(str1, str2) {

    var _this = this;

    var _poster;
    var _posters;
    var _details;

    this.id = '';
    this.year = '';
    this.title = '';
    this.imdbID = '';
    this.details = {};
    this.posters = [];
    this.poster = {};
    this.string = '';

    var idRegex = /^(.+) \((.+)\)$/;

    str1 = decodeURIComponent(str1) || '';

    // Check to see if this was instantiated with an ID
    // or with a title/year combination. If it's an ID,
    // then break it into the title/year.

    if (_testID(str1)) {

        var idObj = _breakID(str1);
        this.title = idObj.title;
        this.year = idObj.year;

    } else {

        this.title = str1 || '';
        this.year = str2 || '';

    }

    Object.defineProperties(this, {
        id: {
            get: function () {
                return _makeID(_this.title, _this.year);
            }
        },

        string: {
            get: function () {
                return _this.title + ' (' + _this.year + ')';
            }
        },

        ref: {
            get: function () {
                return movies.child(_this.id);
            }
        },

        details: {
            get: function() {
                return _details;
            },
            set: function(details) {
                _.assign(_details, details);
                _this.ref.child('details').set(clean(details));
            }
        },

        poster: {
            get: function() {
                return _poster;
            },
            set: function(poster) {
                _.assign(_poster, poster);
                _this.ref.child('poster').set(clean(poster));
            }
        },

        posters: {
            get: function() {
                return _posters;
            },
            set: function (posters) {
                posters = _.map(posters, function (poster) {
                    return clean(poster);
                });
                _.assign(_posters, posters);
                _this.ref.child('posters').set(posters);
            }
        }
    });

    /**
     *
     * @returns {Promise}
     */
    function _getData() {
        return new Promise(function (resolve, reject) {
            _this.ref.once('value', function (snap) {
                var data = snap.val();
                if (data) { resolve(data); }
                else { reject(); }
            });
        });
    }

    /**
     *
     * @returns {Promise}
     */
    this.getDetails = function() {
        return new Promise(function(resolve, reject) {
            _getData().then(function(data) {
                if (!_.isEmpty(data.details)) {
                    _details = data.details;
                    resolve(data.details);
                } else {
                    reject();
                }
            }).catch(reject);
        });
    };

    /**
     *
     * @returns {Promise}
     */
    this.getPosters = function() {
        return new Promise(function(resolve, reject) {
            _getData().then(function(data) {
                if (!_.isEmpty(data.posters)) {
                    _posters = data.posters;
                    if (data.poster) {
                        _poster = data.poster;
                    } else {
                        _poster = _this.poster = data.posters[0];
                    }
                    resolve(data.posters);
                } else {
                    reject();
                }
            }).catch(reject);
        });
    };

    /**
     *
     * @returns {Promise}
     */
    this.getPoster = function() {
        return new Promise(function(resolve, reject) {
            _getData().then(function(data) {
                if (!_.isEmpty(data.poster)) {
                    _poster = data.poster;
                    resolve(_poster);
                } else {
                    reject();
                }
            }).catch(reject);
        });
    };

    function _testID(str) {
        return Boolean(str.match(idRegex));
    }

    function _makeID(title, year) {
        return (_.deburr(title) + ' (' + year + ')').replace('\.', '');
    }

    function _breakID(id) {
        var parts = id.match(idRegex);
        return {
            title: parts[1] || '',
            year: parts[2] || ''
        };
    }
}


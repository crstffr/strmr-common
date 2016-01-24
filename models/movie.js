module.exports = Movie;

var _ = require('lodash');
var Promise = require('promise');
var movies = require('../refs/movies');

function Movie(str1, str2) {

    var _this = this;

    this.id = '';
    this.year = '';
    this.title = '';
    this.imdbID = '';
    this.details = {};
    this.posters = [];
    this.queryString = '';

    str1 = str1 || '';

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

        queryString: {
            get: function () {
                return _this.title + ' ' + _this.year;
            }
        },

        ref: {
            get: function () {
                return movies.child(_this.id);
            }
        },

        details: {
            set: function(details) {
                _this.ref.child('details').set(details);
            }
        },

        posters: {
            set: function(posters) {
                _this.ref.child('posters').set(posters);
            }
        }
    });

    /**
     *
     * @returns {Promise}
     */
    this.getStoredData = function () {
        return new Promise(function (resolve, reject) {
            _this.ref.once('value', function (snap) {
                var data = snap.val();
                if (data) { resolve(data); }
                else { reject(); }
            });
        });
    };

    /**
     *
     * @returns {Promise}
     */
    this.getDetails = function() {
        return new Promise(function(resolve, reject) {
            _this.getStoredData().then(function(data) {
                if (data.details) {
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
            _this.getStoredData().then(function(data) {
                if (data.posters) {
                    resolve(data.posters);
                } else {
                    reject();
                }
            }).catch(reject);
        });
    }

}



function _makeID(title, year) {

    return _.kebabCase(title + ' ' + year);

}


function _breakID(id) {

    var str = '';
    str = id.replace(/-/g, ' ');
    str = _.startCase(str);

    var year = str.substr(-4, 4);
    var title = str.slice(0, -5);

    return {
        title: title,
        year: year
    };

}

function _testID(str) {

    var hasWhites = Boolean((str.match(/ /g) || []).length > 0);
    var hasKebabs = Boolean((str.match(/-/g) || []).length > 0);
    var hasYear = Boolean((str.match(/\d+$/) || []).length > 0);

    return (!hasWhites && hasKebabs && hasYear);

}

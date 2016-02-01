var _ = require('lodash');

var zeropad = require('../utils/zeropad');
var cleankey = require('../utils/cleankey');
var queryString = require('query-string');
var parseTorrentName = require('parse-torrent-name');
var Movie = require('./movie');

/**
 *
 * @param {string} link
 */
module.exports = Magnet;

/**
 *
 * @param {String} link
 * @constructor
 */
function Magnet(link) {

    var _this = this;
    var _errors = [];
    var _params = {};
    var _data = {};
    var _movie = {};
    var _tvshow = {};

    this.url = '';
    this.errors = '';
    this.properties = {};

    this.isTV = false;
    this.isMovie = false;
    this.isValid = false;

    this.filename = '';
    this.filepath = '';
    this.firekey = '';

    this.tvshow = {};
    this.movie = {};

    try {

        _params = queryString.parse(link);
        _data = parseTorrentName(_params.dn || '');
        _data.title = _.startCase(_data.title);

    } catch (e) {
        _errors.push(e);
    }

    Object.defineProperties(this, {
        properties: {
            enumerable: true,
            get: function () {
                return _data;
            }
        },
        url: {
            enumerable: true,
            get: function() {
                return String(link);
            }
        },
        errors: {
            enumerable: false,
            get: function () {
                return _errors.join('; ');
            }
        },
        isValid: {
            enumerable: false,
            get: function () {
                return Boolean(_data.title);
            }
        },
        isTV: {
            enumerable: false,
            get: function () {
                return Boolean(_this.isValid && _data.season && _data.episode);
            }
        },
        isMovie: {
            enumerable: false,
            get: function () {
                return Boolean(_this.isValid && !_this.isTV);
            }
        },
        movie: {
            enumerable: false,
            get: function() {
                return (_this.isMovie) ? _movie : null;
            }
        },
        tvshow: {
            enumerable: false,
            get: function() {
                return (_this.isTV) ? _tvshow : null;
            }
        },
        filename: {
            enumerable: false,
            get: function () {
                return String((_this.isTV) ? _tvshowFilename() : _movieFilename());
            }
        },
        filepath: {
            enumerable: false,
            get: function () {
                return String((_this.isTV) ? _tvshowFolder() : _movieFolder());
            }
        },
        firekey: {
            enumerable: false,
            get: function() {
                return cleankey((_this.isTV) ? _tvshowFirekey() : _movieFirekey());
            }
        }
    });


    if (_this.isMovie) {
        _movie = new Movie(_data.title, _data.year);
    }

    if (_this.isTV) {
        _tvshow = {}; //new Movie(_data.title, _data.year);
    }


    function _tvshowFilename() {
        var s, e, r, file;
        s = zeropad(_data.season, 2);
        e = zeropad(_data.episode, 2);
        return _data.title + ' S' + s + 'E' + e;
    }

    function _tvshowFolder() {
        return 'tvshows/' + _data.title + '/Season ' + zeropad(_data.season, 2) + '/';
    }

    function _tvshowFirekey() {
        return 'tvshows/' + _tvshowFilename();
    }

    function _movieFilename() {
        return _data.title;
    }

    function _movieFolder() {
        return 'movies/' + _data.title + ' (' + _data.year + ')/';
    }

    function _movieFirekey() {
        return _movieFolder();
    }


};

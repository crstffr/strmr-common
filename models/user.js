var _ = require('lodash');
var Promise = require('promise');
var fbref = require('../refs/root');
var users = require('../refs/users');
var Magnet = require('./magnet');
var Movie = require('./movie');

module.exports = User;

function User(authData) {

    var _this = this;
    var _auth = authData;

    this.id = '';
    this.ref = {};
    this.auth = {};
    this.library = {};
    this.password = '';
    this.email = '';

    Object.defineProperties(this, {

        auth: {
            get: function () {
                return _auth;
            }
        },

        id: {
            get: function () {
                return _this.auth.uid;
            }
        },

        email: {
            get: function () {
                return _.get(_this, 'auth.creds.email');
            }
        },

        password: {
            get: function () {
                return _.get(_this, 'auth.creds.password');
            }
        },

        ref: {
            get: function () {
                return users.child(_this.auth.uid);
            }
        },

        library: {
            get: function () {
                return _this.ref.child('movies');
            }
        }

    });

    this.logout = function() {
        fbref.unauth();
    };

    this.setAuthId = function(authid) {
        this.ref.child('authid').set(authid);
    };

    this.getAuthId = function() {
        return this.ref.child('authid').once('value').then(function(snap){
            return snap.val() || Promise.reject('User has no authid');
        });
    };

    this.getStrmById = function (movieid) {
        return new Promise(function (resolve, reject) {
            _this.library.child(movieid).once('value', function (snap) {
                var data = snap.val();
                if (data) {
                    resolve(data);
                } else {
                    reject();
                }
            });
        });
    };

    this.getMovies = function () {
        return new Promise(function (resolve, reject) {
            _this.library.once('value', function (snap) {
                var movies = [];
                _.forEach(snap.val(), function (data) {
                    movies.push(_newMovieFromUserData(data));
                });
                resolve(movies);
            });
        });
    };

    this.getMovie = function (movieid) {
        movieid = decodeURIComponent(movieid);
        return new Promise(function (resolve, reject) {
            _this.library.child(movieid).once('value', function (snap) {
                var data = snap.val();
                if (data) {
                    resolve(_newMovieFromUserData(data));
                } else {
                    reject('could not find movie in library');
                }
            });
        });
    };

    function _newMovieFromUserData(data) {
        var title = data.properties.title;
        var year = data.properties.year;
        var movie = new Movie(title, year);
        movie.magnet = new Magnet(data.url);
        movie.getDetails();
        movie.getPosters();
        return movie;
    }

}

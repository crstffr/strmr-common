var _ = require('lodash');
var Promise = require('promise');
var users = require('../refs/users');
var Movie = require('./movie');

module.exports = User;

function User(authData) {

    var _this = this;
    var _data = authData;

    Object.defineProperties(this, {

        auth: {
            get: function () {
                return _data;
            }
        },

        id: {
            get: function () {
                return _this.auth.uid;
            }
        },

        email: {
            get: function () {
                return _this.auth.creds.email
            }
        },

        password: {
            get: function () {
                return _this.auth.creds.password;
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

    this.getMovie = function (movieId) {
        return new Promise(function (resolve, reject) {
            _this.library.child(movieId).once('value', function (snap) {
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
        movie.magnet = data.url;
        return movie;
    }

}

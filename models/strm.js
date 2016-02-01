
var cleankey = require('../utils/cleankey');

module.exports = Strm;

/**
 *
 * @param {Magnet} magnet
 * @param {User} user
 * @constructor
 */
function Strm(magnet, user) {

    var _this = this;

    Object.defineProperties(this, {

        ref: {
            get: function() {
                return (magnet.isMovie) ? _movieRef() : _tvShowRef();
            }
        },

        magnet: {
            get: function() {
                return magnet;
            }
        },

        contents: {
            get: function() {
                return new Promise(function(resolve) {
                    _this.ref.on('value', function(snapshot) {
                        resolve(snapshot.val());
                    });
                });
            },
            set: function(val) {
                if (!val) { return; }
                _this.ref.set(val);
            }
        }

    });

    _this.contents = magnet;

    function _movieRef() {
        return user.ref.child('movies').child(magnet.movie.id);
    }

    function _tvShowRef() {
        return user.ref.child('tvshows').child(magnet.movie.id);
    }

}

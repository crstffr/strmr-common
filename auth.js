var rpg = require('rpg');// random pass generator
var Promise = require('promise');
var fbref = require('./refs/root');
var authRef = require('./refs/auth');
var User = require('./models/user');


module.exports = new Auth();

function Auth() {

    var _this = this;
    var _user;


    var _valid = new Promise(function(resolve){
        fbref.onAuth(function (authData) {
            _user = (_isValid(authData)) ? new User(authData) : null;
            if (_user) { resolve(_user); }
        });
    });

    /**
     *
     * @returns {Promise}
     */
    this.whenValid = function() {
        return _valid;
    };

    /**
     *
     */
    this.logout = function () {
        fbref.unauth();
    };

    /**
     *
     * @param authData
     * @returns {Boolean}
     */
    this.isValid = _isValid;

    function _isValid(authData) {
        return Boolean(authData && authData.provider === 'password');
    }





    /**
     * Trigger handler only when auth has been established.
     *
     * @param {Function} fn
     * @returns {*}
     */
    this.onAuth = function (fn) {
        return fbref.onAuth(function (authData) {
            if (_isValid(authData)) {
                _getCredentials(_user).then(function (creds) {
                    _user.auth.creds = creds;
                    fn(_user);
                });
            }
        });
    };

    /**
     * Trigger handler only when auth has been lost.
     *
     * @param {Function} fn
     */
    this.onUnAuth = function (fn) {
        return fbref.onAuth(function (authData) {
            if (!_isValid(authData)) {
                fn();
            }
        });
    };

    /**
     *
     * @param uid
     * @returns {Promise}
     */
    this.getData = function (uid) {
        return authRef.child(uid).once('value');
    };

    /**
     *
     * @param id
     * @param email
     * @param password
     * @returns {Promise}
     */
    this.withPassword = function (id, email, password) {
        return new Promise(function (resolve, reject) {
            var creds = {email: email, password: password};
            fbref.authWithPassword(creds, function (err, authData) {
                if (err) {
                    reject(err);
                } else if (authData.uid !== id) {
                    reject('id does not match user');
                } else {
                    _user = new User(authData);
                    resolve(_user);
                }
            });
        });
    };

    /**
     *
     * @returns {Promise}
     */
    this.withGithub = function () {
        return new Promise(function (resolve, reject) {
            fbref.authWithOAuthPopup('github', function (err, authData) {
                if (err) {
                    reject(err);
                } else {
                    _getUserPass(authData).then(function (userPass) {

                        var uid = userPass.uid;
                        var user = userPass.email;
                        var pass = userPass.password;

                        _this.withPassword(uid, user, pass).then(function (user) {
                            resolve(user);
                        }).catch(function (err) {
                            reject(err);
                        });

                    }).catch(function (err) {
                        reject(err);
                    });
                }
            });
        });
    };

    /**
     *
     * @param {User} user
     * @returns {Promise}
     * @private
     */
    function _getCredentials(user) {
        return new Promise(function (resolve, reject) {

            if (!_isValid(user.auth)) { reject('authData is invalid'); }

            user.getAuthId().then(function (authid) {
                authRef.child(authid).once('value').then(function (snap) {
                    resolve(snap.val());
                }).catch(function (err) {
                    console.error(err);
                    _this.logout();
                });
            }).catch(function (err) {
                console.error(err);
                _this.logout();
            });
        });
    }

    /**
     *
     * @param {Object} authData
     * @returns {Promise}
     * @private
     */
    function _getUserPass(authData) {
        var userRef = authRef.child(authData.uid);
        return new Promise(function (resolve, reject) {
            userRef.once('value', function (snap) {
                if (snap.hasChild('email') && snap.hasChild('password')) {
                    var userPassData = snap.val();
                    resolve(userPassData);
                } else {
                    _convertToUserPass(authData).then(function (userPassData) {
                        resolve(userPassData);
                    }).catch(function (err) {
                        reject(err)
                    });
                }
            });
        });
    }

    /**
     *
     * @param authData
     * @returns {Promise}
     * @private
     */
    function _convertToUserPass(authData) {
        var authUserRef = authRef.child(authData.uid);
        return new Promise(function (resolve, reject) {
            var settings = {
                email: _.kebabCase(authData.uid) + '@strmr.space',
                password: rpg({length: 24, set: 'lud'})
            };
            fbref.createUser(settings, function (err, newUser) {
                if (err) {
                    reject(err);
                } else {

                    settings.uid = newUser.uid;
                    authUserRef.set(settings);

                    _this.whenValid().then(function(user){
                        user.setAuthId(authData.uid);
                    });

                    resolve(settings);
                }
            });
        });
    }

}



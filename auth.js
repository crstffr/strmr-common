var rpg = require('rpg');// random pass generator
var Promise = require('promise');
var fbref = require('./refs/root');
var authRef = require('./refs/auth');
var User = require('./models/user');


module.exports = new Auth();

function Auth() {

    var _auth = this;
    var _user;

    /**
     *
     */
    fbref.onAuth(function (authData) {
        _user = (isValid(authData)) ? new User(authData) : null;
    });

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
    this.isValid = isValid;

    function isValid(authData) {
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
            if (_auth.isValid(authData)) {
                _getCredentials(_user, authData).then(function (creds) {
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
            if (!_auth.isValid(authData)) {
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

                        _auth.withPassword(uid, user, pass).then(function (user) {
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
     * @param {Object} authData
     * @returns {Promise}
     * @private
     */
    function _getCredentials(user, authData) {
        return new Promise(function (resolve, reject) {

            if (!isValid(authData)) { reject('authData is invalid'); }

            user.getAuthId().then(function (authid) {
                authRef.child(authid).once('value').then(function (snap) {
                    resolve(snap.val());
                }).catch(function (err) {
                    console.error(err);
                    _auth.logout();
                });
            }).catch(function (err) {
                console.error(err);
                _auth.logout();
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
        var userRef = authRef.child(authData.uid);
        return new Promise(function (resolve, reject) {
            var settings = {
                email: _.kebabCase(authData.uid) + '@strmr.space',
                password: rpg({length: 60, set: 'lud'})
            };
            fbref.createUser(settings, function (err, newUser) {
                if (err) {
                    reject(err);
                } else {

                    settings.uid = newUser.uid;
                    userRef.set(settings);

                    _auth.onAuth(function (user) {
                        user.ref.child('authid').set(authData.uid);
                    });

                    resolve(settings);
                }
            });
        });
    }

}



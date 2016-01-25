
var rpg = require('rpg');
var Promise = require('promise');
var fbref = require('./refs/root');
var User = require('./models/user');

var _user;
var _userRef;
var _authRef = fbref.child('auth');

module.exports = {
    onChange: _onChange,
    withGithub: _authWithGithub,
    withPassword: _authWithPassword
};

fbref.onAuth(function(authData) {
    _user = (authData) ? new User(authData) : null;
});

function _onChange(fn) {
    fbref.onAuth(function(authData) {
        if (authData && authData.provider === 'password') {
            fn(_user);
        } else {
            fn(null);
        }
    });
}

function _authWithPassword(id, email, password) {
    return new Promise(function(resolve, reject) {
        var creds = {email: email, password: password};
        fbref.authWithPassword(creds, function(err, authData) {
            if (err) {
                reject(err);
            } else if (authData.uid !== id) {
                reject('id does not match user');
            } else {
                authData.creds = creds;
                var user = new User(authData);
                _user = user;
                resolve(user);
            }
        });
    });
}

function _authWithGithub() {
    return new Promise(function(resolve, reject) {
        fbref.authWithOAuthPopup('github', function (err, authData) {
            if (err) {
                reject(err);
            } else {
                _userRef = _authRef.child(authData.uid);
                _getUserPass(authData).then(function(userPass){
                    _authWithPassword(userPass.uid, userPass.email, userPass.password).then(function(user){
                        resolve(user);
                    }).catch(function(err){
                        reject(err);
                    });
                }).catch(function(err) {
                    reject(err);
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
function _getUserPass(authData) {

    return new Promise(function(resolve, reject) {

        _userRef.once('value', function(snap) {

           if (snap.hasChild('email') && snap.hasChild('password')) {

               var userPassData = snap.val();
               resolve(userPassData);

           } else {

                _convertToUserPass(authData).then(function(userPassData){

                    resolve(userPassData);

                }).catch(function(err) {

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

    return new Promise(function (resolve, reject) {

        console.log('converting to user pass', authData);

        var settings = {
            email: _.kebabCase(authData.uid) + '@strmr.space',
            password: rpg({length: 60, set: 'lud'})
        };

        fbref.createUser(settings, function (err, newUser) {

            if (err) {

                reject(err);

            } else {

                settings.uid = newUser.uid;
                _userRef.set(settings);
                resolve(settings);
            }
        });

    });
}

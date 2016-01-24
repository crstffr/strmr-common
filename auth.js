
var Promise = require('promise');
var fbref = require('./refs/root');
var User = require('./models/user');

module.exports = {
    withGithub: _authWithGithub,
    withPassword: _authWithPassword
};

function _authWithPassword(id, email, password) {
    return new Promise(function(resolve, reject){

        var creds = {email: email, password: password};

        fbref.authWithPassword(creds, function(err, authData) {
            if (err) {
                reject(err);
            } else if (authData.uid !== id) {
                reject('id does not match user');
            } else {
                authData.creds = creds;
                resolve(new User(authData));
            }
        });
    });
}

function _authWithGithub() {
    return new Promise(function(resolve, reject){
        fbref.authWithOAuthPopup('github', function (error, authData) {
            if (err) {
                reject(err);
            } else {
                resolve(new User(authData));
            }
        });
    });
}

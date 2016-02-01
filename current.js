
var User = require('./models/user');

module.exports = new Current();

function Current() {

    var _user;

    this.magnet = '';
    this.$state = {};
    this.$rootScope = {};

    Object.defineProperties(this, {
        user: {
            get: function(){
                return _user;
            },
            set: function(val){
                if (val instanceof User || val === null) {
                    _user = val;
                }
            }
        }
    });
}

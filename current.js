
var User = require('./models/user');

module.exports = new Current();

function Current() {

    var _user;

    this.magnet = '';
    this.$state = {};
    this.$rootScope = {};

    Object.defineProperties(this, {
        title: {
            get: function() {
                return (window) ? window.document.title : '';
            },
            set: function(title) {
                if (window) {
                    window.document.title = 'Strmr' + ((title) ? ': ' + title : '');
                }
            }
        },
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

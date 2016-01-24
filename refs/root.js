var Firebase = require('firebase');
var settings = require('../settings');

module.exports = new Firebase(settings.urls.firebase);


var request = require('../request');
var format = require('string-format');

var urls = {
    details: 'https://clmx10y474.execute-api.us-east-1.amazonaws.com/development/movie/{id}/details',
    posters: 'https://clmx10y474.execute-api.us-east-1.amazonaws.com/development/movie/{id}/posters'
};

module.exports = {

    url: {
        details: urls.details,
        posters: urls.posters
    },

    getDetails: _getDetails,
    getPosters: _getPosters

};


function _getDetails(id) {

    var url = format(urls.details, {id: id});
    return request.get(url);

}

function _getPosters(id) {

    var url = format(urls.posters, {id: id});
    return request.get(url);

}

var _ = require('lodash');
var format = require('string-format');

module.exports = function(options, path, strms, user) {

    var settings = _.defaults(options, {
        title: 'strmr',
        header: '',
        body: ''
    });

    var out = '<html>' +
              '<head><title>{title}</title></head>' +
              '<body>' +
                  '<h1>{header}</h1>' +
                  '{body}' +
              '</body>' +
              '</html>';

    return {
        html: format(out, settings)
    };

};

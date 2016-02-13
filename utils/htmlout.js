var _ = require('lodash');
var format = require('string-format');

module.exports = function(options, path, strms, user) {

    var settings = _.defaults(options, {
        title: 'strmr',
        header: '',
        body: ''
    });

    var out = '<html>\n' +
              '<head><title>{title}</title></head>\n' +
              '<body bgcolor="white">\n' +
                  '<h1>{header}</h1>' +
                  '{body}' +
              '</body>\n' +
              '</html>';

    return {
        html: format(out, settings)
    };

};

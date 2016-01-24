
module.exports = CleanKey;

function CleanKey(str) {
    return str.replace(/[\.\#\$\[\]]/g, ' ');
}

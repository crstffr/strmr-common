
module.exports = CleanObj;
/**
 * Removes data from object that is not safe to store in Firebase.
 * Keys with . # $ / [ ] will throw Firebase errors.
 *
 * @param obj
 * @returns {Object}
 * @constructor
 */
function CleanObj(obj) {
    return _.pickBy(obj, function(val, key){
        var matches = key.match(/\.|#|\$|\/|\[|]/g);
        return !matches;
    });
}

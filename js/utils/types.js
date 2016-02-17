/**
 * Copyright 2016 Krisztián Nagy
 * @file Provides type checknig functionality for basic types
 * @author Krisztián Nagy [nkrisztian89@gmail.com]
 * @licence GNU GPLv3 <http://www.gnu.org/licenses/>
 * @version 1.0
 */

/*jslint nomen: true, white: true, plusplus: true */
/*global define */

/**
 * @param utils Used for enum functionality
 * @param application Used for displaying error messages
 */
define([
    "utils/utils",
    "modules/application"
], function (utils, application) {
    "use strict";
    var exports = {};
    /**
     * @typedef {Function} Types~BooleanCallback
     * @param {Boolean} safeValue
     * @returns {Boolean}
     */
    /**
     * Returns a type-safe boolean value. If the given original value is invalid, will show an error message and return the given default 
     * value.
     * @param {String} name The name of the variable you are trying to acquire a value for (to show in error messages)
     * @param {} value The original value to be checked
     * @param {Boolean} [defaultValue] If the original value is invalid, this value will be returned instead.
     * @param {Types~BooleanCallback} [checkFunction] If the type of the value is correct and this function is give, it will be called with the 
     * value passed to it to perform any additional checks to confirm the validity of the value. It should return whether the value is 
     * valid.
     * @param {String} [checkFailMessage] An explanatory error message to show it the value is invalid because it fails the check.
     * @returns {Boolean}
     */
    exports.getBooleanValue = function (name, value, defaultValue, checkFunction, checkFailMessage) {
        if (typeof value === "boolean") {
            if (checkFunction) {
                if (!checkFunction(value)) {
                    application.showError("Invalid value for '" + name + "'" + (checkFailMessage ? (": " + checkFailMessage) : ".") + " Using default value " + defaultValue + " instead.");
                    return defaultValue;
                }
            }
            return value;
        }
        application.showError("Invalid value for '" + name + "'. Expected boolean, got " + (typeof value) + " (" + value + "). Using default value " + defaultValue + " instead.");
        return defaultValue;
    };
    /**
     * @typedef {Function} Types~NumberCallback
     * @param {Number} safeValue
     * @returns {Boolean}
     */
    /**
     * Returns a type-safe number value. If the given original value is invalid, will show an error message and return the given default 
     * value.
     * @param {String} name The name of the variable you are trying to acquire a value for (to show in error messages)
     * @param {} value The original value to be checked
     * @param {Number} [defaultValue] If the original value is invalid, this value will be returned instead.
     * @param {Types~NumberCallback} [checkFunction] If the type of the value is correct and this function is give, it will be called with the 
     * value passed to it to perform any additional checks to confirm the validity of the value. It should return whether the value is 
     * valid.
     * @param {String} [checkFailMessage] An explanatory error message to show it the value is invalid because it fails the check.
     * @returns {Boolean}
     */
    exports.getNumberValue = function (name, value, defaultValue, checkFunction, checkFailMessage) {
        if (typeof value === "number") {
            if (checkFunction) {
                if (!checkFunction(value)) {
                    application.showError("Invalid value for '" + name + "'" + (checkFailMessage ? (": " + checkFailMessage) : ".") + " Using default value " + defaultValue + " instead.");
                    return defaultValue;
                }
            }
            return value;
        }
        application.showError("Invalid value for '" + name + "'. Expected number, got " + (typeof value) + " (" + value + "). Using default value " + defaultValue + " instead.");
        return defaultValue;
    };
    /**
     * Returns a type-safe number value falling into a specific range. If the given original value is of invalid type, will show an error 
     * message and return the given default value, if it falls outside of the range, it will be increased / decreased to fit in (along with
     * showing an error message)
     * @param {String} name The name of the variable you are trying to acquire a value for (to show in error messages)
     * @param {} value The original value to be checked
     * @param {Number} [minValue] The minimum value for the range. If not given, check will be only done for the maximum value
     * @param {Number} [maxValue] The maximum value for the range. If not given, check will be only done for the minimum value
     * @param {Number} [defaultValue] If the original value is invalid, this value will be returned instead.
     * @param {Types~NumberCallback} [checkFunction] If the type of the value is correct and this function is give, it will be called with the 
     * value passed to it to perform any additional checks to confirm the validity of the value. It should return whether the value is 
     * valid.
     * @param {String} [checkFailMessage] An explanatory error message to show it the value is invalid because it fails the check.
     * @returns {Boolean}
     */
    exports.getNumberValueInRange = function (name, value, minValue, maxValue, defaultValue, checkFunction, checkFailMessage) {
        if (typeof value === "number") {
            if (((minValue !== undefined) && (value < minValue)) || ((maxValue !== undefined) && (value > maxValue))) {
                application.showError("Invalid value for " + name + ": out of range (" + ((minValue !== undefined) ? minValue : "...") + "-" + ((maxValue !== undefined) ? maxValue : "...") + "). The setting will be changed to fit the valid range.");
                if (minValue !== undefined) {
                    value = Math.max(minValue, value);
                }
                if (maxValue !== undefined) {
                    value = Math.min(value, maxValue);
                }
            }
            if (checkFunction) {
                if (!checkFunction(value)) {
                    application.showError("Invalid value for '" + name + "'" + (checkFailMessage ? (": " + checkFailMessage) : ".") + " Using default value " + defaultValue + " instead.");
                    return defaultValue;
                }
            }
            return value;
        }
        application.showError("Invalid value for '" + name + "'. Expected number, got " + (typeof value) + " (" + value + "). Using default value " + defaultValue + " instead.");
        return defaultValue;
    };
    /**
     * @typedef {Function} Types~StringCallback
     * @param {String} safeValue
     * @returns {Boolean}
     */
    /**
     * Returns a type-safe string value. If the given original value is invalid, will show an error message and return the given default 
     * value.
     * @param {String} name The name of the variable you are trying to acquire a value for (to show in error messages)
     * @param {} value The original value to be checked
     * @param {String} [defaultValue] If the original value is invalid, this value will be returned instead.
     * @param {Types~StringCallback} [checkFunction] If the type of the value is correct and this function is give, it will be called with the 
     * value passed to it to perform any additional checks to confirm the validity of the value. It should return whether the value is 
     * valid.
     * @param {String} [checkFailMessage] An explanatory error message to show it the value is invalid because it fails the check.
     * @returns {Boolean}
     */
    exports.getStringValue = function (name, value, defaultValue, checkFunction, checkFailMessage) {
        if (typeof value === "string") {
            if (checkFunction) {
                if (!checkFunction(value)) {
                    application.showError("Invalid value for '" + name + "'" + (checkFailMessage ? (": " + checkFailMessage) : ".") + " Using default value " + defaultValue + " instead.");
                    return defaultValue;
                }
            }
            return value;
        }
        application.showError("Invalid value for '" + name + "'. Expected string, got " + (typeof value) + " (" + value + "). Using default value " + defaultValue + " instead.");
        return defaultValue;
    };
    /**
     * If the given value is one of the possible enumeration values defined in the given enumeration object, it returns it, otherwise shows
     * a warning message about it to the user and returns the given default.
     * @param {String} name The name of the variable you are trying to acquire a value for (to show in error messages)
     * @param {Object} enumObject the object containing the valid enumeration values.
     * @param {} value The original value to be checked
     * @param {Number} [defaultValue] If the original value is invalid, this value will be returned instead.
     * @param {Types~NumberCallback} [checkFunction] If the type of the value is correct and this function is give, it will be called with the 
     * value passed to it to perform any additional checks to confirm the validity of the value. It should return whether the value is 
     * valid.
     * @param {String} [checkFailMessage] An explanatory error message to show it the value is invalid because it fails the check.
     */
    exports.getEnumValue = function (name, enumObject, value, defaultValue, checkFunction, checkFailMessage) {
        value = utils.getSafeEnumValue(enumObject, value);
        if (value !== null) {
            if (checkFunction) {
                if (!checkFunction(value)) {
                    application.showError("Invalid value for '" + name + "'" + (checkFailMessage ? (": " + checkFailMessage) : ".") + " Using default value " + defaultValue + " instead.");
                    return defaultValue;
                }
            }
            return value;
        }
        application.showError("Unrecognized '" + name + "' value: '" + value + "'. Possible values are are: " + utils.getEnumValues(enumObject).join(", ") + " Default value '" + defaultValue + "' will be used instead.");
        return defaultValue;
    };
    /**
     * Returns an array that contains those elements if the original array that are valid members of the given enumeration object, or if
     * there are no such elements, returns a new array consisting of the default array's elements. If an element is omitted or the array
     * is replaced with the default one, shows a warning message to the user.
     * @param {String} name The name of the variable you are trying to acquire a value for (to show in error messages)
     * @param {Object} enumObject the object containing the valid enumeration values.
     * @param {Array} valueArray
     * @param {Array} defaultValueArray
     * @returns {Array}
     */
    exports.getEnumValueArray = function (name, enumObject, valueArray, defaultValueArray) {
        var i, result = [], safeValue;
        for (i = 0; i < valueArray.length; i++) {
            safeValue = utils.getSafeEnumValue(enumObject, valueArray[i]);
            if (safeValue) {
                result.push(safeValue);
            } else {
                application.showError(
                        "Unrecognized " + name + " value: '" + valueArray[i] + "' in array. This value will be left out of the array.",
                        "minor",
                        "Possible values are are: " + utils.getEnumValues(enumObject).join(", ") + ".");
            }
        }
        if ((valueArray.length > 0) && result.length === 0) {
            application.showError("All " + name + " values in the array were unrecognized. The default array ([" + defaultValueArray.join(", ") + "]) will be used instead.");
            for (i = 0; i < defaultValueArray.length; i++) {
                result.push(defaultValueArray[i]);
            }
        }
        return result;
    };
    return exports;
});
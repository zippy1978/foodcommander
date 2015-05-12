'use strict';
var sprintf = require('sprintf-js').sprintf;

/**
 * Parse a cookie header table into an object.
 * Where key is the cookie name, and value is the cookie value.
 */
var parseCookies = function(cookieHeaders) {

    var result = {};

    cookieHeaders.forEach(function(item) {
        var keyAndValue = item.split(';')[0].split('=');
        result[keyAndValue[0]] = keyAndValue[1];
    });

    return result;

};

/** 
 * Serialize a cookie object (as built by parseCookies function),
 * to a HTTP header Cookie compliant string
 */
var getCookiesAsHeaderString = function(cookies) {
    
    var resultPairs = [];
    for (var key in cookies) {
        resultPairs.push(sprintf('%s=%s', key, cookies[key]));
    }
    
    return resultPairs.join('; ');
};

module.exports = {
    parseCookies: parseCookies,
    getCookiesAsHeaderString: getCookiesAsHeaderString
};
'use strict';
var moment = require('moment');

/**
 * Round to next five minutes.
 * Example : 23:17 will be rounded to 23:20
 */
var roundToNextFiveMinutes = function(date) {
    
    var minutes = date.getHours() * 60 + date.getMinutes();
    var roundedMinutes = Math.ceil((minutes)/5)*5;
    var minutesToAdd = roundedMinutes - minutes;
    
    return moment(date).add(minutesToAdd, 'minutes').toDate();
};

module.exports = {
    roundToNextFiveMinutes: roundToNextFiveMinutes
};
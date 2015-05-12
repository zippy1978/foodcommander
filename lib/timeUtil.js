'use strict';
var moment = require('moment');

/**
 * Round to next ten minutes.
 * Example : 23:17 will be rounded to 23:20
 */
var roundToNextTenMinutes = function(date) {
    
    var minutes = date.getHours() * 60 + date.getMinutes();
    var roundedMinutes = Math.floor((minutes+5)/10)*10;
    var minutesToAdd = roundedMinutes - minutes;
    
    return moment(date).add(minutesToAdd, 'minutes').toDate();
};

module.exports = {
    roundToNextTenMinutes: roundToNextTenMinutes
};
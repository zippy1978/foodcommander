'use strict';
var assert = require('assert');
var moment = require('moment');
var timeUtil = require('../lib/timeUtil.js');

describe('timeUtil module', function () {

    it('round to next ten minutes', function () {
        
        var date = moment('2008-10-24 18:17:00').toDate();
        
        var roundedDate = timeUtil.roundToNextTenMinutes(date);
        
        assert.equal(20, roundedDate.getMinutes());
    });
    
    it('round to next ten minutes when changing hour', function () {
        
        var date = moment('2008-10-24 18:56:00').toDate();
        
        var roundedDate = timeUtil.roundToNextTenMinutes(date);
        
        
        assert.equal(0, roundedDate.getMinutes());
        assert.equal(19, roundedDate.getHours());
    });

});
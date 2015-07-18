'use strict';
var assert = require('assert');
var moment = require('moment');
var timeUtil = require('../lib/timeUtil.js');

describe('timeUtil module', function () {

    it('round to next five minutes #1', function () {
        
        var date = moment('2008-10-24 18:17:00').toDate();
        
        var roundedDate = timeUtil.roundToNextFiveMinutes(date);
        
        assert.equal(20, roundedDate.getMinutes());
        assert.equal(18, roundedDate.getHours());
    });
    
    it('round to next five minutes #2', function () {
        
        var date = moment('2015-07-18 21:03:25').toDate();
        
        var roundedDate = timeUtil.roundToNextFiveMinutes(date);
        
        
        assert.equal(5, roundedDate.getMinutes());
        assert.equal(21, roundedDate.getHours());
    });
    
    it('round to next five minutes when changing hour', function () {
        
        var date = moment('2008-10-24 18:56:00').toDate();
        
        var roundedDate = timeUtil.roundToNextFiveMinutes(date);
        
        assert.equal(0, roundedDate.getMinutes());
        assert.equal(19, roundedDate.getHours());
    });

});
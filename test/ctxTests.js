'use strict';
var assert = require('assert');
var ctx = require('../lib/ctx.js');

describe('ctx (context) module', function () {

    it('cannot validate without franchise', function (done) {
        var ct = new ctx.Context();
        ctx.validate(ct).then(function(valid) {
            assert.equal(false, valid);
            done();
        });
    });
    
    it('can validate with franchise', function (done) {
        var ct = new ctx.Context();
        ct.franchiseId = 'dominos';
        ctx.validate(ct).then(function(valid) {
            assert.equal(true, valid);
            done();
        });
    });

});
'use strict';
var assert = require('assert');
var franchise = require('../lib/franchise.js');

describe('franchise module', function () {

    it('list franchises', function (done) {
        franchise.list().then(function(result) {
            assert(result.length > 0);               
            done();
        });

    });
    
    it('find matching franchise by id', function (done) {
        franchise.findById('dominos_fr').then(function(result) {
            assert.equal('dominos_fr', result.id);               
            done();
        });

    });

    it('franchise by id return null if no match', function (done) {
        franchise.findById('fake').then(function(result) {
            assert.equal(null, result);               
            done();
        });

    });

});
'use strict';
var assert = require('assert');
var cli = require('../lib/cli.js');

describe('cli module', function () {

    it('must format error', function (done) {
        cli.formatErrorMessage(new Error('message')).then(function(result) {
            assert.equal('Error[Error] message', result);
            done();
        });
    });

    it('must build context from args', function (done) {
        var args = {
            postalcode: '34000',
            firstname: 'Homer',
            lastname: 'Simpson',
            street: 'Jump street',
            city: 'Springfield'

        };

        cli.buildContextFromArgs(args).then(function(ctx) {
            assert.equal(args.postalcode, ctx.postalCode);
            assert.equal(args.firstname, ctx.address.firstName);
            assert.equal(args.lastname, ctx.address.lastName);
            assert.equal(args.street, ctx.address.streetName);
            assert.equal(args.city, ctx.address.city);
            assert.equal(args.postalcode, ctx.address.postalCode);
            done();
        });
    });
    
    it('can parse dishes arg', function (done) {
         
        var dishesArg = 'REF1[size=large],REF2[size=medium|pan=thin]*2,REF3';
        
        cli.buildOrderFromDishesArg(dishesArg).then(function(order) {
            assert.equal(3, order.lines.length);
            assert.equal(1, order.lines[0].quantity);
            assert.equal(2, order.lines[1].quantity);
            assert.equal('large', order.lines[0].variant.options.size);
            assert.equal('thin', order.lines[1].variant.options.pan);
            assert.equal('REF2', order.lines[1].dish.id);
            done();
        });
    });

});
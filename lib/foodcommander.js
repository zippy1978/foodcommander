'use strict';
var sprintf = require('sprintf-js').sprintf;
var Q = require("q");

var model = require('./model.js')

var getDefaultFranchiseId = function() {
    var deferred = Q.defer();
    process.nextTick(function() {
        // TODO : add locale specific logic here... One day...
        deferred.resolve('dominos_fr');
    });
    return deferred.promise;
};

var getCurrency = function(storeId) {
    return Q.fcall(function() {
        return model.CurrencyType.EURO;
    });
};

module.exports = {
    cli: require('./cli.js'),
    franchise: require('./franchise.js'),
    context: require('./ctx.js'),
    getDefaultFranchiseId: getDefaultFranchiseId,
    getCurrency: getCurrency
};

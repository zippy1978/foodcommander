'use strict';
var sprintf = require('sprintf-js').sprintf;
var Q = require("q");

var model = require('./model.js');
var moduleUtil = require('./moduleUtil.js');

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

var getOrderModuleForFranchiseId = function(franchiseId) {
    
    return moduleUtil.getModuleForFranchiseId('order', franchiseId);
};

var getMenuModuleForFranchiseId = function(franchiseId) {
    
    return moduleUtil.getModuleForFranchiseId('menu', franchiseId);
};

var getStoreModuleForFranchiseId = function(franchiseId) {
    
    return moduleUtil.getModuleForFranchiseId('store', franchiseId);
};

module.exports = {
    cli: require('./cli.js'),
    franchise: require('./franchise.js'),
    context: require('./ctx.js'),
    model:model,
    getDefaultFranchiseId: getDefaultFranchiseId,
    getCurrency: getCurrency,
    getOrderModuleForFranchiseId: getOrderModuleForFranchiseId,
    getMenuModuleForFranchiseId: getMenuModuleForFranchiseId,
    getStoreModuleForFranchiseId: getStoreModuleForFranchiseId
};

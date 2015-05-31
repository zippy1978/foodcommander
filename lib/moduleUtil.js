'use strict';
var sprintf = require('sprintf-js').sprintf;
var Q = require("q");

var getModuleForFranchiseId = function(module, franchiseId) {
    var deferred = Q.defer();
    process.nextTick(function() {
        deferred.resolve(require(sprintf( __dirname + '/franchises/%s/%s.js', franchiseId, module)));
    });
    return deferred.promise;
};

module.exports = {
    getModuleForFranchiseId: getModuleForFranchiseId
};

'use strict';
var Q = require("q");

var Context = function Context(){
    return {
        franchiseId: null,
        postalCode: null,
        address: null,
        storeId: null
    };        
};

var validate = function(context) {
    
    var deferred = Q.defer();
    process.nextTick(function() {
        deferred.resolve(context.franchiseId != null);
    });
    return deferred.promise;
};

module.exports = {
    Context: Context,
    validate: validate
};
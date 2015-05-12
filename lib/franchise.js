'use strict';
var Q = require("q");

var model = require('./model.js');

var list = function() {
    
    var deferred = Q.defer();
    process.nextTick(function() {

        var dominosFr = new model.Franchise();
        dominosFr.id = 'dominos_fr';
        dominosFr.name = 'Domino\'s Pizza France'; 
       
        deferred.resolve([dominosFr]);
    });
    return deferred.promise;
};

var findById = function(franchiseId) {
    
    var deferred = Q.defer();
    process.nextTick(function() {
        list().then(function(franchises) {
            var found = null;
            var filtered = franchises.filter(function(element) {
                return (element.id === franchiseId);
            });
            found = filtered.length > 0 ? filtered[0] : null;
            deferred.resolve(found);
        });
    });
    return deferred.promise;
};


module.exports = {
    list: list,
    findById: findById
};
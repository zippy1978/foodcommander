'use strict';
var request = require('request');
var Q = require("q");
var sprintf = require('sprintf-js').sprintf;
var cheerio = require('cheerio');

var model = require('../../model.js');
var config = require('./config.js');
var textUtil = require('../../textUtil.js');

var searchByPostalCode = function(postalCode) {

    var deferred = Q.defer();

    var requestOptions = {
        url: sprintf(config.searchUri, postalCode),
        headers: {
            'Accept': 'text/html',
            'User-Agent': config.userAgent
        }
    };

    request(requestOptions, function(error, response, body) {

        if (!error) {

            // Make shure parsing is async
            process.nextTick(function() {

                if (response.statusCode === 200) {

                    var stores = [];

                    // Parse content
                    var $ = cheerio.load(response.body);
                    var $storeRootElem = $('#magasins').next().next();
                    $storeRootElem.find('h2').parent().each(function(i, element) {

                        var store = new model.Store();
                        var $this = $(this);
                        store.name = $this.children('h2').text().normalize(); 
                        store.address = $this.children('p').text().trim().removeLastLine().normalize();
                        store.phone = $this.children('p').text().trim().lastLine().normalize();
                        store.id = $this.find('.menuLink a').attr('data-id');
                        

                        stores.push(store);
                    });

                    deferred.resolve(stores);

                } else {
                    deferred.reject(new Error(sprintf('Request failed with status %d', response.statusCode)));
                }

            });

        } else {
            deferred.reject(error);
        }

    });

    return deferred.promise;
};



module.exports = {

    searchByPostalCode: searchByPostalCode
};
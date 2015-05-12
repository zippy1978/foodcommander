'use strict';
var request = require('request');
var Q = require("q");
var sprintf = require('sprintf-js').sprintf;
var cheerio = require('cheerio');

var model = require('../../model.js');
var config = require('./config.js');
var textUtil = require('../../textUtil.js');

var searchByStoreId = function(storeId) {

    var deferred = Q.defer();

    var requestOptions = {
        url: config.menuUri,
        headers: {
            'Accept': 'text/html',
            'User-Agent': config.userAgent,
            'Cookie': 'StoreId=' + storeId
        }
    };

    request(requestOptions, function(error, response, body) {

        if (!error) {

            // Make shure parsing is async
            process.nextTick(function() {

                if (response.statusCode === 200) {
                    var dishes = [];

                    // Parse content
                    var $ = cheerio.load(response.body);

                    var $pizzas = $('.Pizzas').not('.productImage').not('.pizza_wrapper_sprt').parent();
                    $pizzas.each(function(i, element) {

                        var dish = new model.Dish();
                        var $this = $(this);

                        dish.name = $this.children('h2').text().normalize();
                        dish.description = $this.children('p').text().normalize();
                        dish.type = model.DishType.PIZZA;
                        dish.id = $this.find('.productImage').attr('src').lastPathComponent().slice(0, 'list.png'.length * -1);

                        // Size variants
                        var variants = [];
                        dish.variants = variants;
                        $this.find('.size').each(function() {
                            var size = $(this).children('.sizealign').text().normalize();
                            var price = parseFloat($(this).children('.boldprice').text().normalize());
                            var variant = new model.DishVariant();
                            variant.price = price;
                            variant.options = {size: size};
                            variants.push(variant);
                        });


                        dishes.push(dish);

                    });


                    deferred.resolve(dishes);

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

    searchByStoreId: searchByStoreId
};
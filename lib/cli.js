'use strict';
var sprintf = require('sprintf-js').sprintf;
var colors = require('colors');
var AsciiTable = require('ascii-table');
var Q = require("q");

var ctx = require('./ctx.js');
var model = require('./model.js');
var franchise = require('./franchise.js');
var moduleUtil = require('./moduleUtil.js');

var handleError = function(error) {
    formatErrorMessage(error)
        .then(function(text) {
        console.error(text);
        process.exit(1);
    });
};

/**
 * Format error as a readable message
 */
var formatErrorMessage = function(error) {

    var deferred = Q.defer();
    process.nextTick(function() {
        deferred.resolve(sprintf('[%s] %s', error.name, error.message));
    });
    return deferred.promise;
};

/**
 * Format object list as ASCII table
 * @param   {Function} display custom string representation callback.
 */
var formatObjectList = function(title, list, display) {

    var deferred = Q.defer();
    var output = '';
    process.nextTick(function() {

        if (list.length > 0) {

            // Headers / properties
            var properties = [];
            var object = list[0];

            for (var property in object) {
                if (object.hasOwnProperty(property)) {
                    properties.push(property);
                }
            }


            // Values
            var values = [];
            list.forEach(function(item) {
                var itemValues = [];
                properties.forEach(function(property) {

                    // Custom display
                    var itemValue = null;
                    if (display !== undefined) {
                        itemValue = display(item, property);
                    }

                    // No custom display: default display
                    if (itemValue === null) {
                        itemValue = item[property];
                    }

                    itemValues.push(itemValue);

                });
                values.push(itemValues);
            });

            var table = AsciiTable.factory({
                title: title,
                heading: properties,
                rows: values
            });

            output = table.toString();

        } else {
            output = 'Nothing';
        }

        deferred.resolve(output);
    });
    return deferred.promise;
};

/**
 * Build context object from command line args.
 */
var buildContextFromArgs = function(args) {

    var deferred = Q.defer();
    process.nextTick(function() {

        var ct = new ctx.Context();

        ct.franchiseId = args.franchise;
        ct.storeId  =args.store;
        ct.postalCode = args.postalcode;

        // Populate address only if at least street is defined
        if (args.street !== undefined) {
            var address = new model.Address();
            address.firstName = args.firstname !== undefined ? args.firstname : null;
            address.lastName = args.lastname !== undefined ? args.lastname : null;    
            address.email = args.email !== undefined ? args.email : null;
            address.intercom = args.intercom !== undefined ? args.intercom : null;
            address.building = args.building !== undefined ? args.building : null;
            address.floor = args.floor !== undefined ? args.floor : null;
            address.phone = args.phone !== undefined ? args.phone : null;
            address.streetNumber = args.streetnumber !== undefined ? args.streetnumber : null;
            address.streetName = args.street !== undefined ? args.street : null;
            address.postalCode = args.postalcode !== undefined ? args.postalcode : null;
            address.city = args.city !== undefined ? args.city : null;

            ct.address = address;
        }

        deferred.resolve(ct);

    });
    return deferred.promise;
};

/**
 * Retrieve module from a given context.
 */
var getModuleFromContext = function(context, moduleName) {

    return ctx.validate(context).then(function(valid) {

        if (valid) {
            return moduleUtil.getModuleForFranchiseId(moduleName, context.franchiseId).then(function(module) {
                return Q.fcall(function () {
                    return module;
                });
            });

        } else {
            return Q.fcall(function () {
                throw new Error('Invalid context');
            });
        }

    });
};

/**
 * Build an Order object from dishes arg syntax.
 */
var buildOrderFromDishesArg = function(dishesArg) {

    var deferred = Q.defer();
    process.nextTick(function() {

        var order = new model.Order();

        var lineStrings = dishesArg.split(',');
        lineStrings.forEach(function(lineString) {
            var orderLine = new model.OrderLine();
            orderLine.dish = new model.Dish();

            var quantityStrings = lineString.split('*');

            // Quantity
            orderLine.quantity = 1;
            if (quantityStrings.length > 1) {
                orderLine.quantity = parseInt(quantityStrings[1]);
            }

            // Dish id
            orderLine.dish.id = quantityStrings[0].split('[')[0];


            // Variant
            var variantMatch = quantityStrings[0].match(/[^[\]]+(?=])/g);
            if (variantMatch) {
                orderLine.variant = new model.DishVariant();
                orderLine.variant.options = {};
                var variantsString = variantMatch[0];
                var variantStrings = variantsString.split('|');
                variantStrings.forEach(function(variantPairString) {
                    var variantKeyAndVal = variantPairString.split('=');
                    orderLine.variant.options[variantKeyAndVal[0]] = variantKeyAndVal[1];
                });

            }

            order.lines.push(orderLine);
        });

        deferred.resolve(order);

    });

    return deferred.promise;

};

/**
 * Prompt for keyboard input.
 */
var prompt = function(message, options) {

    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    var deferred = Q.defer();

    var optionString = '';
    if (options !== undefined) {
        optionString = sprintf('(%s) ', options.join('/'));
    }
    process.stdout.write(sprintf('%s %s', message, optionString));
    process.stdin.on('data', function (text) {
        
        // Check if valid answer
        var isValidOption = true;
        if (options !== undefined) {
            isValidOption = options.filter(function(option) {
                return option === text.trim();
            }).length > 0;
        }

        if (isValidOption) {
            process.stdin.pause();
            deferred.resolve(text.trim());
        } else {
            console.log('Invalid option ! ');
            process.stdout.write(sprintf('%s %s', message, optionString));
        }

    });
    
    return deferred.promise;
};

module.exports = {
    formatErrorMessage: formatErrorMessage,
    formatObjectList: formatObjectList,
    buildContextFromArgs: buildContextFromArgs,
    handleError: handleError,
    getModuleFromContext: getModuleFromContext,
    buildOrderFromDishesArg: buildOrderFromDishesArg,
    prompt: prompt
};
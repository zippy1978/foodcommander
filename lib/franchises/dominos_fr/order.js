'use strict';
var request = require('request');
var Q = require("q");
var sprintf = require('sprintf-js').sprintf;
var cheerio = require('cheerio');
var moment = require('moment');
var winston = require('winston');

var model = require('../../model.js');
var webUtil = require('../../webUtil.js');
var textUtil = require('../../textUtil.js');
var timeUtil = require('../../timeUtil.js');
var config = require('./config.js');

/**
 * Place an order.
 */
var place = function(order, dryRun) {

    var deferred = Q.defer();
    var sessionCookies = {};
    var streetId = 0;
    var stepProgress = 100 / (11 + order.lines.length);
    var storeInfo;

    deferred.notify(0);  

    initSession(order).then(function(cookies) {
        sessionCookies = cookies;
        deferred.notify(stepProgress); 

        return setDelivreryMode(order, sessionCookies).then(function() {

            deferred.notify(stepProgress);

            return setPostalCode(order, sessionCookies).then(function() {
                deferred.notify(stepProgress);

                return findStreetId(order, sessionCookies).then(function(id) {
                    streetId = id; 

                    deferred.notify(stepProgress);

                    return setStreetId(order, streetId, sessionCookies).then(function() {

                        deferred.notify(stepProgress);

                        return setDeliveryAddress(order, streetId, sessionCookies).then(function() {

                            deferred.notify(stepProgress);

                            return getStoreInfo(order, sessionCookies).then(function(info) {
                                
                                storeInfo = info;
                                
                                if (!storeInfo.isStoreOpen) {
                                    deferred.reject(new Error('Store is currently closed'));
                                }
                                
                                deferred.notify(stepProgress);

                                return startOrder(order, sessionCookies).then(function() {

                                    deferred.notify(stepProgress);

                                    var linePromises = [];
                                    order.lines.forEach(function(line) {
                                        linePromises.push(addOrderLineToCart(line, sessionCookies));
                                    });

                                    return Q.all(linePromises).then(function() {

                                        deferred.notify(stepProgress * linePromises.length);

                                        return checkCartContent(order, sessionCookies).then(function() {

                                            deferred.notify(stepProgress);

                                            return validateOrder(order, sessionCookies).then(function() {

                                                deferred.notify(stepProgress);

                                                return setDeliveryInfo(order, sessionCookies, storeInfo).then(function(orderConfirmation) {

                                                    deferred.notify(stepProgress);

                                                    // Confirm only if not in dry run mode
                                                    if (!dryRun) {

                                                        return confirmOrder(orderConfirmation, sessionCookies).then(function() {
                                                            deferred.resolve(orderConfirmation);
                                                        });

                                                    } else {

                                                        deferred.resolve(orderConfirmation);

                                                    }

                                                });

                                            });

                                        });

                                    });

                                });

                            });



                        });

                    });

                });

            });            

        });


    }).fail(function(error) {
        deferred.reject(error);
    });

    return deferred.promise;
};

/**
 * Init HTTP session.
 * Will return promise with the cookie string ('Set-Cookie' headers)
 */
var initSession = function(order) {

    winston.debug('initSession');

    var deferred = Q.defer();

    var requestOptions = {
        url: sprintf('%s%s', config.orderBaseUri, '/fr/order/index/'),
        headers: {
            'Accept': 'text/html',
            'User-Agent': config.userAgent
        }
    };

    request(requestOptions, function(error, response, body) {
        if (!error) {

            if (response.statusCode === 200) {

                deferred.resolve(webUtil.parseCookies(response.headers['set-cookie']));

            } else {
                deferred.reject(new Error(sprintf('Request failed with status %d (%s)', response.statusCode, requestOptions.url)));
            }
        } else {
            deferred.reject(error);
        }
    });

    return deferred.promise;
};

var setDelivreryMode = function(order, cookies) {

    winston.debug('setDelivreryMode');

    var deferred = Q.defer();

    var requestOptions = {
        url: sprintf('%s%s', config.orderBaseUri, '/fr/delivery/geo'),
        headers: {
            'Accept': 'text/html',
            'User-Agent': config.userAgent,
            'Cookie': webUtil.getCookiesAsHeaderString(cookies)
        }
    };

    request(requestOptions, function(error, response, body) {
        if (!error) {

            if (response.statusCode === 200) {

                deferred.resolve(order);

            } else {
                deferred.reject(new Error(sprintf('Request failed with status %d (%s)', response.statusCode, requestOptions.url)));
            }
        } else {
            deferred.reject(error);
        }
    });

    return deferred.promise;
};

/**
 * Set postal code (HTTP POST)
 */
var setPostalCode = function(order, cookies) {

    winston.debug('setPostalCode');

    var deferred = Q.defer();

    var requestOptions = {
        url: sprintf('%s%s', config.orderBaseUri, '/fr/delivery/address'),
        method: 'POST',
        headers: {
            'Accept': 'text/html',
            'User-Agent': config.userAgent,
            'Cookie': webUtil.getCookiesAsHeaderString(cookies)
        },
        formData: {
            search: order.address.postalCode,
            submit: 'submit-value'
        }
    };

    request(requestOptions, function(error, response, body) {
        if (!error) {

            // Make shure parsing is async
            process.nextTick(function() {

                if (response.statusCode === 200) {

                    // Check if postal code is valid by parsing content
                    var $ = cheerio.load(response.body);
                    var $streetNumber = $('#streetnumber');
                    if ($streetNumber.length === 0) {
                        deferred.reject(new Error(sprintf('Sorry, unable to deliver to postal code %s', order.address.postalCode)));
                    } else {
                        deferred.resolve(order);
                    }


                } else {
                    deferred.reject(new Error(sprintf('Request failed with status %d (%s)', response.statusCode, requestOptions.url)));
                }

            });

        } else {
            deferred.reject(error);
        }
    });

    return deferred.promise;
};

/**
 * Find street id (used to fill the address form).
 */
var findStreetId = function(order, cookies) {

    winston.debug('findStreetId');

    var deferred = Q.defer();

    var requestOptions = {
        url: sprintf('%s%s/%s', config.orderBaseUri, '/fr/delivery/streetlist', order.address.postalCode),
        method: 'POST',
        headers: {
            'Accept': 'text/html',
            'User-Agent': config.userAgent,
            'Cookie': webUtil.getCookiesAsHeaderString(cookies)
        },
        formData: {
            zipcode: parseInt(order.address.postalCode),
            streetnumber: '',
            streetcomplement: '',
            streetname: '',
            submit: 'submit-value'
        }
    };

    request(requestOptions, function(error, response, body) {
        if (!error) {

            // Make shure parsing is async
            process.nextTick(function() {

                if (response.statusCode === 200) {

                    // Extract street names and their ids from HTML
                    var $ = cheerio.load(response.body);
                    var $streets = $('#list-streets a');
                    var streets = [];
                    $streets.each(function(i, element) {

                        var $this = $(this);
                        var name = $this.attr('title');
                        var id = $this.attr('href').lastPathComponent();

                        streets.push({name: name, id: id});
                    });

                    // Find matching street name
                    var matches = streets.filter(function(item) {
                        return item.name.toUpperCase() === order.address.streetName.toUpperCase();
                    });

                    if (matches.length === 0) {
                        deferred.reject(new Error(sprintf('Street name was not found for postal code %s', order.address.postalCode)));
                    } else {
                        deferred.resolve(matches[0].id);
                    }


                } else {
                    deferred.reject(new Error(sprintf('Request failed with status %d (%s)', response.statusCode, requestOptions.url)));
                }

            });

        } else {
            deferred.reject(error);
        }
    });

    return deferred.promise;
};

/**
 * Set selected street Id.
 */
var setStreetId = function(order, streetId, cookies) {

    winston.debug('setStreetId');

    var deferred = Q.defer();

    var requestOptions = {
        url: sprintf('%s%s/%s/%s', config.orderBaseUri, '/fr/delivery/address', order.address.postalCode, streetId),
        headers: {
            'Accept': 'text/html',
            'User-Agent': config.userAgent,
            'Cookie': webUtil.getCookiesAsHeaderString(cookies)
        }
    };

    request(requestOptions, function(error, response, body) {
        if (!error) {

            if (response.statusCode === 200) {

                deferred.resolve(order);

            } else {
                deferred.reject(new Error(sprintf('Request failed with status %d (%s)', response.statusCode, requestOptions.url)));
            }

        } else {
            deferred.reject(error);
        }
    });

    return deferred.promise;
};

/**
 * Set delivery address.
 * Will return a promise with and order id as a result (required to order).
 */
var setDeliveryAddress = function(order, streetId, cookies) {

    winston.debug('setDeliveryAddress');

    var deferred = Q.defer();

    // Parse street complement (if any)
    var streetNumberParts = order.address.streetNumber.split('-');
    var streetNumber = streetNumberParts[0];
    var streetComplement = streetNumberParts.length > 1 ? streetNumberParts[1] : '';

    var requestOptions = {
        url: sprintf('%s%s', config.orderBaseUri, '/fr/delivery/confirm'),
        method: 'POST',
        headers: {
            'Accept': 'text/html',
            'User-Agent': config.userAgent,
            'Cookie': webUtil.getCookiesAsHeaderString(cookies)
        },
        formData: {
            zipcode: parseInt(order.address.postalCode),
            streetnumber: streetNumber,
            streetcomplement : streetComplement,
            streetname: order.address.streetName.toUpperCase(),
            submit: 'submit-value'
        }
    };

    request(requestOptions, function(error, response, body) {
        if (!error) {

            // Make shure parsing is async
            process.nextTick(function() {

                if (response.statusCode === 200) {

                    var $ = cheerio.load(response.body);
                    var $form = $('form');
                    var $orderButton = $('#bt-ordering');
                    if ($orderButton.length > 0) {
                        deferred.resolve(order);
                    } else {
                        deferred.reject(new Error('Unable to place order for the address'));
                    }


                } else {
                    deferred.reject(new Error(sprintf('Request failed with status %d (%s)', response.statusCode, requestOptions.url)));
                }

            });


        } else {
            deferred.reject(error);
        }
    });

    return deferred.promise;

};

/**
 * Start order. 
 * Make shure that every previous step is ok to fill cart.
 */
var startOrder = function(order, cookies) {

    winston.debug('startOrder');

    var deferred = Q.defer();

    var requestOptions = {
        url: sprintf('%s%s', config.orderBaseUri, '/fr/lacarte/'),
        method: 'POST',
        headers: {
            'Accept': 'text/html',
            'User-Agent': config.userAgent,
            'Cookie': webUtil.getCookiesAsHeaderString(cookies)
        },
        formData: {
            orderType: 'Delivery',
            takeOrder: 'submit-value'
        }
    };

    request(requestOptions, function(error, response, body) {

        if (!error) {

            // Make shure parsing is async
            process.nextTick(function() {

                if (response.statusCode === 200) {

                    var $ = cheerio.load(response.body);
                    var $title = $('title');

                    if ($title.text() === 'Domino\'s Pizza - La carte') {
                        deferred.resolve(order);
                    } else {
                        deferred.reject(new Error('Unable to place order'));
                    }


                } else {
                    deferred.reject(new Error(sprintf('Request failed with status %d (%s) - store is probably closed', response.statusCode, requestOptions.url)));
                }
            });

        } else {
            deferred.reject(error);
        }
    });

    return deferred.promise;

};

/**
 * Add order line to cart.
 */
var addOrderLineToCart = function(orderLine, cookies) {

    winston.debug('addOrderLineToCart');

    var deferred = Q.defer();

    var requestOptions = {
        url: sprintf('%s%s', config.orderBaseUri, '/fr/pizzas/add'),
        method: 'POST',
        headers: {
            'Accept': 'text/html',
            'User-Agent': config.userAgent,
            'Cookie': webUtil.getCookiesAsHeaderString(cookies)
        },
        formData: {
            'product-code': orderLine.dish.id,
            'select-basic-sauce-1': 'CF',
            'select-add-topping-1': 0,
            'select-add-topping-2': 0,
            'select-add-topping-3': 0,
            'select-pizza-crust-1': 'T',
            // Size 2 is medium, 4 is large
            'radio-pizza-size-1': orderLine.variant.options.size === 'med.' ? 2 : 4 , 
            'input-quantity-1': orderLine.quantity
        }
    };

    request(requestOptions, function(error, response, body) {

        if (!error) {

            // When dish is added : redirect is normal
            if (response.statusCode === 302 || response.statusCode === 200) {

                deferred.resolve(orderLine);

            } else {
                deferred.reject(new Error(sprintf('Request failed with status %d (%s)', response.statusCode, requestOptions.url)));
            }

        } else {
            deferred.reject(error);
        }
    });

    return deferred.promise;
};

/**
 * Check that all order lines are present into the cart.
 */
var checkCartContent = function(order, cookies) {

    winston.debug('checkCartContent');

    var deferred = Q.defer();

    var requestOptions = {
        url: sprintf('%s%s', config.orderBaseUri, '/fr/cart/list'),
        headers: {
            'Accept': 'text/html',
            'User-Agent': config.userAgent,
            'Cookie': webUtil.getCookiesAsHeaderString(cookies)
        }
    };

    request(requestOptions, function(error, response, body) {

        if (!error) {

            // Make shure parsing is async
            process.nextTick(function() {

                if (response.statusCode === 200) {

                    var $ = cheerio.load(response.body);
                    var $lines = $('.dp-cart-product');

                    if ($lines.length === order.lines.length) {
                        deferred.resolve(order);
                    } else {
                        deferred.reject(new Error('Cart content mismatch'));    
                    }


                } else {
                    deferred.reject(new Error(sprintf('Request failed with status %d (%s)', response.statusCode, requestOptions.url)));
                }
            });

        } else {
            deferred.reject(error);
        }
    });

    return deferred.promise;
};

/**
 * Validate order.
 */
var validateOrder = function(order, cookies) {

    winston.debug('validateOrder');

    var deferred = Q.defer();

    var requestOptions = {
        url: sprintf('%s%s', config.orderBaseUri, '/fr/cart/coordinates'),
        method: 'POST',
        headers: {
            'Accept': 'text/html',
            'User-Agent': config.userAgent,
            'Cookie': webUtil.getCookiesAsHeaderString(cookies)
        },
        formData: {
            'checkbox-cgv': 'on',
            'submit-btn': 'Valider'
        }
    };

    request(requestOptions, function(error, response, body) {

        if (!error) {

            // Make shure parsing is async
            process.nextTick(function() {

                if (response.statusCode === 200) {

                    var $ = cheerio.load(response.body);

                    if ($('.form-cart-coordinates').length > 0) {
                        deferred.resolve(order);
                    } else {
                        deferred.reject(new Error('Failed to validate order'));
                    }


                } else {
                    deferred.reject(new Error(sprintf('Request failed with status %d (%s)', response.statusCode, requestOptions.url)));
                }
            });

        } else {
            deferred.reject(error);
        }
    });


    return deferred.promise;
};

/**
 * Set delivery address extra info (name, level...).
 * Return an OrderConfirmation object as a promise result.
 */
var setDeliveryInfo = function(order, cookies, storeInfo) {

    winston.debug('setDeliveryInfo');

    var deferred = Q.defer();

    var requestOptions = {
        url: sprintf('%s%s', config.orderBaseUri, '/fr/cart/confirm'),
        method: 'POST',
        headers: {
            'Accept': 'text/html',
            'User-Agent': config.userAgent,
            'Cookie': webUtil.getCookiesAsHeaderString(cookies)
        },
        formData: {
            firstname: order.address.firstName,
            lastname: order.address.lastName,
            phone: order.address.phone,
            email: order.address.email,
            'has-interphone': order.address.intercom === null ? 0 : 1,
            interphone: order.address.intercom === null ? '' : order.address.intercom,
            'has-building': order.address.building === null ? 0 : 1,
            building: order.address.building === null ? '' : order.address.building,
            'has-floor': order.address.floor === null ? 0: 1,
            floor: order.address.floor === null ? '' : order.address.floor,
            comment: order.comment === null ? '' : order.comment
        }
    };

    request(requestOptions, function(error, response, body) {

        if (!error) {

            // Make shure parsing is async
            process.nextTick(function() {

                if (response.statusCode === 200) {

                    var $ = cheerio.load(response.body);

                    if ($('.form-cart-confirm').length > 0) {

                        var confirmation = new model.OrderConfirmation();
                        confirmation.order = order;
                        confirmation.paymentMode = model.PaymentModeType.CREDIT_CARD;
                        
                        var hours = $('#hours').val();
                        var minutes = $('#minutes').val();
                        
                        confirmation.estimatedDeliveryDate = new Date(sprintf('%s %s:%s', moment().format('YYYY-MM-DD'), hours, minutes));

                        deferred.resolve(confirmation);

                    } else {
                        deferred.reject(new Error('Failed to set delivery info'));
                    }


                } else {
                    deferred.reject(new Error(sprintf('Request failed with status %d (%s)', response.statusCode, requestOptions.url)));
                }
            });

        } else {
            deferred.reject(error);
        }
    });

    return deferred.promise;
};

var confirmOrder = function(orderConfirmation, cookies) {

    winston.debug('confirmOrder');

    var deferred = Q.defer();

    var requestOptions = {
        url: sprintf('%s%s', config.orderBaseUri, '/fr/cart/receipt'),
        method: 'POST',
        headers: {
            'Accept': 'text/html',
            'User-Agent': config.userAgent,
            'Cookie': webUtil.getCookiesAsHeaderString(cookies)
        },
        formData: {
            payment: 'card',
            when: 'asap',
            hours: orderConfirmation.estimatedDeliveryDate.getHours().toString(),
            minutes: ('0' + orderConfirmation.estimatedDeliveryDate.getMinutes()).slice(-2),
            'order-now': 'submit-value'
        }
    };

    request(requestOptions, function(error, response, body) {

        if (!error) {

            if (response.statusCode === 200) {

                deferred.resolve(orderConfirmation);

            } else {
                console.log(JSON.stringify(requestOptions));
                deferred.reject(new Error(sprintf('Request failed with status %d (%s)', response.statusCode, requestOptions.url)));
            }

        } else {
            deferred.reject(error);
        }
    });


    return deferred.promise;
};

var getStoreInfo = function(order, cookies) {

    winston.debug('getStoreInfo');

    var deferred = Q.defer();

    var requestOptions = {
        url: sprintf('%s%s', config.orderBaseUri, '/fr/schedule/getJSONTimer'),
        headers: {
            'Accept': 'text/html',
            'User-Agent': config.userAgent,
            'Cookie': webUtil.getCookiesAsHeaderString(cookies)
        }
    };

    request(requestOptions, function(error, response, body) {

        if (!error) {

            if (response.statusCode === 200) {

                deferred.resolve(JSON.parse(response.body));

            } else {
                deferred.reject(new Error(sprintf('Request failed with status %d (%s)', response.statusCode, requestOptions.url)));
            }


        } else {
            deferred.reject(error);
        }
    });

    return deferred.promise;
};

module.exports = {
    place: place
};
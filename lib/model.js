'use strict';

var Address = function Address() {
    return {
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
        intercom: null,
        building: null,
        floor: null,
        streetNumber: null,
        streetName: null,
        postalCode: null,
        city: null
    };  
};

var Franchise = function Franchise() {
    return {
        id: null,
        name: null
    }        
};

var Store = function Store() {
    return {
        id: null,
        name: null,
        address: null,
        phone: null
    }        
};

var Dish = function Dish() {
    return {
        id: null,
        name: null,
        type: null,
        description: null,
        variants: []
    }
};

var DishVariant = function DishVariant() {
    return {
        price: null,
        options: null
    }
};

var Order = function Order() {
    return {
        address: null,
        lines: [],
        totalPrice: null,
        comment: null
    }  
};

var OrderLine = function OrderLine() {
    return {
        dish: null,
        variant: null,
        quantity: null,
        unitPrice: null,
        price: null
    }
};

var OrderConfirmation = function OrderConfirmation() {
    return {
        order: null,
        estimatedDeliveryDate: null,
        paymentMode: null
    }  
};

var Currency = function Currency() {
    return {
        name: null,
        symbol: null
    }
};

var DishType = {
    PIZZA: 'Pizza',
    UNKNOWN: 'Unknown'
};

var CurrencyType =  {
    EURO: {name: 'EUR', symbol: '€'}  
};

var PaymentModeType = {
    CREDIT_CARD: 'Credit card'
};

module.exports = {
    Address: Address,
    Franchise: Franchise,
    Store: Store,
    Dish: Dish,
    DishVariant: DishVariant,
    Currency: Currency,
    Order: Order,
    OrderLine: OrderLine,
    OrderConfirmation: OrderConfirmation,
    CurrencyType: CurrencyType,
    DishType: DishType,
    PaymentModeType: PaymentModeType
}
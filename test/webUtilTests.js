'use strict';
var assert = require('assert');
var webUtil = require('../lib/webUtil.js');

describe('webUtil module', function () {

    it('parse cookies', function () {
        
        var cookieHeaders = ['ServerID=1036; path=/', 'PHPSESSID=264f7cfb8901285e3b38373269d65ab1; path=/', 'PHPSESSID=c28f176dcfd626d847a929d693d9da42; path=/'];
        var cookies = webUtil.parseCookies(cookieHeaders);
        assert.equal('1036', cookies.ServerID);
        assert.equal('c28f176dcfd626d847a929d693d9da42', cookies.PHPSESSID);
    });
    
     it('cookies as header string', function () {
        
        var cookies = {
            'ServerID': '1036',
            'PHPSESSID': 'c28f176dcfd626d847a929d693d9da42'
        };
        var cookieString = webUtil.getCookiesAsHeaderString(cookies);
         assert.equal('ServerID=1036; PHPSESSID=c28f176dcfd626d847a929d693d9da42', cookieString);
    });

});
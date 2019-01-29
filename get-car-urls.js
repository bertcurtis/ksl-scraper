/**
 * phantom-script.js
 */
"use strict";
// Example using HTTP POST operation in PhantomJS
// This website exists and is for test purposes, dont post sensitive information
var page = require('webpage').create();


page.open('https://www.ksl.com/auto/search/index?p=&keyword=memberId%3A2982824&miles=0&page=0', function (status) {
    if (status !== 'success') {
        console.log('Unable to access network');
        phantom.exit();
    }
    else {
        var blocks = page.evaluate(function() {
            return [].map.call(document.querySelectorAll("div[class='photo-block']"), function(elem) {
                return elem.querySelector("a").href;
            });
        });       
        for(var i = 0; i < blocks.length; ++i) {
            if(blocks[i]) {
                console.log(blocks[i]);                    
            }
        }       
        phantom.exit();          
    }  
});

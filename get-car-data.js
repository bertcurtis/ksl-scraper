"use strict";
// Example using HTTP POST operation in PhantomJS
var page = require("webpage").create(),
	system = require("system");

var urls = system.args;
urls.shift();

var x = 0;
var failureIncrement = 0;
var callback = function (urls) {
	var url = urls[x];
	console.log(url);
	if (url) {
		return page.open(url, function (status) {
			console.log("poop~=~url~=~" + url);
			if (status !== "success") {
				if (failureIncrement > 2) {
					phantom.exit();
				} else {
					++failureIncrement;
					return setTimeout(2500, callback(urls));
				}
			} else {
				try {
					x++;
					var carInfo = [],
						imgs = [],
						desc = [],
						price = [];
					var getPrice = page.evaluate(function () {
						return document.querySelector("h3[class='price']").innerText;
					});
					var description = page.evaluate(function () {
						var a = document.querySelector("a[class^='more']");
						var e = document.createEvent("MouseEvents");
						e.initMouseEvent(
							"click",
							true,
							true,
							window,
							0,
							0,
							0,
							0,
							0,
							false,
							false,
							false,
							false,
							0,
							null
						);
						a.dispatchEvent(e);
						waitforload = true;
						return document.querySelector("div[class='full']").innerText;
					});

					var specRowsEven = page.evaluate(function () {
						waitforload = true;
						return [].map.call(
							document.querySelectorAll(
								"li[class^='specificationsTableRowEven']"
							),
							function (elem) {
								return elem.innerText;
							}
						);
					});
					var specRowsOdd = page.evaluate(function () {
						waitforload = true;
						return [].map.call(
							document.querySelectorAll("li[class^='specificationsTableRowOdd']"),
							function (elem) {
								return elem.innerText;
							}
						);
					});

					var imgUrls = page.evaluate(function () {
						waitforload = true;
						return [].map.call(
							document.querySelectorAll("li[style^='width']"),
							function (elem) {
								return elem.firstChild.src;
							}
						);
					});


					desc.push(description.trim());
					price.push(getPrice.trim());
					for (var i = 0; i < specRowsEven.length; ++i) {
						if (specRowsEven[i]) {
							carInfo.push(specRowsEven[i].trim());
						}
					}

					for (var i = 0; i < specRowsOdd.length; ++i) {
						if (specRowsOdd[i]) {
							carInfo.push(specRowsOdd[i].trim());
						}
					}

					for (var i = 0; i < imgUrls.length / 2; ++i) {
						if (imgUrls[i]) {
							imgs.push(imgUrls[i].trim());
						}
					}
					var key = url;

					desc.push(key);
					price.push(key);
					carInfo.push(key);
					imgs.push(key);

					console.log("poop~=~price~=~" + price);
					console.log("poop~=~description~=~" + desc);
					console.log("poop~=~car-info~=~" + carInfo);
					console.log("poop~=~img-urls~=~" + imgs);
				}
				catch (err) {
					console.log(err);
					--x;
					++failureIncrement;
					return setTimeout(2500, callback(urls));
				}

				if (x < urls.length) {
					// navigate to the next url and the callback is this function (recursion)
					return setTimeout(2000, callback(urls));
				} else {
					// exit phantom once the array has been iterated through
					phantom.exit();
				}
			}
		});
	} else {
		x++;
		return callback(urls);
	}
};
callback(urls);

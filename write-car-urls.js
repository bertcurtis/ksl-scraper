const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const mongo = require('./mongo.js');

(async function example() {
	options = new chrome.Options();
	options.addArguments("--headless"); // note: without dashes
	options.addArguments("--disable-gpu");
	let driver = await new Builder()
		.forBrowser("chrome")
		.setChromeOptions(options) // note this
        .build();   
	try {
        await mongo.removeAllDocumentsInUrlsCollection();
		await driver.get(
			"https://cars.ksl.com/search/index?keyword=strickland+auto&perPage=48"
		);
        let elements = await driver.findElements(By.className("photo-block"));
        var resultCount = 0;
		for (var i = 0; i < elements.length; i++) {
			let element = await elements[i].findElement(By.css("a"));
			let att = await element.getAttribute("href");
			if (att.includes("listing")) {
				var insertObject = { url: att };
				mongo.insertNewObject("car-urls", insertObject, function(result) {
                    resultCount++;
					console.log(resultCount);
				});
			}
		}
	} finally {
		await driver.quit();
	}
})();

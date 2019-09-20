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
	let urls = await mongo.getAllUrls();
	try {
		await mongo.removeAllDocumentsInInfoCollection();
		console.log(urls.length);
		var resultCount = 0;
		for (var i = 0; i < urls.length; i++) {
			var carInfoObject = { url: urls[i] };
			await driver.get(
				await urls.map(function (val) {
					return val.url;
				})[i]
			);
			await driver.sleep(1500);
			let header = await driver.findElement(By.tagName("h1"));
			let headerText = await header.getText();
			if (headerText == "Aw snap!") {
				console.log("No vehicle found for url: " + carInfoObject.url.url)
			}
			else {
				/*let dealerName = await driver.findElement(
					By.className("vdp-dealer-name")
				);
				let dealerNameText = await dealerName.getText();
				if (dealerNameText !== "Strickland Auto") {
					await driver.quit();
				}*/
				let price = await driver.findElement(By.css("h3[class='price']"));
				let priceText = await price.getText();
				carInfoObject.price = priceText;
				console.log("price: " + carInfoObject.price);


				try {
					let ad = await driver.findElement(By.id("google_ads_iframe_/6686/ddm.ksl/Cars_8"));
					await ad.getText();
					await driver.executeScript("var elem = document.getElementById('google_ads_iframe_/6686/ddm.ksl/Cars_8'); elem.parentNode.removeChild(elem);");
				}
				catch {
					await driver.sleep(500);
				}
				try {
					let ad = await driver.findElement(By.className("fixed_footer_ad_block"));
					await ad.getText();
					await driver.executeScript("var elem = document.querySelector('div.fixed_footer_ad_block'); elem.parentNode.removeChild(elem);");
				}
				catch {
					await driver.sleep(500);
				}



				let moreLink = await driver.findElement(By.css("a[class^='more']"));
				moreLink.click();


				let short = await driver.findElement(By.className("short"));
				try {
					await short.click();
					await moreLink.click();
					driver.sleep(1000);
					let shortText = await short.getText()
					console.log(shortText);
				} catch {
					await driver.sleep(500);
				}

				let description = await driver.findElement(By.className("full"));
				let descriptionText = await description.getText();
				carInfoObject.description = descriptionText;
				console.log("description: " + carInfoObject.description);

				let specRowsEven = await driver.findElements(By.css("li[class^='specificationsTableRowEven']"));
				let specRowsOdd = await driver.findElements(By.css("li[class^='specificationsTableRowOdd']"));

				let specs = await specRowsEven.concat(specRowsOdd);
				console.log("specs length: " + specs.length);
				for (var x = 0; x < specs.length; ++x) {
					let specText = await specs[x].getText();
					let parsedInput = await specText.split(":");
					switch (parsedInput[0].toLowerCase().trim()) {
						case "vin":
							carInfoObject.vin = parsedInput[1].trim();
							break;
						case "make":
							carInfoObject.make = parsedInput[1].trim();
							break;
						case "model":
							carInfoObject.model = parsedInput[1].trim();
							break;
						case "year":
							carInfoObject.year = parsedInput[1].trim();
							break;
						case "mileage":
							carInfoObject.miles = parsedInput[1].trim();
							break;
						case "trim":
							carInfoObject.trim = parsedInput[1].trim();
							break;
						case "exterior color":
							carInfoObject.extcolor = parsedInput[1].trim();
							break;
						case "interior color":
							carInfoObject.intcolor = parsedInput[1].trim();
							break;
						case "transmission":
							carInfoObject.transmission = parsedInput[1].trim();
							break;
						case "liters":
							carInfoObject.liters = parsedInput[1].trim();
							break;
						case "cylinders":
							carInfoObject.cylinders = parsedInput[1].trim();
							break;
						case "drive type":
							carInfoObject.drivetype = parsedInput[1].trim();
							break;
						case "number of doors":
							carInfoObject.numdoors = parsedInput[1].trim();
							break;
						case "fuel type":
							carInfoObject.fuel = parsedInput[1].trim();
							break;
					}
				}
				console.log("miles: " + carInfoObject.miles);

				var imgs = [];
				let listElements = await driver.findElements(By.css("li[style^='width']"));
				for (var y = 0; y < listElements.length; ++y) {
					let listElement = await listElements[y].findElement(By.tagName('img'));
					let imgSrc = await listElement.getAttribute('src');
					imgs.push(imgSrc);
				}
				carInfoObject.imgs = imgs;
				carInfoObject.index = i;
				console.log("imgurl length: " + carInfoObject.imgs.length);

				mongo.insertNewObject('cars-info', carInfoObject, function (result) {
					resultCount++;
					console.log(resultCount);
				});
			}
		}
	} finally {
		await driver.quit();
	}
})();


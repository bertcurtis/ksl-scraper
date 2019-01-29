var descriptions = [],
	carInfoArrs = [],
	prices = [],
	imgArrs = [],
	kslUrls = [],
	cars = [];

var parseCarData = function (data) {
	for (var i = 0; i < data.length; ++i) {
		if (data[i] === 'description') {
			descriptions.push(data[i + 1]);
		}
		else if (data[i] === 'car-info') {
			carInfoArrs.push(data[i + 1]);
		}
		else if (data[i] === 'img-urls') {
			imgArrs.push(data[i + 1]);
		}
		else if (data[i] === 'url') {
			kslUrls.push(data[i + 1]);
		}
		else if (data[i] === 'price') {
			prices.push(data[i + 1]);
		}
	}
};

var spawn = require("child_process").spawn;
var mongo = require("./mongo.js");
var urls = function (callback) {
	return mongo.getAllUrls(function (allUrls) {
		var sorted = allUrls.sort(function (a, b) {
			var fval = a.split('=');
			var sval = b.split('=');
			return fval[1] - sval[1];
		});
		callback(sorted);
	});
};

var populateArgs = function (callback) {
	return urls(function (sortedUrls) {
		if (sortedUrls) {
			console.log(["./get-car-data.js"].concat(sortedUrls));
			callback(["./get-car-data.js"].concat(sortedUrls));
		}
	});
};
populateArgs(function (args) {
	var createCarObject = function (url, callback) {
		var car = {};
		var i = 0;		
		while (i < carInfoArrs.length) {	
			car.kslUrl = url.replace(/\n/, '');	
			var ci = carInfoArrs[i].split(',');
			var d = descriptions[i].split(',');
			var p = prices[i].split(',');
			var iu = imgArrs[i].split(',');
			if (ci[ci.length -1].includes(car.kslUrl) || car.kslUrl.includes(ci[ci.length -1])) {				
				for (var x = 0; x < ci.length; ++x) {
					var parsedInput = ci[x].split(':');
					switch (parsedInput[0].toLowerCase()) {
						case 'vin':
							car.vin = parsedInput[1].trim();
							break;
						case 'make':
							car.make = parsedInput[1].trim();
							break;
						case 'model':
							car.model = parsedInput[1].trim();
							break;
						case 'year':
							car.year = parsedInput[1].trim();
							break;
						case 'mileage':
							car.miles = parsedInput[1].trim();
							break;
						case 'trim':
							car.trim = parsedInput[1].trim();
							break;
						case 'exterior color':
							car.extcolor = parsedInput[1].trim();
							break;
						case 'interior color':
							car.intcolor = parsedInput[1].trim();
							break;
						case 'transmission':
							car.transmission = parsedInput[1].trim();
							break;
						case 'liters':
							car.liters = parsedInput[1].trim();
							break;
						case 'cylinders':
							car.cylinders = parsedInput[1].trim();
							break;
						case 'drive type':
							car.drivetype = parsedInput[1].trim();
							break;
						case 'number of doors':
							car.numdoors = parsedInput[1].trim();
							break;
						case 'fuel type':
							car.fuel = parsedInput[1].trim();
							break;
					}
				}
			}
			if (d[d.length -1].includes(car.kslUrl) || car.kslUrl.includes(d[d.length -1])) {
				d.pop();
				car.description = d.join();
			}
			if (p[p.length -1].includes(car.kslUrl) || car.kslUrl.includes(p[p.length -1])) {
				car.price = p[0] + ',' + p[1];
			}
			if (iu[iu.length -1].includes(car.kslUrl) || car.kslUrl.includes(iu[iu.length -1])) {
				iu.pop();
				car.imgs = iu;
			}
			i++;
		}
		return callback(car);
	}
	// In case you want to customize the process, modify the options object
	var options = {};

	// If phantom is in the path use 'phantomjs', otherwise provide the path to the phantom phantomExecutable
	// e.g for windows:
	// var phantomExecutable = 'E:\\Programs\\PhantomJS\\bin\\phantomjs.exe';
	var phantomExecutable = "./phantomjs";

	/**
	 * This method converts a Uint8Array to its string representation
	 */
	function Uint8ArrToString(myUint8Arr) {
		return String.fromCharCode.apply(null, myUint8Arr);
	}
	mongo.removeAllDocumentsInInfoCollection(function (result) {
		//console.log(result);
	});
	var child = spawn(phantomExecutable, args, options);

	// Receive output of the child process
	child.stdout.on("data", function (data) {
		var textData = Uint8ArrToString(data);
		if (textData.startsWith('poop')) {
			parseCarData(textData.split('~=~'));
		}
		console.log(textData);
	});

	// Receive error output of the child process
	child.stderr.on("data", function (err) {
		var textErr = Uint8ArrToString(err);
		console.log(textErr);
	});

	// Triggered when the process closes
	child.on("close", function (code) {
		kslUrls.forEach(function (url) {
			createCarObject(url, function (car) {
				mongo.insertNewObject('cars-info', car, function(result) {
					cars.push(result);
				});				
			});
		});
		console.log("Process closed with status code: " + code);
	});
});

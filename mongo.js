var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://strickland-auto:strickland1@ds011873.mlab.com:11873/heroku_lbsm09cg';
var dbName = 'heroku_lbsm09cg';
var carUrlCollection = 'car-urls';
var carsInfoCollection = 'cars-info';

var self = this;

self.insertNewObject = function(collectionName, userObject, callback) {
	MongoClient.connect(
		url,
		{ useNewUrlParser: true },
		function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var collection = dbo.collection(collectionName);
			collection.insertOne(userObject, function(err, result) {
				if (err) throw err;
				callback(result);
				db.close();
			});
		}
	);
};

self.removeAllDocumentsInUrlsCollection = function(callback) {
	MongoClient.connect(
		url,
		{ useNewUrlParser: true },
		function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var collection = dbo.collection(carUrlCollection);
			collection.remove({}, function(err, result) {
				if (err) throw err;
				callback(result);
				db.close();
			});
		}
	);
};

self.removeAllDocumentsInInfoCollection = function(callback) {
	MongoClient.connect(
		url,
		{ useNewUrlParser: true },
		function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var collection = dbo.collection(carsInfoCollection);
			collection.remove({}, function(err, result) {
				if (err) throw err;
				callback(result);
				db.close();
			});
		}
	);
};

self.getAllUrls = function(callback) {
	MongoClient.connect(
		url,
		{ useNewUrlParser: true },
		function(err, db) {
			if (err) throw err;
			var dbo = db.db(dbName);
			var collection = dbo.collection(carUrlCollection);
			collection.find({}).toArray(function(err, result) {
    			if (err) throw err;
    			callback(result.map(function(val) { return val.url }));
    			db.close();
  			});
		}
	);
};

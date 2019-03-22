var MongoClient = require("mongodb").MongoClient;
var url =
	"mongodb://strickland-auto:strickland1@ds011873.mlab.com:11873/heroku_lbsm09cg";
var dbName = "heroku_lbsm09cg";
var carUrlCollection = "car-urls";
var carsInfoCollection = "cars-info";

var self = this;

self.insertNewObject = function(collectionName, userObject, callback) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dbName);
		var collection = dbo.collection(collectionName);
		collection.insertOne(userObject, function(err, result) {
			if (err) throw err;
			callback(result);
			db.close();
		});
	});
};
/*
self.removeAllDocumentsInUrlsCollection = function(callback) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dbName);
		var collection = dbo.collection(carUrlCollection);
		if (collection.count > 0) {
			collection.remove({}, function(err, result) {
				if (err) throw err;
				callback(result);
				db.close();
			});
		}
		db.close();
	});
};*/

self.removeAllDocumentsInUrlsCollection = async () => {
	let db, client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true });
		db = client.db(dbName);
		return await db
			.collection(carUrlCollection)
			.remove({});
	} finally {
		client.close();
	}/*
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dbName);
		var collection = dbo.collection(carsInfoCollection);
		collection.remove({}, function(err, result) {
			if (err) throw err;
			callback(result);
			db.close();
		});
	});*/
};

self.removeAllDocumentsInInfoCollection = async () => {
	let db, client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true });
		db = client.db(dbName);
		return await db
			.collection(carsInfoCollection)
			.remove({});
	} finally {
		client.close();
	}/*
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(dbName);
		var collection = dbo.collection(carsInfoCollection);
		collection.remove({}, function(err, result) {
			if (err) throw err;
			callback(result);
			db.close();
		});
	});*/
};


self.getAllUrls = async () => {
	let db, client;
	try {
		client = await MongoClient.connect(url, { useNewUrlParser: true });
		db = client.db(dbName);
		return await db
			.collection(carUrlCollection)
			.find({})
			.toArray();
	} finally {
		client.close();
	}
};

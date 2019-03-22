/**
 * executing-phantom.js
 */

var spawn = require('child_process').spawn;
var mongo = require('./mongo.js');
var args = ['./get-car-urls.js'];
// In case you want to customize the process, modify the options object
var options = ['--debug=yes', '--ignore-ssl-errors=true', '--ssl-protocol=any', '--web-security=true' ];

// If phantom is in the path use 'phantomjs', otherwise provide the path to the phantom phantomExecutable
// e.g for windows:
// var phantomExecutable = 'E:\\Programs\\PhantomJS\\bin\\phantomjs.exe';
var phantomExecutable = './phantomjs';

/**
 * This method converts a Uint8Array to its string representation
 */
function Uint8ArrToString(myUint8Arr) {
    return String.fromCharCode.apply(null, myUint8Arr);
};
console.log("testing");
/*mongo.removeAllDocumentsInUrlsCollection(function (result) {
    console.log(result);
});*/
var child = spawn(phantomExecutable, args, options);

// Receive output of the child process
child.stdout.on('data', function (data) {
    var textData = Uint8ArrToString(data);
    console.log(textData);
    var urls = [];
    if (textData.includes('listing')) {
        urls = textData.split(/\n/);
    }
    console.log('url length ' + urls.length);
    urls.forEach(function (url) {
        var insertObject = { url: url };
        mongo.insertNewObject('car-urls', insertObject, function (result) {
            console.log(url);
            //console.log(result);
        });
    });
    //console.log(textData);
});

// Receive error output of the child process
child.stderr.on('data', function (err) {
    var textErr = Uint8ArrToString(err);
    console.log(textErr);
});

// Triggered when the process closes
child.on('close', function (code) {
    console.log('Process closed with status code: ' + code);
});
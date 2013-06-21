// Code forked from: rabc/node-downloader
var http = require('http');
var nodeDownloader = require('./lib/node_download.js');

http.createServer(function (req, res) {
	var requested_url = req.url.substr(1);

 	if (typeof requested_url == 'undefiend' || requested_url.length < 1 || requested_url == 'favicon.ico') {
 		res.end('Please provide a url to download.  Ex: http://127.0.0.1:8124/http://ipv4.download.thinkbroadband.com/10MB.zip');
 	} else {
 		var download = new nodeDownloader.NodeDownloader();

		download.setDirToSave('./');
		download.downloadFile(req.url.substr(1));
		// Alternatively download.downloadFile(req.url.substr(1), 'filename.zip');
		
		download.eventEmitter.on('progress', function(percent, speed) {
			console.log('Percent: ' + percent + ' / Speed: ' + speed);
		});

		download.eventEmitter.on('end', function(code) {
			if (code == 0) {
				console.log('Downloaded ' + requested_url + ' Successfully.');
			} else {
				console.log('Download did not succeed.  Exited with code:' + code);
			}
			
			res.end('URL: ' + requested_url + ' Downloaded');
		});
 	}

  
}).listen(8124, "127.0.0.1");

console.log('Server running at http://127.0.0.1:8124/');

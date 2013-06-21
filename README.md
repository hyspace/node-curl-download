# Node.js Curl Downloader

Download any file without blocking your server using the power of curl.

## Download and install

You can watch and keep track of releases on [GitHub](http://github.com/AaronOgle/node-CurlDownloader) 

Install through NPM

     npm install curldownloader
    
OR

* Download [node_download.js](node_download.js)
* Include in project

### Example usage
    var Downloader = require('curldownloader');
    
    var download = new Downloader.CurlDownloader();

    	download.setDirToSave('./');
        
        // The filename is optional
		download.downloadFile('http://ipv4.download.thinkbroadband.com/10MB.zip', 'filename.zip');
		
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

// Code forked from: rabc/node-downloader

function NodeDownloader() {
	
	var dirToSave = './';
	var spawn = require('child_process').spawn;
	var events = require('events');
	var dl;
	var dlOptions;
	var lastProgress;
		
	var eventEmitter = new events.EventEmitter();
	
	// Add the Trim function to javascript
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	}	
	
	this.setDirToSave = function(dir) {
		dirToSave = dir;
	}
	
	this.getDirToSave = function() {
		return dirToSave;
	}
	
	this.downloadFile = function(url, file) {
		console.log('Beginning Download from: ' + url + ' Saving to: ' + dirToSave);

		if (typeof file == 'undefined') {
			dlOptions = ['-P' + dirToSave, url];
		} else {
			var path = dirToSave+file;

			dlOptions = ['--output-document='+path, '--no-check-certificate', url];
		}

		dl = spawn('wget', dlOptions);
		
		dl.on('exit', function (code) {
			// Important for multiple downloads to know when they are finished.
			eventEmitter.emit('end', code);
		});
		
		dl.stderr.on('data', function (data) {
			
			data = data.toString('ascii');
			
			// Extract the progress percentage
			var regExp = new RegExp('\\d{0,}%','i');	
			if (regExp.test(data)) {
				var progress = data.match(regExp);
				
				// Do only when percentage changed
				if (lastProgress != progress[0]) {
					lastProgress = progress[0];
					
					// Extract the download speed
					var position = data.search(regExp);
					var speed = data.substr(position + progress[0].length).trim();
					speed = speed.substr(0, speed.indexOf('/s') + 2).trim();
					
					eventEmitter.emit('progress', progress, speed);
				}
			}
			
		});

		dl.stdin.end();
	}
	
	this.stopDownload = function() {
		console.log('Download stopped');
		dl.kill();
	}
	
	// Expose the public API
	return {
		setDirToSave: this.setDirToSave,
		getDirToSave: this.getDirToSave,
		downloadFile: this.downloadFile,
		stopDownload: this.stopDownload,
		eventEmitter: eventEmitter
	};
}

exports.NodeDownloader = NodeDownloader;

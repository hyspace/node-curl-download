var spawn = require('child_process').spawn,
events = require('events');
function CurlDownloader() {
	
	var dirToSave = './';
	var dl;
	var dlOptions;
	var lastProgress = 0;
		
	var eventEmitter = new events.EventEmitter();
	
	this.setDirToSave = function(dir) {
		dirToSave = dir;
	}
	
	this.getDirToSave = function() {
		return dirToSave;
	}
	
	this.downloadFile = function(url, file) {
		console.log('Beginning Download from: ' + url + ' Saving to: ' + dirToSave);

		if (typeof file == 'undefined') {
			var file = url.substring(url.lastIndexOf('/')+1);
		}

		// Clean filename
		file = file.replace(/[^0-9a-zA-Z\.]+/gi, '');
	
		var path = dirToSave+file;
		
		dlOptions = [url, '--create-dirs', '-o' + path, '-#', '--insecure'];

		dl = spawn('curl', dlOptions);
		
		dl.on('exit', function (code) {
			// Important for multiple downloads to know when they are finished.
			eventEmitter.emit('end', code);
		});
		
		dl.stderr.on('data', function (data) {
			
			data = data.toString('ascii');
			
			// Extract the progress percentage
			if (/\d+(\.\d{1,2})/.test(data)) {
				var progress = parseInt(RegExp.lastMatch);

				// Do only when percentage changed
				if (lastProgress != progress && progress >= lastProgress) {
					lastProgress = progress;
					
					eventEmitter.emit('progress', progress + '%');
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

exports.CurlDownloader = CurlDownloader;

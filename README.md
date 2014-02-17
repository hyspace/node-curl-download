# Node.js Curl Downloader

Download any file without blocking your server using the power of curl.

forked from [node-CurlDownloader](/aaronogle/node-CurlDownloader) and rewrited in coffee-script.

## Download and install

Install through NPM

```shell
npm install curl-download
```

OR

* Download [download.js](download.js) or [download.coffee](download.coffee)
* Include in project

### Example usage in coffee

```coffee
# import download
Download = require 'download'

# new download instance
dl = new Download(
  'http://code.jquery.com/jquery-1.11.0.min.js',
  'tmp/jquery-1.11.0.min.js'
  )

# when progress
dl.on 'progress', (progress)->
  console.log "#{progress}%"

  return

# when end
dl.on 'end', (code)->
  # when success
  if code == 0
    console.log "finished successfully"

  # when fail
  else
    console.log "finished unsuccessfully"

  process.exit(code)

  return

# start download
dl.start()
```

### Example usage in javascript

```js
var Download, dl;

Download = require('download');

dl = new Download('http://code.jquery.com/jquery-1.11.0.min.js', 'tmp/jquery-1.11.0.min.js');

dl.on('progress', function(progress) {
  console.log("" + progress + "%");
});

dl.on('end', function(code) {
  if (code === 0) {
    console.log("finished successfully");
  } else {
    console.log("finished unsuccessfully");
  }
  process.exit(code);
});

dl.start();
```


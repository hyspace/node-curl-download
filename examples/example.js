var Download, dl;

Download = require('node-curl-download').Download;

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

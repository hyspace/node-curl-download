# import download
{Download} = require '../index'

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
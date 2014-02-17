###
curl downloader
@constructor Download(url, dest, options, start)
@param url      :The url of file will be downloaded
@param dest     :Path to save file. Including filename.
@param options  :`curl` command's args and options.
                  Default: (can't be overwritten)
                  --create-dirs   to `mkdir` if dest path does not exists
                  --insecure
                  --progress-bar  to get progress.
                  --location      to follow redirect
@param start    :Start download immediately
###
{spawn} = require "child_process"
{EventEmitter} = require "events"

defaultOptions =
  createDirs:['--create-dirs']
  insecure:['--insecure']
  percentage:['--progress-bar']
  followRedirect:['--location']

class Download extends EventEmitter
  constructor: (@url = null, @dest = null, options = {}, start = false)->

    # Merge options
    fill(options, defaultOptions)

    # Get array of options that can be used in `spawn`
    @options = getOptionArray(options, @dest, @url)

    # command
    @command = 'curl ' + @options.join(' ')

    @start() if start

  start:->
    if @url == null or @dest == null
      throw new Error("node-curl-download: Url and destination path must be provided.")
      return

    # Var to store last got progress number
    lastProgress = 0

    # Spawn curl command
    @_child_process = spawn('curl', @options)

    download = @

    # When curl exit, emit `end` event
    @_child_process.on 'exit', (code)->
      download.emit 'end', code
      return

    # When curl output progress, parse it and then emmit `progress` event
    # fuck curl, why this is being outputed in stderr?
    @_child_process.stderr.on 'data', (data)->

      data = data.toString('ascii')

      # Extract the progress percentage
      if /\d+(\.\d{1,2})/.test(data)
        progress = parseInt(RegExp.lastMatch, 10)

        # Do only when percentage changed
        if lastProgress isnt progress and progress >= lastProgress
          lastProgress = progress
          download.emit "progress", progress
      return
    @_child_process.stdin.end()

  stop: ->
    @_child_process.kill()
    return


getOptionArray = (options, dest, url)->
  array = []
  for key, option of options
    array = array.concat option
  array = array.concat ['-o', dest, url]
  array


fill = (dest, src)->
  for key in Object.keys(src)
    if dest[key] == undefined
      dest[key] = src[key]

exports.Download = Download
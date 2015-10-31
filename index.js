'use strict'

var async = require('async')
var express = require('express')
var fs = require('fs')
var mailin = require('mailin')
var multiparty = require('multiparty')
var util = require('util')

/* Make an http server to receive the webhook. */
var server = express()

/* Grabs the important parts of a message (name, subject, etc) */
// For now, it only prints the results.
function writeMessage(msg) {
  var targets = ['subject', 'text', 'from', 'to', 'cc', 'receivedDate']

  // @todo: Loop through targets and attempt to match fields with msg
  //        Check if each field is an array, if so, loop through entirely.
  

/*
  if (msg.from) {
    if (msg.from[0].name) {
      console.log('GOT THE NAME: ' + msg.from[0].name)
    } else {
      console.log('message.from existed but couldnt retrieve name')
    }
  } else {
    console.log('message.from does not exist, uninstall Sublime and stop trying to write code')
  }*/
}

server.head('/webhook', function (req, res) {
  console.log('Received head request from webhook.')
  res.send(200)
})

server.post('/webhook', function (req, res) {
  console.log('Receiving webhook.')

  /* Respond early to avoid timouting the mailin server. */
  // res.send(200)

  /* Parse the multipart form. The attachments are parsed into fields and can
   * be huge, so set the maxFieldsSize accordingly. */
  var form = new multiparty.Form({
    maxFieldsSize: 70000000
  })

  form.on('progress', (function () {
    var start = Date.now()
    var lastDisplayedPercentage = -1
    return function (bytesReceived, bytesExpected) {
      var elapsed = Date.now() - start
      var percentage = Math.floor(bytesReceived / bytesExpected * 100)
      if (percentage % 20 === 0 && percentage !== lastDisplayedPercentage) {
        lastDisplayedPercentage = percentage
        console.log('Form upload progress ' +
            percentage + '% of ' + bytesExpected / 1000000 + 'Mb. ' + elapsed + 'ms')
      }
    }
  }()))

  form.parse(req, function (err, fields) {
    // Important: `fields` is a string representation of an object wrapped in an array.
    var parsedMailinMsg = JSON.parse(fields.mailinMsg)

    // To avoid headaches later, make sure the message type is Object not Array.
    var message = Array.isArray(parsedMailinMsg) ? parsedMailinMsg[0] : parsedMailinMsg

    if (!err) {
      console.log(util.inspect(message, {
        depth: 5
      }))

      writeMessage(message)

      /* Write down the payload for ulterior inspection. */
      async.auto({
        writeParsedMessage: function (cbAuto) {
          fs.writeFile('payload.json', fields.mailinMsg, cbAuto)
        },
        writeAttachments: function (cbAuto) {
          async.eachLimit(message.attachments, 3, function (attachment, cbEach) {
            fs.writeFile(attachment.generatedFileName, fields[attachment.generatedFileName], 'base64', cbEach)
          }, cbAuto)
        }
      }, function (err) {
        if (err) {
          console.log(err.stack)
          res.send(500, 'Unable to write payload')
        } else {
          console.log('Webhook payload written.')
          res.send(200)
        }
      })
    } else {
      console.log(err)
    }
  })
})

var http = server.listen(8001, function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('Http server listening on port 3000')
  }
})

process.on('uncaughtException', function (err) {
  console.log(err)
  http.close()
})

process.on('SIGTERM', function (err) {
  console.log(err)
  http.close()
})

mailin.start({
  port: 25,
  webhook: 'http://127.0.0.1:8001/webhook'
})

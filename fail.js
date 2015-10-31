// Nick Mai 2015

var mailin = require('mailin')
var fs = require('fs')

// Cleanup
var msgcount = 0

/* Start the Mailin server. The available options are:
 *  options = {
 *     port: 25,
 *     webhook: 'http://mydomain.com/mailin/incoming,
 *     disableWebhook: false,
 *     logFile: '/some/local/path',
 *     logLevel: 'warn', // One of silly, info, debug, warn, error
 *     smtpOptions: { // Set of options directly passed to simplesmtp.createServer(smtpOptions)
 *        SMTPBanner: 'Hi from a custom Mailin instance',
 *        // By default, the DNS validation of the sender and recipient domains is disabled so.
 *        // You can enable it as follows:
 *        disableDNSValidation: false
 *     }
 *  };
 * Here disable the webhook posting so that you can do what you want with the
 * parsed message. */
mailin.start({
  port: 25,
  disableWebhook: true // Disable the webhook posting.
})

/* Event emitted after a message was received and parsed. */
mailin.on('message', function (connection, data, content) {
  // Not interested in 'content' because this is the raw email.
  // 'data' represents the parsed email.

  saveMessage(connection, data)
})

function saveMessage (connection, data) {
  // JS Standard wants each declaration as a separate statement
  var from = JSON.parse(data.from)
  var to = JSON.parse(data.to)
  console.log('test from: ' + from.name + ' to: ' + to.name)
  var subject = data.subject
  var cc = data.cc
  var body = data.text

  console.log('----Received New Message----')
  for (var f in data.from)
    console.log('From: ' + JSON.parse(f).name + '(' + JSON.parse(f).address + ')')
  for (var t in data.to)
    console.log('To: ' + t.name + '(' + t.address + ')')
  console.log('CC: ' + cc)
  console.log('Subject: ' + subject)
  console.log('----')
  console.log(body)
  console.log('----End Message----')

  try {
    fs.writeFile(msgcount.toString() + '.json', JSON.stringify(data), function () {
      console.log('Wrote message #' + msgcount.toString() + 'to disk.')
    })
  } catch (err) {
    console.log(err)
  }
}
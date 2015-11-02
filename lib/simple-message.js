'use strict'

// example usage:
// var SimpleMessage = require('simple-message')
// var msg = new SimpleMessage()

// re-usable formatter for lists like receiver names/addresses
function formatPeople (arr) {
	var str = ''

	if (arr === 'undefined' || !Array.isArray(arr))
		return str

	for (let p in arr) {
		var val = arr[p]
		var address = val.address ? val.address : '?'
		var name = val.name ? val.name : val.address
		var end = p < arr.length - 1 ? ', ' : ''
		str = str.concat(name + ' (' + p.address + ')' + end)
	}

	return str
}

/* Default options */
var save_fields = {'subject': (str) => { return 'Subject: ' + str },
											'from': (arr) => { return 'From: ' + formatPeople(arr) },
												'to': (arr) => { return 'To: ' + formatPeople(arr) },
												'cc': (arr) => { return 'CC: ' + formatPeople(arr) },
							'receivedDate': (str) => { return 'Date: ' + str },
							        'text': (str) => { return '================\n' + str }



// You can provide fields during construction or just set the later.
class SimpleMessage {
  // @todo: copy msg items over
  // @todo: ensure 'new' keyword was used
  constructor (msg) {
  }

  /* This returns a well-formatted string fit for printing to console or saving */
  /* Note: The order of the items (subject, sender, etc) is dependent on the
           order in which they were added.                                      */
  // @todo: Enforce strict ordering
  valueOf () {
  	var str = ''

    // Items that match save_fields take priority because they're ordered
    for (let field in save_fields) {
      // @todo: define some helper functions for custom formatting
      // for example, 'to' could contain multiple items and I'd want to print them
      // with a format like 'Nick (nick@mail.com), Jessica (jess@mail.com)'
      str = str.concat(save_fields[field] + '\n')
    }

    // There should not be any items that aren't in save_fields, but just in case:

    // @todo: I'm sure theres a one-liner for "cookie cutting". I want to create
    // a list of items that aren't in save_fields.
    var non_save_fields = {}
    // populate
    // print
    for (let field in non_save_fields) {
      // console.log(field)
    }

    return str
  }
}

module.exports = SimpleMessage

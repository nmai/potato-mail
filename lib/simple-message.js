'use strict'
// example usage:
// let SimpleMessage = require('simple-message')
// let msg = new SimpleMessage(rawMsgObj)

/* Default options. Define a formatter function for every field name */
// @todo: Consider using Map. Not sure if it would offer any advantages.
// @todo: Consider changing name to something like 'handlers'.
const FIELDS = { 'subject': (str) => { return 'Subject: ' + str },
                    'from': (arr) => { return 'From: ' + formatPeople(arr) },
                      'to': (arr) => { return 'To: ' + formatPeople(arr) },
                      'cc': (arr) => { return 'CC: ' + formatPeople(arr) },
            'receivedDate': (str) => { return 'Date: ' + str },
                    'text': (str) => { return '================\n' + str } }

const UNDEFINED_FIELD_VALUE = '--'

// Freeze defaults to prevent accidental changes later.
Object.freeze(FIELDS)

// Helper. Returns a string like 'Nick (nick@mail.com), Jessica (jess@mail.com)'
function formatPeople (arr) {
  if (arr === 'undefined' || !Array.isArray(arr)) {
    return UNDEFINED_FIELD_VALUE
  }

  let str = ''
  for (let p in arr) {
    let val = arr[p]
    let address = val.address ? val.address : '?'
    let name = val.name ? val.name : val.address
    let end = p < arr.length - 1 ? ', ' : ''
    str = str.concat(name + ' (' + p.address + ')' + end)
  }

  return str
}

// You can provide message data during construction or set it later.
function SimpleMessage (msg, customFields) {
  // Ensure the `new` command was used; if not, fix it automatically.
  if (this.constructor !== SimpleMessage) { return new SimpleMessage() }

  // Apply custom field options if available
  if (customFields && typeof customFields == 'object') {
    this._fields = applyCustomFields(customFields)
  } else {
    // Save ourself some memory if we aren't using custom fields.
    // Keep in mind, this is a frozen const variable. Any attempts to edit
    // this directly will fail.
    this._fields = FIELDS
  }

  // Properties will be copied in the order defined in the field options.
  // @todo: consider copying the "unwanted" fields somewhere instead of ignoring them.
  this._simplemsg = {}
  if (msg && typeof msg == 'object') {
    this.processMessage(msg)
  } else {
    // @todo: null/undefined is OK to ignore, but if the item is in an incorrect
    //  format (e.g. an array), throw an error or a warning
    this.processMessage()
  }
}

SimpleMessage.prototype.applyCustomFields = function (customFields) {
  this._fields = Object.assign(customFields, FIELDS)
}

SimpleMessage.prototype.processMessage = function (msg){
  for (let field in this._fields) {
    msg = msg ? msg : {}
    let val = msg[field]
    if (val && val.length > 0) {
      console.log('val was found')
      this._simplemsg[field] = val
    } else {
      console.log('val wasnt found')
      this._simplemsg[field] = '--'
    }
  }
}

/* This returns a well-formatted string fit for printing to console or saving */
/* Note: The order of the items (subject, sender, etc) is dependent on the
         order in which they were added.                                      */
// @todo: Enforce strict ordering
SimpleMessage.prototype.toString = function () {
  let str = ''
  // @todo: move this definition somewhere else so it can be changed
  let delimiter = '\n'

  for (let field in this._fields) {
    let handler = this._fields[field]
    let value = this._simplemsg[field]
    str += handler(value) + delimiter
  }
  
  // There should not be any items that aren't in FIELDS, but just in case:
  // @todo: I'm sure theres a one-liner for "cookie cutting". I want to create
  // a list of items that aren't in FIELDS.
  // let non_fields = {}
  // for (let field in non_fields) {
  //   console.log(field)
  // }

  return str
}

module.exports = SimpleMessage

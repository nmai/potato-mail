'use strict'

// first attempt at unit testing.
// initially this file will encompass all tests,
// but later certain tests should be broken out.

// we are going to be printing everything so let's be lazy
let log = console.log

let SimpleMessage = require('../lib/simple-message')

log('-----------------')
log('Creating a SimpleMessage instance with nothing passed to constructor')
let msg = new SimpleMessage()
log('Stringify results:')
log(JSON.stringify(msg))
log('-----------------')
log('toString results:')
log(msg.toString())
log('-----------------')
log('super thorough unit testing: complete')

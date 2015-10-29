# potato-mail

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

Saves inbound emails to disk.

Potato is intended to be run as a daemon. To launch it on startup in Ubuntu:
`sudo npm install -g potato-mail
`sudo update-rc.d potato-mail defaults`

*Note: this is just one of many ways you can do this. I haven't even tested the above method yet. I have read recommendations to use `authbind` rather than launching node as a root process (required to bind ports`<1000`)*
# potato-mail

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

Saves inbound emails to disk.

In the future, I'd like to add full-scale message handling capabilities such as:
* Dynamic message forwarding. Will pass relevant data to different addresses based on a set of rules.
* Webhooks. 
* Integration with other apps/services.

Potato is intended to be run as a daemon. To launch it on startup in Ubuntu:
```sh
sudo npm install -g potato-mail
sudo update-rc.d potato-mail defaults`
```

In a full production environment, you might want to use [Supervisor](http://supervisord.org/) instead, as it's simple to configure and it offers a lot more features.

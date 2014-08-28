Tracking errors and solutions for the angular-seed project.

fatal: unable to connect to github.com
--------------------------------------

Here are the details error message you may see
when you try to execute **bower install** ::

  > bower install

  Additional error details:
  fatal: unable to connect to github.com:
  github.com[0: 192.30.252.130]: errno=Connection refused
  
  npm ERR! angular-seed@0.0.0 postinstall: `bower install`
  npm ERR! Exit status 1
  npm ERR!
  npm ERR! Failed at the angular-seed@0.0.0 postinstall script.
  npm ERR! This is most likely a problem with the angular-seed package,
  npm ERR! not with npm itself.
  npm ERR! Tell the author that this fails on your system:
  npm ERR!     bower install
  npm ERR! You can get their info via:
  npm ERR!     npm owner ls angular-seed
  npm ERR! There is likely additional logging output above.
  npm ERR! System Linux 2.6.18-128.el5
  npm ERR! command "/usr/opspedia/xampp/rd/cfgrepo/sample/nodejs/parts/nodejs-build/bin/node" "/usr/opspedia/xampp/rd/cfgrepo/sample/nodejs/parts/nodejs-build/bin/npm" "install"
  npm ERR! cwd /usr/opspedia/xampp/rd/angular-seed
  npm ERR! node -v v0.10.25
  npm ERR! npm -v 1.3.24
  npm ERR! code ELIFECYCLE
  npm ERR!
  npm ERR! Additional logging details can be found in:
  npm ERR!     /usr/opspedia/xampp/rd/angular-seed/npm-debug.log
  npm ERR! not ok code 0

bower is trying to use **git** to fetch some packages 
directly from github.com.
By default, git will use **git://** protocol.
In my case here, my corporation's firewall blocked that protocol.
The easy solution is telling **git** to use **https://** instead of
**git://**.
Here is git config::

  $ cd angular-seed
  $ git config url."https://".insteadof git://

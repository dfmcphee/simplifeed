Simplifeed 2
===========

Simplifeed is a beautiful, private social network for close friends and family. It has been completely rewritten from the ground up using Node.js, the Geddy.js framework and Amazon's S3. The schema has also been redesigned to use a relational database (PostgreSQL) to make for cleaner models and relationships. Note this is still a work in progress and more features will be coming in the future.


Requirements
------------
***Node 0.10.x***

Easiest way is to use nvm: https://github.com/creationix/nvm

***Geddy 0.13.x***

```
[sudo] npm -g install geddy
```

***PostgreSQL***

http://www.postgresql.org/

***ImageMagick***

http://www.imagemagick.org/


Getting Started
---------------
Open a command line and change to the directory

Run `npm install` to install dependencies

Run `geddy secret` to generate a new secrets file

Run `geddy jake db:migrate` to create the database

Add your [SMTP](https://github.com/dfmcphee/simplifeed/wiki/SMTP-Configuration) or [Mandrill](https://github.com/dfmcphee/simplifeed/wiki/Mandrill-Configuration) config

Configure [S3 storage](https://github.com/dfmcphee/simplifeed/wiki/S3-Configuration) if you want (will store uploads locally otherwise)

Run `geddy` to start the server

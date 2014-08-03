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

You will need to add your mailer and s3 config to your secrets file after it has been generated

Run `geddy` to start the server

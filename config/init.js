var sockets = require('./sockets');
var nodemailer = require("nodemailer");
var moment = require("moment");

var init = function(cb) {
  // Add uncaught-exception handler in prod-like environments
  if (geddy.config.environment != 'development') {
    process.addListener('uncaughtException', function (err) {
      var msg = err.message;
      if (err.stack) {
        msg += '\n' + err.stack;
      }
      if (!msg) {
        msg = JSON.stringify(err);
      }
      geddy.log.error(msg);
    });
  }

  sockets.init();

  // Initialize s3
  geddy.uploadfs = require('uploadfs')();

  var storage = geddy.config.storage;

  if (storage && storage.backend === 's3') {
    storage.secret = geddy.config.s3.secret;
    storage.key = geddy.config.s3.key;
    storage.bucket = geddy.config.s3.bucket;
    storage.region = geddy.config.s3.region;
  } else {
    storage.uploadsUrl = geddy.config.protocol + '://' + geddy.config.externalHost + "/";
  }

  console.log(storage);

  geddy.uploadfs.init(storage, function() {
    console.log('Storage initialized.');
  });

  // Create reusable transport method (opens pool of SMTP connections)
  geddy.smtpTransport = nodemailer.createTransport("SMTP", geddy.config.mailer.transport.options);

  // Send mail with defined transport object
  geddy.sendMail = function (mailOptions) {
      geddy.smtpTransport.sendMail(mailOptions, function(error, response){
          if(error){
              console.log('Error sending message: ' + error);
          } else {
              console.log('Message sent: ' + response.message);
          }
      });
  };

  geddy.moment = moment;

  cb();
};

exports.init = init;

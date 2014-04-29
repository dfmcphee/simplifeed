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

  geddy.uploadfs.init({
    backend: 's3',
    secret: geddy.config.s3.secret,
    key: geddy.config.s3.key,
    bucket: geddy.config.s3.bucket,
    region: geddy.config.s3.region,
    tempPath: 'temp',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 200,
        height: 200
      },
      {
        name: 'small',
        width: 500,
        height: 500
      }
    ],
    parallel: 10
  }, function() {
    console.log('S3 initialized.');
  });

  // Create reusable transport method (opens pool of SMTP connections)
  geddy.smtpTransport = nodemailer.createTransport("SMTP", geddy.config.mailer.transport.options);

  // Send mail with defined transport object
  geddy.sendMail = function (mailOptions) {
      geddy.smtpTransport.sendMail(mailOptions, function(error, response){
          if(error){
              console.log(error);
          } else{
              console.log("Message sent: " + response.message);
          }
      });
  };

  geddy.moment = moment;

  cb();
};

exports.init = init;

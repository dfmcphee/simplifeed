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

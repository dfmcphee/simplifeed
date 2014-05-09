var fs = require('fs');
var aglio = require('aglio');

var Docs = function () {
  this.respondsWith = ['html'];

  this.index = function (req, resp, params) {
    var self = this;
    fs.readFile( __dirname + '/../views/docs/api.md', function (err, data) {
      if (err) {
        throw err;
      }

      var blueprint = data.toString();
      var template = '../../../app/views/docs/template';

      aglio.render(blueprint, template, function (err, html, warnings) {
          if (err) return console.log(err);
          if (warnings) console.log(warnings);

          self.respond({blueprint: html});
      });
    });
  };
};

exports.Docs = Docs;

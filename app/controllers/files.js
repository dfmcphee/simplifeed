var passport = require('../helpers/passport')
  , requireAuth = passport.requireAuth
  , validFileType = require('../helpers/validation').validFileType
  , uniqid = require('../helpers/general').uniqid
  , removeUpload = require('../helpers/files').removeUpload
  , formidable = require('formidable');

var Files = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.before(requireAuth, {});

  this.create = function (req, resp, params) {
    var self = this
      , form = new formidable.IncomingForm()
      , uploadedFile
      , savedFile
      , fileType
      , fileSize;

    form.on('file', function(name, file) {
      if (!validFileType(file.type)){
        throw new geddy.errors.BadRequestError('That is not a valid file type.');
      }

      var fileExt = file.name.split('.').pop();
      var newFile = uniqid('img') + '.' + fileExt.toLowerCase();

      geddy.uploadfs.copyImageIn(file.path, '/uploads/' + newFile, function(e, info) {
        if (e) {
          throw new geddy.errors.BadRequestError(e);
        } else {
          var fileParams = {
            filename: info.basePath + '.' + info.extension,
            title: '',
            full: geddy.uploadfs.getUrl() + info.basePath + '.' + info.extension,
            small: geddy.uploadfs.getUrl() + info.basePath + '.small.' + info.extension,
            thumbnail: geddy.uploadfs.getUrl() + info.basePath + '.thumbnail.' + info.extension
          };

          var createdFile = geddy.model.File.create(fileParams);

          if (!createdFile.isValid()) {
            this.respondWith(createdFile);
          }

          createdFile.save(function(err, data) {
            if (err) {
              throw err;
            }
            self.respond({
              files: [{
                id: createdFile.id,
                url: geddy.uploadfs.getUrl() + info.basePath + '.' + info.extension,
                thumbnail_url: geddy.uploadfs.getUrl() + info.basePath + '.thumbnail.' + info.extension,
                name: newFile,
                type: file.type,
                size: file.size,
                delete_url: "/files/" + createdFile.id,
                delete_type: "DELETE"
              }]
            }, {format: 'json'});
          });
        }
      });
    });

    form.parse(req);
  };

  this.update = function (req, resp, params) {
    // Save the resource, then display the item page
    this.redirect({controller: this.name, id: params.id});
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.File.first(params.id, function(err, file) {
      if (err) {
        throw err;
      }
      if (!file) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        var filename = file.filename.split('.');
        removeUpload(filename);
        geddy.model.File.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respond({success: true}, {format: 'json'});
        });
      }
    });
  };
};

exports.Files = Files;

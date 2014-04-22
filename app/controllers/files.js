var passport = require('../helpers/passport')
  , requireAuth = passport.requireAuth
  , validFileType = require('../helpers/validation').validFileType
  , uniqid = require('../helpers/general').uniqid
  , formidable = require('formidable')
  , uploadfs = require('uploadfs')();

var Files = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.before(requireAuth, {});

  uploadfs.init({
    backend: 's3',
    // Get your credentials at aws.amazon.com
    secret: geddy.config.s3.secret,
    key: geddy.config.s3.key,
    // You need to create your bucket first before using it here
    // Go to aws.amazon.com
    bucket: geddy.config.s3.bucket,
    // I recommend creating your buckets in a region with
    // read-after-write consistency (not us-standard)
    // region: 'us-west-2',
    // Required if you use copyImageIn
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
    parallel: 2
  }, function() {

  });

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

      uploadfs.copyImageIn(file.path, '/uploads/' + newFile, function(e, info) {
        if (e) {
          throw new geddy.errors.BadRequestError(e);
        } else {
          var fileParams = {
            filename: info.basePath + '.' + info.extension,
            title: '',
            full: uploadfs.getUrl() + info.basePath + '.' + info.extension,
            small: uploadfs.getUrl() + info.basePath + '.small.' + info.extension,
            thumbnail: uploadfs.getUrl() + info.basePath + '.thumbnail.' + info.extension
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
                url: uploadfs.getUrl() + info.basePath + '.' + info.extension,
                thumbnail_url: uploadfs.getUrl() + info.basePath + '.thumbnail.' + info.extension,
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
        uploadfs.remove(filename[0] + '.' + filename[1], function(e) {
          uploadfs.remove(filename[0] + '.small.' + filename[1], function(e) {
            uploadfs.remove(filename[0] + '.thumbnail.' + filename[1], function(e) {
              geddy.model.File.remove(params.id, function(err) {
                if (err) {
                  throw err;
                }
                self.respond({success: true}, {format: 'json'});
              });
            });
          });
        });
      }
    });
  };
};

exports.Files = Files;

var passport = require('../helpers/passport')
  , requireAuth = passport.requireAuth
  , validFileType = require('../helpers/validation').validFileType
  , uniqid = require('../helpers/general').uniqid
  , formidable = require('formidable')
  , uploadfs = require('uploadfs')();

var Files = function() {

  this.respondsWith = ['json'];
  this.before(requireAuth, {});

  this.upload = function (req, resp, params) {

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
      var newFile = uniqid('img') + '.' + fileExt;

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
      },
      function(e) {
        uploadfs.copyImageIn(file.path, '/uploads/' + newFile, function(e, info) {
          if (e) {
            throw new geddy.errors.BadRequestError(e);
          } else {
            self.respond({
              thumbnal: uploadfs.getUrl() + info.basePath + '.thumbnail.' + info.extension,
              small: uploadfs.getUrl() + info.basePath + '.small.' + info.extension,
              full: uploadfs.getUrl() + info.basePath + '.' + info.extension
            }, {
                format: 'json'
            });
          }
        });
      });
    });

    form.parse(req);
  };
};

exports.Files = Files;

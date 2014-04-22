var assert = require('assert')
  , tests
  , File = geddy.model.File;

tests = {

  'after': function (next) {
    // cleanup DB
    File.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var file = File.create({});
    file.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;

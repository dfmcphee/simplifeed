var assert = require('assert')
  , tests
  , Notification = geddy.model.Notification;

tests = {

  'after': function (next) {
    // cleanup DB
    Notification.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var notification = Notification.create({});
    notification.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;

var async = require('async'),
  suppressError = require('../lib'),
  assert = require('assert');

async.parallel({
  one: suppressError(function (cb) {
    setTimeout(function () {
      cb(new Error('bad'));
    }, 200);
  }),
  two: suppressError(function (cb) {
    setTimeout(function () {
      cb(null, 2);
    }, 100);
  })
}, function (err, results) {
  if (err) throw err;
  assert.equal(results.one.error.message, 'bad');
  assert.equal(results.two.value, 2);
  console.log('ok');
});

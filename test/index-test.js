var suppressError = require('../lib');

describe('suppress-error', function () {
  it('should pass an error to the value', function (done) {
    var real = function (cb) {
      cb('bad');
    };

    var wrapped = suppressError(real);

    wrapped(function (err, result) {
      if (err) return done(err);
      result.error.should.equal('bad');
      done();
    });
  });

  it('should support single value', function (done) {
    var action = suppressError(function (cb) {
      cb(null, 'val');
    });

    action(function (err, result) {
      if (err) return done(err);
      result.value.should.equal('val');
      done();
    });
  });

  it('should support multiple values', function (done) {
    var action = suppressError(function (cb) {
      cb(null, 'a', 'b', 'c');
    });

    action(function (err, result) {
      if (err) return done(err);
      result.value.should.equal('a');
      result.values.should.eql(['a', 'b', 'c']);
      done();
    });
  });

  it('should find the last function even if it is in the middle', function (done) {
    var action = suppressError(function (first, second, cb, last) {
      first.should.equal('a');
      second.should.be.type('function');
      last.should.equal('e');
      cb(null, 'b', 'c', 'd');
    });

    action('a', function () {}, function (err, result) {
      if (err) return done(err);
      result.value.should.equal('b');
      result.values.should.eql(['b', 'c', 'd']);
      done();
    }, 'e');
  });

  it('should throw an error if no function is provided', function () {
    (function () {
      suppressError(function () {
        // noop
      })();
    }).should.throw('no callback');
  });
});

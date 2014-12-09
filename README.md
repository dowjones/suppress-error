# Suppress Error [![Build Status](https://secure.travis-ci.org/areusjs/suppress-error.png)](http://travis-ci.org/areusjs/suppress-error) [![NPM version](https://badge.fury.io/js/suppress-error.svg)](http://badge.fury.io/js/suppress-error)

This library wraps a function, suppresses node-style errors, and surfaces them
in the value. This is useful when you're working with `async` and need the
entire `map` (or all tasks in `parallel`) not to fail because of
failure in one.

## Usage

```javascript
var suppressError = require('suppress-error');

function action(cb) {
  cb(new Error('bad'));
}

var suppressedAction = suppressError(action);

action(function (err) {
  console.log(err);           // renders Error('bad')
});

suppressedAction(function (err, results) {
  console.log(err);           // renders null
  console.log(results.error); // renders [Error: bad]
});
```

### With `async`

```javascript
var async = require('async'),
  suppressError = require('suppress-error'),
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
});
```


*Note* that even though `one` returned an error, the final
callback was called (as async intentionally never got the error),
and the error itself is surfaced in `one.error`.

## API

`suppressError(Function) -> Function`

The called wrapped function returns a `error` (which is null) as
the first argument and `results` as the second argument, which contains:

```
{
  error: (Error|null),   // that was passed to the cb
  value: Object,         // the first non-error argument (for convenience)
  values: Array          // all of the non-error arguments
}
```

## License

[MIT](/LICENSE)

var suppressError = require('../lib');

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

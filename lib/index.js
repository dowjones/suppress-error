var slice = Array.prototype.slice;

/**
 * Ensure that the callback is not called
 * with the error directly, but instead
 * the cb is returned with a null for error
 * and an object: {error: (null|Error), value: Object}
 *
 * This is useful for using with libraries like async,
 * where you don't want the iteration to end after a singe
 * failure. For example:
 *
 * ```
 * async.parallel({
 *   one: suppressError(function (cb) {
 *     cb(null
 *   });
 * });
 * ```
 */

module.exports = function suppressError(func) {
  return function () {
    var args = slice.call(arguments),
      funcIndex = findLastFunctionIndex(args),
      cb = args[funcIndex];

    if (-1 === funcIndex) throw new Error('no callback');

    args[funcIndex] = function (err) {
      var values = slice.call(arguments, 1);
      cb(null, {
        error: err,
        value: values[0],
        values: values
      });
    };

    func.apply(null, args);
  };
};

function findLastFunctionIndex(arr) {
  var idx = -1, i, l;
  for (i = 0, l = arr.length; i < l; i++) {
    if ('function' === typeof arr[i]) idx = i;
  }
  return idx;
}

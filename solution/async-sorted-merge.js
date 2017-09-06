'use strict'

/*3rd party module https://www.npmjs.com/package/binary-search-insert, used to more efficiently insert a log chronologically by last.date into the sorted logSources array: O(log(n) using binary search/insert*/
const BinarySearchInsert = require('binary-search-insert');
const comparator = function (a, b) { return b.last.date - a.last.date; };

module.exports = (logSources, printer) => {
  /*sort the logSources reverse chronologically using BinarySearchInsert for each logSource, based on the last log (which is the oldest w/in each logSource, since each source is already chronological) */
  logSources = logSources.reduce((acc, logSource) => {
    BinarySearchInsert(acc, comparator, logSource);
    return acc;
  }, []);

  let curr;

  processNextLog();

  function processNextLog() {
    //base case - print results & return if no logs left to process
    if (logSources.length === 0) {
      //prints a few stats (i.e., logs printed, time taken, logs/s) of the solution
      printer.done();
      return;
    }
    /* otherwise, remove the last logSources in the array (last is the oldest date) & print it */
    curr = logSources.pop();
    printer.print(curr.last);
    //remove that log from the logSource & reset last. once the promise has resolved, check the return value (i.e., currLast)...
    curr.popAsync().then(currLast => {
      //if the logSource isn't drained (i.e., the return value is the last log), then insert the new last log into logSources using binarySearchInsert
      if (currLast) {
        BinarySearchInsert(logSources, comparator, curr);
      }
      //recurse until there are no more logs to process...
      processNextLog();
    });
  }
}

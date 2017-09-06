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

  //while there are still logs to process...
  while (logSources.length > 0) {
    /* remove the last logSources in the array (last is the oldest date) & print it */
    curr = logSources.pop();
    printer.print(curr.last);
    //remove that log from the logSource & reset last
    curr.pop();
    //if the logSource isn't drained, then insert the new last log into logSources using BinarySearchInsert
    if (!curr.drained) {
      BinarySearchInsert(logSources, comparator, curr);
    }
  }

  //prints a few stats (i.e., logs printed, time taken, logs/s) of the solution
  printer.done();
}

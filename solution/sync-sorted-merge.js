'use strict'

/*3rd party module https://www.npmjs.com/package/binary-search-insert, used to more efficiently insert a log chronologically by last.date into the sorted logSources array: O(log(n) using binary search/insert*/
let binarySearchInsert = require('binary-search-insert');
let comparator = function (a, b) { return b.last.date - a.last.date; }

module.exports = (logSources, printer) => {
  /*sort the logSources reverse chronologically using mergesort, based on the last log (which is the oldest w/in each logSource, since each source is already chronological) */
  logSources = mergesort(logSources);

  let curr;

  //while there are still logs to process...
  while (logSources.length > 0) {
    /* remove the last logSources in the array (last is the oldest date) & print it */
    curr = logSources.pop();
    printer.print(curr.last);
    //remove that log from the logSources & reset last
    curr.pop();
    //if the logSource isn't drained, then insert the new last log into logSources using binarySearchInsert
    if (!curr.drained) {
      binarySearchInsert(logSources, comparator, curr);
    }
  }

  //prints a few stats (i.e., logs printed, time taken, logs/s) of the solution
  printer.done();

  /*Big O: time complexity for mergesort is on average O(n log(n)). Source: http://bigocheatsheet.com/ */
  function mergesort(input) {
    function merge(arr1, arr2){
      const totalElements = arr1.length + arr2.length;
      let result = [];
      let i = 0;
      let j = 0;
      while (i + j < totalElements) {
        //sort chronogically by last.date (oldest at the end)
        if (j >= arr2.length || (i < arr1.length && arr1[i].last.date >= arr2[j].last.date)){
          result.push(arr1[i]);
          i++;
        } else {
          result.push(arr2[j]);
          j++;
        }
      }
      return result;
    }

    function divide(arr) {
      if (arr.length < 2) { return arr; }
      const mid = Math.floor(arr.length / 2);
      return merge(divide(arr.slice(0, mid)), divide(arr.slice(mid)));
    }

    return divide(input);
  }
}

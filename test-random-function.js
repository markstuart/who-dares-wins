/**
 * This file can be run using node like so: node ./test-random-function.js
 */

// Just some test data, values in here don't matter
var entries = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

function randomIndex() {
  return 3 // This should return a random number between 0 and (entries.length - 1)
}

function testRandomArrayIndex() {
  var i = 0
  var min = 0
  var max = entries.length - 1
  var indexes = {}

  do {
    var index = randomIndex()
    if (index < min || index > max) {
      throw new Error('index out of bounds')
    } else {
      // Store the random index as a key on an object,
      // so the keys represent all unique random numbers
      indexes[index] = true
    }

    i += 1
  } while (i < 10000)

  if (Object.keys(indexes).length !== entries.length) {
    console.error('Not all values were found:', Object.keys(indexes))
  } else {
    console.log('All values found, all within bounds!')
  }
}

testRandomArrayIndex()
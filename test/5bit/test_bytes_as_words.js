const {deepEqual} = require('node:assert').strict;
const test = require('node:test');
const {throws} = require('node:assert').strict;

const bytesAsWords = require('./../../5bit/bytes_as_words');

const hexAsBuffer = hex => Buffer.from(hex, 'hex');

const tests = [
  {
    args: {},
    description: 'Data bytes are expected',
    error: 'ExpectedDataBytesToConvertToDataWords',
  },
  {
    args: {bytes: hexAsBuffer('')},
    description: 'No bytes are mapped to no words',
    expected: {words: []},
  },
  {
    args: {bytes: hexAsBuffer('ff')},
    description: 'A single byte is mapped to words with zero padding',
    expected: {words: [31, 28]},
  },
  {
    args: {bytes: hexAsBuffer('751e76e8199196d454941c45d1b3a323f1433bd6')},
    description: 'Bytes are mapped to words',
    expected: {
      words: [
        14, 20, 15, 7, 13, 26, 0, 25, 18, 6, 11, 13, 8, 21, 4, 20, 3, 17, 2,
        29, 3, 12, 29, 3, 4, 15, 24, 20, 6, 14, 30, 22,
      ],
    },
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => bytesAsWords(args), new Error(error), 'Err');
    } else {
      const res = bytesAsWords(args);

      deepEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

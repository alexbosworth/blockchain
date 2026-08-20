const {deepEqual} = require('node:assert').strict;
const test = require('node:test');
const {throws} = require('node:assert').strict;

const wordsAsBytes = require('./../../5bit/words_as_bytes');

const hexAsBuffer = hex => Buffer.from(hex, 'hex');

const tests = [
  {
    args: {},
    description: 'An array of data words is expected',
    error: 'ExpectedArrayOfDataWordsToConvertToDataBytes',
  },
  {
    args: {words: [1.5]},
    description: 'Integer data words are expected',
    error: 'ExpectedIntegerDataWordsToConvertToDataBytes',
  },
  {
    args: {words: [NaN]},
    description: 'Numeric data words are expected',
    error: 'ExpectedIntegerDataWordsToConvertToDataBytes',
  },
  {
    args: {words: [32]},
    description: 'Data words within the word value range are expected',
    error: 'Expected5BitDataWordValuesToConvertToDataBytes',
  },
  {
    args: {words: [-1]},
    description: 'Unsigned data words are expected',
    error: 'Expected5BitDataWordValuesToConvertToDataBytes',
  },
  {
    args: {words: [31, 28, 0]},
    description: 'A full extra word of padding is not expected',
    error: 'ExpectedNoPaddingWordsToConvertToDataBytes',
  },
  {
    args: {words: [31, 31]},
    description: 'Non-zero padding bits are not expected',
    error: 'UnexpectedNonZeroPadding',
  },
  {
    args: {words: []},
    description: 'No words are mapped to no bytes',
    expected: {bytes: hexAsBuffer('')},
  },
  {
    args: {words: [31, 28]},
    description: 'Words are mapped to a byte, removing zero padding',
    expected: {bytes: hexAsBuffer('ff')},
  },
  {
    args: {
      words: [
        14, 20, 15, 7, 13, 26, 0, 25, 18, 6, 11, 13, 8, 21, 4, 20, 3, 17, 2,
        29, 3, 12, 29, 3, 4, 15, 24, 20, 6, 14, 30, 22,
      ],
    },
    description: 'Words are mapped to bytes',
    expected: {bytes: hexAsBuffer('751e76e8199196d454941c45d1b3a323f1433bd6')},
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => wordsAsBytes(args), new Error(error), 'Err');
    } else {
      const res = wordsAsBytes(args);

      deepEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

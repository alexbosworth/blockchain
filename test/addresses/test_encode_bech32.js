const {deepEqual} = require('node:assert').strict;
const test = require('node:test');
const {throws} = require('node:assert').strict;

const encodeBech32 = require('./../../addresses/encode_bech32');

const tests = [
  {
    args: {prefix: 'tc', type: 'bech32', words: [0]},
    description: 'A known prefix is expected',
    error: 'ExpectedKnownBech32AddressPrefixToEncodeBech32',
  },
  {
    args: {prefix: 'bc', type: 'bech32k', words: [0]},
    description: 'A known bech32 type is expected',
    error: 'ExpectedKnownBech32TypeToEncodeBech32String',
  },
  {
    args: {prefix: 'bc', type: 'bech32'},
    description: 'An array of data words is expected',
    error: 'ExpectedArrayOfDataWordsToEncodeBech32String',
  },
  {
    args: {prefix: 'bc', type: 'bech32', words: [1.5]},
    description: 'Integer data words are expected',
    error: 'ExpectedIntegerDataWordsToEncodeBech32String',
  },
  {
    args: {prefix: 'bc', type: 'bech32', words: [32]},
    description: 'Data words within the word value range are expected',
    error: 'Expected5BitDataWordValuesToEncodeBech32String',
  },
  {
    args: {
      prefix: 'bc',
      type: 'bech32',
      words: [
        0, 14, 20, 15, 7, 13, 26, 0, 25, 18, 6, 11, 13, 8, 21, 4, 20, 3, 17,
        2, 29, 3, 12, 29, 3, 4, 15, 24, 20, 6, 14, 30, 22,
      ],
    },
    description: 'Words are encoded as a bech32 string',
    expected: {encoded: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'},
  },
  {
    args: {prefix: 'bc', type: 'bech32m', words: [16, 14, 20, 15, 0]},
    description: 'Words are encoded as a bech32m string',
    expected: {encoded: 'bc1sw50qgdz25j'},
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => encodeBech32(args), new Error(error), 'Err');
    } else {
      const res = encodeBech32(args);

      deepEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

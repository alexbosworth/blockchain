const {deepEqual} = require('node:assert').strict;
const test = require('node:test');
const {throws} = require('node:assert').strict;

const bech32Type = require('./../../addresses/bech32_type');

const hexAsBuffer = hex => Buffer.from(hex, 'hex');

const tests = [
  {
    args: {prefix: 'bc', words: [0, 0, 0, 0, 0, 0]},
    description: 'The checksum must derive to a known value',
    error: 'UnexpectedChecksumValueForBech32DataAndPrefix',
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => bech32Type(args), new Error(error), 'Err');
    } else {
      const res = bech32Type(args);

      deepEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

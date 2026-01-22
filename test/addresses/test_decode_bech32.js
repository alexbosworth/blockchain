const {deepEqual} = require('node:assert').strict;
const test = require('node:test');
const {throws} = require('node:assert').strict;

const decodeBech32 = require('./../../addresses/decode_bech32');

const hexAsBuffer = hex => Buffer.from(hex, 'hex');

const tests = [
  {
    args: {encoded: null},
    description: 'A bech32 string is expected',
    error: 'ExpectedEncodedStringToDecodeBech32String',
  },
  {
    args: {encoded: 'b'.repeat(91)},
    description: 'A short bech32 string is expected',
    error: 'ExpectedShorterBech32EncodedStringToDecode',
  },
  {
    args: {encoded: 'b'.repeat(7)},
    description: 'A long bech32 string is expected',
    error: 'ExpectedLongerBech32EncodedStringToDecode',
  },
  {
    args: {encoded: '1QR508D6QEJXTDG4Y5R3ZARVARYV98GJ9P'},
    description: 'A farther divider is expected',
    error: 'ExpectedLaterDividerPositionForBech32String',
  },
  {
    args: {encoded: 'BCKJBC1QR5'},
    description: 'A shorter divider is expected',
    error: 'ExpectedChecksumDataForBech32String',
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => decodeBech32(args), new Error(error), 'Err');
    } else {
      const res = decodeBech32(args);

      deepEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

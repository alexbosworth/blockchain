const {deepStrictEqual} = require('node:assert').strict;
const {throws} = require('node:assert').strict;
const test = require('node:test');

const {p2wpkhOutputScript} = require('./../../');

const bufferFromHex = hex => Buffer.from(hex, 'hex');

const tests = [
  {
    args: {},
    description: 'A hash is required',
    error: 'ExpectedWitnessPublicKeyHashToDeriveOutputScript',
  },
  {
    args: {hash: bufferFromHex('8d7a0a3461e3891723e5fdf8129caa0075060c')},
    description: 'A correctly sized hash is required',
    error: 'ExpectedKnownLengthWitnessPublicKeyHashForOutputScript',
  },
  {
    args: {hash: bufferFromHex('8d7a0a3461e3891723e5fdf8129caa0075060cff')},
    description: 'An output script is derived for a hash',
    expected: {
      script: bufferFromHex('00148d7a0a3461e3891723e5fdf8129caa0075060cff'),
    },
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => p2wpkhOutputScript(args), new Error(error), 'Got err');
    } else {
      const res = p2wpkhOutputScript(args);

      deepStrictEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

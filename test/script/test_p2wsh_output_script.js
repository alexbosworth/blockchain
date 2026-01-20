const {deepStrictEqual} = require('node:assert').strict;
const {throws} = require('node:assert').strict;
const test = require('node:test');

const {p2wshOutputScript} = require('./../../');

const bufferFromHex = hex => Buffer.from(hex, 'hex');

const tests = [
  {
    args: {},
    description: 'A hash is required',
    error: 'ExpectedWitnessScriptHashToDeriveOutputScript',
  },
  {
    args: {hash: bufferFromHex('8d7a0a3461e3891723e5fdf8129caa0075060c')},
    description: 'A correctly sized hash is required',
    error: 'ExpectedKnownLengthWitnessScriptHashForOutputScript',
  },
  {
    args: {
      hash: bufferFromHex('cdbf909e935c855d3e8d1b61aeb9c5e3c03ae8021b286839b1a72f2e48fdba70'),
    },
    description: 'An output script is derived for a hash',
    expected: {
      script: bufferFromHex('0020cdbf909e935c855d3e8d1b61aeb9c5e3c03ae8021b286839b1a72f2e48fdba70'),
    },
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => p2wshOutputScript(args), new Error(error), 'Got err');
    } else {
      const res = p2wshOutputScript(args);

      deepStrictEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

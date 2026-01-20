const {deepStrictEqual} = require('node:assert').strict;
const {throws} = require('node:assert').strict;
const test = require('node:test');

const {p2trOutputScript} = require('./../../');

const bufferFromHex = hex => Buffer.from(hex, 'hex');

const tests = [
  {
    args: {},
    description: 'A hash is required',
    error: 'ExpectedTaprootHashToDeriveOutputScript',
  },
  {
    args: {hash: bufferFromHex('8d7a0a3461e3891723e5fdf8129caa0075060c')},
    description: 'A correctly sized hash is required',
    error: 'ExpectedKnownLengthTaprootHashForOutputScript',
  },
  {
    args: {
      hash: bufferFromHex('667bdd93c7c029767fd516d2ea292624b938fefefa175ac9f1220cf508963ff3'),
    },
    description: 'An output script is derived for a hash',
    expected: {
      script: bufferFromHex('5120667bdd93c7c029767fd516d2ea292624b938fefefa175ac9f1220cf508963ff3'),
    },
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => p2trOutputScript(args), new Error(error), 'Got err');
    } else {
      const res = p2trOutputScript(args);

      deepStrictEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

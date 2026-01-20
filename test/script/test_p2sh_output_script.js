const {deepStrictEqual} = require('node:assert').strict;
const {throws} = require('node:assert').strict;
const test = require('node:test');

const {p2shOutputScript} = require('./../../');

const bufferFromHex = hex => Buffer.from(hex, 'hex');

const tests = [
  {
    args: {},
    description: 'A hash is required',
    error: 'ExpectedScriptHashToDerivePayToScriptOutputScript',
  },
  {
    args: {hash: bufferFromHex('433ec2ac1ffa1b7b7d027f564529c57197f9ae')},
    description: 'A correctly sized hash is required',
    error: 'UnexpectedHashLengthForPayToScriptHashOutputScript',
  },
  {
    args: {hash: bufferFromHex('433ec2ac1ffa1b7b7d027f564529c57197f9ae88')},
    description: 'An output script is derived for a hash',
    expected: {
      script: bufferFromHex('a914433ec2ac1ffa1b7b7d027f564529c57197f9ae8887'),
    },
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => p2shOutputScript(args), new Error(error), 'Got err');
    } else {
      const res = p2shOutputScript(args);

      deepStrictEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

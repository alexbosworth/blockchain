const {deepStrictEqual} = require('node:assert').strict;
const {throws} = require('node:assert').strict;
const test = require('node:test');

const {p2pkhOutputScript} = require('./../../');

const bufferFromHex = hex => Buffer.from(hex, 'hex');

const tests = [
  {
    args: {},
    description: 'A hash is required',
    error: 'ExpectedPublicKeyHashToDeriveOutputScript',
  },
  {
    args: {hash: bufferFromHex('12ab8dc588ca9d5787dde7eb29569da63c3a23')},
    description: 'A correctly sized hash is required',
    error: 'UnexpectedHashLengthForPublicKeyHashOutputScript',
  },
  {
    args: {hash: bufferFromHex('12ab8dc588ca9d5787dde7eb29569da63c3a238c')},
    description: 'An output script is derived for a hash',
    expected: {
      script: bufferFromHex('76a91412ab8dc588ca9d5787dde7eb29569da63c3a238c88ac'),
    },
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => p2pkhOutputScript(args), new Error(error), 'Got err');
    } else {
      const res = p2pkhOutputScript(args);

      deepStrictEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

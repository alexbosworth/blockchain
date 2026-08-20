const {deepStrictEqual} = require('node:assert').strict;
const {throws} = require('node:assert').strict;
const test = require('node:test');

const {hashForP2pkh} = require('./../../');

const bufferFromHex = hex => Buffer.from(hex, 'hex');

const tests = [
  {
    args: {},
    description: 'A public key is required',
    error: 'ExpectedPublicKeyToDerivePublicKeyHash160',
  },
  {
    args: {
      key: bufferFromHex('0479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8'),
    },
    description: 'A compressed public key is required',
    error: 'ExpectedCompressedPublicKeyToDerivePublicKeyHash160',
  },
  {
    args: {
      key: bufferFromHex('0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798'),
    },
    description: 'A hash is derived for the BIP 173 example public key',
    expected: {
      hash: bufferFromHex('751e76e8199196d454941c45d1b3a323f1433bd6'),
    },
  },
  {
    args: {
      key: bufferFromHex('025476c2e83188368da1ff3e292e7acafcdb3566bb0ad253f62fc70f07aeee6357'),
    },
    description: 'A hash is derived for the BIP 143 example public key',
    expected: {
      hash: bufferFromHex('1d0f172a0ecb48aee1be1f2687d2963ae33f71a1'),
    },
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => hashForP2pkh(args), new Error(error), 'Got err');
    } else {
      const res = hashForP2pkh(args);

      deepStrictEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

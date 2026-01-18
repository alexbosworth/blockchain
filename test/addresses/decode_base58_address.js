const {deepEqual} = require('node:assert').strict;
const test = require('node:test');
const {throws} = require('node:assert').strict;

const {decodeBase58Address} = require('./../../');

const hexAsBuffer = hex => Buffer.from(hex, 'hex');

const tests = [
  {
    args: {},
    description: 'An address is expected',
    error: 'ExpectedBase58AddressStringToDecode',
  },
  {
    args: {address: ' '},
    description: 'A non-empty address is expected',
    error: 'ExpectedNonEmptyBase58AddressToDecode',
  },
  {
    args: {address: '16ro3Jptwo4asSevZnsRX6vfRS24TGE6uP'},
    description: 'Address checksum must match',
    error: 'ExpectedValidPayloadChecksumInBase58Address',
  },
  {
    args: {address: '16ro3Jptwo4asSevZnsRX6vfRS24TGE6'},
    description: 'Address checksum must be present',
    error: 'ExpectedVersionAnd20ByteHashInBase58AddressPayload',
  },
  {
    args: {address: '1'},
    description: 'Address payload and checksum must be present',
    error: 'ExpectedPayloadAndChecksumInBase58Address',
  },
  {
    args: {address: '16ro3Jptwo4asSevZnsRX6vfRS24TGE6u!'},
    description: 'Characters must be base58 set',
    error: 'ExpectedAllBase58CharactersInBase58Address',
  },
  {
    args: {address: '16ro3Jptwo4asSevZnsRX6vfRS24TGE6uK'},
    description: 'A hash and version are returned for a p2pkh address',
    expected: {
      hash: hexAsBuffer('404371705fa9bd789a2fcd52d2c580b65d35549d'),
      version: 0,
    },
  },
  {
    args: {address: '3P14159f73E4gFr7JterCCQh9QjiTjiZrG'},
    description: 'A hash and version are returned for a p2sh address',
    expected: {
      hash: hexAsBuffer('e9c3dd0c07aac76179ebc76a6c78d4d67c6c160a'),
      version: 5,
    },
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => decodeBase58Address(args), new Error(error), 'Err');
    } else {
      const res = decodeBase58Address(args);

      deepEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

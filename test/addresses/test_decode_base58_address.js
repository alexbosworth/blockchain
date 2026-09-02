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
    error: 'ExpectedNonEmptyBase58CheckStringToDecode',
  },
  {
    args: {address: '16ro3Jptwo4asSevZnsRX6vfRS24TGE6uP'},
    description: 'Address checksum must match',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {address: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ'},
    description: 'Address payload must be a version and a 20 byte hash',
    error: 'ExpectedVersionAnd20ByteHashInBase58AddressPayload',
  },
  {
    args: {address: '1'},
    description: 'Address payload and checksum must be present',
    error: 'ExpectedPayloadAndChecksumInBase58CheckString',
  },
  {
    args: {address: '16ro3Jptwo4asSevZnsRX6vfRS24TGE6u!'},
    description: 'Characters must be base58 set',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
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
    args: {address: ' 16ro3Jptwo4asSevZnsRX6vfRS24TGE6uK\n'},
    description: 'Surrounding whitespace is ignored',
    expected: {
      hash: hexAsBuffer('404371705fa9bd789a2fcd52d2c580b65d35549d'),
      version: 0,
    },
  },
  {
    args: {address: 'mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn'},
    description: 'A hash and version are returned for a testnet p2pkh address',
    expected: {
      hash: hexAsBuffer('243f1394f44554f4ce3fd68649c19adc483ce924'),
      version: 111,
    },
  },
  {
    args: {address: '2N3oefVeg6stiTb5Kh3ozCSkaqmx91FDbsm'},
    description: 'A hash and version are returned for a testnet p2sh address',
    expected: {
      hash: hexAsBuffer('73d32ac9e4330a071ee1b3a9ccf3997bdd4174d0'),
      version: 196,
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

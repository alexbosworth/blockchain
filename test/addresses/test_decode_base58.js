const {deepEqual} = require('node:assert').strict;
const test = require('node:test');
const {throws} = require('node:assert').strict;

const {decodeBase58} = require('./../../');

const hexAsBuffer = hex => Buffer.from(hex, 'hex');

const tests = [
  {
    args: {},
    description: 'An encoded string is expected',
    error: 'ExpectedBase58CheckStringToDecode',
  },
  {
    args: {encoded: Buffer.alloc(1)},
    description: 'A string type is expected',
    error: 'ExpectedBase58CheckStringToDecode',
  },
  {
    args: {encoded: ' '},
    description: 'A non-empty encoded string is expected',
    error: 'ExpectedNonEmptyBase58CheckStringToDecode',
  },
  {
    args: {encoded: '16ro3Jptwo4asSevZnsRX6vfRS24TGE6u!'},
    description: 'Characters must be base58 set',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {encoded: '16ro3Jptwo4asSevZnsRX6vfRS24TGE6uO'},
    description: 'Ambiguous characters excluded from base58 are rejected',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {encoded: '16ro3Jptwo4asSevZnsRX6vfRS24TGE6ul'},
    description: 'Lowercase L is not a base58 character',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {encoded: '16ro3Jptwo4asSev ZnsRX6vfRS24TGE6uK'},
    description: 'Interior whitespace is not allowed',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {encoded: '1'},
    description: 'Payload and checksum must be present',
    error: 'ExpectedPayloadAndChecksumInBase58CheckString',
  },
  {
    args: {encoded: '1111'},
    description: 'A checksum alone with no payload is rejected',
    error: 'ExpectedPayloadAndChecksumInBase58CheckString',
  },
  {
    args: {encoded: '16ro3Jptwo4asSevZnsRX6vfRS24TGE6uP'},
    description: 'Checksum must match',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {encoded: '16ro3Jptwo4asSevZnsRX6vfRS24TGE6uK'},
    description: 'A p2pkh address payload is decoded',
    expected: {
      payload: hexAsBuffer('00404371705fa9bd789a2fcd52d2c580b65d35549d'),
    },
  },
  {
    args: {encoded: ' 3P14159f73E4gFr7JterCCQh9QjiTjiZrG '},
    description: 'Whitespace is ignored and a p2sh address payload is decoded',
    expected: {
      payload: hexAsBuffer('05e9c3dd0c07aac76179ebc76a6c78d4d67c6c160a'),
    },
  },
  {
    args: {encoded: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ'},
    description: 'A WIF private key payload is decoded',
    expected: {
      payload: hexAsBuffer('800c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {
      encoded: 'xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8',
    },
    description: 'An extended public key payload is decoded',
    expected: {
      payload: hexAsBuffer('0488b21e000000000000000000873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d5080339a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2'),
    },
  },
  {
    args: {encoded: '11146EAsf'},
    description: 'An all zero bytes payload is preserved',
    expected: {payload: hexAsBuffer('000000')},
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => decodeBase58(args), new Error(error), 'Err');
    } else {
      const res = decodeBase58(args);

      deepEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

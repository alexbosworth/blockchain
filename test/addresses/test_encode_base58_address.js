const {deepEqual} = require('node:assert').strict;
const test = require('node:test');
const {throws} = require('node:assert').strict;

const {encodeBase58Address} = require('./../../');

const hexAsBuffer = hex => Buffer.from(hex, 'hex');

const tests = [
  {
    args: {},
    description: 'A hash is expected',
    error: 'ExpectedOutputHashToEncodeBase58Address',
  },
  {
    args: {hash: hexAsBuffer('00')},
    description: 'A 20 byte hash is expected',
    error: 'Expected20ByteHashToEncodeBase58Address',
  },
  {
    args: {hash: hexAsBuffer('404371705fa9bd789a2fcd52d2c580b65d35549d')},
    description: 'A version number is expected',
    error: 'ExpectedScriptVersionNumberToEncodeBase58Address',
  },
  {
    args: {
      hash: hexAsBuffer('404371705fa9bd789a2fcd52d2c580b65d35549d'),
      version: -1,
    },
    description: 'A non-negative version number is expected',
    error: 'ExpectedScriptVersionNumberToEncodeBase58Address',
  },
  {
    args: {
      hash: hexAsBuffer('404371705fa9bd789a2fcd52d2c580b65d35549d'),
      version: 1.5,
    },
    description: 'An integer version number is expected',
    error: 'ExpectedScriptVersionNumberToEncodeBase58Address',
  },
  {
    args: {
      hash: hexAsBuffer('404371705fa9bd789a2fcd52d2c580b65d35549d'),
      version: 256,
    },
    description: 'A single byte version number is expected',
    error: 'UnexpectedHighScriptVersionToEncodeBase58Address',
  },
  {
    args: {
      hash: hexAsBuffer('404371705fa9bd789a2fcd52d2c580b65d35549d'),
      version: 0,
    },
    description: 'An address is returned for a p2pkh hash and version',
    expected: {address: '16ro3Jptwo4asSevZnsRX6vfRS24TGE6uK'},
  },
  {
    args: {
      hash: hexAsBuffer('e9c3dd0c07aac76179ebc76a6c78d4d67c6c160a'),
      version: 5,
    },
    description: 'An address is returned for a p2sh hash and version',
    expected: {address: '3P14159f73E4gFr7JterCCQh9QjiTjiZrG'},
  },
  {
    args: {
      hash: hexAsBuffer('243f1394f44554f4ce3fd68649c19adc483ce924'),
      version: 111,
    },
    description: 'An address is returned for a testnet p2pkh hash and version',
    expected: {address: 'mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn'},
  },
  {
    args: {
      hash: hexAsBuffer('243f1394f44554f4ce3fd68649c19adc483ce924'),
      version: 196,
    },
    description: 'An address is returned for a testnet p2sh hash and version',
    expected: {address: '2MvYsspbAW1kBiXyNQPSz4VmZJSomMgYyUb'},
  },
  {
    args: {
      hash: hexAsBuffer('0000000000000000000000000000000000000000'),
      version: 0,
    },
    description: 'Leading zero bytes are preserved as leading ones',
    expected: {address: '1111111111111111111114oLvT2'},
  },
  {
    args: {
      hash: hexAsBuffer('ffffffffffffffffffffffffffffffffffffffff'),
      version: 0,
    },
    description: 'A maximum value hash is encoded with a zero version',
    expected: {address: '1QLbz7JHiBTspS962RLKV8GndWFwi5j6Qr'},
  },
  {
    args: {
      hash: hexAsBuffer('0000000000000000000000000000000000000000'),
      version: 255,
    },
    description: 'A minimum value hash is encoded with the maximum version',
    expected: {address: '2mcBp5h1U41ARYXZ6EywGeyQcVdhYP7dFob'},
  },
  {
    args: {
      hash: hexAsBuffer('ffffffffffffffffffffffffffffffffffffffff'),
      version: 255,
    },
    description: 'A maximum value hash is encoded with the maximum version',
    expected: {address: '2n1XR4oJkmBdJMxhBGQGb96gQ88xUyGML1i'},
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => encodeBase58Address(args), new Error(error), 'Err');
    } else {
      const res = encodeBase58Address(args);

      deepEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

const {equal} = require('node:assert').strict;
const {throws} = require('node:assert').strict;
const test = require('node:test');

const {decodeWif} = require('./../../');

// Small buffers are allocated out of a pool of memory that they all share
const sharedMemory = () => Buffer.from(Buffer.from([0]).buffer);

// Buffer.alloc keeps the bytes being looked for out of the shared memory
const unsharedBytes = hex => Buffer.alloc(hex.length / 2, hex, 'hex');

const tests = [
  {
    args: {wif: 'KwRxjZ8YRagMpcNL9W9yHhVuG6PPfn9aYgvPHLgiB4bdrDC51SpV'},
    description: 'A decoded key is copied out of shared memory',
    key: '064d63fc49ccbad4dc217edbf9045c867314faf856749cc24a2a4d0ebf96af97',
  },
  {
    args: {
      network: 'btc',
      wif: 'cVvxbJBaaurCpn8ohKs6wWXajeS1zizwW5qU28LPxGfn78JhssKj',
    },
    description: 'A key on the wrong network is wiped from shared memory',
    error: 'UnexpectedWifVersionForNetwork',
    key: 'f91ed75d163c565416f42e52e4e90fde2c53d9cb04ac0341b29cf6bf0a6b1e12',
  },
  {
    args: {wif: 'T7Mg15eGqNyj97NT9kLFD1KYDnePGfy1oCMfS71NWEnV3898GtRR'},
    description: 'A key with an unknown version is wiped from shared memory',
    error: 'UnexpectedWifVersionForKnownNetworks',
    key: '8074005033020a355f85193d5ea726a578c779ec7e85f27b808cedfc34d4cbda',
  },
  {
    args: {wif: 'KzgCYW6rocRdz4vc6eQvgMX4tvJmqNue8k2UVTEYc9grLk7U1krH'},
    description: 'A key with an invalid flag is wiped from shared memory',
    error: 'UnexpectedCompressionFlagValueInWifPayload',
    key: '67239cce280dbc43eab51c0cd643847805faa5f7ea764e7d5deb6bb4792ad07a',
  },
];

tests.forEach(({args, description, error, key}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => decodeWif(args), new Error(error), 'Got err');
    } else {
      const {private_key} = decodeWif(args);

      equal(private_key.buffer.byteLength, private_key.length, 'Own memory');
    }

    equal(sharedMemory().includes(unsharedBytes(key)), false, 'Not shared');

    return end();
  });
});

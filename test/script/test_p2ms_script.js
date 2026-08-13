const {deepStrictEqual} = require('node:assert').strict;
const {throws} = require('node:assert').strict;
const test = require('node:test');

const {p2msScript} = require('./../../');

const bufferFromHex = hex => Buffer.from(hex, 'hex');

// Public keys from the BIP 143 P2SH-P2WSH 6-of-6 multisig example
const bip143MultisigKeys = [
  '0307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba3',
  '03b28f0c28bfab54554ae8c658ac5c3e0ce6e79ad336331f78c428dd43eea8449b',
  '034b8113d703413d57761b8b9781957b8c0ac1dfe69f492580ca4195f50376ba4a',
  '033400f6afecb833092a9a21cfdf1ed1376e58c5d1f47de74683123987e967a8f4',
  '03a6d48b1131e94ba04d9737d61acdaa1322008af9602b3b14862c07a1789aac16',
  '02d8b661b0b3302ee2f162b09e07a55ad5dfbe673a9f01d9f0c19617681024306b',
];

// Twenty derived placeholder public keys to test past the op number range
const twentyKeys = bip143MultisigKeys
  .concat(bip143MultisigKeys)
  .concat(bip143MultisigKeys)
  .slice(0, 18)
  .concat(['0307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba3'])
  .concat(['03b28f0c28bfab54554ae8c658ac5c3e0ce6e79ad336331f78c428dd43eea8449b']);

const tests = [
  {
    args: {},
    description: 'An array of public keys is required',
    error: 'ExpectedArrayOfPublicKeysToDeriveP2msScript',
  },
  {
    args: {keys: []},
    description: 'A non empty array of public keys is required',
    error: 'ExpectedArrayOfPublicKeysToDeriveP2msScript',
  },
  {
    args: {keys: twentyKeys.concat(twentyKeys).map(bufferFromHex)},
    description: 'A maximum of twenty public keys is required',
    error: 'ExpectedFewerPublicKeysToDeriveP2msScript',
  },
  {
    args: {keys: [bufferFromHex('00')]},
    description: 'Compressed public keys are required',
    error: 'ExpectedCompressedPublicKeysToDeriveP2msScript',
  },
  {
    args: {keys: bip143MultisigKeys.map(bufferFromHex)},
    description: 'A required keys count is required',
    error: 'ExpectedRequiredKeysCountToDeriveP2msScript',
  },
  {
    args: {keys: bip143MultisigKeys.map(bufferFromHex), required: 1.5},
    description: 'An integer required keys count is required',
    error: 'ExpectedRequiredKeysCountToDeriveP2msScript',
  },
  {
    args: {keys: bip143MultisigKeys.map(bufferFromHex), required: 7},
    description: 'A required count within the keys count is required',
    error: 'UnexpectedCountOfRequiredKeysToDeriveP2msScript',
  },
  {
    args: {keys: bip143MultisigKeys.map(bufferFromHex), required: 6},
    description: 'A multisig script is derived for the BIP 143 example keys',
    expected: {
      hash: bufferFromHex('a16b5755f7f6f96dbd65f5f0d6ab9418b89af4b1f14a1bb8a09062c35f0dcb54'),
      script: bufferFromHex('56210307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba32103b28f0c28bfab54554ae8c658ac5c3e0ce6e79ad336331f78c428dd43eea8449b21034b8113d703413d57761b8b9781957b8c0ac1dfe69f492580ca4195f50376ba4a21033400f6afecb833092a9a21cfdf1ed1376e58c5d1f47de74683123987e967a8f42103a6d48b1131e94ba04d9737d61acdaa1322008af9602b3b14862c07a1789aac162102d8b661b0b3302ee2f162b09e07a55ad5dfbe673a9f01d9f0c19617681024306b56ae'),
    },
  },
  {
    args: {keys: bip143MultisigKeys.slice(0, 3).map(bufferFromHex), required: 2},
    description: 'A two of three multisig script is derived',
    expected: {
      hash: bufferFromHex('04facdf99ba64a979191911d7643e52af145ac7b5eb3168c16bec40702f6b9d2'),
      script: bufferFromHex('52210307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba32103b28f0c28bfab54554ae8c658ac5c3e0ce6e79ad336331f78c428dd43eea8449b21034b8113d703413d57761b8b9781957b8c0ac1dfe69f492580ca4195f50376ba4a53ae'),
    },
  },
  {
    args: {keys: twentyKeys.map(bufferFromHex), required: 17},
    description: 'Counts past the op number range are encoded as data pushes',
    expected: {
      hash: bufferFromHex('01312333beba0c1b3a3814d64296528cbeb9a344356d606baabd4782204a3c6c'),
      script: bufferFromHex('0111210307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba32103b28f0c28bfab54554ae8c658ac5c3e0ce6e79ad336331f78c428dd43eea8449b21034b8113d703413d57761b8b9781957b8c0ac1dfe69f492580ca4195f50376ba4a21033400f6afecb833092a9a21cfdf1ed1376e58c5d1f47de74683123987e967a8f42103a6d48b1131e94ba04d9737d61acdaa1322008af9602b3b14862c07a1789aac162102d8b661b0b3302ee2f162b09e07a55ad5dfbe673a9f01d9f0c19617681024306b210307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba32103b28f0c28bfab54554ae8c658ac5c3e0ce6e79ad336331f78c428dd43eea8449b21034b8113d703413d57761b8b9781957b8c0ac1dfe69f492580ca4195f50376ba4a21033400f6afecb833092a9a21cfdf1ed1376e58c5d1f47de74683123987e967a8f42103a6d48b1131e94ba04d9737d61acdaa1322008af9602b3b14862c07a1789aac162102d8b661b0b3302ee2f162b09e07a55ad5dfbe673a9f01d9f0c19617681024306b210307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba32103b28f0c28bfab54554ae8c658ac5c3e0ce6e79ad336331f78c428dd43eea8449b21034b8113d703413d57761b8b9781957b8c0ac1dfe69f492580ca4195f50376ba4a21033400f6afecb833092a9a21cfdf1ed1376e58c5d1f47de74683123987e967a8f42103a6d48b1131e94ba04d9737d61acdaa1322008af9602b3b14862c07a1789aac162102d8b661b0b3302ee2f162b09e07a55ad5dfbe673a9f01d9f0c19617681024306b210307b8ae49ac90a048e9b53357a2354b3334e9c8bee813ecb98e99a7e07e8c3ba32103b28f0c28bfab54554ae8c658ac5c3e0ce6e79ad336331f78c428dd43eea8449b0114ae'),
    },
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => p2msScript(args), new Error(error), 'Got err');
    } else {
      const res = p2msScript(args);

      deepStrictEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

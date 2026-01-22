const {deepEqual} = require('node:assert').strict;
const test = require('node:test');
const {throws} = require('node:assert').strict;

const {decodeBech32Address} = require('./../../');

const hexAsBuffer = hex => Buffer.from(hex, 'hex');

const tests = [
  {
    args: {
      address: 'tc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vq5zuyut',
    },
    description: 'Invalid human-readable part',
    error: 'ExpectedKnownBech32AddressPrefixToDecodeBech32',
  },
  {
    args: {
      address: 'bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqh2y7hd',
    },
    description: 'Invalid checksum (Bech32 instead of Bech32m)',
    error: 'ExpectedUseOfLaterVersionBech32PostInitialSegwit',
  },
  {
    args: {
      address: 'tb1z0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqglt7rf',
    },
    description: 'Invalid tb checksum (Bech32 instead of Bech32m)',
    error: 'ExpectedUseOfLaterVersionBech32PostInitialSegwit',
  },
  {
    args: {
      address: 'BC1S0XLXVLHEMJA6C4DQV22UAPCTQUPFHLXM9H8Z3K2E72Q4K9HCZ7VQ54WELL',
    },
    description: 'Invalid BC checksum (Bech32 instead of Bech32m)',
    error: 'ExpectedUseOfLaterVersionBech32PostInitialSegwit',
  },
  {
    args: {address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kemeawh'},
    description: 'Invalid checksum (Bech32m instead of Bech32)',
    error: 'ExpectedInitialSegwitTypeForInitialSegwitVersion',
  },
  {
    args: {
      address: 'tb1q0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vq24jc47',
    },
    description: 'Invalid tb checksum (Bech32m instead of Bech32)',
    error: 'ExpectedInitialSegwitTypeForInitialSegwitVersion',
  },
  {
    args: {
      address: 'bc1p38j9r5y49hruaue7wxjce0updqjuyyx0kh56v8s25huc6995vvpql3jow4',
    },
    description: 'Invalid character in checksum',
    error: 'ExpectedAllKnownCharactersForBech32EncodedString',
  },
  {
    args: {
      address: 'BC130XLXVLHEMJA6C4DQV22UAPCTQUPFHLXM9H8Z3K2E72Q4K9HCZ7VQ7ZWS8R',
    },
    description: 'Invalid witness version',
    error: 'UnexpectedHighSegwitWitnessVersion',
  },
  {
    args: {address: 'bc1pw5dgrnzv'},
    description: 'Invalid program length (1 byte)',
    error: 'UnexpectedSizeOfBech32AddressProgram',
  },
  {
    args: {
      address: 'bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7v8n0nx0muaewav253zgeav',
    },
    description: 'Invalid program length (41 bytes)',
    error: 'UnexpectedSizeOfBech32AddressProgram',
  },
  {
    args: {address: 'BC1QR508D6QEJXTDG4Y5R3ZARVARYV98GJ9P'},
    description: 'Invalid program length for witness version 0 (per BIP141)',
    error: 'UnexpectedBech32AddressProgramSizeForV0Address',
  },
  {
    args: {
      address: 'tb1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vq47Zagq',
    },
    description: 'Mixed case',
    error: 'ExpectedSingleCasingStyleForBech32EncodedString',
  },
  {
    args: {
      address: 'bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7v07qwwzcrf',
    },
    description: 'zero padding of more than 4 bits',
    error: 'ExpectedNoPaddingOnBech32Address',
  },
  {
    args: {
      address: 'tb1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vpggkg4j',
    },
    description: 'Non-zero padding in 8-to-5 conversion',
    error: 'UnexpectedNonZeroPadding',
  },
  {
    args: {address: 'bc1gmk9yu'},
    description: 'Empty data section',
    error: 'ExpectedNonEmptyWitnessCommitmentDataInBech32Address',
  },
  {
    args: {address: 'BC1QW508D6QEJXTDG4Y5R3ZARVARY0C5XW7KV8F3T4'},
    description: 'Details are returned for a btc1q address',
    expected: {
      prefix: 'bc',
      program: hexAsBuffer('751e76e8199196d454941c45d1b3a323f1433bd6'),
      version: 0,
    },
  },
  {
    args: {
      address: 'tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7',
    },
    description: 'Details are returned for a tb1q address',
    expected: {
      prefix: 'tb',
      program: hexAsBuffer('1863143c14c5166804bd19203356da136c985678cd4d27a1b8c6329604903262'),
      version: 0,
    },
  },
  {
    args: {
      address: 'bc1pw508d6qejxtdg4y5r3zarvary0c5xw7kw508d6qejxtdg4y5r3zarvary0c5xw7kt5nd6y',
    },
    description: 'Details are returned for a bc1p address',
    expected: {
      prefix: 'bc',
      program: hexAsBuffer('751e76e8199196d454941c45d1b3a323f1433bd6751e76e8199196d454941c45d1b3a323f1433bd6'),
      version: 1,
    },
  },
  {
    args: {address: 'BC1SW50QGDZ25J'},
    description: 'Details are returned for a short bc1 address',
    expected: {prefix: 'bc', program: hexAsBuffer('751e'), version: 16},
  },
  {
    args: {address: 'bc1zw508d6qejxtdg4y5r3zarvaryvaxxpcs'},
    description: 'Details are returned for a midsize bc1 address',
    expected: {
      prefix: 'bc',
      program: hexAsBuffer('751e76e8199196d454941c45d1b3a323'),
      version: 2,
    },
  },
  {
    args: {
      address: 'tb1qqqqqp399et2xygdj5xreqhjjvcmzhxw4aywxecjdzew6hylgvsesrxh6hy',
    },
    description: 'Details are returned for a zero starting tb address',
    expected: {
      prefix: 'tb',
      program: hexAsBuffer('000000c4a5cad46221b2a187905e5266362b99d5e91c6ce24d165dab93e86433'),
      version: 0,
    },
  },
  {
    args: {
      address: 'bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqzk5jj0',
    },
    description: 'Details are returned for a bc1 v1 address',
    expected: {
      prefix: 'bc',
      program: hexAsBuffer('79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798'),
      version: 1,
    },
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => decodeBech32Address(args), new Error(error), 'Err');
    } else {
      const res = decodeBech32Address(args);

      deepEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

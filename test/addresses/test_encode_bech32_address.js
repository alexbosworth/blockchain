const {deepEqual} = require('node:assert').strict;
const test = require('node:test');
const {throws} = require('node:assert').strict;

const {encodeBech32Address} = require('./../../');

const hexAsBuffer = hex => Buffer.from(hex, 'hex');

const tests = [
  {
    args: {prefix: 'bc', version: 0},
    description: 'A witness program is expected',
    error: 'ExpectedWitnessProgramToEncodeBech32Address',
  },
  {
    args: {prefix: 'bc', program: hexAsBuffer('75'), version: 16},
    description: 'A minimum length witness program is expected',
    error: 'UnexpectedSizeOfProgramToEncodeBech32Address',
  },
  {
    args: {
      prefix: 'bc',
      program: hexAsBuffer('751e76e8199196d454941c45d1b3a323f1433bd6751e76e8199196d454941c45d1b3a323f1433bd675'),
      version: 1,
    },
    description: 'A maximum length witness program is expected',
    error: 'UnexpectedSizeOfProgramToEncodeBech32Address',
  },
  {
    args: {
      prefix: 'bc',
      program: hexAsBuffer('751e76e8199196d454941c45d1b3a323f1433bd6'),
    },
    description: 'A witness version is expected',
    error: 'ExpectedKnownWitnessVersionToEncodeBech32Address',
  },
  {
    args: {
      prefix: 'bc',
      program: hexAsBuffer('751e76e8199196d454941c45d1b3a323f1433bd6'),
      version: 17,
    },
    description: 'A witness version within the known range is expected',
    error: 'UnexpectedHighSegwitWitnessVersion',
  },
  {
    args: {
      prefix: 'bc',
      program: hexAsBuffer('751e76e8199196d454941c45d1b3a323f1433b'),
      version: 0,
    },
    description: 'A known program length for witness version 0 is expected',
    error: 'UnexpectedBech32AddressProgramSizeForV0Address',
  },
  {
    args: {
      prefix: 'tc',
      program: hexAsBuffer('751e76e8199196d454941c45d1b3a323f1433bd6'),
      version: 0,
    },
    description: 'A known human readable prefix is expected',
    error: 'ExpectedKnownBech32AddressPrefixToEncodeBech32',
  },
  {
    args: {
      prefix: 'bc',
      program: hexAsBuffer('751e76e8199196d454941c45d1b3a323f1433bd6'),
      version: 0,
    },
    description: 'An address is encoded for a bc1q output',
    expected: {address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'},
  },
  {
    args: {
      prefix: 'tb',
      program: hexAsBuffer('1863143c14c5166804bd19203356da136c985678cd4d27a1b8c6329604903262'),
      version: 0,
    },
    description: 'An address is encoded for a tb1q output',
    expected: {
      address: 'tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7',
    },
  },
  {
    args: {
      prefix: 'bc',
      program: hexAsBuffer('751e76e8199196d454941c45d1b3a323f1433bd6751e76e8199196d454941c45d1b3a323f1433bd6'),
      version: 1,
    },
    description: 'An address is encoded for a bc1p output',
    expected: {
      address: 'bc1pw508d6qejxtdg4y5r3zarvary0c5xw7kw508d6qejxtdg4y5r3zarvary0c5xw7kt5nd6y',
    },
  },
  {
    args: {prefix: 'bc', program: hexAsBuffer('751e'), version: 16},
    description: 'An address is encoded for a short bc1 output',
    expected: {address: 'bc1sw50qgdz25j'},
  },
  {
    args: {
      prefix: 'bc',
      program: hexAsBuffer('751e76e8199196d454941c45d1b3a323'),
      version: 2,
    },
    description: 'An address is encoded for a midsize bc1 output',
    expected: {address: 'bc1zw508d6qejxtdg4y5r3zarvaryvaxxpcs'},
  },
  {
    args: {
      prefix: 'tb',
      program: hexAsBuffer('000000c4a5cad46221b2a187905e5266362b99d5e91c6ce24d165dab93e86433'),
      version: 0,
    },
    description: 'An address is encoded for a zero starting tb output',
    expected: {
      address: 'tb1qqqqqp399et2xygdj5xreqhjjvcmzhxw4aywxecjdzew6hylgvsesrxh6hy',
    },
  },
  {
    args: {
      prefix: 'bc',
      program: hexAsBuffer('79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798'),
      version: 1,
    },
    description: 'An address is encoded for a bc1 v1 output',
    expected: {
      address: 'bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqzk5jj0',
    },
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => encodeBech32Address(args), new Error(error), 'Err');
    } else {
      const res = encodeBech32Address(args);

      deepEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

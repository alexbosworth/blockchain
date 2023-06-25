const {deepStrictEqual} = require('node:assert').strict;
const {throws} = require('node:assert').strict;
const test = require('node:test');

const {numberAsCompactInt} = require('./../../');

const tests = [
  {
    args: {number: 0.1},
    description: 'Fractional numbers are not allowed',
    error: 'ExpectedEncodeSafeNumberToEncodeAsCompactInteger',
  },
  {
    args: {number: Number.MAX_SAFE_INTEGER + 1},
    description: 'Large numbers are not allowed',
    error: 'ExpectedEncodeSafeNumberToEncodeAsCompactInteger',
  },
  {
    args: {number: 0},
    description: 'Smallest possible one byte number encoded',
    expected: '00',
  },
  {
    args: {number: 252},
    description: 'Largest possible one byte number encoded',
    expected: 'fc',
  },
  {
    args: {number: 253},
    description: 'Smallest possible two byte number encoded',
    expected: 'fdfd00',
  },
  {
    args: {number: 65535},
    description: 'Largest possible two byte number encoded',
    expected: 'fdffff',
  },
  {
    args: {number: 65536},
    description: 'Smallest possible four byte number encoded',
    expected: 'fe00000100',
  },
  {
    args: {number: 4294967295},
    description: 'Largest possible four byte number encoded',
    expected: 'feffffffff',
  },
  {
    args: {number: 4294967296},
    description: 'Smallest possible eight byte number encoded',
    expected: 'ff0000000001000000',
  },
  {
    args: {number: 9007199254740991},
    description: 'Max safe integer encoded',
    expected: 'ffffffffffffff1f00',
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => numberAsCompactInt(args), new Error(error), 'Error');
    } else {
      const res = numberAsCompactInt(args);

      deepStrictEqual(res.encoded.toString('hex'), expected, 'Got result');
    }

    return end();
  });
});

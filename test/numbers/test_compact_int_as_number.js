const {test} = require('@alexbosworth/tap');

const {compactIntAsNumber} = require('./../../');

const tests = [
  {
    args: {encoded: ''},
    description: 'Encoded bytes are expected',
    error: 'ExpectedBufferToConvertCompactIntegerToNumber',
  },
  {
    args: {encoded: 'ffffffffffffffffff'},
    description: 'Too large numbers are not supported',
    error: 'ExpectedSafeSizeEncodedCompactInteger',
  },
  {
    args: {encoded: '00'},
    description: 'Smallest possible one byte number decoded',
    expected: {bytes: 1, number: 0},
  },
  {
    args: {encoded: 'fc'},
    description: 'Largest possible one byte number decoded',
    expected: {bytes: 1, number: 252},
  },
  {
    args: {encoded: '00fcffffff', start: 1},
    description: 'Largest possible one byte number decoded with offset',
    expected: {bytes: 1, number: 252},
  },
  {
    args: {encoded: 'fdfd00'},
    description: 'Smallest possible two byte number decoded',
    expected: {bytes: 3, number: 253},
  },
  {
    args: {encoded: 'fdffff'},
    description: 'Largest possible two byte number decoded',
    expected: {bytes: 3, number: 65535}
  },
  {
    args: {encoded: 'fe00000100'},
    description: 'Smallest possible four byte number decoded',
    expected: {bytes: 5, number: 65536},
  },
  {
    args: {encoded: 'feffffffff'},
    description: 'Largest possible four byte number decoded',
    expected: {bytes: 5, number: 4294967295},
  },
  {
    args: {encoded: 'ff0000000001000000'},
    description: 'Smallest possible eight byte number decoded',
    expected: {bytes: 9, number: 4294967296},
  },
  {
    args: {encoded: 'ffffffffffffff1f00'},
    description: 'Max safe integer decoded',
    expected: {bytes: 9, number: 9007199254740991},
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, ({end, strictSame, throws}) => {
    args.encoded = !!args.encoded ? Buffer.from(args.encoded, 'hex') : null;

    if (!!error) {
      throws(() => compactIntAsNumber(args), new Error(error), 'Error');
    } else {
      const res = compactIntAsNumber(args);

      strictSame(res, expected, 'Got expected result');
    }

    return end();
  });
});

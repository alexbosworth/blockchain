const {deepStrictEqual} = require('node:assert').strict;
const {throws} = require('node:assert').strict;
const test = require('node:test');

const {numberAsLittleEndian} = require('./../../numbers');

const tests = [
  {
    args: {bytes: 7, number: 1},
    description: 'A supported bytes count is required',
    error: 'ExpectedBytesCountToEncodeNumberAsLittleEndian',
  },
  {
    args: {bytes: 4, number: '1'},
    description: 'A number to encode is required',
    error: 'ExpectedNumberToEncodeAsLittleEndianBytes',
  },
  {
    args: {bytes: 1, number: 256},
    description: 'A number within the byte range is required',
    error: 'ExpectedNumberInByteRangeToEncodeAsLittleEndian',
  },
  {
    args: {bytes: 4, number: -1},
    description: 'A negative number requires the signed flag',
    error: 'ExpectedNumberInByteRangeToEncodeAsLittleEndian',
  },
  {
    args: {bytes: 4, is_signed: true, number: -2147483649},
    description: 'A negative number within the byte range is required',
    error: 'ExpectedNumberInByteRangeToEncodeAsLittleEndian',
  },
  {
    args: {bytes: 4, is_signed: true, number: 2147483648},
    description: 'A signed number within the signed range is required',
    error: 'ExpectedNumberInByteRangeToEncodeAsLittleEndian',
  },
  {
    args: {bytes: 1, number: 255},
    description: 'A single byte number is encoded',
    expected: {encoded: Buffer.from('ff', 'hex')},
  },
  {
    args: {bytes: 4, number: 16843009},
    description: 'A four byte number is encoded as little endian',
    expected: {encoded: Buffer.from('01010101', 'hex')},
  },
  {
    args: {bytes: 4, is_signed: true, number: -1},
    description: 'A negative number is encoded as twos complement',
    expected: {encoded: Buffer.from('ffffffff', 'hex')},
  },
  {
    args: {bytes: 8, number: 987654321},
    description: 'An eight byte number is encoded as little endian',
    expected: {encoded: Buffer.from('b168de3a00000000', 'hex')},
  },
  {
    args: {bytes: 8, is_signed: true, number: -1},
    description: 'A negative eight byte number is encoded as twos complement',
    expected: {encoded: Buffer.from('ffffffffffffffff', 'hex')},
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => numberAsLittleEndian(args), new Error(error), 'Got error');
    } else {
      const res = numberAsLittleEndian(args);

      deepStrictEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

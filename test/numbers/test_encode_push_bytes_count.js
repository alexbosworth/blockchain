const {deepStrictEqual} = require('node:assert').strict;
const {throws} = require('node:assert').strict;
const test = require('node:test');

const {encodePushBytesCount} = require('./../../numbers');

const tests = [
  {
    args: {},
    description: 'A count number is required',
    error: 'ExpectedPushBytesCountNumberToEncode',
  },
  {
    args: {count: -1},
    description: 'A non-negative count number is required',
    error: 'ExpectedPushBytesCountNumberToEncode',
  },
  {
    args: {count: 1.5},
    description: 'An integer count number is required',
    error: 'ExpectedPushBytesCountNumberToEncode',
  },
  {
    args: {count: 4294967296},
    description: 'A count beyond OP_PUSHDATA4 size is rejected',
    error: 'UnexpectedlyLargePushBytesCountToEncode',
  },
  {
    args: {count: 0},
    description: 'A zero count is encoded as a direct byte',
    expected: {encoded: Buffer.from('00', 'hex')},
  },
  {
    args: {count: 75},
    description: 'The largest direct push count is encoded as a direct byte',
    expected: {encoded: Buffer.from('4b', 'hex')},
  },
  {
    args: {count: 76},
    description: 'The smallest OP_PUSHDATA1 count is encoded',
    expected: {encoded: Buffer.from('4c4c', 'hex')},
  },
  {
    args: {count: 255},
    description: 'The largest OP_PUSHDATA1 count is encoded',
    expected: {encoded: Buffer.from('4cff', 'hex')},
  },
  {
    args: {count: 256},
    description: 'The smallest OP_PUSHDATA2 count is encoded',
    expected: {encoded: Buffer.from('4d0001', 'hex')},
  },
  {
    args: {count: 65535},
    description: 'The largest OP_PUSHDATA2 count is encoded',
    expected: {encoded: Buffer.from('4dffff', 'hex')},
  },
  {
    args: {count: 65536},
    description: 'The smallest OP_PUSHDATA4 count is encoded',
    expected: {encoded: Buffer.from('4e00000100', 'hex')},
  },
  {
    args: {count: 4294967295},
    description: 'The largest OP_PUSHDATA4 count is encoded',
    expected: {encoded: Buffer.from('4effffffff', 'hex')},
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => encodePushBytesCount(args), new Error(error), 'Got err');
    } else {
      const res = encodePushBytesCount(args);

      deepStrictEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

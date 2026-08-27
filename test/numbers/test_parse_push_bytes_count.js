const {deepStrictEqual} = require('node:assert').strict;
const test = require('node:test');

const {parsePushBytesCount} = require('./../../numbers');

const hexAsBuffer = hex => Buffer.from(hex, 'hex');

const tests = [
  {
    args: {offset: 0, script: hexAsBuffer('4f00000000')},
    description: 'An unsupported op code is not parsed as a push',
    expected: undefined,
  },
  {
    args: {offset: 0, script: hexAsBuffer('00')},
    description: 'A zero byte count is parsed as a direct push',
    expected: {bytes: hexAsBuffer('00'), count: 0},
  },
  {
    args: {offset: 0, script: hexAsBuffer('4b' + 'ff'.repeat(75))},
    description: 'The largest direct push byte count is parsed',
    expected: {bytes: hexAsBuffer('4b'), count: 75},
  },
  {
    args: {offset: 0, script: hexAsBuffer('4c4c' + 'ff'.repeat(76))},
    description: 'An OP_PUSHDATA1 byte count is parsed',
    expected: {bytes: hexAsBuffer('4c4c'), count: 76},
  },
  {
    args: {offset: 0, script: hexAsBuffer('4c')},
    description: 'An OP_PUSHDATA1 without a length byte is not parsed',
    expected: {},
  },
  {
    args: {offset: 0, script: hexAsBuffer('4d0001' + 'ff'.repeat(256))},
    description: 'An OP_PUSHDATA2 byte count is parsed',
    expected: {bytes: hexAsBuffer('4d0001'), count: 256},
  },
  {
    args: {offset: 0, script: hexAsBuffer('4dff')},
    description: 'An OP_PUSHDATA2 with a short length is not parsed',
    expected: {},
  },
  {
    args: {offset: 0, script: hexAsBuffer('4e70110100')},
    description: 'An OP_PUSHDATA4 byte count is parsed',
    expected: {bytes: hexAsBuffer('4e70110100'), count: 70000},
  },
  {
    args: {offset: 0, script: hexAsBuffer('4e112233')},
    description: 'An OP_PUSHDATA4 with a short length is not parsed',
    expected: {},
  },
  {
    args: {offset: 2, script: hexAsBuffer('ffff4c4c')},
    description: 'A push byte count is parsed at an offset',
    expected: {bytes: hexAsBuffer('4c4c'), count: 76},
  },
];

tests.forEach(({args, description, expected}) => {
  return test(description, (t, end) => {
    deepStrictEqual(parsePushBytesCount(args), expected, 'Got expected');

    return end();
  });
});

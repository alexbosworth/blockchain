const {deepStrictEqual} = require('node:assert').strict;
const {throws} = require('node:assert').strict;
const test = require('node:test');

const {scriptAsScriptElements} = require('./../../');

const tests = [
  {
    args: {script: 'z'},
    description: 'A script is required',
    error: 'ExpectedHexEncodedScriptToDecodeScriptElements',
  },
  {
    args: {script: '76a914000000000000000000000000000000000000000088ac'},
    description: 'An output script is mapped to elements',
    expected: {elements: [118, 169, Buffer.alloc(20), 136, 172]},
  },
  {
    args: {script: '000100'},
    description: 'Zero bytes on the stack',
    expected: {elements: [0, Buffer.alloc(1)]},
  },
  {
    args: {
      script: '4cff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    },
    description: 'Long data push',
    expected: {elements: [Buffer.alloc(255)]},
  },
  {
    args: {script: '01'},
    description: 'Specify one byte, but there is zero bytes',
    expected: {},
  },
  {
    args: {script: '0201'},
    description: 'Specify two bytes but there is only one',
    expected: {},
  },
  {
    args: {script: '4c'},
    description: 'Not any data for pushdata 1',
    expected: {},
  },
  {
    args: {script: '4c0201'},
    description: 'Not enough data for pushdata 1',
    expected: {},
  },
  {
    args: {script: '4dffff01'},
    description: 'Not enough data for pushdata 2',
    expected: {},
  },
  {
    args: {script: '4dff'},
    description: 'Not enough data for pushdata 2 number',
    expected: {},
  },
  {
    args: {script: '4effffffff01'},
    description: 'Not enough data for pushdata 4',
    expected: {},
  },
  {
    args: {script: '4eff'},
    description: 'Not enough data for pushdata 4 number',
    expected: {},
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => scriptAsScriptElements(args), new Error(error), 'Got err');
    } else {
      const res = scriptAsScriptElements(args);

      deepStrictEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

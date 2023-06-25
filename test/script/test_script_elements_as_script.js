const {deepStrictEqual} = require('node:assert').strict;
const {throws} = require('node:assert').strict;
const test = require('node:test');

const {scriptElementsAsScript} = require('./../../');

const tests = [
  {
    args: {},
    description: 'An array of elements is required',
    error: 'ExpectedArrayOfScriptElementsToEncodeScript',
  },
  {
    args: {elements: [118, 169, Buffer.alloc(20), 136, 172]},
    description: 'Elements are mapped to an output script',
    expected: {script: '76a914000000000000000000000000000000000000000088ac'},
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => scriptElementsAsScript(args), new Error(error), 'Got err');
    } else {
      const res = scriptElementsAsScript(args);

      deepStrictEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

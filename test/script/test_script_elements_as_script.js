const {test} = require('@alexbosworth/tap');

const {scriptElementsAsScript} = require('./../../');

const tests = [
  {
    args: {},
    description: 'An array of eleemnts is required',
    error: 'ExpectedArrayOfScriptElementsToEncodeScript',
  },
  {
    args: {elements: [118, 169, Buffer.alloc(20), 136, 172]},
    description: 'Elements are mapped to an output script',
    expected: {script: '76a914000000000000000000000000000000000000000088ac'},
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, ({end, strictSame, throws}) => {
    if (!!error) {
      throws(() => scriptElementsAsScript(args), new Error(error), 'Got err');
    } else {
      const res = scriptElementsAsScript(args);

      strictSame(res, expected, 'Got expected result');
    }

    return end();
  });
});

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
    args: {elements: []},
    description: 'No elements are mapped to an empty script',
    expected: {script: ''},
  },
  {
    args: {elements: [Buffer.alloc(76)]},
    description: 'A data element beyond direct push uses OP_PUSHDATA1',
    expected: {script: '4c4c' + '00'.repeat(76)},
  },
  {
    args: {elements: [Buffer.alloc(256)]},
    description: 'A data element beyond one byte length uses OP_PUSHDATA2',
    expected: {script: '4d0001' + '00'.repeat(256)},
  },
  {
    args: {elements: [Buffer.alloc(70000)]},
    description: 'A data element beyond two byte length uses OP_PUSHDATA4',
    expected: {script: '4e70110100' + '00'.repeat(70000)},
  },
  {
    args: {elements: [300, Buffer.alloc(20)]},
    description: 'Op code elements above a single byte value are rejected',
    error: 'ExpectedSingleByteOpCodeElementToFormOutputScript',
  },
  {
    args: {elements: [-1, Buffer.alloc(20)]},
    description: 'Negative op code elements are rejected',
    error: 'ExpectedSingleByteOpCodeElementToFormOutputScript',
  },
  {
    args: {elements: ['76', Buffer.alloc(20)]},
    description: 'Non number op code elements are rejected',
    error: 'ExpectedDataOrOpCodeScriptElementsToEncodeScript',
  },
  {
    args: {elements: [0, Buffer.alloc(75)]},
    description: 'A maximum length direct data push is encoded',
    expected: {script: '004b' + '00'.repeat(75)},
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

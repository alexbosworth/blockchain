const {deepEqual} = require('node:assert').strict;
const test = require('node:test');
const {throws} = require('node:assert').strict;

const {previousBlockId} = require('./../../');

const hexAsBuffer = hex => Buffer.from(hex, 'hex');

const tests = [
  {
    args: {block: ''},
    description: 'A hex encoded block is required',
    error: 'ExpectedHexEncodedBlockToDerivePreviousBlockId',
  },
  {
    args: {
      block: '00609c32519912209ce3196c09d7a409035874057780d4072fa31adc1f0000000000000090882aac112a7353ffc0cf13ebc8196620bc83c810b03bd5d6678b536a203c4b1a45d264f4422e193e7ea2ab01010000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff1a03ceb625012013090909200909200904631e00a3290000000000ffffffff02be40250000000000160014820d4a343a44e915c36494995c2899abe37418930000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf90120000000000000000000000000000000000000000000000000000000000000000000000000',
    },
    description: 'The previous block id is returned',
    expected: {
      previous: '000000000000001fdc1aa32f07d480770574580309a4d7096c19e39c20129951',
    },
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => previousBlockId(args), new Error(error), 'Error returned');
    } else {
      const res = previousBlockId(args);

      deepEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

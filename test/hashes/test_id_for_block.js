const {deepEqual} = require('node:assert').strict;
const test = require('node:test');
const {throws} = require('node:assert').strict;

const {idForBlock} = require('./../../');

const hexAsBuffer = hex => Buffer.from(hex, 'hex');

const tests = [
  {
    args: {block: ''},
    description: 'A hex encoded block is required',
    error: 'ExpectedHexEncodedBlockToGetIdFor',
  },
  {
    args: {
      block: '0000002006226e46111a0b59caaf126043eb5bbf28c34f3a5e332a1fc7b2b73cf188910f6ebc0169bfbbf66c1f36b5f203e724805717d5e045579851d3a9cd26c89c6e460ca36364ffff7f200000000001020000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff03510101ffffffff0200f2052a0100000017a914a9974100aeee974a20cda9a2f545704a0ab54fdc870000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf90120000000000000000000000000000000000000000000000000000000000000000000000000',
    },
    description: 'A block id is returned',
    expected: {
      id: '77a525d242a5bb062983a852658c4b917d623e49ef1bdf66e94c9c79d2f2e8fe',
    },
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => idForBlock(args), new Error(error), 'Err');
    } else {
      const res = idForBlock(args);

      deepEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

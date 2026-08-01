const {strictEqual} = require('node:assert').strict;
const test = require('node:test');

const parsePushBytesCount = require('./../../script/parse_push_bytes_count');

test('An unsupported op code is not parsed as a push', (t, end) => {
  const res = parsePushBytesCount({
    offset: 0,
    script: Buffer.from('4f00000000', 'hex'),
  });

  strictEqual(res, undefined, 'Got no push bytes count');

  return end();
});

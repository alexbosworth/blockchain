const {deepStrictEqual} = require('node:assert').strict;
const {throws} = require('node:assert').strict;
const test = require('node:test');

const {sizeOfTransaction} = require('./../../');

const legacyTransaction = [
  '02000000',
  '01',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '00000000',
  '00',
  'ffffffff',
  '01',
  '0100000000000000',
  '01',
  '51',
  '00000000',
].join('');

const witnessTransaction = [
  '02000000',
  '0001',
  '01',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '00000000',
  '00',
  'ffffffff',
  '01',
  '0100000000000000',
  '01',
  '51',
  '01',
  '01',
  '00',
  '00000000',
].join('');

const tests = [
  {
    args: {transaction: ''},
    description: 'A transaction is required',
    error: 'ExpectedHexEncodedTransactionToGetSize',
  },
  {
    args: {transaction: '00f'},
    description: 'An even-length transaction is required',
    error: 'ExpectedHexEncodedTransactionToGetSize',
  },
  {
    args: {transaction: 'not hex'},
    description: 'A hex-encoded transaction is required',
    error: 'ExpectedHexEncodedTransactionToGetSize',
  },
  {
    args: {transaction: `${legacyTransaction}00`},
    description: 'Data after the transaction is not accepted',
    error: 'UnexpectedDataAfterTransactionToGetSize',
  },
  {
    args: {transaction: legacyTransaction},
    description: 'The size of a legacy transaction is returned',
    expected: {vsize: 61, weight: 244},
  },
  {
    args: {transaction: witnessTransaction},
    description: 'The size of a witness transaction is returned',
    expected: {vsize: 63, weight: 249},
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => sizeOfTransaction(args), new Error(error), 'Got error');
    } else {
      const res = sizeOfTransaction(args);

      deepStrictEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

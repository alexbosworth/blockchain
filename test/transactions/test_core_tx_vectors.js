const {equal} = require('node:assert').strict;
const {throws} = require('node:assert').strict;
const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const test = require('node:test');

const {componentsOfTransaction} = require('./../../');
const {sizeOfTransaction} = require('./../../');
const {transactionFromComponents} = require('./../../');

// Vectors that Core deserializes but that cannot be represented as Numbers
const expectedErrors = {
  'tx_invalid #24: Negative output': 'UnexpectedOutputValueInTransaction',
};
const fixtures = ['tx_valid', 'tx_invalid'];
const fixturesDir = join(__dirname, '..', 'fixtures');
const isVector = entry => entry.length > 1;
const readJson = name => JSON.parse(readFileSync(join(fixturesDir, name)));
const vectorTx = vector => vector[1];

// Bitcoin Core test vectors: every entry, valid or invalid at the consensus
// level, is required to deserialize, so every entry is expected to parse and
// to re-serialize back to the exact same bytes.
fixtures.forEach(fixture => {
  const entries = readJson(`${fixture}.json`);

  let comment = fixture;

  return entries.forEach((entry, i) => {
    // Single string entries are comments describing the following vectors
    if (!isVector(entry)) {
      comment = entry[0];

      return;
    }

    const transaction = vectorTx(entry);

    const description = `${fixture} #${i}: ${comment}`;

    return test(description, (t, end) => {
      if (!!expectedErrors[description]) {
        const error = new Error(expectedErrors[description]);

        throws(() => componentsOfTransaction({transaction}), error, 'Got err');

        return end();
      }

      const components = componentsOfTransaction({transaction});

      const roundTrip = transactionFromComponents(components).transaction;

      equal(roundTrip, transaction, 'Transaction round trips through components');

      const {vsize, weight} = sizeOfTransaction({transaction});

      const size = transaction.length / 2;

      const hasWitness = components.inputs.some(input => !!input.witness);

      // A legacy tx has weight of 4x its size, a witness tx weighs less
      equal(weight, hasWitness ? weight : size * 4, 'Legacy weight is 4x size');
      equal(weight <= size * 4, true, 'Weight is bounded by 4x the size');
      equal(vsize, Math.ceil(weight / 4), 'Virtual size is weight over 4');

      return end();
    });
  });
});

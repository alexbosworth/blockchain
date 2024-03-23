const {createHash} = require('crypto');

const {idForTransactionComponents} = require('./../hashes');
const parseTransaction = require('./parse_transaction');

const bufferAsHex = buffer => buffer.toString('hex');
const hexAsBuffer = hex => Buffer.from(hex, 'hex');
const {isArray} = Array;
const transactionsStartIndex = 81;

/** Find matching transactions within a block

  {
    block: <Hex Encoded Raw Block String>
    outputs: [<Output Script Hex String>]
  }

  @throws
  <Error>

  @returns
  {
    outputs: [{
      script: <Output Script Hex String>
      tokens: <Output Value Number>
      transaction_id: <Transaction Id Hex String>
      transaction_vout: <Transaction Output Index Number>
    }]
  }
*/
module.exports = ({block, outputs}) => {
  if (!block) {
    throw new Error('ExpectedHexEncodedBlockToQueryTransactions');
  }

  if (!isArray(outputs)) {
    throw new Error('ExpectedArrayOfOutputsToQueryTransactionsInBlock');
  }

  const buffer = hexAsBuffer(block);
  let cursor = transactionsStartIndex;
  const hits = [];

  // Iterate forward through the block, parsing txs and looking for hits
  while (cursor < buffer.length) {
    const tx = parseTransaction({buffer, start: cursor});

    // Look at the transaction outputs to see if there is a match
    const matches = tx.outputs.forEach((output, vout) => {
      // Exit early when the script isn't included in the outputs
      if (!outputs.includes(bufferAsHex(output.script))) {
        return;
      }

      // Calculate the transaction id
      const {id} = idForTransactionComponents({
        inputs: tx.inputs,
        locktime: tx.locktime,
        outputs: tx.outputs,
        version: tx.version,
      });

      // Add the output to found hits
      return hits.push({
        script: bufferAsHex(output.script),
        tokens: output.tokens,
        transaction_id: id,
        transaction_vout: vout,
      });
    });

    cursor += tx.bytes.length;
  }

  return {outputs: hits};
};

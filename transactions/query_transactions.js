const {compactIntAsNumber} = require('./../numbers');

const {idForTransactionComponents} = require('./../hashes');
const parseTransaction = require('./parse_transaction');

const bufferAsHex = buffer => buffer.toString('hex');
const hexAsBuffer = hex => Buffer.from(hex, 'hex');
const {isArray} = Array;
const isTxId = n => typeof n === 'string' && /^[0-9A-F]{64}$/i.test(n);
const minTxByteLength = 60;
const transactionsStartIndex = 80;

/** Find matching transactions within a block

  {
    block: <Hex Encoded Raw Block String>
    [ids]: [<Transaction Id Hex String>]
    [outputs]: [<Output Script Hex String>]
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
    transactions: [{
      id: <Transaction Id Hex String>
      transaction: <Hex Encoded Raw Transaction String>
    }]
  }
*/
module.exports = ({block, ids, outputs}) => {
  if (!block) {
    throw new Error('ExpectedHexEncodedBlockToQueryTransactions');
  }

  if (ids === undefined && outputs === undefined) {
    throw new Error('ExpectedTransactionIdsOrOutputsToQueryTransactions');
  }

  if (outputs !== undefined && !isArray(outputs)) {
    throw new Error('ExpectedArrayOfOutputsToQueryTransactionsInBlock');
  }

  if (ids !== undefined && !isArray(ids)) {
    throw new Error('ExpectedArrayOfIdsToQueryTransactionsInBlock');
  }

  if (!!ids && !ids.every(isTxId)) {
    throw new Error('ExpectedTransactionIdHexStringToQueryTransactions');
  }

  const buffer = hexAsBuffer(block);

  // Exit early with error when the block header data is cut short
  if (buffer.length <= transactionsStartIndex) {
    throw new Error('ExpectedBlockHeaderAndTransactionsToQueryTransactions');
  }

  // A compact int count of transactions follows the block header
  const txCount = compactIntAsNumber({
    encoded: buffer,
    start: transactionsStartIndex,
  });

  let cursor = transactionsStartIndex + txCount.bytes;
  const found = new Set();
  const hits = [];
  const pendingIds = new Set((ids || []).map(id => id.toLowerCase()));
  let remaining = txCount.number;
  const scripts = outputs || [];
  const transactions = [];

  // Confirm the data could possibly contain the claimed count of txs
  if (txCount.number * minTxByteLength > buffer.length - cursor) {
    throw new Error('UnexpectedTransactionCountForBlockDataLength');
  }

  // Iterate forward through the block, parsing txs and looking for hits
  while (remaining--) {
    const tx = parseTransaction({buffer, start: cursor});

    cursor += tx.bytes.length;

    const matches = [];

    // Look at the transaction outputs to see if there is a match
    tx.outputs.forEach((output, vout) => {
      const script = bufferAsHex(output.script);

      // Exit early when the script isn't included in the outputs
      if (!scripts.includes(script)) {
        return;
      }

      return matches.push({script, vout, tokens: output.tokens});
    });

    // Exit early when there are no output hits and no more ids to look for
    if (!matches.length && !pendingIds.size) {
      continue;
    }

    // Calculate the transaction id
    const {id} = idForTransactionComponents({
      inputs: tx.inputs,
      locktime: tx.locktime,
      outputs: tx.outputs,
      version: tx.version,
    });

    // Add the matching outputs to found hits
    matches.forEach(({script, tokens, vout}) => {
      return hits.push({
        script,
        tokens,
        transaction_id: id,
        transaction_vout: vout,
      });
    });

    // Exit early when the transaction was already found in the block
    if (found.has(id)) {
      continue;
    }

    // Exit early when the transaction matches neither an output nor an id
    if (!matches.length && !pendingIds.has(id)) {
      continue;
    }

    found.add(id);

    pendingIds.delete(id);

    // Add the transaction to found transactions
    transactions.push({id, transaction: bufferAsHex(tx.bytes)});
  }

  // Exit early with error when there is extra data after the transactions
  if (cursor !== buffer.length) {
    throw new Error('UnexpectedDataAfterBlockTransactions');
  }

  return {transactions, outputs: hits};
};

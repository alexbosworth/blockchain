const componentsOfTransaction = require('./components_of_transaction');
const {idForTransactionComponents} = require('./../hashes');

const hexAsBuffer = hex => Buffer.from(hex, 'hex');

/**  Derive the standard transaction id for a raw serialized tx

  {
    transaction: <Hex Encoded Transaction String>
  }

  @throws
  <Error>

  @returns
  {
    id: <Transaction Id Hex Encoded String>
  }
*/
module.exports = ({transaction}) => {
  const tx = componentsOfTransaction({transaction});

  const {id} = idForTransactionComponents({
    inputs: tx.inputs.map(({id, script, sequence, vout}) => ({
      sequence,
      vout,
      hash: hexAsBuffer(id).reverse(),
      script: hexAsBuffer(script),
    })),
    locktime: tx.locktime,
    outputs: tx.outputs.map(({script, tokens}) => ({
      tokens,
      script: hexAsBuffer(script),
    })),
    version: tx.version,
  });

  return {id};
};

const parseTransaction = require('./parse_transaction');

const bufferAsHex = buffer => buffer.toString('hex');
const hexAsBuffer = hex => Buffer.from(hex, 'hex');
const isHex = n => !!n && !(n.length % 2) && /^[0-9A-F]*$/i.test(n);
const txHashAsTxId = hash => hash.reverse();

/** Get the components of a hex-encoded transaction

  {
    transaction: <Hex Encoded Transaction String>
  }

  @throws
  <Error>

  @returns
  {
    inputs: [{
      id: <Spending Transaction Id Hex String>
      script: <ScriptSig Script Hex String>
      sequence: <Sequence Number>
      vout: <Spending Transaction Output Index Number>
      [witness]: [<Script Stack Element Hex String>]
    }]
    locktime: <Timelock nLockTime Number>
    outputs: [{
      script: <ScriptPub Script Hex String>
      tokens: <Tokens Count Number>
    }]
    version: <Version Number>
  }
*/
module.exports = ({transaction}) => {
  if (!isHex(transaction)) {
    throw new Error('ExpectedHexEncodedTransactionToGetComponentsOf');
  }

  const details = parseTransaction({buffer: hexAsBuffer(transaction)});

  return {
    inputs: details.inputs.map(input => ({
      id: bufferAsHex(txHashAsTxId(input.hash)),
      script: bufferAsHex(input.script),
      sequence: input.sequence,
      vout: input.vout,
      witness: !!input.witness ? input.witness.map(bufferAsHex) : undefined,
    })),
    locktime: details.locktime,
    outputs: details.outputs.map(output => ({
      script: bufferAsHex(output.script),
      tokens: output.tokens,
    })),
    version: details.version,
  };
};

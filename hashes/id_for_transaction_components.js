const {createHash} = require('crypto');

const {numberAsCompactInt} = require('./../numbers');

const {alloc} = Buffer;
const bufferAsHex = buffer => buffer.toString('hex');
const byteCountHash = 32;
const byteCountInt32 = 4;
const byteCountInt64 = 8;
const {concat} = Buffer;
const sha256 = preimage => createHash('sha256').update(preimage).digest();

/** Determine a transaction id from transaction components

  Note: remember the input hash is the reversed byte order of a normal tx id

  {
    inputs: [{
      hash: <Spending Internal Byte Order Transaction Id Buffer Object>
      script: <Script Buffer Object>
      sequence: <Sequence Number>
      vout: <Spending Transaction Output Index Number>
    }]
    locktime: <Timelock nLockTime Number>
    outputs: [{
      script: <Output Script Buffer Object>
      tokens: <Tokens Count Number>
    }]
    version: <Version Number>
  }

  @throws
  <Error>

  @returns
  {
    id: <Transaction Id Hex String>
  }
*/
module.exports = ({inputs, locktime, outputs, version}) => {
  const elements = [];

  // Write the signed transaction version number
  const ver = alloc(byteCountInt32);

  ver.writeInt32LE(version);

  elements.push(ver);

  // Write how many inputs there are
  elements.push(numberAsCompactInt({number: inputs.length}).encoded);

  // Write the inputs
  elements.push(concat(inputs.map(input => {
    // Encode the sequence number
    const sequence = alloc(byteCountInt32);

    sequence.writeUInt32LE(input.sequence);

    // Encode the spend output index
    const vout = alloc(byteCountInt32);

    vout.writeUInt32LE(input.vout);

    // Write the spend outpoint, script sig, sequence number
    return concat([
      input.hash,
      vout,
      numberAsCompactInt({number: input.script.length}).encoded,
      input.script,
      sequence,
    ]);
  })));

  // Write the outputs count
  elements.push(numberAsCompactInt({number: outputs.length}).encoded);

  elements.push(concat(outputs.map(output => {
    // Encode the output value
    const value = alloc(byteCountInt64);

    value.writeBigUInt64LE(BigInt(output.tokens));

    // Write the output value and output script
    return concat([
      value,
      numberAsCompactInt({number: output.script.length}).encoded,
      output.script,
    ]);
  })));

  // Write the locktime
  const timelock = alloc(byteCountInt32);

  timelock.writeUInt32LE(locktime);

  elements.push(timelock);

  // The id is the double sha256 hash of the elements, reversed
  return {id: bufferAsHex(sha256(sha256(concat(elements))).reverse())};
};

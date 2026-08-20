const {numberAsCompactInt} = require('./../numbers');

const {alloc} = Buffer;
const bufferAsHex = buffer => buffer.toString('hex');
const byteCountInt32 = 4;
const byteCountInt64 = 8;
const {concat} = Buffer;
const encodeCount = number => numberAsCompactInt({number}).encoded;
const hexAsBuffer = hex => Buffer.from(hex, 'hex');
const {isArray} = Array;
const isHex = n => !(n.length % 2) && /^[0-9A-F]*$/i.test(n);
const isTxId = n => /^[0-9A-F]{64}$/i.test(n);
const markerAndFlag = Buffer.from([0x00, 0x01]);
const txIdAsTxHash = id => hexAsBuffer(id).reverse();

/** Form a hex-encoded transaction from its component elements

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

  @throws
  <Error>

  @returns
  {
    transaction: <Hex Encoded Transaction String>
  }
*/
module.exports = ({inputs, locktime, outputs, version}) => {
  if (!isArray(inputs)) {
    throw new Error('ExpectedArrayOfInputsToFormTransactionFromComponents');
  }

  if (inputs.some(input => !input || !isTxId(input.id))) {
    throw new Error('ExpectedSpendingTransactionIdsToFormTransaction');
  }

  if (!!inputs.find(input => !isHex(input.script || ''))) {
    throw new Error('ExpectedHexEncodedInputScriptsToFormTransaction');
  }

  if (locktime === undefined) {
    throw new Error('ExpectedLocktimeToFormTransactionFromComponents');
  }

  if (!isArray(outputs)) {
    throw new Error('ExpectedArrayOfOutputsToFormTransactionFromComponents');
  }

  if (outputs.some(output => !output || !isHex(output.script || ''))) {
    throw new Error('ExpectedHexEncodedOutputScriptsToFormTransaction');
  }

  if (version === undefined) {
    throw new Error('ExpectedVersionNumberToFormTransactionFromComponents');
  }

  // The presence of any input witness indicates SegWit tx encoding
  const isSegWit = !!inputs.find(input => isArray(input.witness));

  const elements = [];

  // Write the signed transaction version number
  const ver = alloc(byteCountInt32);

  ver.writeInt32LE(version);

  elements.push(ver);

  // SegWit transactions lead with marker and flag bytes
  if (isSegWit) {
    elements.push(markerAndFlag);
  }

  // Write how many inputs there are
  elements.push(encodeCount(inputs.length));

  // Write the inputs
  elements.push(concat(inputs.map(input => {
    const script = hexAsBuffer(input.script);

    // Encode the sequence number
    const sequence = alloc(byteCountInt32);

    sequence.writeUInt32LE(input.sequence);

    // Encode the spend output index
    const vout = alloc(byteCountInt32);

    vout.writeUInt32LE(input.vout);

    // Write the spend outpoint, script sig, sequence number
    return concat([
      txIdAsTxHash(input.id),
      vout,
      encodeCount(script.length),
      script,
      sequence,
    ]);
  })));

  // Write the outputs count
  elements.push(encodeCount(outputs.length));

  // Write the outputs
  elements.push(concat(outputs.map(output => {
    const script = hexAsBuffer(output.script);

    // Encode the output value
    const value = alloc(byteCountInt64);

    value.writeBigUInt64LE(BigInt(output.tokens));

    // Write the output value and output script
    return concat([value, encodeCount(script.length), script]);
  })));

  // SegWit places the input witnesses after the outputs
  if (isSegWit) {
    elements.push(concat(inputs.map(input => {
      const witness = input.witness || [];

      // Write the witness stack element count and the stack elements
      return concat([
        encodeCount(witness.length),
        concat(witness.map(element => {
          const item = hexAsBuffer(element);

          return concat([encodeCount(item.length), item]);
        })),
      ]);
    })));
  }

  // The final element is the 4 byte transaction nLockTime
  const timelock = alloc(byteCountInt32);

  timelock.writeUInt32LE(locktime);

  elements.push(timelock);

  return {transaction: bufferAsHex(concat(elements))};
};

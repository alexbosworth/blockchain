const {compactIntAsNumber} = require('./../numbers');

const byteCountHash = 32;
const byteCountInt8 = 1;
const byteCountInt32 = 4;
const byteCountInt64 = 8;
const byteCountMarkerFlag = 2;
const byteCountNoMarkerFlag = 0;
const decodeCompactInt = (b, o) => compactIntAsNumber({encoded: b, start: o});
const defaultLocktime = 0;
const defaultStartIndex = 0;
const defaultWitnessCount = 0;
const {isBuffer} = Buffer;
const segWitV0Marker = 0;
const segWitV0Flag = 1;
const times = n => [...Array(n).keys()];

/** Parse a raw transaction out of a buffer at a specific offset start

  {
    buffer: <Data Buffer Object>
    [is_terminating_after_outputs]: <Ignore Data After Outputs Bool>
    [start]: <Starting Offset Index Number>
  }

  @returns
  {
    bytes: <Raw Transaction Bytes Buffer Object>
    inputs: [{
      hash: <Spending Internal Byte Order Transaction Id Buffer Object>
      script: <Script Buffer Object>
      sequence: <Sequence Number>
      vout: <Spending Transaction Output Index Number>
      [witness]: [<Script Stack Element Buffer Object>]
    }]
    locktime: <Timelock nLockTime Number>
    outputs: [{
      script: <Output Script Buffer Object>
      tokens: <Tokens Count Number>
    }]
    version: <Version Number>
  }
*/
module.exports = args => {
  if (!isBuffer(args.buffer)) {
    throw new Error('ExpectedDataBufferToReadTransactionDataOutOf');
  }

  const start = args.start || defaultStartIndex;

  let offset = start;

  // Transaction version is a signed 4 byte integer
  const version = args.buffer.readInt32LE(offset, offset + byteCountInt32);

  offset += byteCountInt32;

  // For SegWit transactions, the next 2 bytes would be a marker and flag
  const flagSplit = offset + byteCountInt8;

  const marker = args.buffer.readUInt8(offset, flagSplit);

  const flag = args.buffer.readUInt8(flagSplit, offset + byteCountMarkerFlag);

  // The presence of the marker and flag indicates SegWit tx encoding
  const isSegWit = !marker && flag === segWitV0Flag;

  // When tx isn't SegWit though, the bytes are not marker and flag
  offset += isSegWit ? byteCountMarkerFlag : byteCountNoMarkerFlag;

  const inputsCount = decodeCompactInt(args.buffer, offset);

  offset += inputsCount.bytes;

  // For SegWit the witness stacks will be at the end of the transaction
  const witnessCount = isSegWit ? inputsCount.number : defaultWitnessCount;

  // Read in the inputs
  const inputs = times(inputsCount.number).map(i => {
    // The hash is the internal byte order hash of the tx being spent
    const hash = args.buffer.subarray(offset, offset + byteCountHash);

    offset += byteCountHash;

    // The vout is the 4 byte output index of the tx being spent in this input
    const vout = args.buffer.readUInt32LE(offset, offset + byteCountInt32);

    offset += byteCountInt32;

    // Before SegWit, scripts were encoded in this input space
    const scriptLength = decodeCompactInt(args.buffer, offset);

    offset += scriptLength.bytes;

    // Scripts are variable byte length
    const script = args.buffer.subarray(offset, offset + scriptLength.number);

    offset += scriptLength.number;

    // Sequence is a 4 byte unsigned number for an input, used for CSV mainly
    const sequence = args.buffer.readUInt32LE(offset, offset + byteCountInt32);

    offset += byteCountInt32;

    return {hash, script, sequence, vout};
  });

  const outputsCount = decodeCompactInt(args.buffer, offset);

  offset += outputsCount.bytes;

  // Read in the outputs of the transaction
  const outputs = times(outputsCount.number).map(i => {
    // The value being spent
    const value = args.buffer.readBigUInt64LE(offset, offset + byteCountInt64);

    offset += byteCountInt64;

    // The script being spent to has a variable length
    const scriptLength = decodeCompactInt(args.buffer, offset);

    offset += scriptLength.bytes;

    const script = args.buffer.subarray(offset, offset + scriptLength.number);

    offset += scriptLength.number;

    return {script, tokens: Number(value)};
  });

  // Exit early when ignoring data after the outputs
  if (!!args.is_terminating_after_outputs) {
    return {
      inputs,
      outputs,
      version,
      bytes: args.buffer.subarray(start, offset),
      locktime: defaultLocktime,
    };
  }

  // SegWit places the input witnesses after the outputs
  times(witnessCount).forEach(i => {
    // Witnesses are a stack of witness elements
    const stackElementsCount = decodeCompactInt(args.buffer, offset);

    offset += stackElementsCount.bytes;

    // Read in the witness stack elements
    const elements = [...Array(stackElementsCount.number).keys()].map(i => {
      // Stack elements are variable length
      const elementLength = decodeCompactInt(args.buffer, offset);

      offset += elementLength.bytes;

      const item = args.buffer.subarray(offset, offset + elementLength.number);

      offset += elementLength.number;

      return item;
    });

    // Insert the witness stack into the related input
    return inputs[i].witness = elements;
  });

  // The final element is the 4 byte transaction nLockTime
  const locktime = args.buffer.readUInt32LE(offset, offset + byteCountInt32);

  offset += byteCountInt32;

  // Take the bytes of this transaction
  const bytes = args.buffer.subarray(start, offset);

  return {bytes, inputs, locktime, outputs, version};
};
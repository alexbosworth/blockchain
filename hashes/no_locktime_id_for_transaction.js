const {createHash} = require('crypto');

const {compactIntAsNumber} = require('./../numbers');

const bufferAsHex = buffer => buffer.toString('hex');
const byteCountHash = 32;
const byteCountInt8 = 1;
const byteCountInt32 = 4;
const byteCountInt64 = 8;
const byteCountMarkerFlag = 2;
const byteCountNoMarkerFlag = 0;
const decodeCompactInt = (b, o) => compactIntAsNumber({encoded: b, start: o});
const defaultStartIndex = 0;
const defaultWitnessCount = 0;
const {isBuffer} = Buffer;
const segWitV0Marker = 0;
const segWitV0Flag = 1;
const sha256 = preimage => createHash('sha256').update(preimage).digest();
const times = n => [...Array(n).keys()];

/** Get an id for a transaction with witness data and mlocktime not included

  {
    buffer: <Data Buffer Object>
    [start]: <Starting Offset Index Number>
  }

  @throws
  <Error>

  @returns
  {
    id: <No nLockTime Transaction Id Hex String>
  }
*/
module.exports = ({buffer, start}) => {
  if (!isBuffer(buffer)) {
    throw new Error('ExpectedDataBufferToGetNoLocktimeIdForTransaction');
  }

  let offset = start || defaultStartIndex;

  // Transaction version is a signed 4 byte integer
  const version = buffer.readInt32LE(offset, offset + byteCountInt32);

  offset += byteCountInt32;

  // For SegWit transactions, the next 2 bytes would be a marker and flag
  const markerFlagSplit = offset + byteCountInt8;

  const marker = buffer.readUInt8(offset, markerFlagSplit);

  const flag = buffer.readUInt8(markerFlagSplit, offset + byteCountMarkerFlag);

  // The presence of the marker and flag indicates SegWit tx encoding
  const isSegWit = !marker && flag === segWitV0Flag;

  // When tx isn't SegWit though, the bytes are not marker and flag
  offset += isSegWit ? byteCountMarkerFlag : byteCountNoMarkerFlag;

  const inputsCount = decodeCompactInt(buffer, offset);

  offset += inputsCount.bytes;

  // For SegWit the witness stacks will be at the end of the transaction
  const witnessCount = isSegWit ? inputsCount.number : defaultWitnessCount;

  // Read in the inputs
  const inputs = times(inputsCount.number).map(i => {
    // The hash is the internal byte order hash of the tx being spent
    const hash = buffer.subarray(offset, offset + byteCountHash);

    offset += byteCountHash;

    // The vout is the 4 byte output index of the tx being spent in this input
    const vout = buffer.readUInt32LE(offset, offset + byteCountInt32);

    offset += byteCountInt32;

    // Before SegWit, scripts were encoded in this input space
    const scriptLength = decodeCompactInt(buffer, offset);

    offset += scriptLength.bytes;

    // Scripts are variable byte length
    const script = buffer.subarray(offset, offset + scriptLength.number);

    offset += scriptLength.number;

    // Sequence is a 4 byte unsigned number for an input, used for CSV mainly
    const sequence = buffer.readUInt32LE(offset, offset + byteCountInt32);

    offset += byteCountInt32;

    return {hash, script, sequence, vout};
  });

  const outputsCount = decodeCompactInt(buffer, offset);

  offset += outputsCount.bytes;

  // Read in the outputs of the transaction
  const outputs = times(outputsCount.number).map(i => {
    // The value being spent
    const tokens = buffer.readBigUInt64LE(offset, offset + byteCountInt64);

    offset += byteCountInt64;

    // The script being spent to has a variable length
    const scriptLength = decodeCompactInt(buffer, offset);

    offset += scriptLength.bytes;

    const script = buffer.subarray(offset, offset + scriptLength.number);

    offset += scriptLength.number;

    return {script, tokens};
  });

  // The remainder of the transaction bytes are witnesses and nlocktime
  const bytes = buffer.subarray(start, offset);

  return {id: bufferAsHex(sha256(bytes))};
};

const parseTransaction = require('./parse_transaction');

const byteCountLocktime = 4;
const byteCountMarkerFlag = 2;
const {ceil} = Math;
const hexAsBuffer = hex => Buffer.from(hex, 'hex');
const isHex = n => !!n && !(n.length % 2) && /^[0-9A-F]*$/i.test(n);
const noFlagAndMarker = 0;
const witnessScaling = 4;

/** Get the weight and virtual size of a hex-encoded transaction

  {
    transaction: <Hex Encoded Transaction String>
  }

  @throws
  <Error>

  @returns
  {
    vsize: <Transaction Virtual Size Number>
    weight: <Transaction Weight Units Number>
  }
*/
module.exports = ({transaction}) => {
  if (!isHex(transaction)) {
    throw new Error('ExpectedHexEncodedTransactionToGetSize');
  }

  const buffer = hexAsBuffer(transaction);

  const {bytes, inputs} = parseTransaction({buffer});

  if (bytes.length !== buffer.length) {
    throw new Error('UnexpectedDataAfterTransactionToGetSize');
  }

  // Parse through the outputs, stopping before witness data and nLockTime
  const txBeforeWitness = parseTransaction({
    buffer,
    is_terminating_after_outputs: true,
  });

  // Before the witness, a SegWit transaction includes marker and flag bytes
  const hasWitness = inputs.some(input => input.witness !== undefined);

  const markerFlagSize = hasWitness ? byteCountMarkerFlag : noFlagAndMarker;
  const sizeBeforeWitness = txBeforeWitness.bytes.length;

  // Stripped size includes nLockTime but excludes marker, flag, and witnesses
  const strippedSize = sizeBeforeWitness + byteCountLocktime - markerFlagSize;

  // Base bytes weigh four units and witness bytes weigh one unit
  const weight = strippedSize * witnessScaling + bytes.length - strippedSize;

  return {weight, vsize: ceil(weight / witnessScaling)};
};

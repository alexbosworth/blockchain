const {alloc} = Buffer;
const byteCountUInt16 = 2;
const byteCountUInt32 = 4;
const {concat} = Buffer;
const {from} = Buffer;
const {isInteger} = Number;
const maxDirectPushByteLength = 75;
const maxUInt8 = 255;
const maxUInt16 = 65535;
const maxUInt32 = 4294967295;
const minimumCount = 0;
const OP_PUSHDATA1 = 76;
const OP_PUSHDATA2 = 77;
const OP_PUSHDATA4 = 78;

/** Encode the byte count of a script data push

  A count up to 75 is a direct single byte, larger counts use OP_PUSHDATA

  {
    count: <Pushed Data Byte Count Number>
  }

  @throws
  <Error>

  @returns
  {
    encoded: <Push Byte Count Encoding Buffer Object>
  }
*/
module.exports = ({count}) => {
  if (!isInteger(count) || count < minimumCount) {
    throw new Error('ExpectedPushBytesCountNumberToEncode');
  }

  if (count > maxUInt32) {
    throw new Error('UnexpectedlyLargePushBytesCountToEncode');
  }

  // Exit early when the byte count fits in a direct single byte push
  if (count <= maxDirectPushByteLength) {
    return {encoded: from([count])};
  }

  // Exit early when the byte count fits in an OP_PUSHDATA1 push
  if (count <= maxUInt8) {
    return {encoded: from([OP_PUSHDATA1, count])};
  }

  // Exit early when the byte count fits in an OP_PUSHDATA2 push
  if (count <= maxUInt16) {
    const encodedCount = alloc(byteCountUInt16);

    encodedCount.writeUInt16LE(count);

    return {encoded: concat([from([OP_PUSHDATA2]), encodedCount])};
  }

  const encodedCount = alloc(byteCountUInt32);

  encodedCount.writeUInt32LE(count);

  return {encoded: concat([from([OP_PUSHDATA4]), encodedCount])};
};

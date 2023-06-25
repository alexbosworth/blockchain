const countUInt16Bytes = 2;
const countUInt32Bytes = 4;
const OP_PUSHDATA1 = 76;
const OP_PUSHDATA2 = 77;
const OP_PUSHDATA4 = 78;

/** Parse a script data push which is a number of bytes and then bytes

  {
    offset: <Offset Number>
    script: <Script Buffer Object>
  }

  @returns
  {
    bytes: <Byte Count Bytes Buffer Object>
    count: <Pushed Data Buffer Object>
  }
*/
module.exports = ({offset, script}) => {
  const code = script.readUInt8(offset);

  // Exit early when the bytes count is low enough to encode in a single byte
  if (code < OP_PUSHDATA1) {
    return {bytes: script.slice(offset, offset + [code].length), count: code};
  }

  // The data to consider will not include the push data code
  const data = script.slice(offset + [code].length);

  switch (code) {
  case OP_PUSHDATA1:
    // Exit early when there isn't any byte count data
    if (!data.length) {
      return {};
    }

    // OP_PUSHDATA1 means read one byte for the length
    const [nextByte] = data;

    return {
      bytes: script.slice(offset, offset + [code, nextByte].length),
      count: nextByte,
    };

  case OP_PUSHDATA2:
    // Exit early when there isn't enough data for UInt16
    if (data.length < countUInt16Bytes) {
      return {};
    }

    return {
      bytes: script.slice(offset, offset + [code].length + countUInt16Bytes),
      count: data.readUInt16LE(),
    };

  case OP_PUSHDATA4:
  default:
    // Exit early when there isn't enough data for UInt32
    if (data.length < countUInt32Bytes) {
      return {};
    }

    return {
      bytes: script.slice(offset, offset + [code].length + countUInt32Bytes),
      count: data.readUInt32LE(),
    };
  }
};

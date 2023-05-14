const byteLength = n => n < 253 ? 1 : n < 254 ? 3 : n < 255 ? 5 : 9;
const defaultOffset = 0;
const {isBuffer} = Buffer;
const isSafeNumber = n => n <= BigInt(Number.MAX_SAFE_INTEGER);
const lengthMarkerOffset = 1;
const limitBytes1 = 253;

/** Convert a compact integer to a regular number

  {
    encoded: <Compact Integer Encoded Number Buffer Object>
    [start]: <Buffer Offset Start Index Number>
  }

  @returns
  {
    bytes: <Byte Count Number>
    number: <Integer Number>
  }
*/
module.exports = ({encoded, start}) => {
  if (!isBuffer(encoded)) {
    throw new Error('ExpectedBufferToConvertCompactIntegerToNumber');
  }

  const offset = start || defaultOffset;

  // The total byte count of the compact integer is given by the first byte
  const size = encoded.readUInt8(offset);

  // Convert the first byte into the byte length of the encoding
  const bytes = byteLength(size);

  switch (bytes) {
  case 1:
    return {bytes, number: size};

  case 3:
    return {bytes, number: encoded.readUInt16LE(offset + lengthMarkerOffset)};

  case 5:
    return {bytes, number: encoded.readUInt32LE(offset + lengthMarkerOffset)};

  default:
    const number = encoded.readBigUInt64LE(offset + lengthMarkerOffset);

    if (!isSafeNumber(number)) {
      throw new Error('ExpectedSafeSizeEncodedCompactInteger');
    }

    return {bytes, number: Number(number)};
  }
};

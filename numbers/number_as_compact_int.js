const isSafeNumber = n => Number.isInteger(n) && n <= Number.MAX_SAFE_INTEGER;
const byteLength = n => n < 253 ? 1 : n <= 65535 ? 3 : n <= 4294967295 ? 5 : 9;
const byteLengthMarkerOffset = 1;
const limitBytes1 = 253;
const limitBytes2 = 65535;
const limitBytes4 = 4294967295;
const markerBytes2 = 253;
const markerBytes4 = 254;
const markerBytes8 = 255;
const rightShift = 0;

/** Convert a number to compact size integer serialization

  {
    number: <Amount to Convert to Compact Integer Serialization Number>
  }

  @throws
  <Error>

  @returns
  {
    encoded: <Serialized Compact Integer Buffer Object>
  }
*/
module.exports = ({number}) => {
  if (!isSafeNumber(number)) {
    throw new Error('ExpectedEncodeSafeNumberToEncodeAsCompactInteger');
  }

  const encoded = Buffer.alloc(byteLength(number));

  switch (encoded.length) {
  case 1:
    encoded.writeUInt8(number);
    break;

  case 3:
    encoded.writeUInt8(markerBytes2);
    encoded.writeUInt16LE(number, byteLengthMarkerOffset);
    break;

  case 5:
    encoded.writeUInt8(markerBytes4);
    encoded.writeUInt32LE(number, byteLengthMarkerOffset);
    break;

  default:
    encoded.writeUInt8(markerBytes8);
    encoded.writeBigUInt64LE(BigInt(number), byteLengthMarkerOffset);
    break;
  }

  return {encoded};
};

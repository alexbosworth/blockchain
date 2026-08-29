const {alloc} = Buffer;
const asBigInt = number => BigInt(number);
const bitsPerByte = 8;
const byteCountBigInt = 8;
const byteCounts = [1, 2, 3, 4, 5, 6, 8];
const {isInteger} = Number;
const maxSigned = bytes => 2 ** (bytes * bitsPerByte - 1) - 1;
const maxUnsigned = bytes => 2 ** (bytes * bitsPerByte) - 1;
const minSigned = bytes => -(2 ** (bytes * bitsPerByte - 1));
const minUnsigned = 0;
const writeOffset = 0;

/** Encode a number as little endian bytes

  A signed negative number is encoded as its twos complement representation

  {
    bytes: <Encoded Bytes Count Number>
    [is_signed]: <Number Is A Signed Number Bool>
    number: <Number to Encode Number>
  }

  @throws
  <Error>

  @returns
  {
    encoded: <Little Endian Encoded Number Buffer Object>
  }
*/
module.exports = args => {
  if (!byteCounts.includes(args.bytes)) {
    throw new Error('ExpectedBytesCountToEncodeNumberAsLittleEndian');
  }

  if (!isInteger(args.number)) {
    throw new Error('ExpectedNumberToEncodeAsLittleEndianBytes');
  }

  const isSigned = !!args.is_signed;

  const max = isSigned ? maxSigned(args.bytes) : maxUnsigned(args.bytes);
  const min = isSigned ? minSigned(args.bytes) : minUnsigned;

  if (args.number < min || args.number > max) {
    throw new Error('ExpectedNumberInByteRangeToEncodeAsLittleEndian');
  }

  const encoded = alloc(args.bytes);

  if (args.bytes === byteCountBigInt && isSigned) {
    // Eight byte signed numbers are written as signed big int numbers
    encoded.writeBigInt64LE(asBigInt(args.number));
  } else if (args.bytes === byteCountBigInt) {
    // Eight byte numbers are written as unsigned big int numbers
    encoded.writeBigUInt64LE(asBigInt(args.number));
  } else if (isSigned) {
    // Signed numbers are written as twos complement integers
    encoded.writeIntLE(args.number, writeOffset, args.bytes);
  } else {
    encoded.writeUIntLE(args.number, writeOffset, args.bytes);
  }

  return {encoded};
};

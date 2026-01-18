const {createHash} = require('crypto');

const base58Alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const byteMask = 0xff;
const {ceil} = Math;
const countChecksumBytes = 4;
const countHashBytes = 20;
const countVersionBytes = 1;
const leadingZeroCharCode = 0x31;
const notFoundIndex = -1;
const sha256 = preimage => createHash('sha256').update(preimage).digest();

/** Derive output hash and version data from a base58 address string

  {
    address: <Base58 Encoded Address String>
  }

  @throws
  <Error>

  @returns
  {
    hash: <Output Hash Buffer Object>
    version: <Script Version Byte Number>
  }
*/
module.exports = ({address}) => {
  if (typeof address !== 'string') {
    throw new Error('ExpectedBase58AddressStringToDecode');
  }

  // Ignore address string whitespace
  const str = address.trim();

  // Exit early with error on empty address, since it's not an address
  if (!str.length) {
    throw new Error('ExpectedNonEmptyBase58AddressToDecode');
  }

  let bytesLength = 0;
  let countLeadingZeros = 0;
  let index = 0;

  // Iterate to determine the number of leading zeros to preserve
  while (index < str.length && str.charCodeAt(index) === leadingZeroCharCode) {
    countLeadingZeros++;
    index++;
  }

  // Total bytes needed are log(58) / log(256) (256 values in a byte) = 0.732..
  const workingSize = ceil((str.length - index) * 733 / 1000);

  // Working buffer for the base256 (byte) representation, right-aligned
  const working = new Uint8Array(workingSize);

  // Iterate through the address characters and grab the decoded bytes
  while (index < str.length) {
    const value = base58Alphabet.indexOf(str[index]);

    if (value === notFoundIndex) {
      throw new Error('ExpectedAllBase58CharactersInBase58Address');
    }

    let carry = value;
    let i = 0;

    for (
      let position = workingSize - 1;
      (carry !== 0 || i < bytesLength) && position >= 0;
      --position, ++i
    ) {
      carry += base58Alphabet.length * working[position];

      // Take the least-significant byte
      working[position] = carry & byteMask;

      // Carry forward the remaining bytes
      carry = (carry / 256) | 0;
    }

    // Track the number of bytes being used
    bytesLength = i;

    // Move to the next character in the address
    index++;
  }

  // Meaningful bytes are right-aligned in working
  const bytesStart = workingSize - bytesLength;
  const meaningfulCount = workingSize - bytesStart;

  // Final buffer: leading zeros plus meaningful bytes
  const decoded = Buffer.alloc(countLeadingZeros + meaningfulCount);

  // Make a view into the meaningful bytes
  const dataBytes = working.subarray(bytesStart, bytesStart + meaningfulCount);

  // Copy the meaningful bytes into the final decoded data
  decoded.set(dataBytes, countLeadingZeros);

  // Exit early with error when we don't have both a payload and checksum
  if (decoded.length <= countChecksumBytes) {
    throw new Error('ExpectedPayloadAndChecksumInBase58Address');
  }

  // The last bytes of a base58 address are a double sha256 checksum
  const checksum = decoded.subarray(decoded.length - countChecksumBytes);

  // Aside from the checksum there is a version byte and then a hash
  const payload = decoded.subarray(0, decoded.length - countChecksumBytes);

  // Make sure that we have a base58 payload that has the version and hash
  if (payload.length !== countVersionBytes + countHashBytes) {
    throw new Error('ExpectedVersionAnd20ByteHashInBase58AddressPayload');
  }

  // Calculate the checksum for the given payload
  const payloadCheck = sha256(sha256(payload)).subarray(0, countChecksumBytes);

  // Exit early with error when the double SHA256 of payload doesn't match
  if (!checksum.equals(payloadCheck)) {
    throw new Error('ExpectedValidPayloadChecksumInBase58Address');
  }

  const [version] = payload;

  return {version, hash: payload.subarray(countVersionBytes)};
};

const {createHash} = require('crypto');

const base58Alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const byteBase = 256;
const {ceil} = Math;
const countChecksumBytes = 4;
const countHashBytes = 20;
const {isBuffer} = Buffer;
const {isInteger} = Number;
const leadingZeroChar = '1';
const maximumVersion = 0xff;
const minimumVersion = 0;
const sha256 = preimage => createHash('sha256').update(preimage).digest();

/** Encode output hash and version data as a base58 address string

  {
    hash: <Output Hash Buffer Object>
    version: <Script Version Byte Number>
  }

  @throws
  <Error>

  @returns
  {
    address: <Base58 Encoded Address String>
  }
*/
module.exports = ({hash, version}) => {
  if (!isBuffer(hash)) {
    throw new Error('ExpectedOutputHashToEncodeBase58Address');
  }

  if (hash.length !== countHashBytes) {
    throw new Error('Expected20ByteHashToEncodeBase58Address');
  }

  if (!isInteger(version) || version < minimumVersion) {
    throw new Error('ExpectedScriptVersionNumberToEncodeBase58Address');
  }

  if (version > maximumVersion) {
    throw new Error('UnexpectedHighScriptVersionToEncodeBase58Address');
  }

  // The payload of a base58 address is a version byte and then the hash
  const payload = Buffer.concat([Buffer.from([version]), hash]);

  // The last bytes of a base58 address are a double sha256 checksum
  const checksum = sha256(sha256(payload)).subarray(0, countChecksumBytes);

  // Data to encode is the payload followed by its checksum
  const data = Buffer.concat([payload, checksum]);

  let countLeadingZeros = 0;

  // Iterate to determine the number of leading zeros to preserve
  while (countLeadingZeros < data.length && !data[countLeadingZeros]) {
    countLeadingZeros++;
  }

  // Total chars needed are log(256) / log(58) per byte = 1.365..
  const workingSize = ceil((data.length - countLeadingZeros) * 1366 / 1000);

  // Working buffer for the base58 digit representation, right-aligned
  const working = new Uint8Array(workingSize);

  let charsLength = 0;
  let index = countLeadingZeros;

  // Iterate through the data bytes and grab the base58 digits
  while (index < data.length) {
    let carry = data[index];
    let i = 0;

    for (
      let position = workingSize - 1;
      (carry !== 0 || i < charsLength) && position >= 0;
      --position, ++i
    ) {
      carry += byteBase * working[position];

      // Take the least-significant base58 digit
      working[position] = carry % base58Alphabet.length;

      // Carry forward the remaining digits
      carry = (carry / base58Alphabet.length) | 0;
    }

    // Track the number of digits being used
    charsLength = i;

    // Move to the next byte in the data
    index++;
  }

  // Meaningful digits are right-aligned in working
  const digits = working.subarray(workingSize - charsLength);

  // Leading zero bytes are preserved as leading zero characters
  const leadingZeros = leadingZeroChar.repeat(countLeadingZeros);

  // Map the base58 digits to their alphabet characters
  const encoded = [...digits].map(digit => base58Alphabet[digit]).join('');

  return {address: `${leadingZeros}${encoded}`};
};

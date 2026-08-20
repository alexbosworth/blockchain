const modifyBech32Accumulator = require('./modify_bech32_accumulator');

const alphabet = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const checksumLength = 6;
const codeForBech32 = 1;
const codeForBech32m = 0x2bc830a3;
const emptySum = [0, 0, 0, 0, 0, 0];
const {from} = Array;
const {isArray} = Array;
const {isInteger} = Number;
const join = arr => arr.join('');
const knownPrefixes = ['bc', 'tb', 'bcrt'];
const knownTypes = ['bech32', 'bech32m'];
const maximumWordValue = 31;
const minimumWordValue = 0;
const prefixDividerCharacter = '1';
const separator = 0;
const typeInitialSegwit = 'bech32';
const wordBits = 5;
const wordMask = 31;

/** Encode data words as a Bech32/Bech32m string with a checksum

  {
    prefix: <Lowercase Human Readable Prefix String>
    type: <Bech32 Type String>
    words: [<Bech32 5-Bit Data Number>]
  }

  @throws
  <Error>

  @returns
  {
    encoded: <Bech32/Bech32m Encoded String>
  }
*/
module.exports = ({prefix, type, words}) => {
  if (!knownPrefixes.includes(prefix)) {
    throw new Error('ExpectedKnownBech32AddressPrefixToEncodeBech32');
  }

  if (!knownTypes.includes(type)) {
    throw new Error('ExpectedKnownBech32TypeToEncodeBech32String');
  }

  if (!isArray(words)) {
    throw new Error('ExpectedArrayOfDataWordsToEncodeBech32String');
  }

  if (words.some(n => !isInteger(n))) {
    throw new Error('ExpectedIntegerDataWordsToEncodeBech32String');
  }

  if (words.some(n => n < minimumWordValue || n > maximumWordValue)) {
    throw new Error('Expected5BitDataWordValuesToEncodeBech32String');
  }

  let accumulator = 1;
  const code = type === typeInitialSegwit ? codeForBech32 : codeForBech32m;

  // Collect the high bits
  const highBits = from(
    {length: prefix.length},
    (_, i) => prefix.charCodeAt(i) >> wordBits
  );

  // Collect the low bits
  const lowBits = from(
    {length: prefix.length},
    (_, i) => prefix.charCodeAt(i) & wordMask
  );

  // Run the checksum calculation with an empty checksum placeholder
  [...highBits, separator, ...lowBits, ...words, ...emptySum].forEach(v => {
    return accumulator = modifyBech32Accumulator(accumulator) ^ (v & wordMask);
  });

  // Finalize the checksum for the bech32 type
  const checksum = accumulator ^ code;

  // Pull the checksum words out of the checksum value, highest bits first
  const checksumWords = from(
    {length: checksumLength},
    (_, i) => (checksum >> ((checksumLength - 1 - i) * wordBits)) & wordMask
  );

  // Map the data and checksum words to alphabet characters
  const data = [...words, ...checksumWords].map(word => alphabet[word]);

  return {encoded: prefix + prefixDividerCharacter + join(data)};
};

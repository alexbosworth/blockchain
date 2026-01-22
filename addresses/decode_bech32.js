const bech32Type = require('./bech32_type');

const alphabet = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const knownPrefixes = ['bc', 'tb', 'bcrt'];
const lengthSeparator = 1;
const lengthChecksum = 6;
const prefixDividerCharacter = '1';
const maximumCharactersLength = 90;
const minimumCharactersLength = 8;
const minimumDividerPosition = 1;
const notFoundIndex = -1;
const removeChecksum = words => words.slice(0, -6);
const split = (str, index) => [str.slice(0, index), str.slice(index + 1)];

/** Decode a Bech32/Bech32m encoded string and validate/remove checksum

  {
    encoded: <Bech32/Bech32m Encoded String
  }

  @throws
  <Error>

  @returns
  {
    prefix: <Human Readable Part String>
    type: <Bech32 Type String>
    words: [<Data Words Number>]
  }
*/
module.exports = ({encoded}) => {
  if (typeof encoded !== 'string') {
    throw new Error('ExpectedEncodedStringToDecodeBech32String');
  }

  if (encoded.length > maximumCharactersLength) {
    throw new Error('ExpectedShorterBech32EncodedStringToDecode');
  }

  if (encoded.length < minimumCharactersLength) {
    throw new Error('ExpectedLongerBech32EncodedStringToDecode');
  }

  const converted = encoded.toLowerCase();

  if (encoded !== converted && encoded !== encoded.toUpperCase()) {
    throw new Error('ExpectedSingleCasingStyleForBech32EncodedString');
  }

  // Find the last index of the prefix divider character
  const dividerPosition = converted.lastIndexOf(prefixDividerCharacter);

  if (dividerPosition < minimumDividerPosition) {
    throw new Error('ExpectedLaterDividerPositionForBech32String');
  }

  if (converted.length - dividerPosition < lengthSeparator + lengthChecksum) {
    throw new Error('ExpectedChecksumDataForBech32String');
  }

  // Divide the data from the human readable prefix
  const [prefix, data] = split(converted, dividerPosition);

  // Make sure the prefix is a known one
  if (!knownPrefixes.includes(prefix)) {
    throw new Error('ExpectedKnownBech32AddressPrefixToDecodeBech32');
  }

  // Convert data part into bech32 words
  const words = [...data].map(char => alphabet.indexOf(char));

  if (words.includes(notFoundIndex)) {
    throw new Error('ExpectedAllKnownCharactersForBech32EncodedString');
  }

  const {type} = bech32Type({prefix, words});

  return {prefix, type, words: removeChecksum(words)};
};

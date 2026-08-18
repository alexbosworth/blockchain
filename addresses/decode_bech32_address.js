const decodeBech32 = require('./decode_bech32');
const {wordsAsBytes} = require('./../5bit');

const knownV0ProgramLengths = [20, 32];
const maxProgLength = 40;
const maximumSegwitVersion = 16;
const minimumProgLength = 2;
const typeBech32V1 = 'bech32m';
const typeInitialSegwit = 'bech32';
const versionInitialSegwit = 0;

/** Decode a bech32 address string to derive the address details

  {
    address: <Bech32 Encoded Address String>
  }

  @throws
  <Error>

  @returns
  {
    prefix: <Human Readable Prefix String>
    program: <Output Data Buffer Object>
    version: <Witness Version Number>
  }
*/
module.exports = ({address}) => {
  const {prefix, type, words} = decodeBech32({encoded: address});

  if (!words.length) {
    throw new Error('ExpectedNonEmptyWitnessCommitmentDataInBech32Address');
  }

  const [version, ...data] = words;

  if (version > maximumSegwitVersion) {
    throw new Error('UnexpectedHighSegwitWitnessVersion');
  }

  if (version === versionInitialSegwit && type !== typeInitialSegwit) {
    throw new Error('ExpectedInitialSegwitTypeForInitialSegwitVersion');
  }

  if (version !== versionInitialSegwit && type !== typeBech32V1) {
    throw new Error('ExpectedUseOfLaterVersionBech32PostInitialSegwit');
  }

  // Convert the 5 bit bech32 words into 8 bit (ie bytes) data
  const {bytes} = wordsAsBytes({words: data});

  if (bytes.length < minimumProgLength || bytes.length > maxProgLength) {
    throw new Error('UnexpectedSizeOfBech32AddressProgram');
  }

  if (version === 0 && !knownV0ProgramLengths.includes(bytes.length)) {
    throw new Error('UnexpectedBech32AddressProgramSizeForV0Address')
  }

  return {version, prefix, program: bytes};
};

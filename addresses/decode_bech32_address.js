const decodeBech32 = require('./decode_bech32');

const bitsPerBech32Word = 5;
const bitsPerByte = 8;
const byteMask = 0xff;
const bytesArrayAsBuffer = arr => Buffer.from(arr);
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

  let bits = 0;
  let carry = 0;
  const program = [];

  // Convert the 5 bit bech32 words into 8 bit (ie bytes) data
  data.forEach(value => {
    carry = (carry << bitsPerBech32Word) | value;

    bits += bitsPerBech32Word;

    while (bits >= bitsPerByte) {
      bits -= bitsPerByte;

      program.push((carry >> bits) & byteMask);
    }
  });

  if (bits >= bitsPerBech32Word) {
    throw new Error('ExpectedNoPaddingOnBech32Address');
  };

  if (((carry << (bitsPerByte - bits)) & byteMask) !== 0) {
    throw new Error('UnexpectedNonZeroPadding');
  }

  if (program.length < minimumProgLength || program.length > maxProgLength) {
    throw new Error('UnexpectedSizeOfBech32AddressProgram');
  }

  if (version === 0 && !knownV0ProgramLengths.includes(program.length)) {
    throw new Error('UnexpectedBech32AddressProgramSizeForV0Address')
  }

  return {version, prefix, program: bytesArrayAsBuffer(program)};
};

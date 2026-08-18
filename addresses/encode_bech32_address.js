const {bytesAsWords} = require('./../5bit');
const encodeBech32 = require('./encode_bech32');

const {isBuffer} = Buffer;
const {isInteger} = Number;
const knownV0ProgramLengths = [20, 32];
const maximumSegwitVersion = 16;
const maxProgLength = 40;
const minimumProgLength = 2;
const typeBech32V1 = 'bech32m';
const typeInitialSegwit = 'bech32';
const versionInitialSegwit = 0;

/** Encode address details as a bech32 address string

  {
    prefix: <Human Readable Prefix String>
    program: <Output Data Buffer Object>
    version: <Witness Version Number>
  }

  @throws
  <Error>

  @returns
  {
    address: <Bech32 Encoded Address String>
  }
*/
module.exports = ({prefix, program, version}) => {
  if (!isBuffer(program)) {
    throw new Error('ExpectedWitnessProgramToEncodeBech32Address');
  }

  if (program.length < minimumProgLength || program.length > maxProgLength) {
    throw new Error('UnexpectedSizeOfProgramToEncodeBech32Address');
  }

  if (!isInteger(version) || version < versionInitialSegwit) {
    throw new Error('ExpectedKnownWitnessVersionToEncodeBech32Address');
  }

  if (version > maximumSegwitVersion) {
    throw new Error('UnexpectedHighSegwitWitnessVersion');
  }

  const isV0 = version === versionInitialSegwit;

  if (isV0 && !knownV0ProgramLengths.includes(program.length)) {
    throw new Error('UnexpectedBech32AddressProgramSizeForV0Address');
  }

  // Initial segwit uses bech32, later witness versions use bech32m
  const type = isV0 ? typeInitialSegwit : typeBech32V1;

  // Convert the 8 bit (ie bytes) data into 5 bit bech32 words
  const {words} = bytesAsWords({bytes: program});

  const {encoded} = encodeBech32({prefix, type, words: [version, ...words]});

  return {address: encoded};
};

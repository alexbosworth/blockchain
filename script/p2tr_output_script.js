const scriptElementsAsOutput = require('./script_elements_as_output');

const expectedHashLength = 32;
const OP_1 = 0x51;

/** Get a Pay To Taproot Output Script

  {
    hash: <Taproot Hash Buffer Object>
  }

  @throws
  <Error>

  @returns
  {
    script: <Output Script Buffer Object>
  }
*/
module.exports = ({hash}) => {
  if (!hash) {
    throw new Error('ExpectedTaprootHashToDeriveOutputScript');
  }

  if (hash.length !== expectedHashLength) {
    throw new Error('ExpectedKnownLengthTaprootHashForOutputScript');
  }

  const {output} = scriptElementsAsOutput({elements: [OP_1, hash]});

  return {script: output};
};

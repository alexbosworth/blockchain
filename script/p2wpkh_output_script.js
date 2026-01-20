const scriptElementsAsOutput = require('./script_elements_as_output');

const expectedHashLength = 20;
const OP_0 = 0x00;

/** Get a Pay To Witness Public Key Hash Output Script

  {
    hash: <Witness Public Key Hash Buffer Object>
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
    throw new Error('ExpectedWitnessPublicKeyHashToDeriveOutputScript');
  }

  if (hash.length !== expectedHashLength) {
    throw new Error('ExpectedKnownLengthWitnessPublicKeyHashForOutputScript');
  }

  const {output} = scriptElementsAsOutput({elements: [OP_0, hash]});

  return {script: output};
};

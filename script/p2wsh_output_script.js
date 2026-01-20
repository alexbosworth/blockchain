const scriptElementsAsOutput = require('./script_elements_as_output');

const expectedHashLength = 32;
const OP_0 = 0x00;

/** Get a Pay To Witness Script Hash Output Script

  {
    hash: <Witness Script Hash Buffer Object>
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
    throw new Error('ExpectedWitnessScriptHashToDeriveOutputScript');
  }

  if (hash.length !== expectedHashLength) {
    throw new Error('ExpectedKnownLengthWitnessScriptHashForOutputScript');
  }

  const {output} = scriptElementsAsOutput({elements: [OP_0, hash]});

  return {script: output};
};

const scriptElementsAsOutput = require('./script_elements_as_output');

const expectedHashLength = 20;
const OP_EQUAL = 0x87;
const OP_HASH160 = 0xa9;

/** Get a Pay To Script Hash Output Script

  {
    hash: <Script Hash Buffer Object>
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
    throw new Error('ExpectedScriptHashToDerivePayToScriptOutputScript');
  }

  if (hash.length !== expectedHashLength) {
    throw new Error('UnexpectedHashLengthForPayToScriptHashOutputScript');
  }

  const {output} = scriptElementsAsOutput({
    elements: [OP_HASH160, hash, OP_EQUAL],
  });

  return {script: output};
};

const scriptElementsAsOutput = require('./script_elements_as_output');

const expectedHashLength = 20;
const OP_CHECKSIG = 0xac;
const OP_DUP = 0x76;
const OP_EQUALVERIFY = 0x88;
const OP_HASH160 = 0xa9;

/** Get a Pay To Public Key Hash Output Script

  {
    hash: <Public Key Hash Buffer Object>
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
    throw new Error('ExpectedPublicKeyHashToDeriveOutputScript');
  }

  if (hash.length !== expectedHashLength) {
    throw new Error('UnexpectedHashLengthForPublicKeyHashOutputScript');
  }

  const {output} = scriptElementsAsOutput({
    elements: [OP_DUP, OP_HASH160, hash, OP_EQUALVERIFY, OP_CHECKSIG],
  });

  return {script: output};
};

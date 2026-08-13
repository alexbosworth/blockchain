const {createHash} = require('node:crypto');

const scriptElementsAsOutput = require('./script_elements_as_output');

const {isArray} = Array;
const {isBuffer} = Buffer;
const {isInteger} = Number;
const maxKeysCount = 20;
const numberAsElement = num => num <= 16 ? 0x50 + num : Buffer.from([num]);
const OP_CHECKMULTISIG = 0xae;
const publicKeyLength = 33;
const sha256 = data => createHash('sha256').update(data).digest();

/** Get a Pay To Multisig Script and the script hash to pay to the script

  Use `hash` with `p2wshOutputScript` for a P2WSH output script

  {
    keys: [<Public Key Buffer Object>]
    required: <Signatures Required Count Number>
  }

  @throws
  <Error>

  @returns
  {
    hash: <Witness Script SHA256 Hash Buffer Object>
    script: <Multisig Script Buffer Object>
  }
*/
module.exports = ({keys, required}) => {
  if (!isArray(keys) || !keys.length) {
    throw new Error('ExpectedArrayOfPublicKeysToDeriveP2msScript');
  }

  if (keys.length > maxKeysCount) {
    throw new Error('ExpectedFewerPublicKeysToDeriveP2msScript');
  }

  if (!!keys.find(key => !isBuffer(key) || key.length !== publicKeyLength)) {
    throw new Error('ExpectedCompressedPublicKeysToDeriveP2msScript');
  }

  if (!required || !isInteger(required)) {
    throw new Error('ExpectedRequiredKeysCountToDeriveP2msScript');
  }

  if (required > keys.length) {
    throw new Error('UnexpectedCountOfRequiredKeysToDeriveP2msScript');
  }

  const {output} = scriptElementsAsOutput({
    elements: [
      numberAsElement(required),
      ...keys,
      numberAsElement(keys.length),
      OP_CHECKMULTISIG,
    ],
  });

  return {hash: sha256(output), script: output};
};

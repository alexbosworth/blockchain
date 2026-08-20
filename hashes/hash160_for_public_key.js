const {createHash} = require('node:crypto');

const {isBuffer} = Buffer;
const publicKeyLength = 33;
const ripemd160 = data => createHash('ripemd160').update(data).digest();
const sha256 = data => createHash('sha256').update(data).digest();

/** Get the hash160 of a public key

  {
    key: <Public Key Buffer Object>
  }

  @throws
  <Error>

  @returns
  {
    hash: <Public Key Hash160 Buffer Object>
  }
*/
module.exports = ({key}) => {
  if (!isBuffer(key)) {
    throw new Error('ExpectedPublicKeyToDerivePublicKeyHash160');
  }

  if (key.length !== publicKeyLength) {
    throw new Error('ExpectedCompressedPublicKeyToDerivePublicKeyHash160');
  }

  return {hash: ripemd160(sha256(key))};
};

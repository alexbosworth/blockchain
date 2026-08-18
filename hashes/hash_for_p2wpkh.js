const {createHash} = require('node:crypto');

const {isBuffer} = Buffer;
const publicKeyLength = 33;
const ripemd160 = data => createHash('ripemd160').update(data).digest();
const sha256 = data => createHash('sha256').update(data).digest();

/** Get the hash160 of a public key to pay to via P2WPKH

  Use `hash` with `p2wpkhOutputScript` for a P2WPKH output script

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
    throw new Error('ExpectedPublicKeyToDeriveHashForP2wpkh');
  }

  if (key.length !== publicKeyLength) {
    throw new Error('ExpectedCompressedPublicKeyToDeriveHashForP2wpkh');
  }

  return {hash: ripemd160(sha256(key))};
};

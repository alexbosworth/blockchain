const hash160ForPublicKey = require('./hash160_for_public_key');

/** Get the hash160 of a public key to pay to via P2PKH

  Use `hash` with `p2pkhOutputScript` for a P2PKH output script

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
module.exports = ({key}) => hash160ForPublicKey({key});

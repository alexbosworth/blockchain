const decodeBase58 = require('./decode_base58');
const decodeBase58Address = require('./decode_base58_address');
const decodeBech32Address = require('./decode_bech32_address');
const encodeBase58Address = require('./encode_base58_address');
const encodeBech32Address = require('./encode_bech32_address');

module.exports = {
  decodeBase58,
  decodeBase58Address,
  decodeBech32Address,
  encodeBase58Address,
  encodeBech32Address,
};

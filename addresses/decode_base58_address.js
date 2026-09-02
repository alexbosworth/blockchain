const decodeBase58 = require('./decode_base58');

const countHashBytes = 20;
const countVersionBytes = 1;

/** Derive output hash and version data from a base58 address string

  {
    address: <Base58 Encoded Address String>
  }

  @throws
  <Error>

  @returns
  {
    hash: <Output Hash Buffer Object>
    version: <Script Version Byte Number>
  }
*/
module.exports = ({address}) => {
  if (typeof address !== 'string') {
    throw new Error('ExpectedBase58AddressStringToDecode');
  }

  // Decode the base58check string and validate its checksum
  const {payload} = decodeBase58({encoded: address});

  // Make sure that we have a base58 payload that has the version and hash
  if (payload.length !== countVersionBytes + countHashBytes) {
    throw new Error('ExpectedVersionAnd20ByteHashInBase58AddressPayload');
  }

  const [version] = payload;

  return {version, hash: payload.subarray(countVersionBytes)};
};

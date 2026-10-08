const {decodeBase58} = require('./../addresses');
const networks = require('./conf/networks.json');

const compressedFlag = 0x01;
const copyOf = bytes => Buffer.alloc(bytes.length, bytes);
const countFlagBytes = 1;
const countPrivateKeyBytes = 32;
const countVersionBytes = 1;
const curveOrder = Buffer.from('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141', 'hex');
const isDefined = n => n !== undefined && n !== null;
const isZero = bytes => bytes.every(byte => !byte);
const {keys} = Object;
const maxWifLength = 52;
const {values} = Object;
const wipe = bytes => bytes.fill(0);

/** Decode a WIF encoded private key

  Derive the public key in compressed form when `is_compressed` is true

  When a network is not specified, a WIF for any known network is accepted

  Supported networks: btc, btcregtest, btcsignet, btctestnet, btctestnet4

  {
    [network]: <Network Name String>
    wif: <WIF Encoded Private Key String>
  }

  @throws
  <Error>

  @returns
  {
    is_compressed: <Public Key Is Compressed Bool>
    private_key: <Private Key Buffer Object>
  }
*/
module.exports = ({network, wif}) => {
  if (isDefined(network) && !keys(networks).includes(network)) {
    throw new Error('ExpectedKnownNetworkNameToDecodeWif');
  }

  if (typeof wif !== 'string') {
    throw new Error('ExpectedWifEncodedPrivateKeyStringToDecode');
  }

  // Exit early with error when the string is too long to be a WIF to decode
  if (wif.trim().length > maxWifLength) {
    throw new Error('ExpectedShorterWifEncodedPrivateKeyString');
  }

  // Decode the base58check string and validate its checksum
  const decoded = decodeBase58({encoded: wif});

  // Copy the payload into its own memory, it was decoded into shared memory
  const payload = copyOf(decoded.payload);

  // Wipe the shared memory copy of the payload since it has the private key
  wipe(decoded.payload);

  // The payload is a version byte and then the private key, maybe with a flag
  const keyEnd = countVersionBytes + countPrivateKeyBytes;

  // A compressed public key is signaled with a flag byte after the private key
  const isCompressed = payload.length === keyEnd + countFlagBytes;

  // Make sure that the payload has the version and the private key
  if (payload.length !== keyEnd && !isCompressed) {
    throw new Error('ExpectedVersionAnd32BytePrivateKeyInWifPayload');
  }

  // The compressed public key flag byte only has a single valid value
  if (isCompressed && payload[keyEnd] !== compressedFlag) {
    throw new Error('UnexpectedCompressionFlagValueInWifPayload');
  }

  const [version] = payload;

  // Exit early with error when the version is not for the specified network
  if (isDefined(network) && networks[network].wif !== version) {
    throw new Error('UnexpectedWifVersionForNetwork');
  }

  // Exit early with error when the version is not for any known network
  if (!values(networks).some(n => n.wif === version)) {
    throw new Error('UnexpectedWifVersionForKnownNetworks');
  }

  // The private key gets its own memory, apart from the rest of the payload
  const privateKey = copyOf(payload.subarray(countVersionBytes, keyEnd));

  // A private key must be greater than zero and less than the curve order
  if (isZero(privateKey) || privateKey.compare(curveOrder) >= 0) {
    throw new Error('ExpectedValidSecp256k1PrivateKeyInWifPayload');
  }

  return {is_compressed: isCompressed, private_key: privateKey};
};

const {decodeBase58Address} = require('./../addresses');
const {decodeBech32Address} = require('./../addresses');
const networks = require('./conf/networks.json');
const p2pkhOutputScript = require('./p2pkh_output_script');
const p2shOutputScript = require('./p2sh_output_script');
const p2wpkhOutputScript = require('./p2wpkh_output_script');
const p2wshOutputScript = require('./p2wsh_output_script');
const scriptElementsAsOutput = require('./script_elements_as_output');

const bech32Separator = '1';
const bufferAsHex = buffer => buffer.toString('hex');
const {keys} = Object;
const p2wpkhHashLength = 20;
const {values} = Object;
const versionAsOpCode = version => 0x50 + version;
const witnessVersionInitial = 0;

/** Get the output script for an address

  Supported addresses: P2PKH, P2SH, P2WPKH, P2WSH, P2TR, future segwit versions

  Supported networks: btc, btcregtest, btcsignet, btctestnet, btctestnet4

  {
    address: <Address String>
    network: <Network Name String>
  }

  @throws
  <Error>

  @returns
  {
    script: <Output Script Hex String>
  }
*/
module.exports = ({address, network}) => {
  if (typeof address !== 'string') {
    throw new Error('ExpectedAddressStringToDeriveOutputScript');
  }

  if (!keys(networks).includes(network)) {
    throw new Error('ExpectedKnownNetworkNameToDeriveOutputScript');
  }

  const {bech32, p2pkh, p2sh} = networks[network];

  // Bech32 addresses start with a human readable prefix and then a separator
  const [prefix] = address.toLowerCase().split(bech32Separator);

  // Collect the bech32 prefixes that are in use across the known networks
  const prefixes = values(networks).map(n => n.bech32);

  // Exit early when the address is base58 encoded, it is a P2PKH or a P2SH
  if (!prefixes.includes(prefix)) {
    const {hash, version} = decodeBase58Address({address});

    switch (version) {
    case p2pkh:
      return {script: bufferAsHex(p2pkhOutputScript({hash}).script)};

    case p2sh:
      return {script: bufferAsHex(p2shOutputScript({hash}).script)};

    default:
      throw new Error('UnexpectedBase58AddressVersionForNetwork');
    }
  }

  const decoded = decodeBech32Address({address});

  if (decoded.prefix !== bech32) {
    throw new Error('UnexpectedBech32AddressPrefixForNetwork');
  }

  const {program, version} = decoded;

  const isInitialVersion = version === witnessVersionInitial;

  // Initial segwit version programs that are 20 bytes are public key hashes
  if (isInitialVersion && program.length === p2wpkhHashLength) {
    return {script: bufferAsHex(p2wpkhOutputScript({hash: program}).script)};
  }

  // Initial segwit version programs that are 32 bytes are script hashes
  if (isInitialVersion) {
    return {script: bufferAsHex(p2wshOutputScript({hash: program}).script)};
  }

  // Later witness versions are their OP_n and then the program as a push
  const {output} = scriptElementsAsOutput({
    elements: [versionAsOpCode(version), program],
  });

  return {script: bufferAsHex(output)};
};

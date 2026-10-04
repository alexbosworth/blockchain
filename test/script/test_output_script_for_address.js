const {deepStrictEqual} = require('node:assert').strict;
const {throws} = require('node:assert').strict;
const test = require('node:test');

const {outputScriptForAddress} = require('./../../');

const tests = [
  {
    args: {},
    description: 'An address is required',
    error: 'ExpectedAddressStringToDeriveOutputScript',
  },
  {
    args: {address: '16ro3Jptwo4asSevZnsRX6vfRS24TGE6uK'},
    description: 'A network is required',
    error: 'ExpectedKnownNetworkNameToDeriveOutputScript',
  },
  {
    args: {address: '16ro3Jptwo4asSevZnsRX6vfRS24TGE6uK', network: 'bitcoin'},
    description: 'A known network is required',
    error: 'ExpectedKnownNetworkNameToDeriveOutputScript',
  },
  {
    args: {address: '16ro3Jptwo4asSevZnsRX6vfRS24TGE6uP', network: 'btc'},
    description: 'A valid base58 address checksum is required',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {address: 'mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn', network: 'btc'},
    description: 'A testnet base58 address is not a mainnet address',
    error: 'UnexpectedBase58AddressVersionForNetwork',
  },
  {
    args: {
      address: '16ro3Jptwo4asSevZnsRX6vfRS24TGE6uK',
      network: 'btctestnet',
    },
    description: 'A mainnet base58 address is not a testnet address',
    error: 'UnexpectedBase58AddressVersionForNetwork',
  },
  {
    args: {
      address: '16ro3Jptwo4asSevZnsRX6vfRS24TGE6uK',
      network: 'btctestnet4',
    },
    description: 'A mainnet base58 address is not a testnet4 address',
    error: 'UnexpectedBase58AddressVersionForNetwork',
  },
  {
    args: {
      address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kemeawh',
      network: 'btc',
    },
    description: 'A valid bech32 address checksum is required',
    error: 'ExpectedInitialSegwitTypeForInitialSegwitVersion',
  },
  {
    args: {
      address: 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx',
      network: 'btc',
    },
    description: 'A testnet bech32 address is not a mainnet address',
    error: 'UnexpectedBech32AddressPrefixForNetwork',
  },
  {
    args: {
      address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
      network: 'btcregtest',
    },
    description: 'A mainnet bech32 address is not a regtest address',
    error: 'UnexpectedBech32AddressPrefixForNetwork',
  },
  {
    args: {
      address: 'bcrt1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080',
      network: 'btctestnet4',
    },
    description: 'A regtest bech32 address is not a testnet4 address',
    error: 'UnexpectedBech32AddressPrefixForNetwork',
  },
  {
    args: {
      address: 'bc1pw508d6qejxtdg4y5r3zarvary0c5xw7kw508d6qejxtdg4y5r3zarvary0c5xw7kt5nd6y',
      network: 'btc',
    },
    description: 'An output script is derived for a 40 byte v1 program',
    expected: {
      script: '5128751e76e8199196d454941c45d1b3a323f1433bd6751e76e8199196d454941c45d1b3a323f1433bd6',
    },
  },
  {
    args: {address: 'BC1SW50QGDZ25J', network: 'btc'},
    description: 'An output script is derived for a witness v16 address',
    expected: {script: '6002751e'},
  },
  {
    args: {address: 'bc1zw508d6qejxtdg4y5r3zarvaryvaxxpcs', network: 'btc'},
    description: 'An output script is derived for a witness v2 address',
    expected: {script: '5210751e76e8199196d454941c45d1b3a323'},
  },
  {
    args: {address: '16ro3Jptwo4asSevZnsRX6vfRS24TGE6uK', network: 'btc'},
    description: 'A p2pkh output script is derived for a mainnet address',
    expected: {
      script: '76a914404371705fa9bd789a2fcd52d2c580b65d35549d88ac',
    },
  },
  {
    args: {address: '3P14159f73E4gFr7JterCCQh9QjiTjiZrG', network: 'btc'},
    description: 'A p2sh output script is derived for a mainnet address',
    expected: {script: 'a914e9c3dd0c07aac76179ebc76a6c78d4d67c6c160a87'},
  },
  {
    args: {
      address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
      network: 'btc',
    },
    description: 'A p2wpkh output script is derived for a mainnet address',
    expected: {script: '0014751e76e8199196d454941c45d1b3a323f1433bd6'},
  },
  {
    args: {
      address: 'BC1QW508D6QEJXTDG4Y5R3ZARVARY0C5XW7KV8F3T4',
      network: 'btc',
    },
    description: 'A p2wpkh output script is derived for an uppercase address',
    expected: {script: '0014751e76e8199196d454941c45d1b3a323f1433bd6'},
  },
  {
    args: {
      address: 'bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3',
      network: 'btc',
    },
    description: 'A p2wsh output script is derived for a mainnet address',
    expected: {
      script: '00201863143c14c5166804bd19203356da136c985678cd4d27a1b8c6329604903262',
    },
  },
  {
    args: {
      address: 'bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqzk5jj0',
      network: 'btc',
    },
    description: 'A p2tr output script is derived for a mainnet address',
    expected: {
      script: '512079be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
    },
  },
  {
    args: {
      address: 'mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn',
      network: 'btctestnet',
    },
    description: 'A p2pkh output script is derived for a testnet address',
    expected: {
      script: '76a914243f1394f44554f4ce3fd68649c19adc483ce92488ac',
    },
  },
  {
    args: {
      address: '2N3oefVeg6stiTb5Kh3ozCSkaqmx91FDbsm',
      network: 'btctestnet',
    },
    description: 'A p2sh output script is derived for a testnet address',
    expected: {script: 'a91473d32ac9e4330a071ee1b3a9ccf3997bdd4174d087'},
  },
  {
    args: {
      address: 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx',
      network: 'btctestnet',
    },
    description: 'A p2wpkh output script is derived for a testnet address',
    expected: {script: '0014751e76e8199196d454941c45d1b3a323f1433bd6'},
  },
  {
    args: {
      address: 'tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7',
      network: 'btctestnet',
    },
    description: 'A p2wsh output script is derived for a testnet address',
    expected: {
      script: '00201863143c14c5166804bd19203356da136c985678cd4d27a1b8c6329604903262',
    },
  },
  {
    args: {
      address: 'tb1pqqqqp399et2xygdj5xreqhjjvcmzhxw4aywxecjdzew6hylgvsesf3hn0c',
      network: 'btctestnet',
    },
    description: 'A p2tr output script is derived for a testnet address',
    expected: {
      script: '5120000000c4a5cad46221b2a187905e5266362b99d5e91c6ce24d165dab93e86433',
    },
  },
  {
    args: {
      address: 'mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn',
      network: 'btctestnet4',
    },
    description: 'A p2pkh output script is derived for a testnet4 address',
    expected: {
      script: '76a914243f1394f44554f4ce3fd68649c19adc483ce92488ac',
    },
  },
  {
    args: {
      address: '2N3oefVeg6stiTb5Kh3ozCSkaqmx91FDbsm',
      network: 'btctestnet4',
    },
    description: 'A p2sh output script is derived for a testnet4 address',
    expected: {script: 'a91473d32ac9e4330a071ee1b3a9ccf3997bdd4174d087'},
  },
  {
    args: {
      address: 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx',
      network: 'btctestnet4',
    },
    description: 'A p2wpkh output script is derived for a testnet4 address',
    expected: {script: '0014751e76e8199196d454941c45d1b3a323f1433bd6'},
  },
  {
    args: {
      address: 'tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7',
      network: 'btctestnet4',
    },
    description: 'A p2wsh output script is derived for a testnet4 address',
    expected: {
      script: '00201863143c14c5166804bd19203356da136c985678cd4d27a1b8c6329604903262',
    },
  },
  {
    args: {
      address: 'tb1pqqqqp399et2xygdj5xreqhjjvcmzhxw4aywxecjdzew6hylgvsesf3hn0c',
      network: 'btctestnet4',
    },
    description: 'A p2tr output script is derived for a testnet4 address',
    expected: {
      script: '5120000000c4a5cad46221b2a187905e5266362b99d5e91c6ce24d165dab93e86433',
    },
  },
  {
    args: {address: 'mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn', network: 'btcsignet'},
    description: 'A p2pkh output script is derived for a signet address',
    expected: {
      script: '76a914243f1394f44554f4ce3fd68649c19adc483ce92488ac',
    },
  },
  {
    args: {
      address: '2N3oefVeg6stiTb5Kh3ozCSkaqmx91FDbsm',
      network: 'btcsignet',
    },
    description: 'A p2sh output script is derived for a signet address',
    expected: {script: 'a91473d32ac9e4330a071ee1b3a9ccf3997bdd4174d087'},
  },
  {
    args: {
      address: 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx',
      network: 'btcsignet',
    },
    description: 'A p2wpkh output script is derived for a signet address',
    expected: {script: '0014751e76e8199196d454941c45d1b3a323f1433bd6'},
  },
  {
    args: {
      address: 'tb1qqqqqp399et2xygdj5xreqhjjvcmzhxw4aywxecjdzew6hylgvsesrxh6hy',
      network: 'btcsignet',
    },
    description: 'A p2wsh output script is derived for a signet address',
    expected: {
      script: '0020000000c4a5cad46221b2a187905e5266362b99d5e91c6ce24d165dab93e86433',
    },
  },
  {
    args: {
      address: 'tb1pqqqqp399et2xygdj5xreqhjjvcmzhxw4aywxecjdzew6hylgvsesf3hn0c',
      network: 'btcsignet',
    },
    description: 'A p2tr output script is derived for a signet address',
    expected: {
      script: '5120000000c4a5cad46221b2a187905e5266362b99d5e91c6ce24d165dab93e86433',
    },
  },
  {
    args: {
      address: 'mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn',
      network: 'btcregtest',
    },
    description: 'A p2pkh output script is derived for a regtest address',
    expected: {
      script: '76a914243f1394f44554f4ce3fd68649c19adc483ce92488ac',
    },
  },
  {
    args: {
      address: '2N3oefVeg6stiTb5Kh3ozCSkaqmx91FDbsm',
      network: 'btcregtest',
    },
    description: 'A p2sh output script is derived for a regtest address',
    expected: {script: 'a91473d32ac9e4330a071ee1b3a9ccf3997bdd4174d087'},
  },
  {
    args: {
      address: 'bcrt1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080',
      network: 'btcregtest',
    },
    description: 'A p2wpkh output script is derived for a regtest address',
    expected: {script: '0014751e76e8199196d454941c45d1b3a323f1433bd6'},
  },
  {
    args: {
      address: 'bcrt1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qzf4jry',
      network: 'btcregtest',
    },
    description: 'A p2wsh output script is derived for a regtest address',
    expected: {
      script: '00201863143c14c5166804bd19203356da136c985678cd4d27a1b8c6329604903262',
    },
  },
  {
    args: {
      address: 'bcrt1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqc8gma6',
      network: 'btcregtest',
    },
    description: 'A p2tr output script is derived for a regtest address',
    expected: {
      script: '512079be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
    },
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => outputScriptForAddress(args), new Error(error), 'Got err');
    } else {
      const res = outputScriptForAddress(args);

      deepStrictEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

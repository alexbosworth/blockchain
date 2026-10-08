const {deepStrictEqual} = require('node:assert').strict;
const {throws} = require('node:assert').strict;
const test = require('node:test');

const {decodeWif} = require('./../../');

const hexAsBuffer = hex => Buffer.from(hex, 'hex');

const tests = [
  {
    args: {},
    description: 'A WIF encoded private key is expected',
    error: 'ExpectedWifEncodedPrivateKeyStringToDecode',
  },
  {
    args: {wif: null},
    description: 'A WIF string is expected instead of null',
    error: 'ExpectedWifEncodedPrivateKeyStringToDecode',
  },
  {
    args: {wif: 128},
    description: 'A WIF string is expected instead of a number',
    error: 'ExpectedWifEncodedPrivateKeyStringToDecode',
  },
  {
    args: {
      wif: hexAsBuffer('800c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
    description: 'A WIF string is expected instead of the payload bytes',
    error: 'ExpectedWifEncodedPrivateKeyStringToDecode',
  },
  {
    args: {wif: ['5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ']},
    description: 'A WIF string is expected instead of an array',
    error: 'ExpectedWifEncodedPrivateKeyStringToDecode',
  },
  {
    args: {network: 'btc'},
    description: 'A WIF is expected along with a network',
    error: 'ExpectedWifEncodedPrivateKeyStringToDecode',
  },
  {
    args: {
      network: 'bitcoin',
      wif: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ',
    },
    description: 'A known network name is expected',
    error: 'ExpectedKnownNetworkNameToDecodeWif',
  },
  {
    args: {
      network: 'mainnet',
      wif: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ',
    },
    description: 'The mainnet network name is btc',
    error: 'ExpectedKnownNetworkNameToDecodeWif',
  },
  {
    args: {
      network: 'testnet',
      wif: '91gGn1HgSap6CbU12F6z3pJri26xzp7Ay1VW6NHCoEayNXwRpu2',
    },
    description: 'The testnet network name is btctestnet',
    error: 'ExpectedKnownNetworkNameToDecodeWif',
  },
  {
    args: {
      network: 'testnet4',
      wif: '91gGn1HgSap6CbU12F6z3pJri26xzp7Ay1VW6NHCoEayNXwRpu2',
    },
    description: 'The testnet4 network name is btctestnet4',
    error: 'ExpectedKnownNetworkNameToDecodeWif',
  },
  {
    args: {
      network: 'signet',
      wif: '91gGn1HgSap6CbU12F6z3pJri26xzp7Ay1VW6NHCoEayNXwRpu2',
    },
    description: 'The signet network name is btcsignet',
    error: 'ExpectedKnownNetworkNameToDecodeWif',
  },
  {
    args: {
      network: 'regtest',
      wif: '91gGn1HgSap6CbU12F6z3pJri26xzp7Ay1VW6NHCoEayNXwRpu2',
    },
    description: 'The regtest network name is btcregtest',
    error: 'ExpectedKnownNetworkNameToDecodeWif',
  },
  {
    args: {
      network: 'BTC',
      wif: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ',
    },
    description: 'Network names are case sensitive',
    error: 'ExpectedKnownNetworkNameToDecodeWif',
  },
  {
    args: {
      network: ' btc',
      wif: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ',
    },
    description: 'Whitespace around a network name is not ignored',
    error: 'ExpectedKnownNetworkNameToDecodeWif',
  },
  {
    args: {
      network: 'constructor',
      wif: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ',
    },
    description: 'An object prototype property is not a network',
    error: 'ExpectedKnownNetworkNameToDecodeWif',
  },
  {
    args: {
      network: '__proto__',
      wif: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ',
    },
    description: 'The object prototype accessor is not a network',
    error: 'ExpectedKnownNetworkNameToDecodeWif',
  },
  {
    args: {
      network: 'toString',
      wif: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ',
    },
    description: 'An object prototype method is not a network',
    error: 'ExpectedKnownNetworkNameToDecodeWif',
  },
  {
    args: {
      network: 128,
      wif: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ',
    },
    description: 'A WIF version number is not a network',
    error: 'ExpectedKnownNetworkNameToDecodeWif',
  },
  {
    args: {
      network: '',
      wif: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ',
    },
    description: 'An empty network name is not a network',
    error: 'ExpectedKnownNetworkNameToDecodeWif',
  },
  {
    args: {
      network: false,
      wif: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ',
    },
    description: 'A false network is not a network',
    error: 'ExpectedKnownNetworkNameToDecodeWif',
  },
  {
    args: {
      network: 0,
      wif: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ',
    },
    description: 'A zero network is not a network',
    error: 'ExpectedKnownNetworkNameToDecodeWif',
  },
  {
    args: {
      network: ['btc'],
      wif: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ',
    },
    description: 'A network name is expected instead of an array',
    error: 'ExpectedKnownNetworkNameToDecodeWif',
  },
  {
    args: {network: 'bitcoin'},
    description: 'The network is checked before the WIF',
    error: 'ExpectedKnownNetworkNameToDecodeWif',
  },
  {
    args: {wif: ' \t\n'},
    description: 'A WIF of only whitespace is rejected',
    error: 'ExpectedNonEmptyBase58CheckStringToDecode',
  },
  {
    args: {wif: 'KwdMAjGmerYanjeui5SH07JkmpZvVipYvB2LJGU1ZxJwYvP98617'},
    description: 'A zero is not a base58 character',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {wif: 'KwdMAjGmerYanjeui5SHO7JkmpZvVipYvB2LJGU1ZxJwYvP98617'},
    description: 'An uppercase O is not a base58 character',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {wif: 'KwdMAjGmerYanjeui5SHI7JkmpZvVipYvB2LJGU1ZxJwYvP98617'},
    description: 'An uppercase I is not a base58 character',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {wif: 'KwdMAjGmerYanjeui5SHl7JkmpZvVipYvB2LJGU1ZxJwYvP98617'},
    description: 'A lowercase L is not a base58 character',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {wif: '5HueCGU8rMjxEXxiPuD5BDku4M kFqeZyd4dZ1jvhTVqvbTLvyTJ'},
    description: 'Whitespace inside of a WIF is not ignored',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {wif: '\u041awdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwYvP98617'},
    description: 'A lookalike Cyrillic letter is not a base58 character',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {wif: '\u00005HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ'},
    description: 'A leading NUL character is not ignored',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {wif: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ\u0000'},
    description: 'A trailing NUL character is not ignored',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {wif: '\u200b5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ'},
    description: 'A zero width space is not ignored as whitespace',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {wif: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ.'},
    description: 'A WIF with trailing punctuation is not a WIF',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {wif: '5hUEcgu8RmJXexXIpUd5bdKU4mKfQEzYD4Dz1JVHtvQVBtlVYtj'},
    description: 'A WIF with every letter case swapped is not a WIF',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {wif: '1111'},
    description: 'A WIF that only decodes to checksum bytes is rejected',
    error: 'ExpectedPayloadAndChecksumInBase58CheckString',
  },
  {
    args: {wif: 'KwdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwYvP98618'},
    description: 'A mistyped final character fails the checksum',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {wif: 'LwdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwYvP98617'},
    description: 'A mistyped first character fails the checksum',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {wif: '5HueCGU8rMjxEXxiPuD5BDku4NkFqeZyd4dZ1jvhTVqvbTLvyTJ'},
    description: 'A mistyped middle character fails the checksum',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {wif: '5HueCGU8rMxjEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ'},
    description: 'Swapped adjacent characters fail the checksum',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {wif: 'KwdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwYvP9861'},
    description: 'A WIF missing its final character fails the checksum',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {wif: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJa'},
    description: 'A WIF with an extra final character fails the checksum',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {wif: '15HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ'},
    description: 'A WIF with an extra leading one fails the checksum',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {wif: '5HUeCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ'},
    description: 'Base58 is case sensitive',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {wif: 'f3D1ajXzk1biCdNP195jhLiN1jbZzpUigRkeJUqt2tTvC'},
    description: 'A base58 key without a checksum is not a WIF',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {wif: 'KwdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwYvPXCgaE'},
    description: 'A WIF with a single SHA256 checksum is rejected',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {wif: 'S6c56bnXQiBjk9mqSYE7ykVQ7NzrRy'},
    description: 'A mini private key is not a WIF',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {wif: 'KwdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwYvP98617a'},
    description: 'A WIF with one too many characters is too long',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      wif: '0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d',
    },
    description: 'A hex encoded private key is too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      wif: 'xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi',
    },
    description: 'An extended private key is too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      wif: 'xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8',
    },
    description: 'An extended public key is too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: '6PRVWUbkzzsbcVac2qwfssoUJAN1Xhrg6bNk8J7Nzm5H7kxEbn2Nh2ZoGg'},
    description: 'A BIP 38 encrypted private key is too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: 'p2wpkh:KwdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwYvP98617'},
    description: 'A script type prefixed WIF is too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: '"5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ"'},
    description: 'A quoted WIF is too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: '2Sc7S1wac65gQ8sGKeJabXpqNCpxK7masshEtBDGDWT8BmtJ7rsUFD'},
    description: 'A mainnet payload with an extra byte is too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: 'z'.repeat(100000)},
    description: 'A very long string is rejected before decoding it',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: '16ro3Jptwo4asSevZnsRX6vfRS24TGE6uK'},
    description: 'A p2pkh address is not a WIF',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {wif: '3P14159f73E4gFr7JterCCQh9QjiTjiZrG'},
    description: 'A p2sh address is not a WIF',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {wif: 'mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn'},
    description: 'A testnet p2pkh address is not a WIF',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {wif: '2N3oefVeg6stiTb5Kh3ozCSkaqmx91FDbsm'},
    description: 'A testnet p2sh address is not a WIF',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {wif: 'FXjQL6s'},
    description: 'A version byte without a private key is rejected',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {wif: 'yPoVP5njSzmEVK4VJGRWWAwqnwCyLPRcMm5XyrKgY1DE64xhu'},
    description: 'A private key that is one byte short is rejected',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {wif: '2pH9ZQB88A29t7T4BFXMdSDezn7LV3yE8htmevJieD99kwEnyD'},
    description: 'A testnet private key that is one byte short is rejected',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {wif: 'gfmfGdKGPi63uHjNB7s8tHbFYYakiM7T6Fxevi7WmmVKWJudakkX'},
    description: 'A payload that is one byte too long is rejected',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {wif: 'KwdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwYvHFRKf6'},
    description: 'A compression flag of 0x00 is rejected',
    error: 'UnexpectedCompressionFlagValueInWifPayload',
  },
  {
    args: {wif: 'KwdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwYvWxyf5d'},
    description: 'A compression flag of 0x02 is rejected',
    error: 'UnexpectedCompressionFlagValueInWifPayload',
  },
  {
    args: {wif: 'KwdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwYx2CqY6c'},
    description: 'A compression flag of 0x10 is rejected',
    error: 'UnexpectedCompressionFlagValueInWifPayload',
  },
  {
    args: {wif: 'KwdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwZQy6kTvq'},
    description: 'A compression flag of 0xff is rejected',
    error: 'UnexpectedCompressionFlagValueInWifPayload',
  },
  {
    args: {wif: 'cMzLdeGd5vEqxB8B6VFQoRopQ3sLAAvEzDAoQgvX54xwofJjGwkJ'},
    description: 'A testnet compression flag of 0x00 is rejected',
    error: 'UnexpectedCompressionFlagValueInWifPayload',
  },
  {
    args: {wif: '16Mcb23muAxyXaSMhmB6B1mqkvLdWhtuFZmnZsxDczHRqir59L'},
    description: 'A version of 0x00 is not a WIF version',
    error: 'UnexpectedWifVersionForKnownNetworks',
  },
  {
    args: {wif: '1Qdz59dFBGz4VxavNuyXqCQvCrReA7W5dHeg87tihqqWYuW8cSa'},
    description: 'A compressed version of 0x00 is not a WIF version',
    error: 'UnexpectedWifVersionForKnownNetworks',
  },
  {
    args: {wif: 'Ap5VkGD32Z6edUxtbsArn1eRKzvt2vGqSvK1KKSBu2DtzaGDYY'},
    description: 'A p2sh address version is not a WIF version',
    error: 'UnexpectedWifVersionForKnownNetworks',
  },
  {
    args: {wif: '4irzCKqbN8F6wb5iz3f5xmZjVRH3ngF6FCRisCETZMjLCrWXi8T'},
    description: 'A testnet address version is not a WIF version',
    error: 'UnexpectedWifVersionForKnownNetworks',
  },
  {
    args: {wif: '5Fxu2326zw4j6iP1VKb5DuA89F8YBwj6qRZSmbEoTqqY6rxQPg2'},
    description: 'A version just below the mainnet version is rejected',
    error: 'UnexpectedWifVersionForKnownNetworks',
  },
  {
    args: {wif: '5KrPNVvAhnRBNMYRJUq58YMfyUMyVMQrQhhfFtcbT9rK67poC3F'},
    description: 'A version just above the mainnet version is rejected',
    error: 'UnexpectedWifVersionForKnownNetworks',
  },
  {
    args: {wif: '8yjXbmqebA8s4mtJ7fUz6Vi5nuVFM7GJBNRPrDbJoaaass89VzM'},
    description: 'A version just below the testnet version is rejected',
    error: 'UnexpectedWifVersionForKnownNetworks',
  },
  {
    args: {wif: '93d1xEjiJ1VKLR3hvpiz18udd8igeWx3keZcLWy6ntbMs73eGip'},
    description: 'A version just above the testnet version is rejected',
    error: 'UnexpectedWifVersionForKnownNetworks',
  },
  {
    args: {wif: '9YnBbiUC5PdiMimHXX2yJwuFMqxTQ5bBZEdDzmHYhihBGWTpGbk'},
    description: 'A version of 0xff is not a WIF version',
    error: 'UnexpectedWifVersionForKnownNetworks',
  },
  {
    args: {wif: '6uDNfQ1fknCphurZuj12xcY51qJj3T21Pk2iivwjAxAYHHxwEEr'},
    description: 'A Litecoin WIF is not a known network WIF',
    error: 'UnexpectedWifVersionForKnownNetworks',
  },
  {
    args: {wif: 'T3TccUZx4EXBZaHnFiP9eTr8igDEZoqSjNvbA56Z8vV74oyAcjTK'},
    description: 'A compressed Litecoin WIF is not a known network WIF',
    error: 'UnexpectedWifVersionForKnownNetworks',
  },
  {
    args: {wif: '6JDyVDw6R82kH9PsbHq3nqk8XnDoLmrFEEknLEZbHA3ZQ8cSuqc'},
    description: 'A Dogecoin WIF is not a known network WIF',
    error: 'UnexpectedWifVersionForKnownNetworks',
  },
  {
    args: {
      network: 'btcregtest',
      wif: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ',
    },
    description: 'A mainnet WIF is not a btcregtest WIF',
    error: 'UnexpectedWifVersionForNetwork',
  },
  {
    args: {
      network: 'btcsignet',
      wif: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ',
    },
    description: 'A mainnet WIF is not a btcsignet WIF',
    error: 'UnexpectedWifVersionForNetwork',
  },
  {
    args: {
      network: 'btctestnet',
      wif: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ',
    },
    description: 'A mainnet WIF is not a btctestnet WIF',
    error: 'UnexpectedWifVersionForNetwork',
  },
  {
    args: {
      network: 'btctestnet4',
      wif: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ',
    },
    description: 'A mainnet WIF is not a btctestnet4 WIF',
    error: 'UnexpectedWifVersionForNetwork',
  },
  {
    args: {
      network: 'btcregtest',
      wif: 'KwdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwYvP98617',
    },
    description: 'A compressed mainnet WIF is not a btcregtest WIF',
    error: 'UnexpectedWifVersionForNetwork',
  },
  {
    args: {
      network: 'btcsignet',
      wif: 'KwdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwYvP98617',
    },
    description: 'A compressed mainnet WIF is not a btcsignet WIF',
    error: 'UnexpectedWifVersionForNetwork',
  },
  {
    args: {
      network: 'btctestnet',
      wif: 'KwdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwYvP98617',
    },
    description: 'A compressed mainnet WIF is not a btctestnet WIF',
    error: 'UnexpectedWifVersionForNetwork',
  },
  {
    args: {
      network: 'btctestnet4',
      wif: 'KwdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwYvP98617',
    },
    description: 'A compressed mainnet WIF is not a btctestnet4 WIF',
    error: 'UnexpectedWifVersionForNetwork',
  },
  {
    args: {
      network: 'btc',
      wif: '91gGn1HgSap6CbU12F6z3pJri26xzp7Ay1VW6NHCoEayNXwRpu2',
    },
    description: 'A testnet WIF is not a btc WIF',
    error: 'UnexpectedWifVersionForNetwork',
  },
  {
    args: {
      network: 'btc',
      wif: 'cMzLdeGd5vEqxB8B6VFQoRopQ3sLAAvEzDAoQgvX54xwofSWj1fx',
    },
    description: 'A compressed testnet WIF is not a btc WIF',
    error: 'UnexpectedWifVersionForNetwork',
  },
  {
    args: {
      network: 'btc',
      wif: '6uDNfQ1fknCphurZuj12xcY51qJj3T21Pk2iivwjAxAYHHxwEEr',
    },
    description: 'A Litecoin WIF is not a btc WIF',
    error: 'UnexpectedWifVersionForNetwork',
  },
  {
    args: {
      network: 'btctestnet',
      wif: '6uDNfQ1fknCphurZuj12xcY51qJj3T21Pk2iivwjAxAYHHxwEEr',
    },
    description: 'A Litecoin WIF is not a btctestnet WIF',
    error: 'UnexpectedWifVersionForNetwork',
  },
  {
    args: {wif: '5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreAbuatmU'},
    description: 'A private key of zero is rejected',
    error: 'ExpectedValidSecp256k1PrivateKeyInWifPayload',
  },
  {
    args: {wif: 'KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73Nd2Mcv1'},
    description: 'A compressed private key of zero is rejected',
    error: 'ExpectedValidSecp256k1PrivateKeyInWifPayload',
  },
  {
    args: {wif: '91avARGdfge8E4tZfYLoxeJ5sGBdNJQH4kvjJoQFacbgwi1C2GD'},
    description: 'A testnet private key of zero is rejected',
    error: 'ExpectedValidSecp256k1PrivateKeyInWifPayload',
  },
  {
    args: {
      network: 'btcregtest',
      wif: 'cMahea7zqjxrtgAbB7LSGbcQUr1uX1ojuat9jZodMN87J7g8rY9t',
    },
    description: 'A compressed regtest private key of zero is rejected',
    error: 'ExpectedValidSecp256k1PrivateKeyInWifPayload',
  },
  {
    args: {wif: '5Km2kuu7vtFDPpxywn4u3NLpbr5jKpTB3jsuDU2KYEqetwr388P'},
    description: 'A private key equal to the curve order is rejected',
    error: 'ExpectedValidSecp256k1PrivateKeyInWifPayload',
  },
  {
    args: {wif: 'L5oLkpV3aqBjhki6LmvChTCV6odsp4SXM6FfU2Gppt5kFqRzExJJ'},
    description: 'A compressed private key of the curve order is rejected',
    error: 'ExpectedValidSecp256k1PrivateKeyInWifPayload',
  },
  {
    args: {
      network: 'btcsignet',
      wif: 'cWALDjUu1tszsCBMjBjL4mhYj2wHUWYDR8Q8aSjLKzjkWaXMLRaY',
    },
    description: 'A signet private key of the curve order is rejected',
    error: 'ExpectedValidSecp256k1PrivateKeyInWifPayload',
  },
  {
    args: {wif: '5Km2kuu7vtFDPpxywn4u3NLpbr5jKpTB3jsuDU2KYEqetyuszSh'},
    description: 'A private key just above the curve order is rejected',
    error: 'ExpectedValidSecp256k1PrivateKeyInWifPayload',
  },
  {
    args: {wif: 'L5oLkpV3aqBjhki6LmvChTCq73v9gyymzzMpBbhA5jUNu5nsyKgr'},
    description: 'A private key equal to the field prime is rejected',
    error: 'ExpectedValidSecp256k1PrivateKeyInWifPayload',
  },
  {
    args: {wif: '5Km2kuu7vtFDPpxywn4u3NLu8iSdrqhxWT8tUKjeEXs2f9yxoWz'},
    description: 'A private key of all 0xff bytes is rejected',
    error: 'ExpectedValidSecp256k1PrivateKeyInWifPayload',
  },
  {
    args: {wif: 'L5oLkpV3aqBjhki6LmvChTCq73v9gyymzzMpBbhDLjDpKCuAXpsi'},
    description: 'A compressed private key of all 0xff bytes is rejected',
    error: 'ExpectedValidSecp256k1PrivateKeyInWifPayload',
  },
  {
    args: {
      network: 'btctestnet4',
      wif: '93XfLeifX7KMMtUGa7xouxtrnNoM21F9rPzqYx69aGc5SDGXUKD',
    },
    description: 'A testnet4 private key of all 0xff bytes is rejected',
    error: 'ExpectedValidSecp256k1PrivateKeyInWifPayload',
  },
  {
    args: {wif: '12DNf4s27PCKhTcCVGSrCnVHV5P7ux2nphxTduKrXoxvmAJpM'},
    description: 'The payload size is checked before the version',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {wif: '1Qdz59dFBGz4VxavNuyXqCQvCrReA7W5dHeg87tihqqWYjbdJaj'},
    description: 'The compression flag is checked before the version',
    error: 'UnexpectedCompressionFlagValueInWifPayload',
  },
  {
    args: {wif: 'KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73NkCTu37'},
    description: 'The compression flag is checked before the private key',
    error: 'UnexpectedCompressionFlagValueInWifPayload',
  },
  {
    args: {
      network: 'btc',
      wif: '91avARGdfge8E4tZfYLoxeJ5sGBdNJQH4kvjJoQFacbgwi1C2GD',
    },
    description: 'The network version is checked before the private key',
    error: 'UnexpectedWifVersionForNetwork',
  },
  {
    args: {wif: '1111111111111111111111111111111112m1s9K'},
    description: 'A known version is checked before the private key',
    error: 'UnexpectedWifVersionForKnownNetworks',
  },
  {
    args: {wif: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ'},
    description: 'An uncompressed mainnet WIF is decoded',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {
      network: 'btc',
      wif: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ',
    },
    description: 'An uncompressed btc WIF is decoded',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {wif: 'KwdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwYvP98617'},
    description: 'A compressed mainnet WIF is decoded',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {
      network: 'btc',
      wif: 'KwdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwYvP98617',
    },
    description: 'A compressed btc WIF is decoded',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {wif: '91gGn1HgSap6CbU12F6z3pJri26xzp7Ay1VW6NHCoEayNXwRpu2'},
    description: 'An uncompressed testnet WIF is decoded',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {
      network: 'btcregtest',
      wif: '91gGn1HgSap6CbU12F6z3pJri26xzp7Ay1VW6NHCoEayNXwRpu2',
    },
    description: 'An uncompressed btcregtest WIF is decoded',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {
      network: 'btcsignet',
      wif: '91gGn1HgSap6CbU12F6z3pJri26xzp7Ay1VW6NHCoEayNXwRpu2',
    },
    description: 'An uncompressed btcsignet WIF is decoded',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {
      network: 'btctestnet',
      wif: '91gGn1HgSap6CbU12F6z3pJri26xzp7Ay1VW6NHCoEayNXwRpu2',
    },
    description: 'An uncompressed btctestnet WIF is decoded',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {
      network: 'btctestnet4',
      wif: '91gGn1HgSap6CbU12F6z3pJri26xzp7Ay1VW6NHCoEayNXwRpu2',
    },
    description: 'An uncompressed btctestnet4 WIF is decoded',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {wif: 'cMzLdeGd5vEqxB8B6VFQoRopQ3sLAAvEzDAoQgvX54xwofSWj1fx'},
    description: 'A compressed testnet WIF is decoded',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {
      network: 'btcregtest',
      wif: 'cMzLdeGd5vEqxB8B6VFQoRopQ3sLAAvEzDAoQgvX54xwofSWj1fx',
    },
    description: 'A compressed btcregtest WIF is decoded',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {
      network: 'btcsignet',
      wif: 'cMzLdeGd5vEqxB8B6VFQoRopQ3sLAAvEzDAoQgvX54xwofSWj1fx',
    },
    description: 'A compressed btcsignet WIF is decoded',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {
      network: 'btctestnet',
      wif: 'cMzLdeGd5vEqxB8B6VFQoRopQ3sLAAvEzDAoQgvX54xwofSWj1fx',
    },
    description: 'A compressed btctestnet WIF is decoded',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {
      network: 'btctestnet4',
      wif: 'cMzLdeGd5vEqxB8B6VFQoRopQ3sLAAvEzDAoQgvX54xwofSWj1fx',
    },
    description: 'A compressed btctestnet4 WIF is decoded',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {
      network: undefined,
      wif: 'KwdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwYvP98617',
    },
    description: 'An undefined network is the same as no network',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {
      network: null,
      wif: 'cMzLdeGd5vEqxB8B6VFQoRopQ3sLAAvEzDAoQgvX54xwofSWj1fx',
    },
    description: 'A null network is the same as no network',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {wif: ' 5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ\n'},
    description: 'Whitespace around a WIF is ignored',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {wif: '\ufeff5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ'},
    description: 'A byte order mark before a WIF is ignored',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {wif: 'KwdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwYvP98617\u00a0'},
    description: 'A non-breaking space after a WIF is ignored',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {
      network: 'btctestnet',
      wif: '\u300091gGn1HgSap6CbU12F6z3pJri26xzp7Ay1VW6NHCoEayNXwRpu2\u2028',
    },
    description: 'Unicode spaces and line separators around a WIF are ignored',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {
      wif: `${' '.repeat(1000)}KwdMAjGmerYanjeui5SHS7JkmpZvVipYvB2LJGU1ZxJwYvP98617${'\n'.repeat(1000)}`,
    },
    description: 'Whitespace around a WIF does not count toward its length',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d'),
    },
  },
  {
    args: {wif: '5JG9hT3beGTJuUAmCQEmNaxAuMacCTfXuw1R3FCXig23RQHMr4K'},
    description: 'The Mastering Bitcoin uncompressed WIF is decoded',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('3aba4162c7251c891207b747840551a71939b0de081f85c4e44cf7c13e41daa6'),
    },
  },
  {
    args: {wif: 'KyBsPXxTuVD82av65KZkrGrWi5qLMah5SdNq6uftawDbgKa2wv6S'},
    description: 'The Mastering Bitcoin compressed WIF is decoded',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('3aba4162c7251c891207b747840551a71939b0de081f85c4e44cf7c13e41daa6'),
    },
  },
  {
    args: {wif: '5KN7MzqK5wt2TP1fQCYyHBtDrXdJuXbUzm4A9rKAteGu3Qi5CVR'},
    description: 'The BIP 38 TestingOneTwoThree WIF is decoded',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('cbf4b9f70470856bb4f40f80b87edb90865997ffee6df315ab166d713af433a5'),
    },
  },
  {
    args: {wif: '5HtasZ6ofTHP6HCwTqTkLDuLQisYPah7aUnSKfC7h4hMUVw2gi5'},
    description: 'The BIP 38 Satoshi WIF is decoded',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('09c2686880095b1a4c249ee3ac4eea8a014f11e6f986d0b5025ac1f39afbd9ae'),
    },
  },
  {
    args: {wif: 'L44B5gGEpqEDRS9vVPz7QT35jcBG2r3CZwSwQ4fCewXAhAhqGVpP'},
    description: 'The BIP 38 compressed TestingOneTwoThree WIF is decoded',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('cbf4b9f70470856bb4f40f80b87edb90865997ffee6df315ab166d713af433a5'),
    },
  },
  {
    args: {wif: 'KwYgW8gcxj1JWJXhPSu4Fqwzfhp5Yfi42mdYmMa4XqK7NJxXUSK7'},
    description: 'The BIP 38 compressed Satoshi WIF is decoded',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('09c2686880095b1a4c249ee3ac4eea8a014f11e6f986d0b5025ac1f39afbd9ae'),
    },
  },
  {
    args: {wif: '5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreAnchuDf'},
    description: 'A private key of one is decoded',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('0000000000000000000000000000000000000000000000000000000000000001'),
    },
  },
  {
    args: {wif: 'KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn'},
    description: 'A compressed private key of one is decoded',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('0000000000000000000000000000000000000000000000000000000000000001'),
    },
  },
  {
    args: {wif: 'cMahea7zqjxrtgAbB7LSGbcQUr1uX1ojuat9jZodMN87JcbXMTcA'},
    description: 'A testnet private key of one is decoded',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('0000000000000000000000000000000000000000000000000000000000000001'),
    },
  },
  {
    args: {wif: 'KwDiBf89QgGbjEhKnhXJuH7cbeG5y4PFJ6qZMpHdQC9wVhg4t5rs'},
    description: 'A private key with leading zero bytes keeps its zero bytes',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('00000000000000000000000000000000ffffffffffffffffffffffffffffffff'),
    },
  },
  {
    args: {wif: '5Km2kuu7vtFDPpxywn4u3NLpbr5jKpTB3jsuDU2KYEqetqj84qw'},
    description: 'A private key of the curve order minus one is decoded',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140'),
    },
  },
  {
    args: {wif: 'L5oLkpV3aqBjhki6LmvChTCV6odsp4SXM6FfU2Gppt5kFLaHLuZ9'},
    description: 'A compressed key of the curve order minus one is decoded',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140'),
    },
  },
  {
    args: {
      network: 'btctestnet4',
      wif: 'cWALDjUu1tszsCBMjBjL4mhYj2wHUWYDR8Q8aSjLKzjkW5eBtpzu',
    },
    description: 'A testnet4 key of the curve order minus one is decoded',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140'),
    },
  },
  {
    args: {network: 'btc', wif: '1FsSia9rv4NeEwvJ2GvXrX7LyxYspbN2mo'},
    description: 'Core key_io_valid #0: a main p2pkh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {network: 'btc', wif: '36j4NfKv6Akva9amjWrLG6MuSQym1GuEmm'},
    description: 'Core key_io_valid #1: a main p2sh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {network: 'btctestnet4', wif: 'mzK2FFDEhxqHcmrJw1ysqFkVyhUULo45hZ'},
    description: 'Core key_io_valid #2: a testnet4 p2pkh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {network: 'btctestnet4', wif: '2NC2hEhe28ULKAJkW5MjZ3jtTMJdvXmByvK'},
    description: 'Core key_io_valid #3: a testnet4 p2sh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {network: 'btcsignet', wif: 'mww4LvqtTMKvmeQvizPz2EQv26xTneWrbg'},
    description: 'Core key_io_valid #4: a signet p2pkh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {network: 'btcsignet', wif: '2N1r7aC69VHeE7yQJPDLi9T1PYq4wnwvjuT'},
    description: 'Core key_io_valid #5: a signet p2sh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {network: 'btcregtest', wif: 'n4fajahJrAuKbN7uNsKjLjQkz9Qn5ewJXQ'},
    description: 'Core key_io_valid #6: a regtest p2pkh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {network: 'btcregtest', wif: '2MxFajLApXpYk4VodBSZSt7rw8y4ryABkfA'},
    description: 'Core key_io_valid #7: a regtest p2sh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {
      network: 'btc',
      wif: '5JuW2AMDYu4xVwRG9DZW18VbzQrGcd5RCgb99sS6ehJsNQXu5b9',
    },
    description: 'Core key_io_valid #8: a main uncompressed private key',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('8f8943bf956de595665c38ffff23827e17c10cdc1c27a028caae6c9810626198'),
    },
  },
  {
    args: {
      network: 'btc',
      wif: 'L5nJeqKmpHp4P7F8ZYyjwc5a7P4d8EabuGAzfGJk7yC1BJyzNaEd',
    },
    description: 'Core key_io_valid #9: a main compressed private key',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('ff778740f88ddcf102aeb81daee289c044c4a4571c4b6f287400f4b8e0b843f8'),
    },
  },
  {
    args: {
      network: 'btctestnet4',
      wif: '92ZdE5HoLafywnTBbzPxbvRmp75pSfzvdU3XaZGh1cToipgdHVh',
    },
    description: 'Core key_io_valid #10: a testnet4 uncompressed private key',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('80c32d81e91bdea04cd7a3819b32275fc3298af4c7ec87eb0099527d041ced5c'),
    },
  },
  {
    args: {
      network: 'btctestnet4',
      wif: 'cV83kKisF3RQSvXbUCm9ox3kaz5JjEUBWcx8tNydfGJcyeUxuH47',
    },
    description: 'Core key_io_valid #11: a testnet4 compressed private key',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('e0fcd4ce4e3d0e3de091f21415bb7cd011fac288c42020a879f28c2a4387df9b'),
    },
  },
  {
    args: {
      network: 'btcsignet',
      wif: '92QuSnywrhsV7WPZChTgSQA23uSmj9MCEEno1eRBDG9sg8M29cX',
    },
    description: 'Core key_io_valid #12: a signet uncompressed private key',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('6cf636ed8ac1bab033b64f66feaba65f70e684731e3f39105605968d3a963801'),
    },
  },
  {
    args: {
      network: 'btcsignet',
      wif: 'cND53Dhp8eCZqG2ghe8YhSCGesXZ8fE5PGD1khrqNvEi4RBoXhEK',
    },
    description: 'Core key_io_valid #13: a signet compressed private key',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('12b5a10f3a11e708dc5412833c47ab7c368a21b9efe19293793ec879ce683018'),
    },
  },
  {
    args: {
      network: 'btcregtest',
      wif: '91mn1wYKEB1zyof1VFm8tMtocZx1oBrKKRCu9GCpgZvPmBLEJjp',
    },
    description: 'Core key_io_valid #14: a regtest uncompressed private key',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('18a86e5a6c6977ddba0daca7fba5190f67ba56ccdc1b3f31308972236c2e4776'),
    },
  },
  {
    args: {
      network: 'btcregtest',
      wif: 'cPisAUdLvqqAr6MYtXnrWvgvyUAwuNyuTvZkDGw6miPhZdaiSDNH',
    },
    description: 'Core key_io_valid #15: a regtest compressed private key',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('3fdfec1371cedcdb8c190ca6ff8ad603f817edc0d93c2a687c7b36dd66e70f2a'),
    },
  },
  {
    args: {network: 'btc', wif: 'bc1qvyq0cc6rahyvsazfdje0twl7ez82ndmuac2lhv'},
    description: 'Core key_io_valid #16: a main p2wpkh address',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {
      network: 'btc',
      wif: 'bc1qyucykdlhp62tezs0hagqury402qwhk589q80tqs5myh3rxq34nwqhkdhv7',
    },
    description: 'Core key_io_valid #17: a main p2wsh address',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      network: 'btc',
      wif: 'bc1p83n3au0rjylefxq2nc2xh2y4jzz4pm6zxj4mw5pagdjjr2a9f36s6jjnnu',
    },
    description: 'Core key_io_valid #18: a main p2tr address',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {network: 'btc', wif: 'bc1z2rksukkjr8'},
    description: 'Core key_io_valid #19: a main witness v2 address',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {
      network: 'btctestnet4',
      wif: 'tb1qcrh3yqn4nlleplcez2yndq2ry8h9ncg3qh7n54',
    },
    description: 'Core key_io_valid #20: a testnet4 p2wpkh address',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {
      network: 'btctestnet4',
      wif: 'tb1quyl9ujpgwr2chdzdnnalen48sup245vdfnh2jxhsuq3yx80rrwlq5hqfe4',
    },
    description: 'Core key_io_valid #21: a testnet4 p2wsh address',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      network: 'btctestnet4',
      wif: 'tb1p35n52jy6xkm4wd905tdy8qtagrn73kqdz73xe4zxpvq9t3fp50aqk3s6gz',
    },
    description: 'Core key_io_valid #22: a testnet4 p2tr address',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {network: 'btctestnet4', wif: 'tb1rgv5m6uvdk3kc7qsuz0c79v88ycr5w4wa'},
    description: 'Core key_io_valid #23: a testnet4 witness v3 address',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {
      network: 'btcsignet',
      wif: 'tb1q3vya2h5435jkugq2few7dmktlrwq4ejmfaw7kr',
    },
    description: 'Core key_io_valid #24: a signet p2wpkh address',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {
      network: 'btcsignet',
      wif: 'tb1qxkhrl2s6ttrclckldruea0e8anhrehffl8xv7t0pdyrzm08v2hyqy408nf',
    },
    description: 'Core key_io_valid #25: a signet p2wsh address',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      network: 'btcsignet',
      wif: 'tb1pae5um27ahn8n73pgexe3kcwlp8dhswpn684h2k2w6t9a7w3eq65qephd5y',
    },
    description: 'Core key_io_valid #26: a signet p2tr address',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      network: 'btcsignet',
      wif: 'tb1rx9n9g37az8mu236e5jpxdt0m67y4fuq8rhs0ss3djnm0kscfrwvq0ntlyg',
    },
    description: 'Core key_io_valid #27: a signet witness v3 address',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      network: 'btcregtest',
      wif: 'bcrt1qdavt4j2sd7dlhqsavtnfxvzppw6k7qy97tmnu9',
    },
    description: 'Core key_io_valid #28: a regtest p2wpkh address',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {
      network: 'btcregtest',
      wif: 'bcrt1qan8gntac7z7me2ejt4hpru42ad2f759fmy0m3ejvs98656znv7eqga4uhv',
    },
    description: 'Core key_io_valid #29: a regtest p2wsh address',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      network: 'btcregtest',
      wif: 'bcrt1pfwxjqvtt4tcxrtdluukfmy2dv7xd2qzdfy6kajv5nwn4yam3wxkq3553uh',
    },
    description: 'Core key_io_valid #30: a regtest p2tr address',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      network: 'btcregtest',
      wif: 'bcrt1sx6p8njlx7h9mc2agz4yg82dzne23050ncq72cneeecez2pst8mahn8xecsf8g6hzx94420',
    },
    description: 'Core key_io_valid #31: a regtest witness v16 address',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {network: 'btc', wif: '1FjL87pn8ky6Vbavd1ZHeChRXtoxwRGCRd'},
    description: 'Core key_io_valid #32: a main p2pkh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {network: 'btc', wif: '3BZECeAH8gSKkjrTx8PwMrNQBLG18yHpvf'},
    description: 'Core key_io_valid #33: a main p2sh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {network: 'btctestnet4', wif: 'n4YNbYuFdPwFrxSP8sjHFbAhUbLMUiY9jE'},
    description: 'Core key_io_valid #34: a testnet4 p2pkh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {network: 'btctestnet4', wif: '2NAeQVZayzVFAtgeC3iYJsjpjWDmsDph71A'},
    description: 'Core key_io_valid #35: a testnet4 p2sh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {network: 'btcsignet', wif: 'mnCBpkNMJEJLehgdEkzSo2eioniyJMxLpZ'},
    description: 'Core key_io_valid #36: a signet p2pkh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {network: 'btcsignet', wif: '2N5sNHomeNJDZv67AcFx9ES7FBZY4jx9KDA'},
    description: 'Core key_io_valid #37: a signet p2sh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {network: 'btcregtest', wif: 'mfhE6jAUwjUDNZhaX1PAsDTKfneQF2Nshc'},
    description: 'Core key_io_valid #38: a regtest p2pkh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {network: 'btcregtest', wif: '2MxNm1VHyVU4RuP3u1c1v5aQLk2dQjwy1Qk'},
    description: 'Core key_io_valid #39: a regtest p2sh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {
      network: 'btc',
      wif: '5HsL2nZuEebU5nM3RxNVQD9GcAnvNMahqQskf4fkqHe54zwd14e',
    },
    description: 'Core key_io_valid #40: a main uncompressed private key',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('06e8649790a90615a46d22dd762e0c42615336745356c2e16147c0f3d46b40d5'),
    },
  },
  {
    args: {
      network: 'btc',
      wif: 'KwuVvu6hsuEMHrfFWJQV64tRrWX3QzqHH18JuAHYqYV6dqBvNKxd',
    },
    description: 'Core key_io_valid #41: a main compressed private key',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('147804bf8a0dfff35939a611c7f5a60ac107f33f33d6059f273d2079ab1d90f2'),
    },
  },
  {
    args: {
      network: 'btctestnet4',
      wif: '921M1RNxghFcsVGqAJksQVbSgx36Yz4u6vebfz1wDujNvgNt93B',
    },
    description: 'Core key_io_valid #42: a testnet4 uncompressed private key',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('3777b341c45e2a9b9bf6bfb71dc7d129f64f1b9406ed4f93ade8f56065f1b732'),
    },
  },
  {
    args: {
      network: 'btctestnet4',
      wif: 'cNEnbfF2fcxmmCLWqMAaq6fxJvVkwMbyU3kCbpQznz4Z1j6TZDGb',
    },
    description: 'Core key_io_valid #43: a testnet4 compressed private key',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('1397b0d4a03e1ab2c54dd9af99ce1ecbfb90c80a58886da95e1181a55703d96b'),
    },
  },
  {
    args: {
      network: 'btcsignet',
      wif: '93BcpCMKPmFCuY8bqS4k3HFrhJ1Afxi4uSsEeJFvX86GYW7PC7W',
    },
    description: 'Core key_io_valid #44: a signet uncompressed private key',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('d27d1b6ef55ca2e4d475b5276f2dbb85f7a6459dceeb89c67b776fd3bb974452'),
    },
  },
  {
    args: {
      network: 'btcsignet',
      wif: 'cUtwbyxoL1owPxUafgH2meEpydeywjhnTYv2mJaFHHchz39AaEgy',
    },
    description: 'Core key_io_valid #45: a signet compressed private key',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('da3ed4ef1647e1733ec076919cab6156077ed9532e7c365acc425747e198b3e1'),
    },
  },
  {
    args: {
      network: 'btcregtest',
      wif: '927zPWny2SiNaUmHF5NnGQXQWDwbByfFzXGgu88j91ZoutSosvE',
    },
    description: 'Core key_io_valid #46: a regtest uncompressed private key',
    expected: {
      is_compressed: false,
      private_key: hexAsBuffer('468e0284f230153db8687d8ec23db079a5b67d72ca04174b3867b13e4ea9945e'),
    },
  },
  {
    args: {
      network: 'btcregtest',
      wif: 'cRez45VGSp5EXNqm89K3NJJPSKKapJg5Kbw3atxr2337x2gtgYed',
    },
    description: 'Core key_io_valid #47: a regtest compressed private key',
    expected: {
      is_compressed: true,
      private_key: hexAsBuffer('798d87586cffbe8c545ab374454e403b1eb831501ebe89f3c3b02f3137bd7b46'),
    },
  },
  {
    args: {network: 'btc', wif: 'bc1qhxt04s5xnpy0kxw4x99n5hpdf5pmtzpqs52es2'},
    description: 'Core key_io_valid #48: a main p2wpkh address',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {
      network: 'btc',
      wif: 'bc1qgc9ljrvdf2e0zg9rmmq86xklqwfys7r6wptjlacdgrcdc7sa6ggqu4rrxf',
    },
    description: 'Core key_io_valid #49: a main p2wsh address',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      network: 'btc',
      wif: 'bc1pve739yap4uxjvfk0jrey69078u0gasm2nwvv483ec6zkzulgw9xqu4w9fd',
    },
    description: 'Core key_io_valid #50: a main p2tr address',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {network: 'btc', wif: 'bc1zmjtqxkzs89'},
    description: 'Core key_io_valid #51: a main witness v2 address',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {
      network: 'btctestnet4',
      wif: 'tb1ql4k5ayv7p7w0t0ge7tpntgpkgw53g2payxkszr',
    },
    description: 'Core key_io_valid #52: a testnet4 p2wpkh address',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {
      network: 'btctestnet4',
      wif: 'tb1q9jx3x2qqdpempxrcfgyrkjd5fzeacaqj4ua7cs7fe2sfd2wdaueq5wn26y',
    },
    description: 'Core key_io_valid #53: a testnet4 p2wsh address',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      network: 'btctestnet4',
      wif: 'tb1pdswckwd9ym5yf5eyzg8j4jjwnzla8y0tf9cp7aasfkek0u29sz9qfr00yf',
    },
    description: 'Core key_io_valid #54: a testnet4 p2tr address',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {network: 'btctestnet4', wif: 'tb1r0ecpfxg2udhtc556gqrpwwhk4sw3f0kc'},
    description: 'Core key_io_valid #55: a testnet4 witness v3 address',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {
      network: 'btcsignet',
      wif: 'tb1q6mwf89hnqhlu8txjgjfs4s7p93ugffn3k062ll',
    },
    description: 'Core key_io_valid #56: a signet p2wpkh address',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {
      network: 'btcsignet',
      wif: 'tb1qafrjalu4d73dql0czau9j6z422434kef235mzljf48ckd5xz3sys09jm97',
    },
    description: 'Core key_io_valid #57: a signet p2wsh address',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      network: 'btcsignet',
      wif: 'tb1pwst9qszjrhuv2e7as0flcq9gm698v6gdxzz9e87p07s8rssdx3zqklm3vf',
    },
    description: 'Core key_io_valid #58: a signet p2tr address',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      network: 'btcsignet',
      wif: 'tb1r3ss76jtsuxe8c8c8lxsehnpak55ylrgr345pww076l536ahjr6jsydamx3',
    },
    description: 'Core key_io_valid #59: a signet witness v3 address',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      network: 'btcregtest',
      wif: 'bcrt1q65nhlm4hf2ptg3t264al57p7wjxj2c3s6kyt83',
    },
    description: 'Core key_io_valid #60: a regtest p2wpkh address',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {
      network: 'btcregtest',
      wif: 'bcrt1qawvc90lpytw3z3k9etdx54l0exq5f5sqfzu5e45kjnl6slwayeeqx2dyac',
    },
    description: 'Core key_io_valid #61: a regtest p2wsh address',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      network: 'btcregtest',
      wif: 'bcrt1p39a4s4vdcw9kqa8w2t0rp7aj8kfxyw7mce5sk5d70x6wnnmpvt7skf2kxy',
    },
    description: 'Core key_io_valid #62: a regtest p2tr address',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      network: 'btcregtest',
      wif: 'bcrt1s489d9fhmyel0vzfqsrmew4x7r80asuqesm5hgqacy35daflcyufh3j8cgdtflvt99ph05m',
    },
    description: 'Core key_io_valid #63: a regtest witness v16 address',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {network: 'btc', wif: '1G9A9j6W8TLuh6dEeVwWeyibK1Uc5MfVFV'},
    description: 'Core key_io_valid #64: a main p2pkh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {network: 'btc', wif: '33GA3ZXbw5o5HeUrBEaqkWXFYYZmdxGRRP'},
    description: 'Core key_io_valid #65: a main p2sh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {network: 'btctestnet4', wif: 'mwgS2HRbjyfYxFnR1nF9VKLvmdgMfFBmGq'},
    description: 'Core key_io_valid #66: a testnet4 p2pkh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {network: 'btctestnet4', wif: '2MwBVrJQ76BdaGD76CTmou8cZzQYLpe4NqU'},
    description: 'Core key_io_valid #67: a testnet4 p2sh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {network: 'btcsignet', wif: 'mfnJ8tEkqKNFE5YaHTXFxyHk2mnDK2fvDh'},
    description: 'Core key_io_valid #68: a signet p2pkh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {network: 'btcsignet', wif: '2My83D67ir7K8PPzeT6mE2oth3ZwNTVRS9F'},
    description: 'Core key_io_valid #69: a signet p2sh address',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {wif: ''},
    description: 'Core key_io_invalid #0: an empty string',
    error: 'ExpectedNonEmptyBase58CheckStringToDecode',
  },
  {
    args: {wif: 'x'},
    description: 'Core key_io_invalid #1: a string too short for a checksum',
    error: 'ExpectedPayloadAndChecksumInBase58CheckString',
  },
  {
    args: {
      wif: '1GAdfviErV2Ew95FPtZyikz2qGP3gyCB6Hyu94sedAkPpA523m3fQwps9YKUZkKgQckGPKhRsFR',
    },
    description: 'Core key_io_invalid #2: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      wif: '37G2kMDLpmWVhimxRdzwNfE8JFvWXnJYnVcXeeGrek2qumdJuK7XArcVVpRtLLjRra3t64BEPF2',
    },
    description: 'Core key_io_invalid #3: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      wif: 'giymtio7u7oqWtmC9YnvAEKkLF3JQpAdkEFkVJKYrVDfaLbhaDpX1ihfF2vZmya1i61fwLPC3YQ',
    },
    description: 'Core key_io_invalid #4: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: '8iVk9nLM3nYwRuwypjy9NK5rsuZH7BbrQRZ1pgcQmvMnjAgRXD'},
    description: 'Core key_io_invalid #5: a key with version 0x03',
    error: 'UnexpectedWifVersionForKnownNetworks',
  },
  {
    args: {wif: 'cPTVQ1hbo4qdoysf6Jx5GthqucNmdfqt6J2pZRFeXv8Ep7Kmjqud'},
    description: 'Core key_io_invalid #6: a compression flag of 0xf1',
    error: 'UnexpectedCompressionFlagValueInWifPayload',
  },
  {
    args: {wif: 'cQbR2Ny85XFBzUMx3Ed6HsTLw2pVruSgPvt5AofnBUnhiv86gYeW'},
    description: 'Core key_io_invalid #7: a compression flag of 0xe3',
    error: 'UnexpectedCompressionFlagValueInWifPayload',
  },
  {
    args: {
      wif: '2UB3iG3VJbX2TRrMwm6ssWskgvU9VjFBYSqCzwqkrihCwo7mg4mtS4WuGZgxTKuxf5A3EcotYEymz',
    },
    description: 'Core key_io_invalid #8: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: 'cQe12pqwPR6ExtZKfrKf1q4b3CTh1Qi7MwuvMvzs79nWXDvESfBJ'},
    description: 'Core key_io_invalid #9: a compression flag of 0xc8',
    error: 'UnexpectedCompressionFlagValueInWifPayload',
  },
  {
    args: {wif: 'tc1qeul5g2xfkvdkrhcfmdursv73ad64jnkjl9c40f'},
    description: 'Core key_io_invalid #10: a string with non-base58 characters',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {
      wif: 'bt1pq65rzej5glw3ra79gav6fqnx4haa0z257qr3mc8cggkefahmgvyseufhc0',
    },
    description: 'Core key_io_invalid #11: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      wif: 'tb13hty4qmumlwpp6chxjvcyzza4duqgtmxw3xhm3u9ahj4nyhtwz8eq7ynrj4',
    },
    description: 'Core key_io_invalid #12: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: 'bcrt1r2qxpwuge'},
    description: 'Core key_io_invalid #13: a string with an invalid checksum',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {
      wif: 'bc10uexgzna2dpfk0vjt35srz6a27ps6m0l89jweznt83n2sqn2fx4hvn9ym5af8wut34sfrqhk3',
    },
    description: 'Core key_io_invalid #14: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: 'tb1qum6uh0pt4q253qaf520929737v63w5gf'},
    description: 'Core key_io_invalid #15: a string with non-base58 characters',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {
      wif: 'bcrt1q888ryfgxpvl0k7vum8zpyar2u2sexvdhkf38ue37yknmqq0ycrwpl3w48y',
    },
    description: 'Core key_io_invalid #16: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: 'bc1qdsuzmn04k2z8vryw8l4dj8m5ygqgnne5n'},
    description: 'Core key_io_invalid #17: a string with non-base58 characters',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {
      wif: 'tb1qlj8es50nc8j8r8xshrjgzmw5azx89efghmw8ju6zcqla0g6xcnrstsjz7k',
    },
    description: 'Core key_io_invalid #18: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: 'bcrt1qzwmyj0z924g7fzs5yvnrkc43y76RVyr2lh5t4r'},
    description: 'Core key_io_invalid #19: a string with non-base58 characters',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {wif: 'bc1qpu6d26mrulzetu4jqhd7rsunv9aqru26f5c4j8'},
    description: 'Core key_io_invalid #20: a string with non-base58 characters',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {
      wif: 'tb1qun6d26ufh77ghny6u5u8cwz9da7qwc6k4wkuceae9tth06eqlw0syupl4w',
    },
    description: 'Core key_io_invalid #21: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: 'bcrt1qj7g2jps453kj9htk9cxyyc2nxe69x4kzzmth7v'},
    description: 'Core key_io_invalid #22: a string with an invalid checksum',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {
      wif: 'bc1p702xksx4z3uqf0u2phllxkfe5cgu0adxptqs0uelx0tqt8e885sqryes2l',
    },
    description: 'Core key_io_invalid #23: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: 'tb1z7gmh0v6pc30z4xum76lmw8w86yswrlmw'},
    description: 'Core key_io_invalid #24: a string with non-base58 characters',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {wif: 'bcrt1sjsrw6nun4h502cr97xmnyyuhkr22q0s6efrgtu'},
    description: 'Core key_io_invalid #25: a string with non-base58 characters',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {wif: '2UVPFpGYnLHJezFzjUo42our6PMEoozzRdM'},
    description: 'Core key_io_invalid #26: a 21 byte payload with version 0xd4',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {wif: '2MygHQjE1U33q3LSC53p69YqFjP8PihumJAF'},
    description: 'Core key_io_invalid #27: a string with an invalid checksum',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {wif: 'KzNbAQ4mexfAxa6RKBzHQqfoTycaeWpv2p'},
    description: 'Core key_io_invalid #28: a 21 byte payload with version 0x2f',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {wif: '2jDPrDfAKihCGPbPD9ztY8TswAia4V8Bc6vx'},
    description: 'Core key_io_invalid #29: a string with an invalid checksum',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {
      wif: '4VQUNG1hG64QFtaNyQZQWDdwpxB275Pwb3tvyPt2HDxB8Mi2MgH8Tz3AC83YYiz9LydsLNXEZJLHY',
    },
    description: 'Core key_io_invalid #30: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: '39TKsUQ5QpEL1wowc6GMUqak94ijirPuP69ooV3xsFmiKQX2dau'},
    description: 'Core key_io_invalid #31: a key with version 0x40',
    error: 'UnexpectedWifVersionForKnownNetworks',
  },
  {
    args: {
      wif: '2UEJjT3dSdwc8dAo7oedPzznXceXCEsBbDfAvSymqpqDrkZMv7JBEUpLyhkghioYAWC9W4sKysry',
    },
    description: 'Core key_io_invalid #32: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      wif: '7VmMEkphxCFSV1y659Th4dkk6x6bJS5eQvbt8rzUYKQyd6ACgwQ4vXHtXKFUwP2kW3XULipnHJdZ7',
    },
    description: 'Core key_io_invalid #33: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: 'tc1qdlapns4zkn03juf2k9xwwpct209suj6mgcd9gh'},
    description: 'Core key_io_invalid #34: a string with non-base58 characters',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {
      wif: 'bt1psa5eptk29c4jc9yumeseat3a0l5e2fpmw635za2p4gpwdnthueysxga9je',
    },
    description: 'Core key_io_invalid #35: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      wif: 'tb13w8c43lykfj3lvm9sgp6dsnfjla3d57cm83seykunf0ltxjc9lt2q4efm4d',
    },
    description: 'Core key_io_invalid #36: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: 'bcrt1rjqr2tdkm'},
    description: 'Core key_io_invalid #37: a string with an invalid checksum',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {
      wif: 'bc10lyxwnxa70l270e6fcmxr4x7dtgu2yvy7gzkurwxy4zhdvgaqrrn6pfg2flyhqzy5t5se8yu3',
    },
    description: 'Core key_io_invalid #38: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: 'TB1QFDFM763VXVSUNZHQLPWC0Q8FG5LJX6ZN'},
    description: 'Core key_io_invalid #39: a string with non-base58 characters',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {
      wif: 'bcrt1q60chha7wfwlau4kdr4mlvyeyc8mnnh9dhxk05e0hmrxcuhghefj36uwyha',
    },
    description: 'Core key_io_invalid #40: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: 'bc1gmk9yu'},
    description: 'Core key_io_invalid #41: a string with an invalid checksum',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {wif: 'tb1ly0q7p'},
    description: 'Core key_io_invalid #42: a string with non-base58 characters',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {wif: 'bcrt1qdwttaw38uf42wxw40kwk3u8nguyTQH3hx6jmqp'},
    description: 'Core key_io_invalid #43: a string with non-base58 characters',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {wif: 'bc1qtsvlht6730n04f2mpaj5vv8hrledn5n5ug8c79'},
    description: 'Core key_io_invalid #44: a string with non-base58 characters',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {wif: 'tb1dclvmr'},
    description: 'Core key_io_invalid #45: a string with non-base58 characters',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {wif: 'bcrt1q3fqvctqu48wsvggrt09vj0yk2gzzcscdp4h98u'},
    description: 'Core key_io_invalid #46: a string with non-base58 characters',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {
      wif: 'bc1prklpq7tjcawg89cmwwqr3u5apwav36xa4zz56ady7crsllm6mpnqts7p86',
    },
    description: 'Core key_io_invalid #47: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: 'tb1zkm58zyhxz3ffkfgsyprflg543slsl4c4'},
    description: 'Core key_io_invalid #48: a string with non-base58 characters',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {wif: 'bcrt1snzr5kaypnfhpnjanrhd20fhqcjxm3hfh7dw9fu'},
    description: 'Core key_io_invalid #49: a string with non-base58 characters',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {
      wif: '2GgnYKqBGuA2Mm5GnrPsMTZR81xPhNtgMYoFUZngZGiobhCuUpCaTriUHRcgFreEekNdPAR17q8d',
    },
    description: 'Core key_io_invalid #50: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: 'AZEah8d1EK362okRBS66e8SvdtYkrE8tsX'},
    description: 'Core key_io_invalid #51: a 21 byte payload with version 0x17',
    error: 'ExpectedVersionAnd32BytePrivateKeyInWifPayload',
  },
  {
    args: {
      wif: 'gep8xr77FyPW6zYP15RiV9W8nL6w2HyHB16cUDakfyDceMA6ZzUdhJjk2LPuLYHnLkBqkRTTi6z',
    },
    description: 'Core key_io_invalid #52: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: '2NDNP7GY59tTJPZTpbkprhM9SR99Nn5rUs7'},
    description: 'Core key_io_invalid #53: a string with an invalid checksum',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {
      wif: '2Csgzy2T287YAjeU5tFtt1nPshBZAUFQi4WtgaWyZGKSBNnKXHy2Tmxo8QK4Mfdds977ShcDWC5o',
    },
    description: 'Core key_io_invalid #54: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: 'Kwjk3Vy6sdXMQDGWJzaWmqFxUNtWZCX1q4F4Kpt8jNNUoWJUUaTY'},
    description: 'Core key_io_invalid #55: a string with an invalid checksum',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {
      wif: 'Svj8kk98bAS9V4L2crmxakbhmnPm3cJ1tJ4Je4yVzDreU8eSTFURS1SPYv5oWEQD8Q9VBDvx5uF',
    },
    description: 'Core key_io_invalid #56: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: 'KNYsv6v9GtkGeD4WdQnBEJCrPKQm91PTxAbCfXr66LEd4JDmhPWC'},
    description: 'Core key_io_invalid #57: a compressed key with version 0x7c',
    error: 'UnexpectedWifVersionForKnownNetworks',
  },
  {
    args: {
      wif: '2UJ2H2xvAeXmFKfQwMyDoSdQTTPFMNCT3SsoUafBWKzoGP3NsUK1buEgQZG38viyD53jgMdpqfT7',
    },
    description: 'Core key_io_invalid #58: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: '6aLMfayKF4TW4ecn5SEc8FExpyJA2peKxYRGZhes6tQ4NTTzuGy'},
    description: 'Core key_io_invalid #59: a key with version 0xa6',
    error: 'UnexpectedWifVersionForKnownNetworks',
  },
  {
    args: {
      wif: '7VP4FmcebU2thJns9MnXde7LWfuqR5vMizrAuUoq2GcJjzTyA4RHFcPVdZL8PLg1SbpSFdJrvLXoY5',
    },
    description: 'Core key_io_invalid #60: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: 'tc1q5qdvt99uc92jyz663dtdpfpv6nr67ahmgwcpq2'},
    description: 'Core key_io_invalid #61: a string with an invalid checksum',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {
      wif: 'bt1peu3ppd7x796sjjenp09r8cs22rhylqm9lhggk72qp8q22vzft0wq2a0x6j',
    },
    description: 'Core key_io_invalid #62: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {
      wif: 'tb1323z3lnz7dl3kd0nsuh6xy4he9almzl67anxgg3xdzkaxc9rwntlqdhdzd7',
    },
    description: 'Core key_io_invalid #63: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: 'bcrt1r2gc42sky'},
    description: 'Core key_io_invalid #64: a string with an invalid checksum',
    error: 'ExpectedValidPayloadChecksumInBase58CheckString',
  },
  {
    args: {
      wif: 'bc10fd889x4hd54tqu2ewg9t4hhft2wl7m6x50av4uswzw46xe6as0xmltfg7vrjfkvm459vld7w',
    },
    description: 'Core key_io_invalid #65: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: 'TB1QZY7V0F2AT3308YGGNGN66ULJTCN3RY6F'},
    description: 'Core key_io_invalid #66: a string with non-base58 characters',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {
      wif: 'bcrt1qjg3cwht92znyw0l4r5rtctmls337nrc7g0ry9drjxmlecjd3atl3fake7c',
    },
    description: 'Core key_io_invalid #67: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
  {
    args: {wif: 'bc1qmgf8xt8xkecl79k04mma3lz34gqep7hg4'},
    description: 'Core key_io_invalid #68: a string with non-base58 characters',
    error: 'ExpectedAllBase58CharactersInBase58CheckString',
  },
  {
    args: {
      wif: 'TB1Q3F9WGNXE9ZMTTMDN5VKVKHYZ8Y0LCV72YV7V5LSXTJXEYHNHEHASLYL0TZ',
    },
    description: 'Core key_io_invalid #69: a string too long to be a WIF',
    error: 'ExpectedShorterWifEncodedPrivateKeyString',
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => decodeWif(args), new Error(error), 'Got err');
    } else {
      const res = decodeWif(args);

      deepStrictEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

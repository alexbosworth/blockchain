# Blockchain

Utility methods for working with Blockchain data

## Methods

- [compactIntAsNumber](#compactintasnumber)
- [componentsOfTransaction](#componentsoftransaction)
- [decodeBase58Address](#decodebase58address)
- [decodeBech32Address](#decodebech32address)
- [encodeBech32Address](#encodebech32address)
- [hashForP2pkh](#hashforp2pkh)
- [hashForP2wpkh](#hashforp2wpkh)
- [idForBlock](#idforblock)
- [idForTransaction](#idfortransaction)
- [idForTransactionComponents](#idfortransactioncomponents)
- [noLocktimeIdForTransaction](#nolocktimeidfortransaction)
- [numberAsCompactInt](#numberascompactint)
- [p2msScript](#p2msscript)
- [p2pkhOutputScript](#p2pkhoutputscript)
- [p2shOutputScript](#p2shoutputscript)
- [p2trOutputScript](#p2troutputscript)
- [p2wpkhOutputScript](#p2wpkhoutputscript)
- [p2wshOutputScript](#p2wshoutputscript)
- [previousBlockId](#previousblockid)
- [queryTransactions](#querytransactions)
- [scriptAsScriptElements](#scriptasscriptelements)
- [scriptElementsAsScript](#scriptelementsasscript)
- [sizeOfTransaction](#sizeoftransaction)
- [unsignedTxFromPsbt](#unsignedtxfrompsbt)

### compactIntAsNumber

Convert a compact integer to a regular number

    {
      encoded: <Compact Integer Encoded Number Buffer Object>
      [start]: <Buffer Offset Start Index Number>
    }

    @returns
    {
      bytes: <Byte Count Number>
      number: <Integer Number>
    }

Example:

```node
const {compactIntAsNumber} = require('@alexbosworth/blockchain');

// Decode the plain number from the encoded compact int bytes
const {number} = compactIntAsNumber({encoded: Buffer.from('fdfd00', 'hex')});
```

### componentsOfTransaction

Get the components of a hex-encoded transaction

    {
      transaction: <Hex Encoded Transaction String>
    }

    @throws
    <Error>

    @returns
    {
      inputs: [{
        id: <Spending Transaction Id Hex String>
        script: <ScriptSig Script Hex String>
        sequence: <Sequence Number>
        vout: <Spending Transaction Output Index Number>
        [witness]: [<Script Stack Element Hex String>]
      }]
      locktime: <Timelock nLockTime Number>
      outputs: [{
        script: <ScriptPub Script Hex String>
        tokens: <Tokens Count Number>
      }]
      version: <Version Number>
    }

### decodeBase58Address

Derive output hash and version data from a base58 address string

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

### decodeBech32Address

Decode a bech32 address string to derive the address details

    {
      address: <Bech32 Encoded Address String>
    }

    @throws
    <Error>

    @returns
    {
      prefix: <Human Readable Prefix String>
      program: <Output Data Buffer Object>
      version: <Witness Version Number>
    }

### encodeBech32Address

Encode address details as a bech32 address string

    {
      prefix: <Human Readable Prefix String>
      program: <Output Data Buffer Object>
      version: <Witness Version Number>
    }

    @throws
    <Error>

    @returns
    {
      address: <Bech32 Encoded Address String>
    }

Example:

```node
const {encodeBech32Address, hashForP2wpkh} = require('@alexbosworth/blockchain');

// The P2WPKH witness program is the hash160 of the compressed public key
const {hash} = hashForP2wpkh({key: publicKey});

// Encode the P2WPKH address paying to the public key hash
const {address} = encodeBech32Address({
  prefix: 'bc',
  program: hash,
  version: 0,
});
```

### hashForP2pkh

Get the hash160 of a public key to pay to via P2PKH

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

### hashForP2wpkh

Get the hash160 of a public key to pay to via P2WPKH

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

### idForBlock

Get an id for a block: the double sha256 hash of the block header

    {
      block: <Hex Encoded Block Data String>
    }

    @throws
    <Error>

    @returns
    {
      id: <Block Id Hex Encoded String>
    }

### idForTransaction

Derive the standard transaction id for a raw serialized tx

    {
      transaction: <Hex Encoded Transaction String>
    }

    @throws
    <Error>

    @returns
    {
      id: <Transaction Id Hex Encoded String>
    }

### idForTransactionComponents

Determine a transaction id from transaction components

Note: remember the input hash is the reversed byte order of a normal tx id

    {
      inputs: [{
        hash: <Spending Internal Byte Order Transaction Id Buffer Object>
        script: <Script Buffer Object>
        sequence: <Sequence Number>
        vout: <Spending Transaction Output Index Number>
      }]
      locktime: <Timelock nLockTime Number>
      outputs: [{
        script: <Output Script Buffer Object>
        tokens: <Tokens Count Number>
      }]
      version: <Version Number>
    }

    @throws
    <Error>

    @returns
    {
      id: <Transaction Id Hex String>
    }

### noLocktimeIdForTransaction

Get an id for a transaction with witness data and mlocktime not included

    {
      buffer: <Data Buffer Object>
      [start]: <Starting Offset Index Number>
    }

    @throws
    <Error>

    @returns
    {
      id: <No nLockTime Transaction Id Hex String>
    }

### numberAsCompactInt

Convert a number to compact size integer serialization

    {
      number: <Amount to Convert to Compact Integer Serialization Number>
    }

    @throws
    <Error>

    @returns
    {
      encoded: <Serialized Compact Integer Buffer Object>
    }

### p2msScript

Get a Pay To Multisig Script and the script hash to pay to the script

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

Example:

```node
const {p2msScript, p2wshOutputScript} = require('@alexbosworth/blockchain');

// Derive the 2-of-3 multisig script and its witness script hash
const {hash} = p2msScript({keys: publicKeys, required: 2});

// Get the P2WSH output script paying to the multisig script
const {script} = p2wshOutputScript({hash});
```

### p2pkhOutputScript

Get a Pay To Public Key Hash Output Script

    {
      hash: <Public Key Hash Buffer Object>
    }

    @throws
    <Error>

    @returns
    {
      script: <Output Script Buffer Object>
    }

### p2shOutputScript

Get a Pay To Script Hash Output Script

    {
      hash: <Script Hash Buffer Object>
    }

    @throws
    <Error>

    @returns
    {
      script: <Output Script Buffer Object>
    }

### p2trOutputScript

Get a Pay To Taproot Output Script

    {
      hash: <Taproot Hash Buffer Object>
    }

    @throws
    <Error>

    @returns
    {
      script: <Output Script Buffer Object>
    }

### p2wpkhOutputScript

Get a Pay To Witness Public Key Hash Output Script

    {
      hash: <Witness Public Key Hash Buffer Object>
    }

    @throws
    <Error>

    @returns
    {
      script: <Output Script Buffer Object>
    }

### p2wshOutputScript

Get a Pay To Witness Script Hash Output Script

    {
      hash: <Witness Script Hash Buffer Object>
    }

    @throws
    <Error>

    @returns
    {
      script: <Output Script Buffer Object>
    }

### previousBlockId

Given a raw block, return the previous block id

    {
      block: <Hex Encoded Block String>
    }

    @throws
    <Error>

    @returns
    {
      previous: <Previous Block Id Hex String>
    }

### queryTransactions

Find matching transactions within a block

    {
      block: <Hex Encoded Raw Block String>
      outputs: [<Output Script Hex String>]
    }

    @throws
    <Error>

    @returns
    {
      outputs: [{
        script: <Output Script Hex String>
        tokens: <Output Value Number>
        transaction_id: <Transaction Id Hex String>
        transaction_vout: <Transaction Output Index Number>
      }]
    }

### scriptAsScriptElements

Map a serialized script into an array of script elements

    {
      script: <Script Hex String>
    }

    @throws
    <Error>

    @returns
    {
      [elements]: [<Data Buffer>, <Script OP_CODE Number>]
    }

### scriptElementsAsScript

Map array of script buffer elements to a fully formed script

    {
      elements: [<Data Buffer>, <Script OP_CODE Number>]
    }

    @throws
    <Error>

    @returns
    {
      script: <Script Hex String>
    }

### sizeOfTransaction

Get the weight and virtual size of a hex-encoded transaction

    {
      transaction: <Hex Encoded Transaction String>
    }

    @throws
    <Error>

    @returns
    {
      vsize: <Transaction Virtual Size Number>
      weight: <Transaction Weight Units Number>
    }

### unsignedTxFromPsbt

Get the unsigned transaction out of a PSBT

    {
      psbt: <PSBT Hex String>
    }

    @throws
    <Error>

    @returns
    {
      transaction: <Unsigned Transaction Buffer Object>
    }

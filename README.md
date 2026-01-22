# Blockchain

Utility methods for working with Blockchain data

## Methods

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
      data: <Output Data Buffer Object>
      prefix: <Human Readable Prefix String>
      version: <Witness Version Number>
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

### p2pkhOutputScript

Get a Pay To Witness Public Key Hash Output Script

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

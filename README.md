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

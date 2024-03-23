# Versions

## 2.0.0

- `idForTransactionComponents`: Add method to get transaction id for components
- `queryTransactions`: Add method to find transaction outputs matching a query

### Breaking Changes

- End support for Node.js v16, require v18+

## 1.6.0

- `previousBlockId`: Add method to get the previous block id from a block

## 1.5.0

- `scriptAsScriptElements`: Convert an encoded script into script elements

## 1.4.0

- `scriptElementsAsScript`: Convert an array of script elements to a script

## 1.3.0

- `componentsOfTransaction`: Parse transaction hex into its component elements

## 1.2.1

- `noLocktimeIdForTransaction`: Fix id derivation to correct value

## 1.2.0

- Add `idForBlock`: to calculate the block id given a hex encoded block

## 1.1.0

- Add `noLocktimeIdForTransaction` for a hash that doesn't cover the locktime

## 1.0.0

- Add `compactIntAsNumber` to convert a Bitcoin variable byte size int
- Add `numberAsCompactInt` to convert a number to a Bitcoin variable byte int

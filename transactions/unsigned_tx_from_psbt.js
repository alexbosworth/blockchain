const {compactIntAsNumber} = require('./../numbers');
const parseTransaction = require('./parse_transaction');

const decodeCompactInt = (b, o) => compactIntAsNumber({encoded: b, start: o});
const globalUnsignedTxKeyType = 0;
const hexAsBuffer = hex => Buffer.from(hex, 'hex');
const isHex = n => !!n && !(n.length % 2) && /^[0-9A-F]*$/i.test(n);
const psbtStartBytes = Buffer.from([0x70, 0x73, 0x62, 0x74, 0xff, 0x01]);

/** Get the unsigned transaction out of a PSBT

  {
    psbt: <PSBT Hex String>
  }

  @throws
  <Error>

  @returns
  {
    transaction: <Unsigned Transaction Buffer Object>
  }
*/
module.exports = ({psbt}) => {
  if (!isHex(psbt)) {
    throw new Error('ExpectedPsbtToGetUnsignedTransaction');
  }

  const psbtData = hexAsBuffer(psbt);

  // Start reading - beginning with magic bytes, separator, unsigned tx type
  const startBytes = psbtData.slice(0, psbtStartBytes.length);

  // The magic bytes, separator, and tx type of a PSBT must always be set
  if (!startBytes.equals(psbtStartBytes)) {
    throw new Error('ExpectedKnownPsbtStartBytesToGetUnsignedTransaction');
  }

  // Exit early with error when there is no key type byte to read
  if (psbtData.length <= psbtStartBytes.length) {
    throw new Error('ExpectedUnsignedTransactionKeyTypeInPsbt');
  }

  // The single byte key of the first global pair follows the start bytes
  const keyType = psbtData.readUInt8(psbtStartBytes.length);

  // The first global key is expected to be the unsigned transaction type
  if (keyType !== globalUnsignedTxKeyType) {
    throw new Error('ExpectedUnsignedTransactionKeyTypeInPsbt');
  }

  // The next byte will be a compact int number that describes the tx length
  const valueSize = decodeCompactInt(psbtData, psbtStartBytes.length + 1);

  // Read in the transaction from the global value bytes
  const {bytes} = parseTransaction({
    buffer: psbtData,
    start: psbtStartBytes.length + valueSize.bytes + 1,
  });

  // Confirm the unsigned transaction matches its declared value length
  if (bytes.length !== valueSize.number) {
    throw new Error('UnexpectedByteLengthOfPsbtUnsignedTransaction');
  }

  return {transaction: bytes};
};

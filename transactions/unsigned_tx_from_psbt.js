const {compactIntAsNumber} = require('./../numbers');
const parseTransaction = require('./parse_transaction');

const decodeCompactInt = (b, o) => compactIntAsNumber({encoded: b, start: o});
const hexAsBuffer = hex => Buffer.from(hex, 'hex');
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
  if (!psbt) {
    throw new Error('ExpectedPsbtToGetUnsignedTransaction');
  }

  const psbtData = hexAsBuffer(psbt);

  // Start reading - beginning with magic bytes, separator, unsigned tx type
  const startBytes = psbtData.slice(0, psbtStartBytes.length);

  // The magic bytes, separator, and tx type of a PSBT must always be set
  if (!startBytes.equals(psbtStartBytes)) {
    throw new Error('ExpectedKnownPsbtStartBytesToGetUnsignedTransaction');
  }

  // The next byte will be a compact int number that describes the tx length
  const keySize = decodeCompactInt(psbtData, psbtStartBytes.length + 1).bytes;

  // Read in the transaction from the global value bytes
  const {bytes} = parseTransaction({
    buffer: psbtData,
    start: psbtStartBytes.length + keySize + 1,
  });

  return {transaction: bytes};
};

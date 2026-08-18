const bitsPerByte = 8;
const bitsPerWord = 5;
const {isBuffer} = Buffer;
const wordMask = 31;

/** Map 8 bit bytes to 5 bit data words, zero padding the remaining bits

  {
    bytes: <Data Bytes Buffer Object>
  }

  @throws
  <Error>

  @returns
  {
    words: [<5-Bit Data Word Number>]
  }
*/
module.exports = ({bytes}) => {
  if (!isBuffer(bytes)) {
    throw new Error('ExpectedDataBytesToConvertToDataWords');
  }

  let bits = 0;
  let carry = 0;
  const words = [];

  // Convert the 8 bit (ie bytes) data into 5 bit words
  bytes.forEach(byte => {
    carry = (carry << bitsPerByte) | byte;

    bits += bitsPerByte;

    while (bits >= bitsPerWord) {
      bits -= bitsPerWord;

      words.push((carry >> bits) & wordMask);
    }
  });

  // Zero pad the final bits into a trailing word
  if (!!bits) {
    words.push((carry << (bitsPerWord - bits)) & wordMask);
  }

  return {words};
};

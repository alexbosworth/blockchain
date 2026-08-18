const bitsPerByte = 8;
const bitsPerWord = 5;
const byteMask = 0xff;
const bytesArrayAsBuffer = arr => Buffer.from(arr);
const {isArray} = Array;
const {isInteger} = Number;
const maximumWordValue = 31;
const minimumWordValue = 0;
const zeroPadding = 0;

/** Map 5 bit data words to 8 bit bytes, expecting only zero bit padding

  {
    words: [<5-Bit Data Word Number>]
  }

  @throws
  <Error>

  @returns
  {
    bytes: <Data Bytes Buffer Object>
  }
*/
module.exports = ({words}) => {
  if (!isArray(words)) {
    throw new Error('ExpectedArrayOfDataWordsToConvertToDataBytes');
  }

  if (!!words.find(n => !isInteger(n))) {
    throw new Error('ExpectedIntegerDataWordsToConvertToDataBytes');
  }

  if (!!words.find(n => n < minimumWordValue || n > maximumWordValue)) {
    throw new Error('Expected5BitDataWordValuesToConvertToDataBytes');
  }

  let bits = 0;
  const bytes = [];
  let carry = 0;

  // Convert the 5 bit words into 8 bit (ie bytes) data
  words.forEach(word => {
    carry = (carry << bitsPerWord) | word;

    bits += bitsPerWord;

    while (bits >= bitsPerByte) {
      bits -= bitsPerByte;

      bytes.push((carry >> bits) & byteMask);
    }
  });

  // A full extra word of padding bits is never expected
  if (bits >= bitsPerWord) {
    throw new Error('ExpectedNoPaddingWordsToConvertToDataBytes');
  }

  // The remaining padding bits are expected to be zeros
  if (((carry << (bitsPerByte - bits)) & byteMask) !== zeroPadding) {
    throw new Error('UnexpectedNonZeroPadding');
  }

  return {bytes: bytesArrayAsBuffer(bytes)};
};

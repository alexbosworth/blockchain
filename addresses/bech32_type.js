const modifyBech32Accumulator = require('./modify_bech32_accumulator');

const codeForBech32 = 1;
const codeForBech32m = 0x2bc830a3;
const {from} = Array;
const separator = 0;

/** Determine the type of bech32 data being represented and verify checksum

  {
    prefix: <Lowercase Human Readable Prefix String>
    words: [<Bech32 5-Bit Data Number>]
  }

  @throws
  <Error>

  @returns
  {
    type: <Bech32 Type String>
  }
*/
module.exports = ({prefix, words}) => {
  let accumulator = 1;

  // Collect the high bits
  const highBits = from(
    {length: prefix.length},
    (_, i) => prefix.charCodeAt(i) >> 5
  );

  // Collect the low bits
  const lowBits = from(
    {length: prefix.length},
    (_, i) => prefix.charCodeAt(i) & 31
  );

  [...highBits, separator, ...lowBits, ...words].forEach(v => {
    return accumulator = modifyBech32Accumulator(accumulator) ^ (v & 31);
  });

  switch (accumulator) {
  case codeForBech32:
    return {type: 'bech32'};

  case codeForBech32m:
    return {type: 'bech32m'};

  default:
    throw new Error('UnexpectedChecksumValueForBech32DataAndPrefix');
  }
};

const {createHash} = require('crypto');

const bufferAsHex = buffer => buffer.toString('hex');
const headerEndIndex = 160;
const headerStartIndex = 0;
const hexAsBuffer = hex => Buffer.from(hex, 'hex');
const isHex = n => !!n && !(n.length % 2) && /^[0-9A-F]*$/i.test(n);
const sha256 = preimage => createHash('sha256').update(preimage).digest();

/** Get an id for a block

  {
    block: <Hex Encoded Block Data String>
  }

  @throws
  <Error>

  @returns
  {
    id: <Block Hex String>
  }
*/
module.exports = ({block}) => {
  if (!isHex(block)) {
    throw new Error('ExpectedHexEncodedBlockToGetIdFor');
  }

  const header = block.substring(headerStartIndex, headerEndIndex);

  return {id: bufferAsHex(sha256(sha256(hexAsBuffer(header))).reverse())};
};

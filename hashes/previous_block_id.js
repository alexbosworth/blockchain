const hashBytesHexCount = 32 * 2;
const reverseByteOrder = n => Buffer.from(n, 'hex').reverse().toString('hex');
const versionBytesHexCount = 4 * 2;

/** Given a raw block, return the previous block id

  {
    block: <Hex Encoded Block String>
  }

  @throws
  <Error>

  @returns
  {
    previous: <Previous Block Id Hex String>
  }
*/
module.exports = ({block}) => {
  if (!block) {
    throw new Error('ExpectedHexEncodedBlockToDerivePreviousBlockId');
  }

  const end = hashBytesHexCount + versionBytesHexCount;
  const start = versionBytesHexCount;

  return {previous: reverseByteOrder(block.substring(start, end))};
};

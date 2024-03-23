const {createHash} = require('crypto');

const parseTransaction = require('./parse_transaction');

const bufferAsHex = buffer => buffer.toString('hex');
const sha256 = preimage => createHash('sha256').update(preimage).digest();

/** Get an id for a transaction with witness data and mlocktime not included

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
*/
module.exports = ({buffer, start}) => {
  // The remainder of the transaction bytes are witnesses and nlocktime
  const {bytes} = parseTransaction({
    buffer,
    start,
    is_terminating_after_outputs: true,
  });

  return {id: bufferAsHex(sha256(bytes))};
};

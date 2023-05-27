const {numberAsCompactInt} = require('./../numbers');

const bufferAsHex = buffer => buffer.toString('hex');
const {concat} = Buffer;
const encode = number => numberAsCompactInt({number}).encoded;
const flatten = arr => arr.reduce((sum, n) => Buffer.concat([sum, n]));
const {from} = Buffer;
const {isArray} = Array;
const {isBuffer} = Buffer;

/** Map array of script buffer elements to a fully formed script

  {
    elements: [<Data Buffer>, <Script OP_CODE Number>]
  }

  @throws
  <Error>

  @returns
  {
    script: <Script Hex String>
  }
*/
module.exports = ({elements}) => {
  if (!isArray(elements)) {
    throw new Error('ExpectedArrayOfScriptElementsToEncodeScript');
  }

   // Convert numbers to buffers and hex data to pushdata
  const fullScript = elements.map(element => {
    // Exit early when element is a data push
    if (isBuffer(element)) {
      return concat([encode(element.length), element]);
    }

    // Non data elements are direct bytes
    return from([element]);
  });

  return {script: bufferAsHex(flatten(fullScript))};
};

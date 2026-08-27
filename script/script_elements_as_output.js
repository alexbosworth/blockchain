const {encodePushBytesCount} = require('./../numbers');

const {alloc} = Buffer;
const {concat} = Buffer;
const encode = count => encodePushBytesCount({count}).encoded;
const flatten = arr => arr.reduce((s, n) => concat([s, n]), Buffer.alloc(0));
const {from} = Buffer;
const {isArray} = Array;
const {isBuffer} = Buffer;
const {isInteger} = Number;
const isOpCode = code => code >= 0 && code <= 255;

/** Map array of script buffer elements to an output script

  {
    elements: [<Data Buffer>, <Script OP_CODE Number>]
  }

  @throws
  <Error>

  @returns
  {
    output: <Script Output Buffer Object>
  }
*/
module.exports = ({elements}) => {
  if (!isArray(elements)) {
    throw new Error('ExpectedArrayOfScriptElementsToEncodeScript');
  }

  // Elements are either data pushes or op code numbers
  if (elements.some(n => !isBuffer(n) && !isInteger(n))) {
    throw new Error('ExpectedDataOrOpCodeScriptElementsToEncodeScript');
  }

  // Op code elements must be single byte values
  if (elements.some(n => isInteger(n) && !isOpCode(n))) {
    throw new Error('ExpectedSingleByteOpCodeElementToFormOutputScript');
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

  return {output: flatten(fullScript)};
};

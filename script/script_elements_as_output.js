const {numberAsCompactInt} = require('./../numbers');

const {concat} = Buffer;
const encode = number => numberAsCompactInt({number}).encoded;
const flatten = arr => arr.reduce((sum, n) => Buffer.concat([sum, n]));
const {from} = Buffer;
const {isArray} = Array;
const {isBuffer} = Buffer;

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

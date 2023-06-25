const parsePushBytesCount = require('./parse_push_bytes_count');

const hexAsBuffer = hex => Buffer.from(hex, 'hex');
const isHex = n => n !== undefined && !(n.length%2) && /^[0-9A-F]*$/i.test(n);
const OP_0 = 0;
const OP_1 = 81;
const OP_16 = 96;
const OP_PUSHDATA4 = 78;
const start = 0;

/** Map a serialized script into an array of script elements

  {
    script: <Script Hex String>
  }

  @throws
  <Error>

  @returns
  {
    [elements]: [<Data Buffer>, <Script OP_CODE Number>]
  }
*/
module.exports = ({script}) => {
  if (!isHex(script)) {
    throw new Error('ExpectedHexEncodedScriptToDecodeScriptElements');
  }

  const elements = [];
  const scriptData = hexAsBuffer(script);
  let offset = start;

  const scriptLength = scriptData.length;

  // Run through the script data and parse out pushes and op codes
  while (offset < scriptLength) {
    const cursor = scriptData[offset];

    // Exit early when the cursor is a simple op code and not a data push
    if (cursor === OP_0 || cursor > OP_PUSHDATA4) {
      elements.push(cursor);

      // We read a byte off of the wire
      offset++;

      continue;
    }

    const size = parsePushBytesCount({offset, script: scriptData});

    // Exit early when the bytes to push isn't well-formed
    if (!size.bytes) {
      return {};
    }

    // Data will start after the size data encoding
    const dataStart = offset + size.bytes.length;

    // The push data can be found after the size counter, with length size
    const data = scriptData.slice(dataStart, dataStart + size.count);

    // Push offset forward to account for the push data and size counter
    offset += size.bytes.length + size.count;

    // Exit early when the bytes to read in the script were insufficient
    if (data.length < size.count) {
      return {};
    }

    elements.push(data);
  }

  return {elements};
};

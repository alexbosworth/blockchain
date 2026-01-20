const scriptElementsAsOutput = require('./script_elements_as_output');

const bufferAsHex = buffer => buffer.toString('hex');

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
  const {output} = scriptElementsAsOutput({elements});

  return {script: bufferAsHex(output)};
};

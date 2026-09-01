const {createHash} = require('crypto');

const {numberAsCompactInt} = require('./../numbers');
const {numberAsLittleEndian} = require('./../numbers');
const {parsePushBytesCount} = require('./../numbers');
const parseTransaction = require('./parse_transaction');

const anyOnePaysFlag = 0x80;
const blankedOutput = Buffer.from('ffffffffffffffff00', 'hex');
const bufferAsHex = buffer => buffer.toString('hex');
const {concat} = Buffer;
const countOf = number => numberAsCompactInt({number}).encoded;
const defaultHashType = 0x01;
const hashTypes = [0x01, 0x02, 0x03, 0x81, 0x82, 0x83];
const hexAsBuffer = hex => Buffer.from(hex, 'hex');
const isHex = n => !!n && !(n.length % 2) && /^[0-9A-F]*$/i.test(n);
const {isInteger} = Number;
const isString = n => typeof n === 'string';
const opCodeSeparator = 0xab;
const opPushData4 = 78;
const opZero = 0;
const outputTypeMask = 0x1f;
const sha256 = preimage => createHash('sha256').update(preimage).digest();
const sigHashNone = 2;
const sigHashSingle = 3;
const singleByte = 1;
const sizeOf = script => numberAsCompactInt({number: script.length}).encoded;
const start = 0;
const uint32 = n => numberAsLittleEndian({bytes: 4, number: n}).encoded;
const uint64 = n => numberAsLittleEndian({bytes: 8, number: n}).encoded;
const zeroSequence = 0;

/** Calculate the pre-SegWit transaction hash to sign

  For P2PK, P2PKH, or bare multisig the script is the output script being spent

  For P2SH the script is the redeem script that hashes to the output script

  When a code separator was executed, pass only the script following it, any
  remaining code separators are removed from the script before hashing

  Signing for a single output requires an output matching the input index

  {
    script: <Signing Input Script Hex String>
    [sighash]: <Signature Hash Type Number>
    transaction: <Raw Transaction Hex String>
    vin: <Signing Transaction Input Index Number>
  }

  @throws
  <Error>

  @returns
  {
    hash: <Hash to Sign Hex String>
  }
*/
module.exports = ({script, sighash, transaction, vin}) => {
  if (!isString(script) || !isHex(script)) {
    throw new Error('ExpectedScriptCodeHexToCalculateNonWitnessHashToSign');
  }

  if (!!sighash && !hashTypes.includes(sighash)) {
    throw new Error('ExpectedValidSigHashTypeForNonWitnessHashToSign');
  }

  if (!isString(transaction) || !isHex(transaction)) {
    throw new Error('ExpectedTransactionHexToCalculateNonWitnessHashToSign');
  }

  if (!isInteger(vin)) {
    throw new Error('ExpectedInputIndexToCalculateNonWitnessHashToSign');
  }

  const data = hexAsBuffer(script);
  const decoded = parseTransaction({buffer: hexAsBuffer(transaction)});
  const hashType = sighash || defaultHashType;
  const parts = [];

  // The signing input is expected to be present in the transaction
  if (!decoded.inputs[vin]) {
    throw new Error('ExpectedMatchingInputToCalculateNonWitnessHashToSign');
  }

  const isAnyOnePays = !!(hashType & anyOnePaysFlag);
  const outputType = hashType & outputTypeMask;

  // Signing for a single output requires an output at the input index
  if (outputType === sigHashSingle && !decoded.outputs[vin]) {
    throw new Error('ExpectedMatchingOutputForSingleNonWitnessHashToSign');
  }

  // Signing for all outputs is any type that isn't for none or a single one
  const isAllOutputs = ![sigHashNone, sigHashSingle].includes(outputType);

  let offset = start;

  // The script code is committed to with its code separators removed
  while (offset < data.length) {
    const code = data.readUInt8(offset);

    // Code separators are dropped from the committed script code
    if (code === opCodeSeparator) {
      offset += singleByte;

      continue;
    }

    // Exit early when the code is a simple op code and not a data push
    if (code === opZero || code > opPushData4) {
      parts.push(data.subarray(offset, offset + singleByte));

      offset += singleByte;

      continue;
    }

    const push = parsePushBytesCount({offset, script: data});

    // The pushed data bytes are expected to be present in the script
    if (!push.bytes || offset + push.bytes.length + push.count > data.length) {
      throw new Error('ExpectedValidScriptCodeForNonWitnessHashToSign');
    }

    parts.push(data.subarray(offset, offset + push.bytes.length + push.count));

    offset += push.bytes.length + push.count;
  }

  const scriptCode = concat(parts);

  // Only the signing input is committed to when anyone can pay
  const committed = decoded.inputs
    .map(({hash, sequence, vout}, index) => ({hash, index, sequence, vout}))
    .filter(({index}) => !isAnyOnePays || index === vin);

  // The transaction version number is a signed integer
  const version = numberAsLittleEndian({
    bytes: 4,
    is_signed: true,
    number: decoded.version,
  });

  // Elements to hash over start with the signed transaction version number
  const elements = [version.encoded];

  // Write how many inputs there are
  elements.push(countOf(committed.length));

  // Write the inputs
  committed.forEach(({hash, index, sequence, vout}) => {
    // Write the outpoint being spent
    elements.push(hash);
    elements.push(uint32(vout));

    // The signing input commits to the script code, others are blanked
    if (index === vin) {
      elements.push(sizeOf(scriptCode));
      elements.push(scriptCode);
    } else {
      elements.push(sizeOf(hexAsBuffer(String())));
    }

    // Other input sequence numbers are zeroed unless signing for all outputs
    if (index === vin || isAllOutputs) {
      elements.push(uint32(sequence));
    } else {
      elements.push(uint32(zeroSequence));
    }
  });

  // Signing for a single output only commits up to the matching output
  const outputs = decoded.outputs.slice(
    start,
    outputType === sigHashSingle ? vin + [vin].length : decoded.outputs.length
  );

  // Write how many outputs there are, none commits to no outputs at all
  elements.push(countOf(outputType === sigHashNone ? start : outputs.length));

  // Write the outputs, blanking outputs before the single matching output
  if (outputType !== sigHashNone) {
    outputs.forEach(({script, tokens}, index) => {
      // Outputs before the single matching output have negative one values
      if (outputType === sigHashSingle && index < vin) {
        return elements.push(blankedOutput);
      }

      elements.push(uint64(tokens));
      elements.push(sizeOf(script));

      return elements.push(script);
    });
  }

  // Commit to the transaction locktime and the signature hash type
  elements.push(uint32(decoded.locktime));
  elements.push(uint32(hashType));

  // The hash to sign is the double sha256 hash of the elements
  return {hash: bufferAsHex(sha256(sha256(concat(elements))))};
};

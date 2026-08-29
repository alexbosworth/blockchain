const {createHash} = require('crypto');

const {numberAsCompactInt} = require('./../numbers');
const {numberAsLittleEndian} = require('./../numbers');
const parseTransaction = require('./parse_transaction');

const {alloc} = Buffer;
const anyOnePaysFlag = 0x80;
const bufferAsHex = buffer => buffer.toString('hex');
const byteCountHash = 32;
const {concat} = Buffer;
const defaultHashType = 0x01;
const hash256 = preimage => sha256(sha256(preimage));
const hashTypes = [0x01, 0x02, 0x03, 0x81, 0x82, 0x83];
const hexAsBuffer = hex => Buffer.from(hex, 'hex');
const int32 = number => littleEndian({number, bytes: 4, is_signed: true});
const isHex = n => !!n && !(n.length % 2) && /^[0-9A-F]*$/i.test(n);
const {isInteger} = Number;
const isString = n => typeof n === 'string';
const littleEndian = args => numberAsLittleEndian(args).encoded;
const outputTypeMask = 0x1f;
const sha256 = preimage => createHash('sha256').update(preimage).digest();
const sigHashNone = 2;
const sigHashSingle = 3;
const sizeOf = script => numberAsCompactInt({number: script.length}).encoded;
const uint32 = number => littleEndian({number, bytes: 4});
const uint64 = number => littleEndian({number, bytes: 8});
const zeroHash = alloc(byteCountHash);

/** Calculate the v0 witness transaction hash to sign

  The script is the BIP 143 script code of the output being spent

  For P2WPKH the script code is the P2PKH script of the public key hash

  For P2WSH the script code is the witness script

  {
    script: <Signing Input Script Code Hex String>
    [sighash]: <Signature Hash Type Number>
    tokens: <Spending Output Tokens Number>
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
module.exports = ({script, sighash, tokens, transaction, vin}) => {
  if (!isString(script) || !isHex(script)) {
    throw new Error('ExpectedScriptCodeHexStringToCalculateV0HashToSign');
  }

  if (!!sighash && !hashTypes.includes(sighash)) {
    throw new Error('ExpectedValidSignatureHashTypeToCalculateV0HashToSign');
  }

  if (!isInteger(tokens)) {
    throw new Error('ExpectedSpendTokensNumberToCalculateV0HashToSign');
  }

  if (!isString(transaction) || !isHex(transaction)) {
    throw new Error('ExpectedTransactionHexStringToCalculateV0HashToSign');
  }

  if (!isInteger(vin)) {
    throw new Error('ExpectedInputIndexNumberToCalculateV0HashToSign');
  }

  const decoded = parseTransaction({buffer: hexAsBuffer(transaction)});
  const hashType = sighash || defaultHashType;
  const scriptCode = hexAsBuffer(script);

  // The signing input is expected to be present in the transaction
  if (!decoded.inputs[vin]) {
    throw new Error('ExpectedMatchingInputToCalculateV0HashToSign');
  }

  const isAnyOnePays = !!(hashType & anyOnePaysFlag);
  const outputType = hashType & outputTypeMask;

  // Signing for all outputs is any type that isn't for none or a single one
  const isAllOutputs = ![sigHashNone, sigHashSingle].includes(outputType);

  // The hash commits to inputs as outpoints and little endian sequences
  const spending = decoded.inputs.map(({hash, sequence, vout}) => ({
    outpoint: concat([hash, uint32(vout)]),
    sequence: uint32(sequence),
  }));

  const spend = spending[vin];

  // Elements to hash over start with the signed transaction version number
  const elements = [int32(decoded.version)];

  // Commit to all of the outpoints being spent unless anyone can pay
  if (!isAnyOnePays) {
    elements.push(hash256(concat(spending.map(({outpoint}) => outpoint))));
  } else {
    elements.push(zeroHash);
  }

  // Commit to all input sequence numbers when signing for all outputs
  if (!isAnyOnePays && isAllOutputs) {
    elements.push(hash256(concat(spending.map(({sequence}) => sequence))));
  } else {
    elements.push(zeroHash);
  }

  // Commit to the outpoint, script code, value, sequence of the signing input
  elements.push(spend.outpoint);
  elements.push(sizeOf(scriptCode));
  elements.push(scriptCode);
  elements.push(uint64(tokens));
  elements.push(spend.sequence);

  const output = decoded.outputs[vin];

  if (isAllOutputs) {
    // Commit to all of the outputs of the transaction
    const outputs = decoded.outputs.map(({script, tokens}) => {
      return concat([uint64(tokens), sizeOf(script), script]);
    });

    elements.push(hash256(concat(outputs)));
  } else if (outputType === sigHashSingle && !!output) {
    // Commit to the matching output when signing for a single output
    elements.push(hash256(concat([
      uint64(output.tokens),
      sizeOf(output.script),
      output.script,
    ])));
  } else {
    // There are no outputs committed to when signing for none
    elements.push(zeroHash);
  }

  // Commit to the transaction locktime and the signature hash type
  elements.push(uint32(decoded.locktime));
  elements.push(uint32(hashType));

  // The hash to sign is the double sha256 hash of the elements
  return {hash: bufferAsHex(hash256(concat(elements)))};
};

const generatedModifierValues = [[0x01, 0x3b6a57b2], [0x02, 0x26508e6d], [0x04, 0x1ea119fa], [0x08, 0x3d4233dd], [0x10, 0x2a1462b3]];
const lowerBitsBitMask = 0x1ffffff;

/** Update the 30 bit accumulator with Bech32 precomputed values

  accumulator: <Current Accumulator 32-Bit Range Integer Number>

  @returns
  <Bech32 Generator Constants Modified Number>
*/
module.exports = accumulator => {
  // Take the top 5 bits of the accumulator value (30 - 5 = 25)
  const topBits = accumulator >> 25;

  // Shift the lower 25 bits up by 5
  let modified = ((accumulator & lowerBitsBitMask) << 5) >>> 0;

  // Based on bit masks, apply the appropriate precomputed Bech32 values
  generatedModifierValues
    .filter(([mask]) => topBits & mask)
    .forEach(([, modifier]) => modified ^= modifier);

  return modified;
};

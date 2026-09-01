const {deepStrictEqual} = require('node:assert').strict;
const {throws} = require('node:assert').strict;
const test = require('node:test');

const {nonWitnessHashToSign} = require('./../../');

const anyOnePaysP2pkScriptCode = '21035e7f0d4d0841bcd56c39337ed086b1a633ee770c1ffdd94ac552a95ac2ce0efcac';
const anyOnePaysTransaction = '010000000200010000000000000000000000000000000000000000000000000000000000000000000049483045022100d180fd2eb9140aeb4210c9204d3f358766eb53842b2a9473db687fa24b12a3cc022079781799cd4f038b85135bbe49ec2b57f306b2bb17101b17f71f000fcab2b6fb01ffffffff0002000000000000000000000000000000000000000000000000000000000000000000004847304402205f7530653eea9b38699e476320ab135b74771e1c48b81a5d041e2ca84b9be7a802200ac8d1f40fb026674fe5a5edd3dea715c27baa9baca51ed45ea750ac9dc0a55e81ffffffff010100000000000000015100000000';
const changedSequenceTransaction = '01000000020001000000000000000000000000000000000000000000000000000000000000000000004948304502203a0f5f0e1f2bdbcd04db3061d18f3af70e07f4f467cbc1b8116f267025f5360b022100c792b6e215afc5afc721a351ec413e714305cb749aae3d7fee76621313418df101010000000002000000000000000000000000000000000000000000000000000000000000000000004847304402205f7530653eea9b38699e476320ab135b74771e1c48b81a5d041e2ca84b9be7a802200ac8d1f40fb026674fe5a5edd3dea715c27baa9baca51ed45ea750ac9dc0a55e81ffffffff010100000000000000015100000000';
const p2pkhScriptCode = '76a9141d0f172a0ecb48aee1be1f2687d2963ae33f71a188ac';
const singleAnyOnePaysP2pkScriptCode = '2103596d3451025c19dbbdeb932d6bf8bfb4ad499b95b6f88db8899efac102e5fc71ac';
const singleAnyOnePaysP2pkTransaction = '01000000020001000000000000000000000000000000000000000000000000000000000000000000004847304402202a0b4b1294d70540235ae033d78e64b4897ec859c7b6f1b2b1d8a02e1d46006702201445e756d2254b0f1dfda9ab8e1e1bc26df9668077403204f32d16a49a36eb6983ffffffff00010000000000000000000000000000000000000000000000000000000000000100000049483045022100acb96cfdbda6dc94b489fd06f2d720983b5f350e31ba906cdbd800773e80b21c02200d74ea5bdf114212b4bbe9ed82c36d2e369e302dff57cb60d01c428f0bd3daab83ffffffff02e8030000000000000151e903000000000000015100000000';
const singleAnyOnePaysTransaction = '010000000390d31c6107013d754529d8818eff285fe40a3e7635f6930fec5d12eb02107a43010000006b483045022100f40815ae3c81a0dd851cc8d376d6fd226c88416671346a9033468cca2cdcc6c202204f764623903e6c4bed1b734b75d82c40f1725e4471a55ad4f51218f86130ac038321033d710ab45bb54ac99618ad23b3c1da661631aa25f23bfe9d22b41876f1d46e4effffffff3ff04a68e22bdd52e7c8cb848156d2d158bd5515b3c50adabc87d0ca2cd3482d010000006a4730440220598d263c107004008e9e26baa1e770be30fd31ee55ded1898f7c00da05a75977022045536bead322ca246779698b9c3df3003377090f41afeca7fb2ce9e328ec4af2832102b738b531def73020bd637f32935924cc88549c8206976226d968edd3a42fc2d7ffffffff46a8dc8970eb96622f27a516adcf40e0fcec5731e7556e174f2a271aef6861c7010000006b483045022100c5b90a777a9fdc90c208dbef7290d1fc1be651f47151ee4ccff646872a454cf90220640cfbc4550446968fbbe9d12528f3adf7d87b31541569c59e790db8a220482583210391332546e22bbe8fe3af54addfad6f8b83d05fa4f5e047593d4c07ae938795beffffffff028036be26000000001976a914ddfb29efad43a667465ac59ff14dc6442a1adfca88ac3d5cba01000000001976a914b64dde7a505a13ca986c40e86e984a8dc81368b688ac00000000';
const singleScriptCode = '76a914dcf72c4fd02f5a987cf9b02f2fabfcac3341a87d88ac';
const singleTransaction = '010000000370ac0a1ae588aaf284c308d67ca92c69a39e2db81337e563bf40c59da0a5cf63000000006a4730440220360d20baff382059040ba9be98947fd678fb08aab2bb0c172efa996fd8ece9b702201b4fb0de67f015c90e7ac8a193aeab486a1f587e0f54d0fb9552ef7f5ce6caec032103579ca2e6d107522f012cd00b52b9a65fb46f0c57b9b8b6e377c48f526a44741affffffff7d815b6447e35fbea097e00e028fb7dfbad4f3f0987b4734676c84f3fcd0e804010000006b483045022100c714310be1e3a9ff1c5f7cacc65c2d8e781fc3a88ceb063c6153bf950650802102200b2d0979c76e12bb480da635f192cc8dc6f905380dd4ac1ff35a4f68f462fffd032103579ca2e6d107522f012cd00b52b9a65fb46f0c57b9b8b6e377c48f526a44741affffffff3f1f097333e4d46d51f5e77b53264db8f7f5d2e18217e1099957d0f5af7713ee010000006c493046022100b663499ef73273a3788dea342717c2640ac43c5a1cf862c9e09b206fcb3f6bb8022100b09972e75972d9148f2bdd462e5cb69b57c1214b88fc55ca638676c07cfc10d8032103579ca2e6d107522f012cd00b52b9a65fb46f0c57b9b8b6e377c48f526a44741affffffff0380841e00000000001976a914bfb282c70c4191f45b5a6665cad1682f2c9cfdfb88ac80841e00000000001976a9149857cc07bed33a5cf12b9c5e0500b675d500c81188ace0fd1c00000000001976a91443c52850606c872403c0601e69fa34b26f62db4a88ac00000000';
const twoInTwoOutTransaction = '0100000002fff7f7881a8099afa6940d42d1e7f6362bec38171ea3edf433541db4e4ad969f0000000000eeffffffef51e1b804cc89d182d279655c3aa89e815b1b309fe287d9b2b55d57b90ec68a0100000000ffffffff02202cb206000000001976a9148280b37df378db99f66f85c95a783a76ac7a6d5988ac9093510d000000001976a9143bde42dbee7e4dbe6a21b2d50ce2f0167faa815988ac11000000';

const tests = [
  {
    args: {script: undefined},
    description: 'A script code hex string is required',
    error: 'ExpectedScriptCodeHexToCalculateNonWitnessHashToSign',
  },
  {
    args: {script: '00', sighash: 0x04},
    description: 'A known signature hash type is required',
    error: 'ExpectedValidSigHashTypeForNonWitnessHashToSign',
  },
  {
    args: {script: '00', sighash: 0x01},
    description: 'A transaction hex string is required',
    error: 'ExpectedTransactionHexToCalculateNonWitnessHashToSign',
  },
  {
    args: {script: '00', sighash: 0x01, transaction: twoInTwoOutTransaction},
    description: 'An input index number is required',
    error: 'ExpectedInputIndexToCalculateNonWitnessHashToSign',
  },
  {
    args: {
      script: '00',
      sighash: 0x01,
      transaction: twoInTwoOutTransaction,
      vin: 2,
    },
    description: 'A matching input is required',
    error: 'ExpectedMatchingInputToCalculateNonWitnessHashToSign',
  },
  {
    args: {
      script: '76a91434fea2c5a75414fd945273ae2d029ce1f28dafcf88ac',
      sighash: 0x83,
      transaction: singleAnyOnePaysTransaction,
      vin: 2,
    },
    description: 'A single input past the outputs is refused not signed as one',
    error: 'ExpectedMatchingOutputForSingleNonWitnessHashToSign',
  },
  {
    args: {
      script: '4c',
      sighash: 0x01,
      transaction: twoInTwoOutTransaction,
      vin: 0,
    },
    description: 'A well formed script code is required',
    error: 'ExpectedValidScriptCodeForNonWitnessHashToSign',
  },
  {
    args: {
      script: '02ab',
      sighash: 0x01,
      transaction: twoInTwoOutTransaction,
      vin: 0,
    },
    description: 'Complete script code push data bytes are required',
    error: 'ExpectedValidScriptCodeForNonWitnessHashToSign',
  },
  {
    args: {
      script: '410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac',
      sighash: 0x01,
      transaction: '0100000001c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd3704000000004847304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901ffffffff0200ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000',
      vin: 0,
    },
    description: 'The first ever transaction signature hash is calculated',
    expected: {
      hash: '7a05c6145f10101e9d6325494245adf1297d80f8f38d4d576d57cdba220bcb19',
    },
  },
  {
    args: {
      script: singleScriptCode,
      sighash: 0x03,
      transaction: singleTransaction,
      vin: 0,
    },
    description: 'A mainnet single hash is calculated for the first input',
    expected: {
      hash: '465f0318f9801d56aeb1737d1e9af8e27d841a493b11494a9283477a1fdccc1e',
    },
  },
  {
    args: {
      script: singleScriptCode,
      sighash: 0x03,
      transaction: singleTransaction,
      vin: 1,
    },
    description: 'A mainnet single hash is calculated for the second input',
    expected: {
      hash: '3b8eee7ff2be39a1d7a69cfdfda487985caa090f33858a60de0b4df67ae84319',
    },
  },
  {
    args: {
      script: singleScriptCode,
      sighash: 0x03,
      transaction: singleTransaction,
      vin: 2,
    },
    description: 'A mainnet single hash is calculated for the third input',
    expected: {
      hash: 'd694785005d3292d4771695034ee3f07b4dc8a3bacfdb0ecf221a7a68d061f1c',
    },
  },
  {
    args: {
      script: '76a914383fb81cb0a3fc724b5e08cf8bbd404336d711f688ac',
      sighash: 0x83,
      transaction: singleAnyOnePaysTransaction,
      vin: 0,
    },
    description: 'A p2pkh single anyone can pay hash is calculated',
    expected: {
      hash: 'dc8584ae65a4ee4485d402bfadebb501077579adda20de321a1cbfb2a7dcff5b',
    },
  },
  {
    args: {
      script: '76a914275ec2a233e5b23d43fa19e7bf9beb0cb399611788ac',
      sighash: 0x83,
      transaction: singleAnyOnePaysTransaction,
      vin: 1,
    },
    description: 'A p2pkh single anyone can pay hash blanks the first output',
    expected: {
      hash: '2c0c915ab013457e84e8fedbd834d9c2c659c15caacb501c22eae52e65bd06da',
    },
  },
  {
    args: {
      script: anyOnePaysP2pkScriptCode,
      sighash: 0x01,
      transaction: anyOnePaysTransaction,
      vin: 0,
    },
    description: 'A p2pk hash is calculated for all beside an anyone can pay',
    expected: {
      hash: 'f69b639c5d2ee6f886701efaf4616daa84793a48d851d19434bb6a13dd6225cc',
    },
  },
  {
    args: {
      script: anyOnePaysP2pkScriptCode,
      sighash: 0x81,
      transaction: anyOnePaysTransaction,
      vin: 1,
    },
    description: 'A p2pk hash is calculated for all anyone can pay',
    expected: {
      hash: '57f5a54d548db73fa8ef7a43d011120f9935fe792f0a0630d28ee70b4c72a7e8',
    },
  },
  {
    args: {
      script: anyOnePaysP2pkScriptCode,
      sighash: 0x81,
      transaction: changedSequenceTransaction,
      vin: 1,
    },
    description: 'An anyone can pay hash ignores other input sequence changes',
    expected: {
      hash: '57f5a54d548db73fa8ef7a43d011120f9935fe792f0a0630d28ee70b4c72a7e8',
    },
  },
  {
    args: {
      script: singleAnyOnePaysP2pkScriptCode,
      sighash: 0x83,
      transaction: singleAnyOnePaysP2pkTransaction,
      vin: 0,
    },
    description: 'A single anyone can pay hash commits to the input position',
    expected: {
      hash: 'e67f282e8931e966e29d467b36d974cc67fa8cfbf8b230673e7dfa04d8213a95',
    },
  },
  {
    args: {
      script: singleAnyOnePaysP2pkScriptCode,
      sighash: 0x83,
      transaction: singleAnyOnePaysP2pkTransaction,
      vin: 1,
    },
    description: 'A single anyone can pay hash differs for the second input',
    expected: {
      hash: '63df76233203400e0af3395d8eba7fe3f98095bf1a0c0f5ac0d356981fb6033a',
    },
  },
  {
    args: {
      script: 'ad',
      sighash: 0x01,
      transaction: '010000000169c12106097dc2e0526493ef67f21269fe888ef05c7a3a5dacab38e1ac8387f1581b0000b64830450220487fb382c4974de3f7d834c1b617fe15860828c7f96454490edd6d891556dcc9022100baf95feb48f845d5bfc9882eb6aeefa1bc3790e39f59eaa46ff7f15ae626c53e0121037a3fb04bcdb09eba90f69961ba1692a3528e45e67c85b200df820212d7594d334aad4830450220487fb382c4974de3f7d834c1b617fe15860828c7f96454490edd6d891556dcc9022100baf95feb48f845d5bfc9882eb6aeefa1bc3790e39f59eaa46ff7f15ae626c53e01ffffffff0101000000000000000000000000',
      vin: 0,
    },
    description: 'A p2sh redeem script code with a deleted signature is hashed',
    expected: {
      hash: '1ba1fe3bc90c5d1265460e684ce6774e324f0fabdf67619eda729e64e8b6bc08',
    },
  },
  {
    args: {
      script: '52af75',
      sighash: 0x01,
      transaction: '01000000019275cb8d4a485ce95741c013f7c0d28722160008021bb469a11982d47a662896581b0000fd6f01004830450220487fb382c4974de3f7d834c1b617fe15860828c7f96454490edd6d891556dcc9022100baf95feb48f845d5bfc9882eb6aeefa1bc3790e39f59eaa46ff7f15ae626c53e0148304502205286f726690b2e9b0207f0345711e63fa7012045b9eb0f19c2458ce1db90cf43022100e89f17f86abc5b149eba4115d4f128bcf45d77fb3ecdd34f594091340c03959601522102cd74a2809ffeeed0092bc124fd79836706e41f048db3f6ae9df8708cefb83a1c2102e615999372426e46fd107b76eaf007156a507584aa2cc21de9eee3bdbd26d36c4c9552af4830450220487fb382c4974de3f7d834c1b617fe15860828c7f96454490edd6d891556dcc9022100baf95feb48f845d5bfc9882eb6aeefa1bc3790e39f59eaa46ff7f15ae626c53e0148304502205286f726690b2e9b0207f0345711e63fa7012045b9eb0f19c2458ce1db90cf43022100e89f17f86abc5b149eba4115d4f128bcf45d77fb3ecdd34f594091340c0395960175ffffffff0101000000000000000000000000',
      vin: 0,
    },
    description: 'A multisig redeem script code with deleted signatures is hashed',
    expected: {
      hash: '1d50f00ba4db2917b903b0ec5002e017343bb38876398c9510570f5dce099295',
    },
  },
  {
    args: {
      script: p2pkhScriptCode,
      sighash: 0x01,
      transaction: twoInTwoOutTransaction,
      vin: 0,
    },
    description: 'A non witness hash to sign is calculated for all',
    expected: {
      hash: '47194bc3c303a30aa5f78e45c7c2980b3be1284a9d69b1ea9ec0d29aac5f6848',
    },
  },
  {
    args: {
      script: p2pkhScriptCode,
      transaction: twoInTwoOutTransaction,
      vin: 0,
    },
    description: 'A non witness hash to sign defaults to signing for all',
    expected: {
      hash: '47194bc3c303a30aa5f78e45c7c2980b3be1284a9d69b1ea9ec0d29aac5f6848',
    },
  },
  {
    args: {
      script: p2pkhScriptCode,
      sighash: 0x02,
      transaction: twoInTwoOutTransaction,
      vin: 1,
    },
    description: 'A non witness hash to sign is calculated for none',
    expected: {
      hash: 'ffbbcf554debe55f76a79db7d205edc891f194184a93a660366bb8f7facb89e2',
    },
  },
  {
    args: {
      script: p2pkhScriptCode,
      sighash: 0x03,
      transaction: twoInTwoOutTransaction,
      vin: 1,
    },
    description: 'A non witness hash to sign is calculated for single',
    expected: {
      hash: '33cd468bd6b82f04bcef180b748c521d6fdee3b11711a2f27b2e465915afaec2',
    },
  },
  {
    args: {
      script: p2pkhScriptCode,
      sighash: 0x81,
      transaction: twoInTwoOutTransaction,
      vin: 0,
    },
    description: 'A non witness hash is calculated for all anyone can pay',
    expected: {
      hash: '4e7de48ff097d47bb87912759ec9380049a160289f2b89d48a28887ee30a41d4',
    },
  },
  {
    args: {
      script: p2pkhScriptCode,
      sighash: 0x82,
      transaction: twoInTwoOutTransaction,
      vin: 1,
    },
    description: 'A non witness hash is calculated for none anyone can pay',
    expected: {
      hash: 'bd8ca4cb1ab60a8db8451bd58bc068a9abd5ea20a08029b38934c9d50c1d6721',
    },
  },
  {
    args: {
      script: p2pkhScriptCode,
      sighash: 0x83,
      transaction: twoInTwoOutTransaction,
      vin: 1,
    },
    description: 'A non witness hash is calculated for single anyone can pay',
    expected: {
      hash: '865c7791b88917498a4c402176c302f146c53a6c2f50ecda08548f515237dca6',
    },
  },
  {
    args: {
      script: '00ab' + p2pkhScriptCode,
      sighash: 0x01,
      transaction: twoInTwoOutTransaction,
      vin: 0,
    },
    description: 'A zero op code is kept in the committed script code',
    expected: {
      hash: 'bc2a4d64ca999408ad71506b90d27225e59e3bf3f1308a9f43e67c04a8515fbc',
    },
  },
  {
    args: {
      script: '4c50' + 'ab'.repeat(80) + '75' + p2pkhScriptCode + 'ab',
      sighash: 0x01,
      transaction: twoInTwoOutTransaction,
      vin: 0,
    },
    description: 'Separator bytes inside a push data 1 push are kept',
    expected: {
      hash: '64b2d0421e77f95ee403ff7eec49c2066af6fcfcbb8822e32a3813fe6878afd9',
    },
  },
  {
    args: {
      script: 'ab4d0001' + 'ab'.repeat(256) + '75' + p2pkhScriptCode + 'ab',
      sighash: 0x01,
      transaction: twoInTwoOutTransaction,
      vin: 0,
    },
    description: 'Separator bytes inside a push data 2 push are kept',
    expected: {
      hash: '778dffb8dc7acbbece56410ca48e663ba2e2c10ecb13509575d30f74a0a77f27',
    },
  },
  {
    args: {
      script: p2pkhScriptCode,
      sighash: 0x03,
      transaction: twoInTwoOutTransaction,
      vin: 0,
    },
    description: 'A single hash for the first input blanks no outputs',
    expected: {
      hash: '0d8ad17ba098be7eaf7efff778bb22e234805b5d370c996271a7f5ff7416f263',
    },
  },
  {
    args: {
      script: p2pkhScriptCode,
      sighash: 0x01,
      transaction: 'ffffffff' + twoInTwoOutTransaction.slice(8),
      vin: 0,
    },
    description: 'A negative version number is committed to as signed bytes',
    expected: {
      hash: '19ed79919ad5a3f911dec0e134b52ba4d9ac5a6b15bcbdd685ff146a8690c024',
    },
  },
  {
    args: {
      script: 'ab' + p2pkhScriptCode + 'ab',
      sighash: 0x01,
      transaction: twoInTwoOutTransaction,
      vin: 0,
    },
    description: 'Code separators are removed from the script code',
    expected: {
      hash: '47194bc3c303a30aa5f78e45c7c2980b3be1284a9d69b1ea9ec0d29aac5f6848',
    },
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => nonWitnessHashToSign(args), new Error(error), 'Got error');
    } else {
      const res = nonWitnessHashToSign(args);

      deepStrictEqual(res, expected, 'Got expected result');
    }

    return end();
  });
});

const {test} = require('@alexbosworth/tap');

const {componentsOfTransaction} = require('./../../');

const hexAsBuffer = hex => Buffer.from(hex, 'hex');

const tests = [
  {
    args: {transaction: ''},
    description: 'A transaction hex is required',
    error: 'ExpectedHexEncodedTransactionToGetComponentsOf',
  },
  {
    args: {
      transaction: '01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff4d04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100f2052a01000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac00000000',
    },
    description: 'A coinbase transaction is parsed',
    expected: {
      inputs: [{
        id: '0000000000000000000000000000000000000000000000000000000000000000',
        script: '04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73',
        sequence: 4294967295,
        vout: 4294967295,
        witness: undefined,
      }],
      locktime: 0,
      outputs: [{
        script: '4104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac',
        tokens: 5000000000,
      }],
      version: 1,
    },
  },
  {
    args: {
      transaction: '01000000019ac03d5ae6a875d970128ef9086cef276a1919684a6988023cc7254691d97e6d010000006b4830450221009d41dc793ba24e65f571473d40b299b6459087cea1509f0d381740b1ac863cb6022039c425906fcaf51b2b84d8092569fb3213de43abaff2180e2a799d4fcb4dd0aa012102d5ede09a8ae667d0f855ef90325e27f6ce35bbe60a1e6e87af7f5b3c652140fdffffffff080100000000000000010101000000000000000202010100000000000000014c0100000000000000034c02010100000000000000014d0100000000000000044dffff010100000000000000014e0100000000000000064effffffff0100000000',
    },
    description: 'invalid script',
    expected: {
      inputs: [{
        id: '6d7ed9914625c73c0288694a6819196a27ef6c08f98e1270d975a8e65a3dc09a',
        script: '4830450221009d41dc793ba24e65f571473d40b299b6459087cea1509f0d381740b1ac863cb6022039c425906fcaf51b2b84d8092569fb3213de43abaff2180e2a799d4fcb4dd0aa012102d5ede09a8ae667d0f855ef90325e27f6ce35bbe60a1e6e87af7f5b3c652140fd',
        sequence: 4294967295,
        vout: 1,
        witness: undefined,
      }],
      locktime: 0,
      outputs: [
        {
          script: '01',
          tokens: 1,
        },
        {
          script: '0201',
          tokens: 1,
        },
        {
          script: '4c',
          tokens: 1,
        },
        {
          script: '4c0201',
          tokens: 1,
        },
        {
          script: '4d',
          tokens: 1,
        },
        {
          script: '4dffff01',
          tokens: 1,
        },
        {
          script: '4e',
          tokens: 1,
        },
        {
          script: '4effffffff01',
          tokens: 1,
        },
      ],
      version: 1,
    },
  },
  {
    args: {
      transaction: '02000000000103ae8caf3aad8861142597a29d6377f524a55f4542d5294c8292ce123a956d3e520000000000ffffffff9cbb1c5531a677b90c489d75a198a14f02d49e554ab9cdaa17bd956b127724570200000000ffffffff9cbb1c5531a677b90c489d75a198a14f02d49e554ab9cdaa17bd956b127724570100000000ffffffff0640420f0000000000160014eaa9b76637b1ad340b6efadf773a73b53637d5b6de91f62901000000225120f4c82416bcb08422c195af995e1d248d1378d8b48dafa9f45bc213b83101d49240420f00000000001600148729d17b2aa507ab19051a028384bc6e0ce25e455e368900000000002251200249ccc5af06fa5642f12d42d2a34bfbb08688d54a9b99d07b98619b35df03b440420f0000000000160014d2d59a8a59f997cbc8888411010faf1658e0e3465e368900000000002251207febd720c78518b52aa1a2443823cc8f55e373910f616e112d5d7bd622fe1ab2024830450221008ac71eff4d7e298941be012fc14f0ac9bf62ae6ffeac13522bb27b5b4108d3aa0220192a69ad6fdb86b1e09c7fdcaaafeb58d25060e44199c734dc0d7d385b5d800d0121029943eaccd3987fa495a6b4f47f2fafeb0521e4e12f39498d9465a564ef75329602483045022100f9cde9adb00c0a6c62dae8604ca750039201288c0dafff952461da3caf05e3ae0220679c01f2518413951de3b62531b1cf36bb92562e3bd4197f0fa6e6e3e231272e0121027326b48c9f2729597e328ab6d05f5af75866e1ffa203fadf78387a3b202ff80d0247304402202550beec478845af2df929abf85708f9fcceaae31377f2e01d803e2acf7b426f022036c312b1e38ca333fe70aa37d3093387ac7486f08438eb8eed323699594468cb012102275a197f7ccfece19cf0532b068b6e38ceceda146e791875ecbdc55500bb7efe00000000',
    },
    description: 'Transaction with witnesses and P2TR and P2WPKH outputs',
    expected: {
      inputs: [
        {
          id: '523e6d953a12ce92824c29d542455fa524f577639da29725146188ad3aaf8cae',
          script: '',
          sequence: 4294967295,
          vout: 0,
          witness: [
            '30450221008ac71eff4d7e298941be012fc14f0ac9bf62ae6ffeac13522bb27b5b4108d3aa0220192a69ad6fdb86b1e09c7fdcaaafeb58d25060e44199c734dc0d7d385b5d800d01',
            '029943eaccd3987fa495a6b4f47f2fafeb0521e4e12f39498d9465a564ef753296',
          ],
        },
        {
          id: '572477126b95bd17aacdb94a559ed4024fa198a1759d480cb977a631551cbb9c',
          script: '',
          sequence: 4294967295,
          vout: 2,
          witness: [
            '3045022100f9cde9adb00c0a6c62dae8604ca750039201288c0dafff952461da3caf05e3ae0220679c01f2518413951de3b62531b1cf36bb92562e3bd4197f0fa6e6e3e231272e01',
            '027326b48c9f2729597e328ab6d05f5af75866e1ffa203fadf78387a3b202ff80d',
          ],
        },
        {
          id: '572477126b95bd17aacdb94a559ed4024fa198a1759d480cb977a631551cbb9c',
          script: '',
          sequence: 4294967295,
          vout: 1,
          witness: [
            '304402202550beec478845af2df929abf85708f9fcceaae31377f2e01d803e2acf7b426f022036c312b1e38ca333fe70aa37d3093387ac7486f08438eb8eed323699594468cb01',
            '02275a197f7ccfece19cf0532b068b6e38ceceda146e791875ecbdc55500bb7efe'
          ],
        }
      ],
      locktime: 0,
      outputs: [
        {
          script: '0014eaa9b76637b1ad340b6efadf773a73b53637d5b6',
          tokens: 1000000,
        },
        {
          script: '5120f4c82416bcb08422c195af995e1d248d1378d8b48dafa9f45bc213b83101d492',
          tokens: 4998992350,
        },
        {
          script: '00148729d17b2aa507ab19051a028384bc6e0ce25e45',
          tokens: 1000000,
        },
        {
          script: '51200249ccc5af06fa5642f12d42d2a34bfbb08688d54a9b99d07b98619b35df03b4',
          tokens: 8992350,
        },
        {
          script: '0014d2d59a8a59f997cbc8888411010faf1658e0e346',
          tokens: 1000000,
        },
        {
          script: '51207febd720c78518b52aa1a2443823cc8f55e373910f616e112d5d7bd622fe1ab2',
          tokens: 8992350,
        },
      ],
      version: 2,
    },
  },
  {
    args: {
      transaction: '0100000001f709fa82596e4f908ee331cb5e0ed46ab331d7dcfaf697fe95891e73dac4ebcb000000008c20ca42095840735e89283fec298e62ac2ddea9b5f34a8cbb7097ad965b87568100201b1b01dc829177da4a14551d2fc96a9db00c6501edfa12f22cd9cefd335c227f483045022100a9df60536df5733dd0de6bc921fab0b3eee6426501b43a228afa2c90072eb5ca02201c78b74266fac7d1db5deff080d8a403743203f109fbcabf6d5a760bf87386d20100ffffffff01c075790000000000232103611f9a45c18f28f06f19076ad571c344c82ce8fcfe34464cf8085217a2d294a6ac00000000',
    },
    description: 'A non-segwit transaction is read',
    expected: {
      inputs: [{
        id: 'cbebc4da731e8995fe97f6fadcd731b36ad40e5ecb31e38e904f6e5982fa09f7',
        script: '20ca42095840735e89283fec298e62ac2ddea9b5f34a8cbb7097ad965b87568100201b1b01dc829177da4a14551d2fc96a9db00c6501edfa12f22cd9cefd335c227f483045022100a9df60536df5733dd0de6bc921fab0b3eee6426501b43a228afa2c90072eb5ca02201c78b74266fac7d1db5deff080d8a403743203f109fbcabf6d5a760bf87386d20100',
        sequence: 4294967295,
        vout: 0,
        witness: undefined,
      }],
      locktime: 0,
      outputs: [{
        script: '2103611f9a45c18f28f06f19076ad571c344c82ce8fcfe34464cf8085217a2d294a6ac',
        tokens: 7960000,
      }],
      version: 1,
    },
  },
  {
    args: {
      transaction: '0100000001c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd3704000000004847304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901ffffffff0200ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000',
    },
    description: 'A P2PK transaction is read',
    expected: {
      inputs: [{
        id: '0437cd7f8525ceed2324359c2d0ba26006d92d856a9c20fa0241106ee5a597c9',
        script: '47304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901',
        sequence: 4294967295,
        vout: 0,
        witness: undefined,
      }],
      locktime: 0,
      outputs: [
        {
          script: '4104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac',
          tokens: 1000000000,
        },
        {
          script: '410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac',
          tokens: 4000000000,
        },
      ],
      version: 1,
    },
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, ({end, strictSame, throws}) => {
    if (!!error) {
      throws(() => componentsOfTransaction(args), new Error(error), 'Got err');
    } else {
      const res = componentsOfTransaction(args);

      strictSame(res, expected, 'Got expected result');
    }

    return end();
  });
});

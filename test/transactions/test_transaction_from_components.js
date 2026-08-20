const {deepStrictEqual} = require('node:assert').strict;
const {throws} = require('node:assert').strict;
const test = require('node:test');

const {componentsOfTransaction} = require('./../../');
const {transactionFromComponents} = require('./../../');

const tests = [
  {
    args: {},
    description: 'An array of inputs is required',
    error: 'ExpectedArrayOfInputsToFormTransactionFromComponents',
  },
  {
    args: {inputs: [{id: '00'}]},
    description: 'Inputs are required to have spending transaction ids',
    error: 'ExpectedSpendingTransactionIdsToFormTransaction',
  },
  {
    args: {inputs: [null]},
    description: 'Inputs are required to be defined',
    error: 'ExpectedSpendingTransactionIdsToFormTransaction',
  },
  {
    args: {
      inputs: [{
        id: Buffer.alloc(32).toString('hex'),
        script: 'not hex',
      }],
    },
    description: 'Inputs are required to have hex encoded scripts',
    error: 'ExpectedHexEncodedInputScriptsToFormTransaction',
  },
  {
    args: {
      inputs: [{id: Buffer.alloc(32).toString('hex'), script: ''}],
    },
    description: 'A locktime is required',
    error: 'ExpectedLocktimeToFormTransactionFromComponents',
  },
  {
    args: {
      inputs: [{id: Buffer.alloc(32).toString('hex'), script: ''}],
      locktime: 0,
    },
    description: 'An array of outputs is required',
    error: 'ExpectedArrayOfOutputsToFormTransactionFromComponents',
  },
  {
    args: {
      inputs: [{id: Buffer.alloc(32).toString('hex'), script: ''}],
      locktime: 0,
      outputs: [{script: 'not hex', tokens: 1}],
    },
    description: 'Outputs are required to have hex encoded scripts',
    error: 'ExpectedHexEncodedOutputScriptsToFormTransaction',
  },
  {
    args: {
      inputs: [{id: Buffer.alloc(32).toString('hex'), script: ''}],
      locktime: 0,
      outputs: [{tokens: 1}, {script: 'not hex', tokens: 1}],
    },
    description: 'Outputs with absent scripts are checked for hex scripts',
    error: 'ExpectedHexEncodedOutputScriptsToFormTransaction',
  },
  {
    args: {
      inputs: [{id: Buffer.alloc(32).toString('hex'), script: ''}],
      locktime: 0,
      outputs: [null],
    },
    description: 'Outputs are required to be defined',
    error: 'ExpectedHexEncodedOutputScriptsToFormTransaction',
  },
  {
    args: {
      inputs: [{id: Buffer.alloc(32).toString('hex'), script: ''}],
      locktime: 0,
      outputs: [],
    },
    description: 'A version number is required',
    error: 'ExpectedVersionNumberToFormTransactionFromComponents',
  },
  {
    args: {
      inputs: [{
        id: '0000000000000000000000000000000000000000000000000000000000000000',
        script: '04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73',
        sequence: 4294967295,
        vout: 4294967295,
      }],
      locktime: 0,
      outputs: [{
        script: '4104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac',
        tokens: 5000000000,
      }],
      version: 1,
    },
    description: 'A coinbase transaction is formed',
    expected: {
      transaction: '01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff4d04ffff001d0104455468652054696d65732030332f4a616e2f32303039204368616e63656c6c6f72206f6e206272696e6b206f66207365636f6e64206261696c6f757420666f722062616e6b73ffffffff0100f2052a01000000434104678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5fac00000000',
    },
  },
  {
    args: {
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
            '02275a197f7ccfece19cf0532b068b6e38ceceda146e791875ecbdc55500bb7efe',
          ],
        },
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
    description: 'A transaction with witnesses is formed',
    expected: {
      transaction: '02000000000103ae8caf3aad8861142597a29d6377f524a55f4542d5294c8292ce123a956d3e520000000000ffffffff9cbb1c5531a677b90c489d75a198a14f02d49e554ab9cdaa17bd956b127724570200000000ffffffff9cbb1c5531a677b90c489d75a198a14f02d49e554ab9cdaa17bd956b127724570100000000ffffffff0640420f0000000000160014eaa9b76637b1ad340b6efadf773a73b53637d5b6de91f62901000000225120f4c82416bcb08422c195af995e1d248d1378d8b48dafa9f45bc213b83101d49240420f00000000001600148729d17b2aa507ab19051a028384bc6e0ce25e455e368900000000002251200249ccc5af06fa5642f12d42d2a34bfbb08688d54a9b99d07b98619b35df03b440420f0000000000160014d2d59a8a59f997cbc8888411010faf1658e0e3465e368900000000002251207febd720c78518b52aa1a2443823cc8f55e373910f616e112d5d7bd622fe1ab2024830450221008ac71eff4d7e298941be012fc14f0ac9bf62ae6ffeac13522bb27b5b4108d3aa0220192a69ad6fdb86b1e09c7fdcaaafeb58d25060e44199c734dc0d7d385b5d800d0121029943eaccd3987fa495a6b4f47f2fafeb0521e4e12f39498d9465a564ef75329602483045022100f9cde9adb00c0a6c62dae8604ca750039201288c0dafff952461da3caf05e3ae0220679c01f2518413951de3b62531b1cf36bb92562e3bd4197f0fa6e6e3e231272e0121027326b48c9f2729597e328ab6d05f5af75866e1ffa203fadf78387a3b202ff80d0247304402202550beec478845af2df929abf85708f9fcceaae31377f2e01d803e2acf7b426f022036c312b1e38ca333fe70aa37d3093387ac7486f08438eb8eed323699594468cb012102275a197f7ccfece19cf0532b068b6e38ceceda146e791875ecbdc55500bb7efe00000000',
    },
  },
  {
    args: {
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
          id: 'cbebc4da731e8995fe97f6fadcd731b36ad40e5ecb31e38e904f6e5982fa09f7',
          script: '2103611f9a45c18f28f06f19076ad571c344c82ce8fcfe34464cf8085217a2d294a6ac',
          sequence: 4294967294,
          vout: 1,
        },
      ],
      locktime: 0,
      outputs: [{
        script: '0014eaa9b76637b1ad340b6efadf773a73b53637d5b6',
        tokens: 1000000,
      }],
      version: 2,
    },
    description: 'A transaction with mixed witness and non-witness inputs is formed',
    expected: {
      transaction: '02000000000102ae8caf3aad8861142597a29d6377f524a55f4542d5294c8292ce123a956d3e520000000000fffffffff709fa82596e4f908ee331cb5e0ed46ab331d7dcfaf697fe95891e73dac4ebcb01000000232103611f9a45c18f28f06f19076ad571c344c82ce8fcfe34464cf8085217a2d294a6acfeffffff0140420f0000000000160014eaa9b76637b1ad340b6efadf773a73b53637d5b6024830450221008ac71eff4d7e298941be012fc14f0ac9bf62ae6ffeac13522bb27b5b4108d3aa0220192a69ad6fdb86b1e09c7fdcaaafeb58d25060e44199c734dc0d7d385b5d800d0121029943eaccd3987fa495a6b4f47f2fafeb0521e4e12f39498d9465a564ef7532960000000000',
    },
  },
  {
    args: {
      inputs: [{
        id: 'cbebc4da731e8995fe97f6fadcd731b36ad40e5ecb31e38e904f6e5982fa09f7',
        script: '20ca42095840735e89283fec298e62ac2ddea9b5f34a8cbb7097ad965b87568100201b1b01dc829177da4a14551d2fc96a9db00c6501edfa12f22cd9cefd335c227f483045022100a9df60536df5733dd0de6bc921fab0b3eee6426501b43a228afa2c90072eb5ca02201c78b74266fac7d1db5deff080d8a403743203f109fbcabf6d5a760bf87386d20100',
        sequence: 4294967295,
        vout: 0,
      }],
      locktime: 0,
      outputs: [{
        script: '2103611f9a45c18f28f06f19076ad571c344c82ce8fcfe34464cf8085217a2d294a6ac',
        tokens: 7960000,
      }],
      version: 1,
    },
    description: 'A non-segwit transaction is formed',
    expected: {
      transaction: '0100000001f709fa82596e4f908ee331cb5e0ed46ab331d7dcfaf697fe95891e73dac4ebcb000000008c20ca42095840735e89283fec298e62ac2ddea9b5f34a8cbb7097ad965b87568100201b1b01dc829177da4a14551d2fc96a9db00c6501edfa12f22cd9cefd335c227f483045022100a9df60536df5733dd0de6bc921fab0b3eee6426501b43a228afa2c90072eb5ca02201c78b74266fac7d1db5deff080d8a403743203f109fbcabf6d5a760bf87386d20100ffffffff01c075790000000000232103611f9a45c18f28f06f19076ad571c344c82ce8fcfe34464cf8085217a2d294a6ac00000000',
    },
  },
];

tests.forEach(({args, description, error, expected}) => {
  return test(description, (t, end) => {
    if (!!error) {
      throws(() => transactionFromComponents(args), new Error(error), 'Err');
    } else {
      const res = transactionFromComponents(args);

      deepStrictEqual(res, expected, 'Got expected result');

      const components = componentsOfTransaction(res);

      deepStrictEqual(
        transactionFromComponents(components),
        expected,
        'Components round trip back to the transaction'
      );
    }

    return end();
  });
});

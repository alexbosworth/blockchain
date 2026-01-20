const p2pkhOutputScript = require('./p2pkh_output_script');
const p2shOutputScript = require('./p2sh_output_script');
const p2trOutputScript = require('./p2tr_output_script');
const p2wpkhOutputScript = require('./p2wpkh_output_script');
const p2wshOutputScript = require('./p2wsh_output_script');
const scriptAsScriptElements = require('./script_as_script_elements');
const scriptElementsAsScript = require('./script_elements_as_script');

module.exports = {
  p2pkhOutputScript,
  p2shOutputScript,
  p2trOutputScript,
  p2wpkhOutputScript,
  p2wshOutputScript,
  scriptAsScriptElements,
  scriptElementsAsScript,
};

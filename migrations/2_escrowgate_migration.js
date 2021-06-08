const EscrowGate = artifacts.require("EscrowGate");

module.exports = function (deployer) {
  deployer.deploy(EscrowGate);
};

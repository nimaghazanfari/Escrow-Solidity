const EscrowGate = artifacts.require("EscrowGate");
const chaiModule = require('chai');
const { chaiEthers } = require('chai-ethers');
const truffleAssert = require('truffle-assertions');

chaiModule.use(chaiEthers);
const { expect } = chaiModule;

contract('EscrowGate', async (accounts) => {

    let instance;
    let agent;
    let alice;
    let bob;

    before(async () => {
        [agent, alice, bob] = accounts;
        instance = await EscrowGate.deployed();
    });

    describe('Init Phase', () => {

        it('should init escrow', async () => {
            
        })

    })

})
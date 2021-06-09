const Escrow = artifacts.require("Escrow");
const chaiModule = require('chai');
const { chaiEthers } = require('chai-ethers');
const truffleAssert = require('truffle-assertions');

chaiModule.use(chaiEthers);
const { expect } = chaiModule;

contract('Escrow', async (accounts) => {

    let instance;
    let agent;
    let alice;
    let bob;

    before(async () => {
        [agent, alice, bob] = accounts;
        instance = await Escrow.deployed();
    });

    describe('Init Phase', () => {

        it('should init escrow', async () => {

            await instance.initEscrow(alice, 50000, 5);

        })

    })

})
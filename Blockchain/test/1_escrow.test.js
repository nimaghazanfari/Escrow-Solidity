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
    let jack;

    before(async () => {
        [agent, alice, bob, jack] = accounts;
        instance = await Escrow.deployed();
    });

    describe('Init Phase', () => {

        it('should init escrow', async () => {

            //initiate new item to be sold
            await instance.initNewEscrowItem(alice, web3.utils.toWei('100', 'finney'), 5);            
            const exists = await instance.contains(0);
            expect(exists).to.be.true;

        });

    });

    describe('Buying', () => {

        it('should revert for non-existant items', async () => {

            await expect(instance.buyItem(2)).to.be.revertedWith('!exists');

        });

        it('should revert when payment < totalPrice', async () => {

            await expect(instance.buyItem(0, {
                from: bob, value: 2000
            })).to.be.revertedWith('!totalPrice');

        });

        it('should buy an item', async () => {

            const paymentAmount = web3.utils.toWei('100', 'finney');

            //buy item[0]
            await instance.buyItem(0, { from: bob, value: paymentAmount });
            const item = await instance.escrows(0);
            expect(item.buyer).to.equal(bob);

            //check total balance after payment
            const totalBalance = await web3.eth.getBalance(instance.address);
            expect(totalBalance).to.equal(`${paymentAmount}`);

        });

        it('should revert for SOLD items', async () => {

            const paymentAmount = web3.utils.toWei('1', 'ether');

            //buy item[0] again
            await expect(instance.buyItem(0, {
                from: bob, value: paymentAmount
            })).to.be.revertedWith('!for-sale');

        });
    });

    describe('Withdrawal', () => {


        it('should revert if RBAC reverts', async () => {

            //alice is the seller
            await expect(instance.withdraw(0, { from: bob })).to.be.revertedWith('!seller');

        });

        it('should revert for non-existant items', async () => {

            await expect(instance.withdraw(2, { from: alice })).to.be.revertedWith('!exists');

        });

        it('should revert for not SOLD items', async () => {

            //adding new Item
            await instance.initNewEscrowItem(alice, 80000, 10);
            await expect(instance.withdraw(1, { from: alice })).to.be.revertedWith('!sold');

        });

        it('should revert for not Own Seller', async () => {

            //jack is the new escrow seller
            await instance.initNewEscrowItem(jack, 60000, 10);
            await instance.buyItem(2, { from: bob, value: 60000 });
            await expect(instance.withdraw(2, { from: alice })).to.be.revertedWith('!ownseller');

        });

        it('should withdraw for seller', async () => {

            const balanceBefore = await web3.eth.getBalance(alice);
            await instance.withdraw(0, { from: alice });
            const balanceAfter = await web3.eth.getBalance(alice);

            expect(balanceAfter).not.to.equal(balanceBefore);
        });

        it('should revert for WITHDRAWN items', async () => {

            //item[0] is already withdrawn
            await expect(instance.withdraw(0, { from: alice })).to.be.revertedWith('withdrawn');

        });
    });

});
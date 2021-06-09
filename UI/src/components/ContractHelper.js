import axios from 'axios';
import Web3 from 'web3';
import TruffleContract from 'truffle-contract';

const InitWeb3 = async () => {
    let MainProvider = {};
    // Modern dapp browsers...
    if (window.ethereum) {
        MainProvider.web3Provider = window.ethereum;
        try {
            // Request account access
            await window.ethereum.enable();
        } catch (error) {
            // User denied account access...
            console.error("User denied account access")
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        MainProvider.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
        MainProvider.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }

    window.web3 = new Web3(MainProvider.web3Provider);

    return MainProvider;
};

const GetContract = async (MainProvider, name) => {

    let artifact = await axios.get(`http://localhost:3300/${name}`);

    let contract = TruffleContract(artifact.data);
    contract.setProvider(MainProvider.web3Provider)

    return contract;
}

const ContractHelper = async () => {

    let MainProvider = await InitWeb3();

    return {

        Accounts: await window.web3.eth.getAccounts(),   
        Contracts: {
            Escrow: await GetContract(MainProvider, 'Escrow')
        }
        
    }
}


export default ContractHelper;
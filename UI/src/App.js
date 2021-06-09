import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import ContractHelper from './components/ContractHelper';

const App = () => {


  useEffect(() => {
    const initContract = async () => {
      const contracts = await ContractHelper();
      console.log(contracts.Accounts)
      const instance = await contracts.Contracts.Escrow.deployed();
      const owner = await instance.owner()
      console.log(owner)
    }

    initContract();
  })


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );

}

export default App;

import React, { useEffect, useState } from 'react';
import ContractHelper from './components/ContractHelper';
import AvailAccounts from './components/AvailAccounts';


const initContract = async () => {

  const instance = await (await ContractHelper.init()).Escrow.deployed();
  
  console.log(instance.address)

}

initContract();
	
const App = () => {
  const [loading, setLoading] = useState(true);
  const [escrows, setEscrows] = useState([]);

  const availAccountSelected = account => {
    console.log(account);
  }

  return (
    <div className="container">

      <div className="row m-5">
        <AvailAccounts accountSelected={availAccountSelected} />
      </div>

    </div>
  );

}

export default App;

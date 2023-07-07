const { ethers } = require('hardhat');
const { solidity } = require('ethereum-waffle');
const { Tenderly, Network, Web3Address } = require('@tenderly/sdk');
const { Interface } = require('ethers/lib/utils');
const StakerJson = require('../artifacts/contracts/Staker.sol/Staker.json');
const StakerAbi = new Interface(StakerJson.abi);
const { dotenv } = require('dotenv');
const { readFileSync } = require ( 'fs');

const wallet = "0x0000000000000000000000000000000000000000"
const anotherWallet = "0x0AA5141FB867B616b9584492698330D3DbCE1180"
const contract = "0x393007bc739d48038adef76381c9b3691105073d"

// Tenderly Config
const tenderly = new Tenderly({
  accountName: "tlrichar",
  projectName: "project",
  accessKey: "XZ9Hmq7qxUxMO-uiFzBXR2WY7ycAUpnG",
  network: Network.GOERLI, // Replace with the appropriate network
});

const transactionParameters = {
  from: wallet, // the sender address
  to: contract, // the contract address
  input: StakerAbi.encodeFunctionData('stake', []), //params would go here
  value: "0",
  gas: 20000000,
  gas_price: '0',
};

const simulationDetails = {
  transaction: transactionParameters,
  blockNumber: 9294858,
  override: {
    [contract]: {
      state: {
        [`_balances[${wallet}]`]: '1234567891',
        ['openForWithdraw']: 'true',
        ['deadline']:   '0x9999999999999999999999999999999999999999999999999999999999999999',
        ['startStake']: '0x0',
        ['threshold']: '0x0'
      },
    },
  },
};

(async () => {

  
  try {
    
    const addedWallet = await tenderly.wallets.add(anotherWallet, {
      displayName: "My Wallet",
    }); 
  
    console.log("Added wallet:", addedWallet);
    
  } catch(error) {
    console.error("Error adding wallet:", error);
  }
  

  try {

    const simulationResult = await tenderly.simulator.simulateTransaction(simulationDetails);
    console.log("Simulation result:", simulationResult);
  } catch (error) {
    console.error("Error running simulation:", error);
  }


  try {


    const simulationsResult = await tenderly.simulator.simulateBundle({
      transactions: [
         {
          from: wallet, // the sender address
          to: contract, // the contract address
          input: StakerAbi.encodeFunctionData('stake', []),
          value: "0",
          gas: 20000000,
          gas_price: '0',
        },
        {
          from: wallet, // the sender address
          to: contract, // the contract address
          input: StakerAbi.encodeFunctionData('withdraw', []),
          value: "0",
          gas: 20000000,
          gas_price: '0',
        },
        {
          from: wallet, // the sender address
          to: contract, // the contract address
          input: StakerAbi.encodeFunctionData('execute', []),
          value: "0",
          gas: 20000000,
          gas_price: '0',
        }, 
        {
          from: wallet, // the sender address
          to: contract, // the contract address
          input: StakerAbi.encodeFunctionData('timeLeft', []),
          value: "0",
          gas: 20000000,
          gas_price: '0',
        },
       
      ],
      blockNumber: 9294858,
      override: {
        [contract]: {
          state: {
            [`_balances[${'0x0000000000000000000000000000000000000000'}]`]: '1234567891',
            ['openForWithdraw']: 'true',
            ['deadline']:   '0x9999999999999999999999999999999999999999999999999999999999999999',
            ['startStake']: '0x0',
            ['threshold']: '0x0'
          },
        },
      },
    });

console.log("stake output 0:", simulationsResult[0].trace[0].output);
console.log("withdraw output 0:", simulationsResult[1].trace[0].output);
console.log("withdraw output 1:", simulationsResult[1].trace[1].output);
console.log("execute output 0:", simulationsResult[2].trace[0].output);
console.log("execute output 1:", simulationsResult[2].trace[1].output);
console.log("time left output 0:", simulationsResult[3].trace[0].output);

    console.log("Bundled Simulation result:", simulationsResult);
  } catch (error) {
    console.error("Error running bundled simulation:", error);
  }

})();




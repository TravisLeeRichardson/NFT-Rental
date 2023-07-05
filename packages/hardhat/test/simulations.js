const { ethers } = require('hardhat');
const { solidity } = require('ethereum-waffle');
const { Tenderly, Network } = require('@tenderly/sdk');
const { Interface } = require('ethers/lib/utils');
const StakerJson = require('../artifacts/contracts/Staker.sol/Staker.json');
const StakerAbi = new Interface(StakerJson.abi);
const { dotenv } = require('dotenv');

// Tenderly Config
const tenderly = new Tenderly({
    accountName: "tlrichar",
    projectName: "project",
    accessKey: "XZ9Hmq7qxUxMO-uiFzBXR2WY7ycAUpnG",
    network: Network.GOERLI, // Replace with the appropriate network
});

const transactionParameters = {
    from: "0x0000000000000000000000000000000000000000", // the sender address
    to: "0x393007bc739d48038adef76381c9b3691105073d", // the contract address
    //input: StakerAbi.encodeFunctionData('stake', []),
    input: "0x1300a6d1", // the encoded data for getting contract deadline
    value: "0",
    gas: 20000000,
    gas_price: '0',
};

const simulationDetails = {
    transaction: transactionParameters,
    blockNumber: 9294858,
    override: {}, // Optional state override
};

(async () => {
    try {

    const simulationResult = await tenderly.simulator.simulateTransaction(simulationDetails);
    console.log("Simulation result:", simulationResult);
  } catch (error) {
    console.error("Error running simulation:", error);
  }
})();




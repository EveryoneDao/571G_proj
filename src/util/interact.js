require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
//export const helloWorldContract;

// const contractABI = require("../contract-abi.json");
// const contractAddress = "0x752b5fDB8012c26940B00ec19Dac749Bf66F10db";
// export const pollContract = new web3.eth.Contract(
//     contractABI,
//     contractAddress
// );
/* 
This function handles the logic of loading current events
stored in the smart contract. It will make a read call 
to the poll smart contract using the Alchemy Web3 API
*/
export const loadCurrentEvent = async () => { 
  
};

export const loadAllEvents = async () => { 
  
};

export const connectWallet = async () => {
  
};

export const getCurrentWalletConnected = async () => {
  
};

// export const updateEventList = async (address, message) => {
  
// };

// export const createNewEvent = async (address, message) => {
  
// };
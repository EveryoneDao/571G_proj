// interact.js

const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// For Hardhat 
const contract = require("../artifacts/contracts/Poll.sol/Poll.json");

// Provider
const alchemyProvider = new ethers.providers.AlchemyProvider(network="ropsten", API_KEY);

// Signer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// Contract
const pollContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
    const numberOfParticipant = await pollContract.numberOfParticipant();
    console.log("The numberOfParticipant is: " + numberOfParticipant);

    console.log("A new participant log in ...");
    const tx = await pollContract.registerParticipant("Monica");
    await tx.wait();

    const newNumberOfParticipant = await pollContract.numberOfParticipant();
    console.log("The new numberOfParticipant is: " + newNumberOfParticipant);
  }
  main();
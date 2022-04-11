// interact.js

// const API_KEY = process.env.API_KEY;
// const PRIVATE_KEY = process.env.PRIVATE_KEY;
// const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const API_KEY = "1Gi14w2BjldpByYRx3-Q0oZRv4fEaoOL"
const PRIVATE_KEY = "db7ee4ef8472a54629aeadbcf74237919347f0a58ec030fb090049b42e23d779"
const CONTRACT_ADDRESS = "0xDfeB0F818b2a26Cd0F5337746C9ac9D97e1D26B3"

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
    const tx = await pollContract.registerParticipant("Monica", {value: "100000000000000000"});
    await tx.wait();

    const newNumberOfParticipant = await pollContract.numberOfParticipant();
    console.log("The new numberOfParticipant is: " + newNumberOfParticipant);
  }
  main();
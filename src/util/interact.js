require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
// console.log("sss")
// console.log(alchemyKey)
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require("../contract-abi.json");
const contractAddress = "0xBE6005cBedb60D3386ba69f48C6b2b4413Bd8471";
export const pollContract = new web3.eth.Contract(
    contractABI,
    contractAddress
);


/* 
This function handles the logic of loading current events
stored in the smart contract. It will make a read call 
to the poll smart contract using the Alchemy Web3 API
*/
// export const loadCurrentEvent = async () => { 
//     const a = await pollContract.function.fakeTest(3).encodeABI();
//     console.log(a);
//     return a;
// };

// export const loadAllEvents = async () => {
//     const nextPossibleEventID = await pollContract.methods.numberOfParticipant().call();
//     console.log(nextPossibleEventID);
    
//     return nextPossibleEventID;
// };

export const loadAllEvents = async () => {
    const nextPossibleEventID = await pollContract.methods.nextPollId().call();
    console.log(nextPossibleEventID);
    let eventArr = [];
    if(nextPossibleEventID > 1){
        for(let i = 1; i < nextPossibleEventID; i++) {
            const curEvent = await pollContract.methods.polls(i).call();
            let curEvent_description = event_i.description;
            let curEvent_name = event_i.name;
            let curEvent_totalVote = event_i.totalVote;
            let curEvent_optionDesc = event_i.optionDesc;
            const event_i = {
                id: i, 
                name: curEvent_name, 
                description: curEvent_description, 
                participants: curEvent_totalVote, 
                options: curEvent_optionDesc
            }
            eventArr.push(event_i);
        }
    }else{
        const fakeEvent1 = {
            id: -1, 
            name: "fakePoll1", 
            description: "just a fake poll I am tired", 
            participants: 1000, 
            options: ["A", "B", "C", "D"]
        };
        const fakeEvent2 = {
            id: -2, 
            name: "fakePoll2", 
            description: "just a fake poll 2 I am tired", 
            participants: 2000, 
            options: ["A", "B", "C"]
        };
        eventArr.push(fakeEvent1);
        eventArr.push(fakeEvent2);
    }
    return eventArr;
};

// export const loadSingleEvent = async(eventID) => {
//     const a = await pollContract.methods.fakeTest(eventID).call();
//     console.log(a);
//     return a;
// }

// export const connectWallet = async () => {
  
// };

// export const getCurrentWalletConnected = async () => {
  
// };

// // export const updateEventList = async (address, message) => {
  
// // };

// // export const createNewEvent = async (address, message) => {
  
// // };
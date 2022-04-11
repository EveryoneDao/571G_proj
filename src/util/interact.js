require('dotenv').config();
//const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const alchemyKey = "https://eth-ropsten.alchemyapi.io/v2/1Gi14w2BjldpByYRx3-Q0oZRv4fEaoOL";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require("../contract-abi.json");
//const contractAddress = process.env.CONTRACT_ADDRESS; // TODO
const contractAddress = "0xc638D706790b8EEC398a84faEAc96de8A0e9152c";
console.log(contractAddress);

export const pollContract = new web3.eth.Contract(
    contractABI,
    contractAddress
);

export const loadAllEvents = async (address) => {
    // next possible id
    const nextPossibleEventID = await pollContract.methods.viewPolls().call({ from: address });
    let eventArr = [];
    // 1 -> next possible - 1
    if (nextPossibleEventID > 1) {
        for (let i = 1; i < nextPossibleEventID; i++) {
            // find mapping
            const curEvent = await pollContract.methods.viewPoll(i).call({ from: address });
            const event_i = {
                id: i,
                name: curEvent.name,
                description: curEvent.description,
                participants: curEvent.totalVote,
                creator: curEvent.organizer,
                isBlind: curEvent.blind, 
                isAboutDao: curEvent.aboutDAO
            }
            eventArr.push(event_i);
        }
    } else {
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


export const viewAnEvent = async (address, pollID) => {

    //sign the transaction
    try {
        const curEvent = await pollContract.methods.viewPoll(pollID).call({ from: address });
        return curEvent;
    } catch (error) {
        return "😥 " + error.message + " rejected";
    }
}

export const checkPrevVote = async (address, pollID) => {

    //sign the transaction
    try {
        const prevChoice = await pollContract.methods.checkVotedChoice(pollID).call({ from: address });
        return prevChoice;
    } catch (error) {
        return "😥 " + error.message + " rejected";
    }
}

export const selectAnOption = async (address, pollID, selectOption) => {
    //input error handling
    if (!window.ethereum || address === null) {
        return {
            status:
                "💡 Connect your Metamask wallet to update the message on the blockchain.",
        };
    }

    if (selectOption === undefined) {
        return {
            status: "❌ must make a valid selection.",
        };
    }
    //set up transaction parameters
    // const transactionParameters = {
    //     to: contractAddress, // Required except during contract publications.
    //     from: address, // must match user's active address.
    //     data: pollContract.methods.vote(pollID, selectOption).encodeABI(),
    // };

    //sign the transaction
    try {
        const voteInfo = await pollContract.methods.vote(pollID, selectOption).call({ from: address });
        return voteInfo;
        // const txHash = await window.ethereum.request({
        //     method: "eth_sendTransaction",
        //     params: [transactionParameters],
        // });
        // return {
        //     status: (
        //         <span>
        //             ✅{" "}
        //             <a target="_blank" href={`https://ropsten.etherscan.io/tx/${txHash}`}>
        //                 View the status of your transaction on Etherscan!
        //             </a>
        //             <br />
        //             ℹ️ Once the transaction is verified by the network, you have successfully voted.
        //             Thank you for your participant.
        //         </span>
        //     ),
        // };
    } catch (error) {
        return "😥 " + error.message + " rejected";
    }
}

export const viewResult = async (address, pollID) => {
    //input error handling

    //set up transaction parameters
    // const transactionParameters = {
    //     to: contractAddress, // Required except during contract publications.
    //     from: address, // must match user's active address.
    //     data: pollContract.methods.viewResult(pollID).encodeABI(),
    // };

    //sign the transaction
    try {

        const info = await pollContract.methods.viewResult(pollID).call({ from: address });
        // const txHash = await window.ethereum.request({
        //     method: "eth_sendTransaction",
        //     params: [transactionParameters],
        // });
        // return {
        //     status: (
        //         <span>
        //             ✅{" "}
        //             <a target="_blank" href={`https://ropsten.etherscan.io/tx/${txHash}`}>
        //                 View the status of your transaction on Etherscan!
        //             </a>
        //             <br />
        //             ℹ️ Once the transaction is verified by the network, you can review the result of the poll.
        //         </span>
        //     ),
        // };
        return info;
    } catch (error) {
        return error.message + " rejected";
    }
}

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const obj = {
                status: "👆🏽 input the transfer to address in the text-field above.",
                address: addressArray[0],
            };
            return obj;
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your
                            browser.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};


export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            });
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "👆🏽 input the transfer to address in the text-field above.",
                };
            } else {
                return {
                    address: "",
                    status: "Access Rejected, 🦊 Please connect your meta mask wallet in the welcome page.",
                };
            }
        } catch (err) {
            return "😥 " + error.message + " rejected";
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your
                            browser.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};

export const createEvent = async (address, pollName, pollDescription, duration, isBlind, isAboutDao, options, optionsDescription) => {
    console.log(address);
    //input error handling
    // if (!window.ethereum || address === null) {
    //     return {
    //         status:
    //             "💡 Connect your Metamask wallet to update the message on the blockchain.",
    //     };
    // }
    // //set up transaction parameters
    // const transactionParameters = {
    //     to: contractAddress, // Required except during contract publications.
    //     from: address, // must match user's active address.
    //     data: pollContract.methods.createPoll(pollName, pollDescription, duration, isBlind, isAboutDao, options, optionsDescription).encodeABI(),
    // };
    //sign the transaction
    try {
        const info = await pollContract.methods.createPoll(pollName, pollDescription, duration, isBlind, isAboutDao, options, optionsDescription).call({ from: address });
        return info;
        // const txHash = await window.ethereum.request({
        //     method: "eth_sendTransaction",
        //     params: [transactionParameters],
        // });
        // // console.log("transaction happened");
        // const receipt = txHash.wait();
        // return receipt;
    } catch (error) {
        return "😥 " + error.message + " rejected";
    }
};


export const createParticipate = async (address, userName) => {
    //sign the transaction
    try {
        const info = await pollContract.methods.registerParticipant(userName).call({ from: address });

        return info;
    } catch (error) {
        return  "Might use the wrong testnet to login, use Ropsten testnet plz; " + error.message + " rejected";
    }
};



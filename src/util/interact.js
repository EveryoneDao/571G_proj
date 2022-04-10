require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require("../contract-abi.json");
const contractAddress = "0xf9D418a40F1082c50B629fc692c56d00Ec687d9d";
export const pollContract = new web3.eth.Contract(
    contractABI,
    contractAddress
);

export const loadAllEvents = async () => {
    const nextPossibleEventID = await pollContract.methods.nextPollId().call();
    console.log("loadAllEvents");
    let eventArr = [];
    if (nextPossibleEventID > 1) {
        for (let i = 1; i < nextPossibleEventID; i++) {
            const curEvent = await pollContract.methods.polls(i).call();
            console.log(curEvent);
            let curEvent_description = curEvent.description;
            let curEvent_name = curEvent.name;
            let curEvent_totalVote = curEvent.totalVote;
            // TODO: options are not loaded correctly !!!! More investigation needed here
            let curEvent_optionDesc = curEvent.choseFrom;
            const event_i = {
                id: i,
                name: curEvent_name,
                description: curEvent_description,
                participants: curEvent_totalVote,
                selections: ["A", "B", "C"]
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
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: address, // must match user's active address.
        data: pollContract.methods.vote(pollID, selectOption).encodeABI(),
    };

    //sign the transaction
    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });
        return {
            status: (
                <span>
                    ✅{" "}
                    <a target="_blank" href={`https://ropsten.etherscan.io/tx/${txHash}`}>
                        View the status of your transaction on Etherscan!
                    </a>
                    <br />
                    ℹ️ Once the transaction is verified by the network, you have successfully voted.
                    Thank you for your participant.
                </span>
            ),
        };
    } catch (error) {
        return {
            status: "😥 " + error.message,
        };
    }
}

export const viewAnEvent = async (address, pollID) => {
    //input error handling
    if (!window.ethereum || address === null) {
        return {
            status:
                "💡 Connect your Metamask wallet to update the message on the blockchain.",
        };
    }

    //set up transaction parameters
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: address, // must match user's active address.
        data: pollContract.methods.viewPoll(pollID).encodeABI(),
    };

    //sign the transaction
    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });
        return {
            status: (
                <span>
                    ✅{" "}
                    <a target="_blank" href={`https://ropsten.etherscan.io/tx/${txHash}`}>
                        View the status of your transaction on Etherscan!
                    </a>
                    <br />
                    ℹ️ Once the transaction is verified by the network, you can review the result of the poll.
                </span>
            ),
        };
    } catch (error) {
        return {
            status: "😥 " + error.message,
        };
    }
}

export const viewResult = async (address, pollID) => {
    //input error handling
    if (!window.ethereum || address === null) {
        return {
            status:
                "💡 Connect your Metamask wallet to update the message on the blockchain.",
        };
    }

    //set up transaction parameters
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: address, // must match user's active address.
        data: pollContract.methods.viewResult(pollID).encodeABI(),
    };

    //sign the transaction
    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });
        return {
            status: (
                <span>
                    ✅{" "}
                    <a target="_blank" href={`https://ropsten.etherscan.io/tx/${txHash}`}>
                        View the status of your transaction on Etherscan!
                    </a>
                    <br />
                    ℹ️ Once the transaction is verified by the network, you can review the result of the poll.
                </span>
            ),
        };
    } catch (error) {
        return {
            status: "😥 " + error.message,
        };
    }
}

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const obj = {
                status: "👆🏽 input the transfer to addresst in the text-field above.",
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

export const loadTokenName = async () => {};

export const loadTokenAccountBalance = async () => { };

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            });
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "👆🏽 input the transfer to addresst in the text-field above.",
                };
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to Metamask using the top right button.",
                };
            }
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

export const createFakeEvent = async (address, pollName, pollDescription, duration, isBlind, isAboutDao, options, optionsDescription) => {
    //input error handling
    if (!window.ethereum || address === null) {
        return {
            status:
                "💡 Connect your Metamask wallet to update the message on the blockchain.",
        };
    }
    //set up transaction parameters
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: address, // must match user's active address.
        data: pollContract.methods.createPoll(pollName, pollDescription, duration, isBlind, isAboutDao, options, optionsDescription).encodeABI(),
    };
    //sign the transaction
    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });
        console.log("transaction happened");
        return {
            status: (
                <span>
                    ✅{" "}
                    <a target="_blank" href={`https://ropsten.etherscan.io/tx/${txHash}`}>
                        View the status of your transaction on Etherscan!
                    </a>
                    <br />
                    ℹ️ Once the transaction is verified by the network, you have successfully created.
                    Thank you for your participant.
                </span>
            ),
        };
    } catch (error) {
        return {
            status: "😥 " + error.message,
        };
    }
};


export const createParticipate = async (address, userName) => {
    //input error handling
    if (!window.ethereum || address === null) {
        return {
            status:
                "💡 Connect your Metamask wallet to update the message on the blockchain.",
        };
    }

    //set up transaction parameters
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: address, // must match user's active address.
        data: pollContract.methods.registerParticipant(userName).encodeABI(),
    };
    //sign the transaction
    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });
        console.log("transaction successed");
        return ; 
    } catch (error) {
        return  "Might use the wrong testnet to login, use Ropsten testnet plz; " + error.message;
    }
};


export const filterPolls = async (address, isByMe, isAboutDao, isBlind) => {
    //input error handling
    if (!window.ethereum || address === null) {
        return {
            status:
                "💡 Connect your Metamask wallet to update the message on the blockchain.",
        };
    }

    //set up transaction parameters
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: address, // must match user's active address.
        data: pollContract.methods.viewAllPolls(isByMe, isBlind, isAboutDao).encodeABI(),
    };
    //sign the transaction
    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });
        console.log("transaction happened");
        return {
            status: (
                <span>
                    ✅{" "}
                    <a target="_blank" href={`https://ropsten.etherscan.io/tx/${txHash}`}>
                        View the status of your transaction on Etherscan!
                    </a>
                    <br />
                    ℹ️ Once the transaction is verified by the network, you have successfully created.
                    Thank you for your participant.
                </span>
            ),
        };
    } catch (error) {
        return {
            status: "😥 " + error.message,
        };
    }
};

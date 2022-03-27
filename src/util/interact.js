require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require("../contract-abi.json");
const contractAddress = "0xBE6005cBedb60D3386ba69f48C6b2b4413Bd8471";
export const pollContract = new web3.eth.Contract(
    contractABI,
    contractAddress
);

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

export const selectAnOption = async(address, pollID, selectOption) => {
//input error handling
  if (!window.ethereum || address === null) {
    return {
      status:
        "💡 Connect your Metamask wallet to update the message on the blockchain.",
    };
  }

  if (option === undefined) {
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

export const viewAnEvent= async(address, pollID) => {
    //input error handling
      if (!window.ethereum || address === null) {
        return {
          status:
            "💡 Connect your Metamask wallet to update the message on the blockchain.",
        };
      }
    
      if (option === undefined) {
        return {
          status: "❌",
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

export const viewResult = async(address, pollID) => {
    //input error handling
      if (!window.ethereum || address === null) {
        return {
          status:
            "💡 Connect your Metamask wallet to update the message on the blockchain.",
        };
      }
    
      if (option === undefined) {
        return {
          status: "❌",
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

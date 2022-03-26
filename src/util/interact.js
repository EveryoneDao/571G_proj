//export const helloWorldContract;
// require('dotenv').config();
// const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
// const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
// const web3 = createAlchemyWeb3(alchemyKey);

// const contractABI = require("../contract-abi.json");
// const contractAddress = "0x752b5fDB8012c26940B00ec19Dac749Bf66F10db";
// export const pollContract = new web3.eth.Contract(
//     contractABI,
//     contractAddress
// );

export const loadCurrentMessage = async () => { 
    
};

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

export const loadTokenAccountBalance = async () => {};

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


export const updateMessage = async (address, message) => {
  
};
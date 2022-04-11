/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

// const { API_URL, PRIVATE_KEY } = process.env;
// const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const API_URL = "https://eth-ropsten.alchemyapi.io/v2/1Gi14w2BjldpByYRx3-Q0oZRv4fEaoOL";
const PRIVATE_KEY = "db7ee4ef8472a54629aeadbcf74237919347f0a58ec030fb090049b42e23d779";
const ETHERSCAN_API_KEY = "TZCIGV7JW28SKBGGXCP7GMWX3ACSR7W6KM"; 
// console.log(ETHERSCAN_API_KEY)
module.exports = {
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100
      }
    }
  },
  defaultNetwork: "ropsten",
  networks: {
    hardhat: {},
    ropsten: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY
  }
};

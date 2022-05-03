```shell
# 1. Install all package 
npm i

# 2. Compile hardhat.config.js 
npx hardhat compile

# Test the contract [optional]
npx hardhat test

# 3. Deploy contract
npx hardhat run scripts/deploy.js --network ropsten

# Then get contract address and put into .env

# 4. test basic functions in deployed contract 
npx hardhat run scripts/interact.js --network ropsten

# 5. Verify contract on etherscan 
npx hardhat verify --network ropsten CONTRACT_ADDRESS

# Then copy contract-abi from etherscan into src/contract-abi.json and change contractAddress in src/utils/interact.js

# 6. start the website on your local machine 
npm start 
```
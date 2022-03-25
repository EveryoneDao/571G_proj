async function main() {
    const Poll = await ethers.getContractFactory("Poll");
 
    // Start deployment, returning a promise that resolves to a contract object
    const Poll_Contract = await Poll.deploy();   
    console.log("Contract deployed to address:", Poll_Contract.address);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });
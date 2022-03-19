const {expect, assert} = require("chai");
const BigNumber = require('big-number');
const { ethers } = require("hardhat");

describe("Poll", function() {
    let Poll;
    let deployedPoll;
    let pollCreator;
    let participant1;
    let participant2;

    beforeEach(async function() {
        Poll = await ethers.getContractFactory("Poll");
        deployedPoll = await Poll.deploy();
        [pollCreator, participant1, participant2] = await ethers.getSigners();
    });

    describe("Participant Registration", function() {
        it("1. Unsuccessful registration if name is empty.", async function() {
            await expect(deployedPoll.connect(participant1).registerParticipant("",{value: "100000000000000000"})).to.be.reverted;
        });
    
        it("2. Unsuccessful registration if registration price is not paid in the exact amount.", async function() {
            //1e16
            await expect(deployedPoll.connect(participant1).registerParticipant("Monica", {value: "10000000000000000"})).to.be.reverted;
            //1e18
            await expect(deployedPoll.connect(participant1).registerParticipant("Monica", {value: "1000000000000000000"})).to.be.reverted;
        });
    
        it("3. Successful registration if a first-time participate provides non-empty name and enough registration fee.", async function() {
            //1e17
            await deployedPoll.connect(participant1).registerParticipant("Monica", {value: "100000000000000000"});
            expect(await deployedPoll.numberOfParticipant()).to.equal(1);
            expect(await deployedPoll.participantName("Monica")).to.equal(await participant1.address);
    
        });
    
        it("4. Unsuccessful registration if already registered.", async function() {
            //1e17
            await deployedPoll.connect(participant1).registerParticipant("Monica", {value: "100000000000000000"});
            await expect(deployedPoll.connect(participant1).registerParticipant("Monica", {value: "100000000000000000"})).to.be.reverted;
            expect(await deployedPoll.numberOfParticipant()).to.equal(1);
        });

        it("5. Non-registered participant doesn't exist in poll.", async function() {
            await expect(deployedPoll.connect(participant1).lookUpParticipant("Rachel")).to.be.reverted;
        });
    });
});

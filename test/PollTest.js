const {expect, assert} = require("chai");
const BigNumber = require('big-number');
const { ethers } = require("hardhat");
const { poll } = require("ethers/lib/utils");

describe("Poll", function() {
    let pollContract;
    let deployedPoll;
    let pollCreator;
    let participant1;
    let participant2;
    let availableSelections;


    beforeEach(async function() {
        pollContract = await ethers.getContractFactory("Poll");
        deployedPoll = await pollContract.deploy();
        [pollCreator, participant1, participant2] = await ethers.getSigners();
        availableSelections = [1, 2];

    });

    describe("Participant Registration", function() {
        it("1. Unsuccessful registration if name is empty.", async function() {
            await expect(deployedPoll.connect(participant1).registerParticipant("",{value: "100000000000000000"})).to.be.revertedWith(
                "Participant name is empty");
        });
    
        it("2. Unsuccessful registration if registration price is not paid in the exact amount.", async function() {
            //1e16
            await expect(deployedPoll.connect(participant1).registerParticipant("Monica", {value: "10000000000000000"})).to.be.revertedWith(
                "Asset not enough to register");
            //1e18
            await expect(deployedPoll.connect(participant1).registerParticipant("Monica", {value: "1000000000000000000"})).to.be.revertedWith(
                "Amount sent not equal to the registration price");
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

            await expect(deployedPoll.connect(participant1).registerParticipant("Monica", {value: "100000000000000000"})).to.be.revertedWith(
                "Participant already registered");

            expect(await deployedPoll.numberOfParticipant()).to.equal(1);
        });

        it("5. Non-registered participant doesn't exist in poll.", async function() {
            await expect(deployedPoll.connect(participant1).lookUpParticipant("Rachel")).to.be.revertedWith(
                "Can't find the name in all participants");
        });
    });

    describe("New Poll Creation", function() {
        it("1. Unsuccessful creation if poll name or discription is empty.", async function() {
            await expect(deployedPoll.connect(pollCreator).createPoll("", "Test poll", 10, true, true, availableSelections)).to.be.revertedWith(
                "Poll name is empty");

            await expect(deployedPoll.connect(pollCreator).createPoll("Poll", "", 10, true, true, availableSelections)).to.be.revertedWith(
                "Poll description is empty");
        });

        it("2. Unsuccessful creation if duration is not larger than 0.", async function() {
            await expect(deployedPoll.connect(pollCreator).createPoll("Poll", "Test poll", 0, true, true, availableSelections)).to.be.revertedWith(
                "Poll duration is empty");
        });       

        it("3. Unsuccessful creation if available choices are not provided.", async function() {
            await expect(deployedPoll.connect(pollCreator).createPoll("Poll", "Test poll", 10, true, true, [])).to.be.revertedWith(
                "Choice to select from not given");
        }); 

        it("4. Unsuccessful creation if available choices are outside of Selection enum.", async function() {
            // https://github.com/NomicFoundation/hardhat/issues/1227
            // Other exception was thrown: Error: Transaction reverted: function was called with incorrect parameters
            // dispite having a require statement that throws "Input choice not valid"
            await expect(deployedPoll.connect(pollCreator).createPoll("Poll", "Test poll", 10, true, true, [7])).to.be.reverted;
        });         

        it("5. Unsuccessful creation if poll creator is not registered.", async function() {
            await expect(deployedPoll.connect(pollCreator).createPoll("Poll", "Test poll", 10, true, true, availableSelections)).to.be.revertedWith(
                "Participant not registered in the system");
        });

        it("6. Successful creation if all requirements are met.", async function() {
            await deployedPoll.connect(pollCreator).registerParticipant("Ross", {value: "100000000000000000"});
            await deployedPoll.connect(pollCreator).createPoll("Poll", "Test poll", 10, true, true, availableSelections);

            // A single poll has been created
            let allPolls = await deployedPoll.connect(pollCreator).viewAllPolls();
            expect(allPolls.length).to.equal(1);

            let singlePoll = allPolls[0];
            
            // Test created poll attributes
            expect (singlePoll.state).to.equal(0);
            expect(singlePoll.pollId).to.equal(1);
            expect(singlePoll.name).to.equal("Poll");
            expect(singlePoll.description).to.equal("Test poll");
            expect(singlePoll.votingDuration).to.equal(10);
            expect(singlePoll.blind).to.equal(true);
            expect(singlePoll.aboutDAO).to.equal(true);
            expect(singlePoll.choseFrom).to.eql(availableSelections);
            expect(singlePoll.blind).to.equal(true);
            expect(singlePoll.totalVote).to.equal(0);
            expect(singlePoll.voted).to.eql([]);
            expect(singlePoll.votedChoices).to.eql([]);
            expect(singlePoll.result).to.equal(0);
        });
    });

    describe("Poll Result View", function() {
        beforeEach(async function() {
            await deployedPoll.connect(pollCreator).registerParticipant("Ross", {value: "100000000000000000"});
            await deployedPoll.connect(pollCreator).createPoll("Poll", "Test poll", 10, true, true, availableSelections);
            await deployedPoll.connect(participant1).registerParticipant("Monica", {value: "100000000000000000"});
        });

    });
});

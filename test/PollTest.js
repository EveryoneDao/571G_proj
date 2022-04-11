const {expect, assert} = require("chai");
const BigNumber = require('big-number');
const { ethers, network } = require("hardhat");


describe("Poll", function() {
    let pollContract;
    let deployedPoll;
    let organizer1;
    let organizer2;
    let participant1;
    let participant2;
    let participant3;
    let availableSelections;
    let selectionsDescriptions;
    const pollDuration = 10;

    beforeEach(async function() {
        pollContract = await ethers.getContractFactory("Poll");
        deployedPoll = await pollContract.deploy();
        [organizer1, organizer2, participant1, participant2, participant3] = await ethers.getSigners();
        availableSelections = [1, 2];
        selectionsDescriptions = ["first choice", "second choice"];
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
            await expect(deployedPoll.connect(participant1).registerParticipant("Monica", {value: "100000000000000000"})).to.emit(
                deployedPoll, 'participantRegistered').withArgs("Monica");

            expect(await deployedPoll.numberOfParticipant()).to.equal(1);

            expect(await deployedPoll.participantName("Monica")).to.equal(await participant1.address);

            const loggedParticipant = await deployedPoll.connect(participant1).participants(await participant1.address);

            expect(loggedParticipant.participantAddr).to.equal(await participant1.address);
            expect(loggedParticipant.voterName).to.equal("Monica");
        });
    
        it("4. Successful payment of registration fee after registeration", async function() {
            const balanceBefore = BigNumber(await participant1.getBalance() + "");

            const tx = await deployedPoll.connect(participant1).registerParticipant("Monica", {value: "100000000000000000"});
            const receipt = await tx.wait();
            const gas = await receipt.gasUsed;
            const gasFee = BigNumber(gas + "").multiply(BigNumber(tx.gasPrice + ""));

            const balanceAfter = BigNumber(await participant1.getBalance() + "");
            
            const string1 = balanceBefore.subtract(balanceAfter).subtract(BigNumber("100000000000000000")) + "";
            assert.equal(string1, gasFee + "");
        });

        it("5. Successful login if already registered.", async function() {
            //1e17
            await deployedPoll.connect(participant1).registerParticipant("Monica", {value: "100000000000000000"});

            await expect(deployedPoll.connect(participant1).registerParticipant("Monica", {value: "100000000000000000"})).to.emit(
                deployedPoll, 'participantLoggedIn').withArgs("Monica");

            expect(await deployedPoll.numberOfParticipant()).to.equal(1);
        });
    });

    describe("New Poll Creation", function() {
        it("1. Unsuccessful creation if poll name or discription is empty.", async function() {
            await deployedPoll.connect(organizer1).registerParticipant("Ross", {value: "100000000000000000"});

            await expect(deployedPoll.connect(organizer1).createPoll("", "Test poll", 10, true, true, availableSelections, selectionsDescriptions)).to.be.revertedWith(
                "Poll name is empty");

            await expect(deployedPoll.connect(organizer1).createPoll("Poll", "", 10, true, true, availableSelections, selectionsDescriptions)).to.be.revertedWith(
                "Poll description is empty");
        });

        it("2. Unsuccessful creation if duration is not larger than 0.", async function() {
            await deployedPoll.connect(organizer1).registerParticipant("Ross", {value: "100000000000000000"});

            await expect(deployedPoll.connect(organizer1).createPoll("Poll", "Test poll", 0, true, true, availableSelections, selectionsDescriptions)).to.be.revertedWith(
                "Poll duration is empty");
        });       

        it("3. Unsuccessful creation if available choices are not provided.", async function() {
            await deployedPoll.connect(organizer1).registerParticipant("Ross", {value: "100000000000000000"});

            await expect(deployedPoll.connect(organizer1).createPoll("Poll", "Test poll", 10, true, true, [], [])).to.be.revertedWith(
                "Choice to select from not given");
        }); 

        it("4. Unsuccessful creation if available choices are outside of Selection enum.", async function() {
            // https://github.com/NomicFoundation/hardhat/issues/1227
            // Other exception was thrown: Error: Transaction reverted: function was called with incorrect parameters
            // dispite having a require statement that throws "Input choice not valid"
            await deployedPoll.connect(organizer1).registerParticipant("Ross", {value: "100000000000000000"});

            await expect(deployedPoll.connect(organizer1).createPoll("Poll", "Test poll", 10, true, true, [9], ["choice"])).to.be.reverted;
        });         

        it("5. Unsuccessful creation if poll creator is not registered.", async function() {
            await expect(deployedPoll.connect(organizer1).createPoll("Poll", "Test poll", 10, true, true, availableSelections, selectionsDescriptions)).to.be.revertedWith(
                "Participant not registered in the system");
        });

        it("6. Unsuccessful creation if selections length doesn't match with descriptions length", async function() {
            await deployedPoll.connect(organizer1).registerParticipant("Ross", {value: "100000000000000000"});

            await expect(deployedPoll.connect(organizer1).createPoll("Poll", "Test poll", 10, true, true, availableSelections, ["choice"])).to.be.reverted;
        })

        it("7. Successful creation if all requirements are met.", async function() {
            await expect(deployedPoll.connect(organizer1).viewPoll(1)).to.be.revertedWith("Participant not registered in the system");

            await deployedPoll.connect(organizer1).registerParticipant("Ross", {value: "100000000000000000"});
            await expect(deployedPoll.connect(organizer1).createPoll("Poll", "Test poll", 10, true, true, availableSelections, selectionsDescriptions)).to.emit(
                deployedPoll, 'pollCreated').withArgs(organizer1.address, "Poll", 10, true, true);

            // A single poll has been created
            const pollGenerated = await deployedPoll.connect(organizer1).polls(1);

            // Test created poll attributes
            expect(pollGenerated.state).to.equal(0);
            expect(pollGenerated.pollId).to.equal(1);
            expect(pollGenerated.organizer).to.equal(await organizer1.address);
            expect(pollGenerated.name).to.equal("Poll");
            expect(pollGenerated.description).to.equal("Test poll");
            expect(pollGenerated.votingDuration).to.equal(10);
            expect(pollGenerated.blind).to.equal(true);
            expect(pollGenerated.aboutDAO).to.equal(true);
            expect(pollGenerated.blind).to.equal(true);
            expect(pollGenerated.totalVote).to.equal(0);

            let createdPollIds = await deployedPoll.connect(organizer1).getParticipantCreatedPollIds();
            assert.equal(createdPollIds[0] + "", 1);
            expect(createdPollIds.length).to.equal(1);

        });

        it("8. Correct poll Ids when multiple polls are created by different organizers", async function() {
            await deployedPoll.connect(organizer1).registerParticipant("Ross", {value: "100000000000000000"});
            await deployedPoll.connect(organizer2).registerParticipant("Phoebe", {value: "100000000000000000"});

            await expect(deployedPoll.connect(organizer1).createPoll("Poll1", "Test poll", 10, true, true, availableSelections, selectionsDescriptions)).to.emit(
                deployedPoll, 'pollCreated').withArgs(organizer1.address, "Poll1", 10, true, true);
            
            await expect(deployedPoll.connect(organizer2).createPoll("Poll2", "Test poll", 10, true, true, availableSelections, selectionsDescriptions)).to.emit(
                    deployedPoll, 'pollCreated').withArgs(organizer2.address, "Poll2", 10, true, true);

            await expect(deployedPoll.connect(organizer1).createPoll("Poll3", "Test poll", 10, true, true, availableSelections, selectionsDescriptions)).to.emit(
                    deployedPoll, 'pollCreated').withArgs(organizer1.address, "Poll3", 10, true, true);

            await expect(deployedPoll.connect(organizer2).createPoll("Poll4", "Test poll", 10, true, true, availableSelections, selectionsDescriptions)).to.emit(
                    deployedPoll, 'pollCreated').withArgs(organizer2.address, "Poll4", 10, true, true);
    
            let organizer1CreatedPollIds = await deployedPoll.connect(organizer1).getParticipantCreatedPollIds();
            expect(organizer1CreatedPollIds.length).to.equal(2);
            assert.equal(organizer1CreatedPollIds[0] + "", 1);
            assert.equal(organizer1CreatedPollIds[1] + "", 3);
                       
            let organizer2CreatedPollIds = await deployedPoll.connect(organizer2).getParticipantCreatedPollIds();
            expect(organizer2CreatedPollIds.length).to.equal(2);
            assert.equal(organizer2CreatedPollIds[0] + "", 2);
            assert.equal(organizer2CreatedPollIds[1] + "", 4);
        });

        it("9. Correct poll Ids by participants", async function() {
            await deployedPoll.connect(organizer1).registerParticipant("Ross", {value: "100000000000000000"});
            await deployedPoll.connect(organizer2).registerParticipant("Phoebe", {value: "100000000000000000"});

            await expect(deployedPoll.connect(organizer1).createPoll("Poll1", "Test poll", 10, true, true, availableSelections, selectionsDescriptions)).to.emit(
                deployedPoll, 'pollCreated').withArgs(organizer1.address, "Poll1", 10, true, true);
            
            await expect(deployedPoll.connect(organizer2).createPoll("Poll2", "Test poll", 10, true, false, availableSelections, selectionsDescriptions)).to.emit(
                    deployedPoll, 'pollCreated').withArgs(organizer2.address, "Poll2", 10, true, false);

            await expect(deployedPoll.connect(organizer1).createPoll("Poll3", "Test poll", 10, false, true, availableSelections, selectionsDescriptions)).to.emit(
                    deployedPoll, 'pollCreated').withArgs(organizer1.address, "Poll3", 10, false, true);

            await expect(deployedPoll.connect(organizer2).createPoll("Poll4", "Test poll", 10, false, true, availableSelections, selectionsDescriptions)).to.emit(
                    deployedPoll, 'pollCreated').withArgs(organizer2.address, "Poll4", 10, false, true);
    
            let organizer1Ids = await deployedPoll.connect(organizer1).getParticipantCreatedPollIds();
            expect(organizer1Ids.length).to.equal(2);
            assert.equal(organizer1Ids[0] + "", 1);
            assert.equal(organizer1Ids[1] + "", 3);

            let organizer2Ids = await deployedPoll.connect(organizer2).getParticipantCreatedPollIds();
            expect(organizer2Ids.length).to.equal(2);
            assert.equal(organizer2Ids[0] + "", 2);
            assert.equal(organizer2Ids[1] + "", 4);
        });
    });

    describe("Poll Voting: voting is not blind", function() {

        beforeEach(async function() {
            
            await deployedPoll.connect(organizer1).registerParticipant("Ross", {value: "100000000000000000"});
            await deployedPoll.connect(participant1).registerParticipant("Monica", {value: "100000000000000000"});

            await deployedPoll.connect(organizer1).createPoll("Poll", "Test poll", pollDuration, false, true, availableSelections, selectionsDescriptions);
        });

        describe("Checking results before anyone votes", function() {
            it("1. Cannot view result of non-existent poll", async function() {
                await expect(deployedPoll.connect(participant1).viewResult(2)).to.be.revertedWith("Poll not created");
            });
    
            it("2. Result should be DEFAULT (i.e. 0) when no one has voted", async function() {
                await expect(deployedPoll.connect(participant1).viewResult(1)).to.emit(deployedPoll, 'resultViewed').withArgs(false, [], 0, false);
            });
        });

        describe("Voting and checking results when poll is still in progress.", function() {
            it("1. Cannot vote at a non-existent poll", async function() {
                await expect(deployedPoll.connect(participant1).vote(2, 1)).to.be.revertedWith("Poll not created");
            });

            it("2. Unsuccessful voting if participant has not registered.", async function () {
                await expect(deployedPoll.connect(participant2).vote(1, 1)).to.be.revertedWith("Participant not registered in the system");
            });

            it("3. Successful voting at a poll if participant has registered.", async function() {
                let pollCreatedTime = Date.now();

                await expect(deployedPoll.connect(participant1).vote(1, 1)).to.emit(deployedPoll, 'voteDone').withArgs(1, false);
                
                // Confirm poll has not ended
                let timeElapsedInSeconds = (Date.now() - pollCreatedTime) / 1000;
                assert.isBelow(timeElapsedInSeconds, pollDuration, "Trying to test successful voting but voting period has ended");
            });

            it("4. Correct voting result after one participant voted.", async function() {
                let pollCreatedTime = Date.now();

                await deployedPoll.connect(participant1).vote(1, 1);
                await expect(deployedPoll.connect(participant1).viewResult(1)).to.emit(deployedPoll, 'resultViewed').withArgs(false,[1], 0, false);

                // Confirm poll has not ended
                let timeElapsedInSeconds = (Date.now() - pollCreatedTime) / 1000;
                assert.isBelow(timeElapsedInSeconds, pollDuration, "Trying to test successful voting but voting period has ended");            
            });

            it("5. Correct voting result if mutiple voting options received equal number of votes.", async function() {
                let pollCreatedTime = Date.now();

                await deployedPoll.connect(participant1).vote(1, 1);
                await deployedPoll.connect(participant2).registerParticipant("Rachel", {value: "100000000000000000"});
                await deployedPoll.connect(participant2).vote(1, 2);

                await expect(deployedPoll.connect(participant1).viewResult(1)).to.emit(deployedPoll, 'resultViewed').withArgs(true,[1, 2], 0, false);

                // Confirm poll has not ended
                let timeElapsedInSeconds = (Date.now() - pollCreatedTime) / 1000;
                assert.isBelow(timeElapsedInSeconds, pollDuration, "Trying to test successful voting but voting period has ended");            
            });

            it("6. Correct voting result if one voting option recieved more votes than others.", async function() {
                let pollCreatedTime = Date.now();

                await deployedPoll.connect(participant2).registerParticipant("Rachel", {value: "100000000000000000"});
                await deployedPoll.connect(participant3).registerParticipant("Joey", {value: "100000000000000000"});
                await deployedPoll.connect(participant1).vote(1, 1);
                await deployedPoll.connect(participant2).vote(1, 2);
                await deployedPoll.connect(participant3).vote(1, 2);

                await expect(deployedPoll.connect(participant1).viewResult(1)).to.emit(deployedPoll, 'resultViewed').withArgs(false,[2], 0, false);
                // Confirm poll has not ended
                let timeElapsedInSeconds = (Date.now() - pollCreatedTime) / 1000;
                assert.isBelow(timeElapsedInSeconds, pollDuration, "Trying to test successful voting but voting period has ended");    
            });
  
            it("7. Correct dynamic results with participants changing votes", async function() {
                let pollCreatedTime = Date.now();
                await network.provider.send("evm_setAutomine", [false]);
                await network.provider.send("evm_setIntervalMining", [500]);

                await Promise.all([
                    deployedPoll.connect(participant2).registerParticipant("Rachel", {value: "100000000000000000"}), 
                    
                    deployedPoll.connect(participant3).registerParticipant("Joey", {value: "100000000000000000"}),
                    expect(deployedPoll.connect(participant1).vote(1, 1)).to.emit(deployedPoll, 'voteDone').withArgs(1, false),
                    expect(deployedPoll.connect(participant2).vote(1, 2)).to.emit(deployedPoll, 'voteDone').withArgs(2, false),
                    expect(deployedPoll.connect(participant3).vote(1, 2)).to.emit(deployedPoll, 'voteDone').withArgs(2, false),
                    expect(deployedPoll.connect(participant1).viewResult(1)).to.emit(deployedPoll, 'resultViewed').withArgs(false,[2], 0, false),
                    expect(deployedPoll.connect(participant1).vote(1, 2)).to.emit(deployedPoll, 'voteDone').withArgs(2, true),
                    expect(deployedPoll.connect(participant2).vote(1, 1)).to.emit(deployedPoll, 'voteDone').withArgs(1, true),
                    expect(deployedPoll.connect(participant3).vote(1, 1)).to.emit(deployedPoll, 'voteDone').withArgs(1, true),
                    expect(deployedPoll.connect(participant1).viewResult(1)).to.emit(deployedPoll, 'resultViewed').withArgs(false,[1], 0, false),

                    expect(deployedPoll.connect(participant2).vote(1, 2)).to.emit(deployedPoll, 'voteDone').withArgs(2, true),
                    expect(deployedPoll.connect(participant1).viewResult(1)).to.emit(deployedPoll, 'resultViewed').withArgs(false,[2], 0, false)
                ]);

                // Confirm poll has not ended
                let timeElapsedInSeconds = (Date.now() - pollCreatedTime) / 1000;
                assert.isBelow(timeElapsedInSeconds, pollDuration, "Trying to test successful voting but voting period has ended");    
            });
        });

        describe("Voting and checking results after poll has ended", function() {
            it("1. Unsuccessful voting if poll has ended. No one voted.", async function() {
                //TODO: this has changed to testing a 2-min poll
                await deployedPoll.connect(organizer1).createPoll("Poll", "Test poll", 120, false, true, availableSelections, selectionsDescriptions);

                let pollCreatedTime = Date.now();

                await new Promise(r => setTimeout(r, 180 * 1000));

                // Confirm poll has now ended
                let timeElapsedInSeconds = (Date.now() - pollCreatedTime) / 1000;
                assert.isAtLeast(timeElapsedInSeconds, pollDuration, "Trying to test unsuccessful voting due to poll ending but poll didn't end");

                await expect(deployedPoll.connect(participant1).vote(2, 1)).to.be.revertedWith("The poll has ended");
                await expect(deployedPoll.connect(participant1).viewResult(2)).to.emit(deployedPoll, 'resultViewed').withArgs(false,[], 1, false);
            });

            it("2. Correct final results after poll has ended.", async function() {
                let pollCreatedTime = Date.now();
                
                await deployedPoll.connect(participant2).registerParticipant("Rachel", {value: "100000000000000000"});
                await deployedPoll.connect(participant3).registerParticipant("Joey", {value: "100000000000000000"});

                await deployedPoll.connect(participant1).vote(1, 1);
                await deployedPoll.connect(participant2).vote(1, 2);
                await deployedPoll.connect(participant3).vote(1, 2);

                // Confirm poll is still in progress
                let timeElapsedInSeconds = (Date.now() - pollCreatedTime) / 1000;
                assert.isBelow(timeElapsedInSeconds, pollDuration, "Trying to test successful voting but voting period has ended");   

                await new Promise(r => setTimeout(r, pollDuration * 1000));
                //await network.provider.send("evm_increaseTime", [pollDuration])

                // Confirm poll has now ended
                timeElapsedInSeconds = (Date.now() - pollCreatedTime) / 1000;
                assert.isAtLeast(timeElapsedInSeconds, pollDuration, "Trying to test unsuccessful voting due to poll ending but poll didn't end");

                await expect(deployedPoll.connect(participant1).viewResult(1)).to.emit(deployedPoll, 'resultViewed').withArgs(false,[2], 1, false);
            });

            it("3. Correct votes by participants.", async function() {
                let pollCreatedTime = Date.now();
                
                await deployedPoll.connect(participant2).registerParticipant("Rachel", {value: "100000000000000000"});
                await deployedPoll.connect(participant3).registerParticipant("Joey", {value: "100000000000000000"});

                await deployedPoll.connect(participant1).viewPoll(1);
                // await deployedPoll.connect(participant1).checkVotedChoice(1);
                // expect(voted).to.equal(false);
                // expect(mySelection).to.equal(0);

                await deployedPoll.connect(participant1).vote(1, 1);
                await deployedPoll.connect(participant2).vote(1, 2);
                await deployedPoll.connect(participant3).vote(1, 2);

                // Confirm poll is still in progress
                let timeElapsedInSeconds = (Date.now() - pollCreatedTime) / 1000;
                assert.isBelow(timeElapsedInSeconds, pollDuration, "Trying to test successful voting but voting period has ended");   

                await new Promise(r => setTimeout(r, pollDuration * 1000));
                //await network.provider.send("evm_increaseTime", [pollDuration])

                // Confirm poll has now ended
                timeElapsedInSeconds = (Date.now() - pollCreatedTime) / 1000;
                assert.isAtLeast(timeElapsedInSeconds, pollDuration, "Trying to test unsuccessful voting due to poll ending but poll didn't end");

                await expect(deployedPoll.connect(participant1).viewResult(1)).to.emit(deployedPoll, 'resultViewed').withArgs(false,[2], 1, false);
            });
        });
    });

    describe("Poll Voting: voting is blind", function() {
        
        beforeEach(async function() {
            await deployedPoll.connect(organizer1).registerParticipant("Ross", {value: "100000000000000000"});
            await deployedPoll.connect(participant1).registerParticipant("Monica", {value: "100000000000000000"});
            await deployedPoll.connect(participant2).registerParticipant("Rachel", {value: "100000000000000000"});
            await deployedPoll.connect(participant3).registerParticipant("Joey", {value: "100000000000000000"});
            await deployedPoll.connect(organizer1).createPoll("Poll", "Test poll", pollDuration, true, true, availableSelections, selectionsDescriptions);
        });

        it("1. Cannot view result of non-existent poll.", async function() {
            await expect(deployedPoll.connect(participant1).viewResult(2)).to.be.revertedWith("Poll not created");
        });

        it("2. Cannot view result if voting is still in progress.", async function() {
            let pollCreatedTime = Date.now();
            
            await deployedPoll.connect(participant1).vote(1, 1);
            await deployedPoll.connect(participant2).vote(1, 2);
            await deployedPoll.connect(participant3).vote(1, 2);
            
            expect(deployedPoll.connect(organizer1).viewResult(1)).to.emit(deployedPoll, 'blindResultViewedFailed');

            // Confirm poll is still in progress
            let timeElapsedInSeconds = (Date.now() - pollCreatedTime) / 1000;
            assert.isBelow(timeElapsedInSeconds, pollDuration, "Trying to test unsuccessful results lookup but poll has ended");   
        });

        it("3. Correct results if voting has ended and no one can vote anymore.", async function() {
            let pollCreatedTime = Date.now();
                
            await deployedPoll.connect(participant1).vote(1, 1);
            await deployedPoll.connect(participant2).vote(1, 2);
            await deployedPoll.connect(participant3).vote(1, 2);

            // Confirm poll is still in progress
            let timeElapsedInSeconds = (Date.now() - pollCreatedTime) / 1000;
            assert.isBelow(timeElapsedInSeconds, pollDuration, "Trying to test successful voting but voting period has ended");   

            await new Promise(r => setTimeout(r, pollDuration * 1000));

            // Confirm poll has now ended
            timeElapsedInSeconds = (Date.now() - pollCreatedTime) / 1000;

            assert.isAtLeast(timeElapsedInSeconds, pollDuration, "Trying to look up results after poll has ended but poll didn't end");

            await expect(deployedPoll.connect(participant1).viewResult(1)).to.emit(deployedPoll, 'resultViewed').withArgs(false,[ 2 ], 1, true);

            await expect(deployedPoll.connect(participant1).vote(1, 2)).to.be.revertedWith("The poll has ended");
        })
    });
});
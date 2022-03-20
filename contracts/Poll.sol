// SPDX-License-Identifier: MIT
// DAO - 道可道, 非常道.
// some of the logic cited from Jackson Ng's ballot.sol and solidity official documentation
// However, this contract incorporates some theories of DAO to achieve a higher autonomous level
// Everyone is able to organize a voting event
// And no one has real control over the poll

pragma solidity >=0.8.0;

import "hardhat/console.sol";
// Version 1.1 with all desired functions and revised external/ public, storage/ memory

contract Poll {

    uint256 constant public registrationPrice = 100000000000000000;

    enum State { VOTING, ENDED }
    enum Selection { DEFAULT, YES, NO, A, B, C, D }

    struct Participant{
        address participantAddr;
        string voterName;
    }

    // From what I understand, time in solidity is 1 == 1 second
    // https://ethereum.stackexchange.com/questions/3034/how-to-get-current-time-by-solidity
    // While time in js avascript's timestamp is always a factor 1000 larger than the one used by Solidity
    // https://ethereum.stackexchange.com/questions/68217/smart-contract-now-vs-javascript-now

    struct PollEvent{
        State state;
        uint pollId;
        string name;
        string description;        
        uint startTime;
        uint votingDuration; // In seconds 
        bool blind; // Show result in real time or in the end 
        bool aboutDAO; // The prposal is about this dao (tag type)        
        Selection[] choseFrom;
        uint totalVote;
        address[] voted; // An array to store who has already voted 
        Selection[] votedChoices; // An array to store voter's choices 
        Selection result; // Temporary result or final result depend on state
    }

    uint public numberOfParticipant;
    uint private nextPollId = 1;
    
    mapping(uint => PollEvent) public polls;
    mapping(address => Participant) public participants;
    mapping(string => address) public participantName; 

	constructor() {
        numberOfParticipant = 0;
    }

    event participantRegistered(string name);
    event pollCreated(address organizer, string name, uint dur, bool blind, bool aboutDAO);
    event voteDone(address voter, bool voted);
    event voteEnded(Selection result);
    event resultViewed(Selection result, State state, bool blind); // state is used to determine whether the result is temporary
    //event pollsViewed(PollEvent[] polls);

    modifier newParticipantCheck(string memory name)
    {
        require(bytes(name).length > 0, "Participant name is empty");
        require(participantName[name] == address(0x0), "Participant already registered");

        require(msg.value >= registrationPrice, "Asset not enough to register");
        require(msg.value == registrationPrice, "Amount sent not equal to the registration price");
        _;
    }

    // Do this when connecting to wallet 
    function registerParticipant(string memory _name) 
        newParticipantCheck(_name) external payable 
    {
        Participant memory newParticipant = Participant(msg.sender, _name);
        participants[msg.sender] = newParticipant;
        participantName[_name] = msg.sender;

        numberOfParticipant += 1;

        emit participantRegistered(_name);
    }

    modifier participantLookUpCheck(string memory name)
    {
        require(bytes(name).length > 0, "Participant name is empty");
        require(participantName[name] != address(0x0), "Can't find the name in all participants");
        _;
    }

    function lookUpParticipant(string memory _name) 
        participantLookUpCheck(_name) public view returns (address) 
    {
        return participantName[_name];
    }


    modifier newPollCreateionCheck(string memory name, string memory desc, uint dur, Selection[] memory sel) 
    {
        console.log("contract creation time in solidity", block.timestamp);
        require(bytes(name).length > 0, "Poll name is empty");
        require(bytes(desc).length > 0, "Poll description is empty");
        require(dur > 0, "Poll duration is empty");
        require(sel.length > 0, "Choice to select from not given");
        for (uint i = 0; i < sel.length; i++) {
            require(sel[i] >= Selection.YES && sel[i] <= Selection.D, "Input choice not valid");
        }
        
        _;
    }

    function createPoll(string memory name, string memory desc, uint dur, bool blind, bool aboutDAO, Selection[] memory sel) 
        newPollCreateionCheck(name, desc, dur, sel) external
    {

        require(participants[msg.sender].participantAddr != address(0x00), "Participant not registered in the system");

        address[] memory voted;
        Selection[] memory votedChoices;
        Selection result;
        PollEvent memory newPoll = PollEvent(State.VOTING, nextPollId, name, desc, block.timestamp, dur, blind, aboutDAO, sel, 0, voted, votedChoices, result);
        polls[nextPollId] = newPoll;

        nextPollId += 1;

        emit pollCreated(msg.sender, name, dur, blind, aboutDAO);
    }


    modifier updateResult(uint pollId) 
    {

        if (polls[pollId].state ==  State.VOTING) {

            uint[] memory counts = new uint[](polls[pollId].choseFrom.length);
            uint i = 0;
            for(; i < polls[pollId].totalVote; i++) {
                for (uint j = 0; j < polls[pollId].choseFrom.length; j++) {
                    if (polls[pollId].choseFrom[j] == polls[pollId].votedChoices[i]) {
                        counts[j] += 1;
                        break;
                    }
                }
            }

            uint winnerVoteCount = 0;

            for (uint j = 0; j < polls[pollId].choseFrom.length; j++){
                if (counts[j] > winnerVoteCount) {
                    polls[pollId].result = polls[pollId].choseFrom[j];
                    winnerVoteCount = counts[j];
                }
            }

            console.log("Timestamp needs to pass in sol", polls[pollId].startTime + polls[pollId].votingDuration);
            console.log("current time in solidity - update", block.timestamp);
            // End vote in flight 
            if (polls[pollId].startTime + polls[pollId].votingDuration < block.timestamp) {
                console.log("end!!!!!!!!!!!!!!!!!!");
                polls[pollId].state = State.ENDED;
                emit voteEnded(polls[pollId].result);
            }
        }

        _;
    }


    modifier voteCheck(uint pollId, Selection choice) 
    {
        require(polls[pollId].pollId > 0, "Poll not created");  
        require(polls[pollId].state == State.VOTING, "The poll has ended");
        require(polls[pollId].startTime + polls[pollId].votingDuration > block.timestamp, "Vote time has passed");
        //require(bytes(choice).length > 0, "No choice made yet");

        _;
    }

    function vote(uint pollId, Selection choice)
        updateResult(pollId) 
        voteCheck(pollId, choice) 
        external
    {
        require(participants[msg.sender].participantAddr != address(0x00), "Participant not registered in the system");

        bool voted = false;
        uint i = 0;
        for (; i < polls[pollId].voted.length; i++) {
            if (polls[pollId].voted[i] == msg.sender) {
                voted = true;
                break;
            }
        }

        if (voted) {
            polls[pollId].votedChoices[i] = choice;
        } else {
            polls[pollId].voted.push(msg.sender);
            polls[pollId].votedChoices.push(choice);
            polls[pollId].totalVote += 1;
        }
        emit voteDone(msg.sender, voted);
    }

    modifier viewResultCheck(uint pollId)
    {
        // For debugging print 
        console.log("current time in solidity - check", block.timestamp);

        require(polls[pollId].pollId > 0, "Poll not created");
        if (polls[pollId].blind) {
            require(polls[pollId].state == State.ENDED, "This voting is blind, still in voting");
            require(polls[pollId].startTime + polls[pollId].votingDuration < block.timestamp, "This voting is blind, result not revealed yet");
        }

        _;
    }

    function viewResult(uint pollId) 
        updateResult(pollId) 
        viewResultCheck(pollId)
        public returns (Selection)
    {
        emit resultViewed(polls[pollId].result, polls[pollId].state, polls[pollId].blind);
        return polls[pollId].result;
    }

    // We could also do only return poll name and descriptions.
    function viewAllPolls()
        public view returns (PollEvent[] memory)
    {
        PollEvent[] memory pollEvents = new PollEvent[](nextPollId - 1);
        for (uint i = 1; i < nextPollId; i++) {
            pollEvents[i-1] = polls[i];
        }

        return pollEvents;
    }
}


// SPDX-License-Identifier: MIT
// DAO - 道可道, 非常道.
// some of the logic cited from Jackson Ng's ballot.sol and solidity official documentation
// However, this contract incorporates some theories of DAO to achieve a higher autonomous level
// Everyone is able to organize a voting event
// And no one has real control over the poll

pragma solidity >=0.8.0;


// Version 1 with all desired functions
// TODO: check usage of memory/storage and public/external
// TODO: view all polls function

contract Poll {

    uint256 constant public registrationPrice = 100000000000000000;

    enum State { VOTING, ENDED }
    enum Selection { YES, NO, A, B, C, D }

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
    // event viewPolls(PollEvent[] polls);

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
        newParticipantCheck(_name) public payable 
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
        require(bytes(name).length > 0, "Poll name is empty");
        require(bytes(desc).length > 0, "Poll description is empty");
        require(dur > 0, "Poll duration is empty");
        require(sel.length > 0, "Choice to select from not given");
        // TODO: Check whether selection in enum
        
        _;
    }

    function createPoll(string memory name, string memory desc, uint dur, bool blind, bool aboutDAO, Selection[] memory sel) 
        newPollCreateionCheck(name, desc, dur, sel) public
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
        PollEvent storage thisPoll = polls[pollId];

        if (thisPoll.state ==  State.VOTING) {

            uint[] memory counts = new uint[](thisPoll.choseFrom.length);
            uint i = 0;
            for(; i < thisPoll.totalVote; i++) {
                for (uint j = 0; j < thisPoll.choseFrom.length; j++) {
                    if (thisPoll.choseFrom[j] == thisPoll.votedChoices[i]) {
                        counts[j] += 1;
                        break;
                    }
                }
            }

            uint winnerVoteCount = 0;

            for (uint j = 0; j < thisPoll.choseFrom.length; j++){
                if (counts[j] > winnerVoteCount) {
                    thisPoll.result = thisPoll.choseFrom[j];
                    winnerVoteCount = counts[j];
                }
            }

            if (thisPoll.startTime + thisPoll.votingDuration < block.timestamp) {
                thisPoll.state = State.ENDED;
                emit voteEnded(thisPoll.result);
            }
        }

        _;
    }


    modifier voteCheck(uint pollId, Selection choice) 
    {
        PollEvent storage thisPoll = polls[pollId];
        require(thisPoll.pollId > 0, "Poll not created");  
        require(thisPoll.state == State.VOTING, "The poll has ended");
        require(thisPoll.startTime + thisPoll.votingDuration > block.timestamp, "Vote time has passed");
        //require(bytes(choice).length > 0, "No choice made yet");

        _;
    }

    function vote(uint pollId, Selection choice)
        updateResult(pollId) 
        voteCheck(pollId, choice) 
        public 
    {
        require(participants[msg.sender].participantAddr != address(0x00), "Participant not registered in the system");

        PollEvent storage thisPoll = polls[pollId];

        bool voted = false;
        uint i = 0;
        for (; i < thisPoll.voted.length; i++) {
            if (thisPoll.voted[i] == msg.sender) {
                voted = true;
                break;
            }
        }

        if (voted) {
            thisPoll.votedChoices[i] = choice;
        } else {
            thisPoll.voted.push(msg.sender);
            thisPoll.votedChoices.push(choice);
            thisPoll.totalVote += 1;
        }
        emit voteDone(msg.sender, voted);
    }

    modifier viewResultCheck(uint pollId)
    {
        PollEvent storage thisPoll = polls[pollId];
        require(thisPoll.pollId > 0, "Poll not created");
        if (thisPoll.blind) {
            require(thisPoll.state == State.VOTING, "This voting is blind, still in voting");
            require(thisPoll.startTime + thisPoll.votingDuration < block.timestamp, "This voting is blind, result not revealed yet");
        }

        _;
    }

    function viewResult(uint pollId) 
        updateResult(pollId) 
        viewResultCheck(pollId)
        public returns (Selection)
    {
        PollEvent storage thisPoll = polls[pollId];

        emit resultViewed(thisPoll.result, thisPoll.state, thisPoll.blind);
        return thisPoll.result;
    }

    // function viewAllPolls()
    //     public returns ()
    // {

    //     for (uint i = 0; i < thisPoll.voted.length; i++) {
    // }
}

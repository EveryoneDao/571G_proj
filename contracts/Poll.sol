<<<<<<< HEAD
// SPDX-License-Identifier: MIT
// DAO - 道可道, 非常道.
// some of the logic cited from Jackson Ng's ballot.sol and solidity official documentation
// However, this contract incorporates some theories of DAO to achieve a higher autonomous level
// Everyone is able to organize a voting event
// And no one has real control over the poll

pragma solidity >=0.8.0;


// Version 1.1 with all desired functions and revised external/ public, storage/ memory
=======
/*
    SPDX-License-Identifier: MIT
    DAO - 道可道, 非常道.
    Built on the starter logic cited from Jackson Ng's ballot.sol and solidity official documentation, 
    this contract incorporates some theories of DAO to achieve a higher decentralized and autonomous level --
            Everyone is able to organize a voting event and no one has real control over the poll
*/

/* DONE 
    Version 1:
    - desired functions (blind vote, timed stop) 
    - revised external/ public, storage/ memory
    - Change return with emit for offchain operations 
*/

/* DONE
    Version 2 (better data delivery to the front end):
    - login/ register (p.1) - added modifier and boolean check
    - create poll (p.3) - enum and new optionDesc array in struct 
    - update and view result (p.6)
    - new func view one poll (p.5)
    - view polls (p.2), add filters - blind, my poll, poll type
*/

/*
    Other comments, time in solidity is 1 == 1 second
    https://ethereum.stackexchange.com/questions/3034/how-to-get-current-time-by-solidity
    While time in js avascript's timestamp is always a factor 1000 larger than the one used by Solidity
    https://ethereum.stackexchange.com/questions/68217/smart-contract-now-vs-javascript-now
*/

pragma solidity >=0.8.0;
import "hardhat/console.sol";
>>>>>>> 15a488d8d9dbfa910c9226e278adcb3d7fd18431

contract Poll {

    uint256 constant public registrationPrice = 100000000000000000;

    enum State { VOTING, ENDED }
<<<<<<< HEAD
    enum Selection { DEFAULT, YES, NO, A, B, C, D }
=======
    enum Selection { DEFAULT, A, B, C, D, E, F, G, H } // At most 8 choices 
    enum FILTER { ALL, IN, OUT }
>>>>>>> 15a488d8d9dbfa910c9226e278adcb3d7fd18431

    struct Participant{
        address participantAddr;
        string voterName;
<<<<<<< HEAD
    }

    // From what I understand, time in solidity is 1 == 1 second
    // https://ethereum.stackexchange.com/questions/3034/how-to-get-current-time-by-solidity
    // While time in js avascript's timestamp is always a factor 1000 larger than the one used by Solidity
    // https://ethereum.stackexchange.com/questions/68217/smart-contract-now-vs-javascript-now

    struct PollEvent{
        State state;
        uint pollId;
=======
        uint[] pollIds; // Created polls
        uint[] tempViewPollIds; // For views 
    }

    struct PollEvent{
        State state;
        uint pollId;
        address organizer;
>>>>>>> 15a488d8d9dbfa910c9226e278adcb3d7fd18431
        string name;
        string description;        
        uint startTime;
        uint votingDuration; // In seconds 
        bool blind; // Show result in real time or in the end 
        bool aboutDAO; // The prposal is about this dao (tag type)        
        Selection[] choseFrom;
<<<<<<< HEAD
        uint totalVote;
        address[] voted; // An array to store who has already voted 
        Selection[] votedChoices; // An array to store voter's choices 
        Selection result; // Temporary result or final result depend on state
=======
        string[] optionDesc;
        uint totalVote;
        address[] voted; // An array to store who has already voted 
    }

    struct PollResult{
        State state;
        uint pollId;
        bool tie;
        Selection[] votedChoices; // An array to store voter's choices, length = PollEvent.voted
        Selection[] result; // Temporary result or final result depend on state
>>>>>>> 15a488d8d9dbfa910c9226e278adcb3d7fd18431
    }

    uint public numberOfParticipant;
    uint private nextPollId = 1;
    
<<<<<<< HEAD
    mapping(uint => PollEvent) public polls;
    mapping(address => Participant) public participants;
    mapping(string => address) public participantName; 
=======
    mapping(address => Participant) public participants;
    mapping(string => address) public participantName; 
    mapping(uint => PollEvent) public polls;
    mapping(uint => PollResult) private pollResults;
>>>>>>> 15a488d8d9dbfa910c9226e278adcb3d7fd18431

	constructor() {
        numberOfParticipant = 0;
    }

    event participantRegistered(string name);
<<<<<<< HEAD
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
=======
    event participantLoggedIn(string name);
    event pollCreated(address organizer, string name, uint dur, bool blind, bool aboutDAO);
    event voteDone(address voter, bool voted);
    event voteEnded(bool tie, Selection[] result);
    event resultViewed(bool tie, Selection[] result, State state, bool blind); // state is used to determine whether the result is temporary
    event pollViewed(PollEvent poll);
    event pollsViewed(uint[] pollIds);

    modifier existingParticipantCheck(address addr, string memory name)
    {
        require(bytes(name).length > 0, "Participant name is empty");
        bool registered = false;
        if(participantName[name] == addr) {
            emit participantLoggedIn(name);
            registered = true;
        }
        if (!registered){
            _;
        }
    }

    modifier newParticipantCheck(string memory name)
    {
        require(participantName[name] == address(0x0), "Participant already registered");
        require(msg.value >= registrationPrice, "Asset not enough to register");
        require(msg.value == registrationPrice, "Amount sent not equal to the registration price");

        _;
    }

    modifier newPollCreateionCheck(string memory name, string memory desc, uint dur, Selection[] memory sel, string[] memory selDesc)
    {
        //console.log("contract creation time in solidity", block.timestamp);
>>>>>>> 15a488d8d9dbfa910c9226e278adcb3d7fd18431
        require(bytes(name).length > 0, "Poll name is empty");
        require(bytes(desc).length > 0, "Poll description is empty");
        require(dur > 0, "Poll duration is empty");
        require(sel.length > 0, "Choice to select from not given");
        for (uint i = 0; i < sel.length; i++) {
<<<<<<< HEAD
            require(sel[i] >= Selection.YES && sel[i] <= Selection.D, "Input choice not valid");
        }
=======
            require(sel[i] >= Selection.A && sel[i] <= Selection.H, "Input choice not valid");
        }
        require(selDesc.length == sel.length, "Choices' length not equal to descriptions' length");
>>>>>>> 15a488d8d9dbfa910c9226e278adcb3d7fd18431
        
        _;
    }

<<<<<<< HEAD
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
=======
    modifier participantCheck() {
        //require(participantName[name] == address(0x0), "Participant already registered");
        require(participants[msg.sender].participantAddr != address(0x00), "Participant not registered in the system");
        _;
    }

    modifier pollCheck(uint pollId) {
        require(polls[pollId].pollId > 0, "Poll not created");
        _;
>>>>>>> 15a488d8d9dbfa910c9226e278adcb3d7fd18431
    }


    modifier updateResult(uint pollId) 
    {

<<<<<<< HEAD
        if (polls[pollId].state ==  State.VOTING) {

            uint[] memory counts = new uint[](polls[pollId].choseFrom.length);
            uint i = 0;
            for(; i < polls[pollId].totalVote; i++) {
                for (uint j = 0; j < polls[pollId].choseFrom.length; j++) {
                    if (polls[pollId].choseFrom[j] == polls[pollId].votedChoices[i]) {
                        counts[j] += 1;
                        break;
                    }
=======
        if (polls[pollId].state == State.VOTING) {

            uint[] memory counts = new uint[](polls[pollId].choseFrom.length);

            for(uint i = 0; i < polls[pollId].totalVote; i++) {
                for (uint j = 0; j < polls[pollId].choseFrom.length; j++) {
                    if (polls[pollId].choseFrom[j] == pollResults[pollId].votedChoices[i]) { counts[j] += 1; break; }
>>>>>>> 15a488d8d9dbfa910c9226e278adcb3d7fd18431
                }
            }

            uint winnerVoteCount = 0;
<<<<<<< HEAD

            for (uint j = 0; j < polls[pollId].choseFrom.length; j++){
                if (counts[j] > winnerVoteCount) {
                    polls[pollId].result = polls[pollId].choseFrom[j];
                    winnerVoteCount = counts[j];
                }
            }

            // End vote in flight 
            if (polls[pollId].startTime + polls[pollId].votingDuration < block.timestamp) {
                polls[pollId].state = State.ENDED;
                emit voteEnded(polls[pollId].result);
=======
            for (uint j = 0; j < polls[pollId].choseFrom.length; j++){
                if (counts[j] > winnerVoteCount) { winnerVoteCount = counts[j]; }
            }

            Selection[] memory result;
            pollResults[pollId].result = result;
            for (uint j = 0; j < polls[pollId].choseFrom.length; j++){
                if (counts[j] == winnerVoteCount && winnerVoteCount != 0) {
                    pollResults[pollId].result.push(polls[pollId].choseFrom[j]);
                }
            }

            if (pollResults[pollId].result.length > 1) {
                pollResults[pollId].tie = true;
            } else {
                pollResults[pollId].tie = false;
            }

            // console.log("Timestamp needs to pass in sol", polls[pollId].startTime + polls[pollId].votingDuration);
            // console.log("current time in solidity - update", block.timestamp);
            // End vote in flight 
            if (polls[pollId].startTime + polls[pollId].votingDuration < block.timestamp) {
                // console.log("end!!!!!!!!!!!!!!!!!!");
                polls[pollId].state = State.ENDED;
                pollResults[pollId].state = State.ENDED;
                emit voteEnded(pollResults[pollId].tie, pollResults[pollId].result);
>>>>>>> 15a488d8d9dbfa910c9226e278adcb3d7fd18431
            }
        }

        _;
    }

<<<<<<< HEAD

    modifier voteCheck(uint pollId, Selection choice) 
    {
        require(polls[pollId].pollId > 0, "Poll not created");  
        require(polls[pollId].state == State.VOTING, "The poll has ended");
        require(polls[pollId].startTime + polls[pollId].votingDuration > block.timestamp, "Vote time has passed");
        //require(bytes(choice).length > 0, "No choice made yet");
=======
    modifier voteCheck(uint pollId, Selection choice) 
    {
        // console.log("trying to vote", block.timestamp);
        // console.log("Timestamp needs to pass in sol", polls[pollId].startTime + polls[pollId].votingDuration);
        require(polls[pollId].state == State.VOTING, "The poll has ended");
        require(polls[pollId].startTime + polls[pollId].votingDuration > block.timestamp, "Vote time has passed");

        bool inSel = false;
        for (uint i; i < polls[pollId].choseFrom.length; i++) {
            if (choice == polls[pollId].choseFrom[i]) { inSel = true; break; }
        }
        require(inSel, "Not selected from provided choices");
>>>>>>> 15a488d8d9dbfa910c9226e278adcb3d7fd18431

        _;
    }

<<<<<<< HEAD
    function vote(uint pollId, Selection choice)
=======
    modifier viewResultCheck(uint pollId)
    {
        //console.log("current time in solidity - check", block.timestamp);
        if (polls[pollId].blind) {
            require(polls[pollId].state == State.ENDED, "This voting is blind, still in voting");
            require(polls[pollId].startTime + polls[pollId].votingDuration < block.timestamp, "This voting is blind, result not revealed yet");
        }

        _;
    }

    // Do this when connecting to wallet and input a name 
    function registerParticipant(string memory _name) 
        existingParticipantCheck(msg.sender, _name)
        newParticipantCheck(_name) 
        external payable 
    {
        uint[] memory pollIds;
        uint[] memory tempViewPollIds;
        Participant memory newParticipant = Participant(msg.sender, _name, pollIds, tempViewPollIds);
        participants[msg.sender] = newParticipant;
        participantName[_name] = msg.sender;

        numberOfParticipant += 1;

        emit participantRegistered(_name);
    }

    function _newPoll(string memory name, string memory desc, uint dur, bool blind, bool aboutDAO, Selection[] memory sel, string[] memory selDesc)
        internal 
    {
        address[] memory voted;
        PollEvent memory newPoll = PollEvent(State.VOTING, nextPollId, msg.sender, name, desc, block.timestamp, dur, blind, aboutDAO, sel, selDesc, 0, voted);
        polls[nextPollId] = newPoll;
    }

    function _newPollResult() internal
    {
        PollResult memory newPollResult;
        pollResults[nextPollId] = newPollResult;
    }

    function createPoll(string memory name, string memory desc, uint dur, bool blind, bool aboutDAO, Selection[] memory sel, string[] memory selDesc) 
        participantCheck()
        newPollCreateionCheck(name, desc, dur, sel, selDesc) 
        external
    {
        participants[msg.sender].pollIds.push(nextPollId);

        _newPoll(name, desc, dur, blind, aboutDAO, sel, selDesc);
        _newPollResult();

        nextPollId += 1;

        emit pollCreated(msg.sender, name, dur, blind, aboutDAO);
    }

    function vote(uint pollId, Selection choice)
        participantCheck()
        pollCheck(pollId)
>>>>>>> 15a488d8d9dbfa910c9226e278adcb3d7fd18431
        updateResult(pollId) 
        voteCheck(pollId, choice) 
        external
    {
<<<<<<< HEAD
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

=======
        bool voted = false; // Reflects first vote or change of mind vote
        uint i = 0;
        for (; i < polls[pollId].voted.length; i++) {
            if (polls[pollId].voted[i] == msg.sender) { voted = true; break; }
        }

        if (voted) {
            pollResults[pollId].votedChoices[i] = choice;
        } else {
            polls[pollId].totalVote += 1;
            polls[pollId].voted.push(msg.sender);
            pollResults[pollId].votedChoices.push(choice);
        }
        emit voteDone(msg.sender, voted); 
    }

    function viewResult(uint pollId) 
        pollCheck(pollId)
        updateResult(pollId) 
        viewResultCheck(pollId)
        external
    {
        emit resultViewed(pollResults[pollId].tie, pollResults[pollId].result, polls[pollId].state, polls[pollId].blind);
    }

    function viewPoll(uint pollId) 
        pollCheck(pollId)
        updateResult(pollId) 
        external
    {   
        emit pollViewed(polls[pollId]);
    }

    function filterPoll(uint pollId, FILTER isBlind, FILTER aboutDAO) 
        pollCheck(pollId)
        updateResult(pollId) 
        internal returns (uint)
    {   
        if (isBlind == FILTER.IN && !polls[pollId].blind ) return 0;
        if (isBlind == FILTER.OUT && polls[pollId].blind ) return 0;
        if (aboutDAO == FILTER.IN && !polls[pollId].aboutDAO ) return 0;
        if (aboutDAO == FILTER.OUT && polls[pollId].aboutDAO ) return 0;
        return pollId;
    }

    function viewAllPolls(bool byMe, FILTER isBlind, FILTER aboutDAO)
        participantCheck()
        external 
    {
        uint[] memory tempViewPollIds;
        participants[msg.sender].tempViewPollIds = tempViewPollIds;
        if (byMe) {
            for (uint i = 0; i < participants[msg.sender].pollIds.length; i++) {
                if (filterPoll(participants[msg.sender].pollIds[i], isBlind, aboutDAO) != 0) {
                    participants[msg.sender].tempViewPollIds.push(participants[msg.sender].pollIds[i]);
                }
            }
        } else {
            for (uint i = 1; i < nextPollId; i++) {
                if (filterPoll(i, isBlind, aboutDAO) != 0) {
                    participants[msg.sender].tempViewPollIds.push(i);
                }
            }
        }
        emit pollsViewed(participants[msg.sender].tempViewPollIds);
    }

    // Helper functions for testing
    function getParticipantCreatedPollIds() public view returns (uint[] memory) {
        return participants[msg.sender].pollIds;
    }

    function getFilteredViewPollIds() public view returns (uint[] memory) {
        return participants[msg.sender].tempViewPollIds;
    }
}
>>>>>>> 15a488d8d9dbfa910c9226e278adcb3d7fd18431

// SPDX-License-Identifier: MIT
// DAO - 道可道, 非常道.
// some of the logic cited from Jackson Ng's ballot.sol and solidity official documentation
// However, this contract incorporates some theories of DAO to achieve a higher autonomous level
// Everyone is able to organize a voting event

pragma solidity >=0.8.0;


// Preliminary version without time, delegation, blind vote
contract Poll {

    uint256 constant public registrationPrice = 100000000000000000;

    enum State { VOTING, ENDED }
    enum Selection { YES, NO, A, B, C, D }

    // struct time{
    //     uint year;
    //     uint month;
    //     uint day;
    // }

    struct Participant{
        address participantAddr;
        string voterName;
        address delegate;
        //address[] represent;
    }

    struct PollEvent{
        State state;
        uint pollId;
        string name;
        string description;        
        uint votingDuration;
        bool blind; // Show result in real time or in the end 
        bool aboutDAO; // The prposal is about this dao (tag type)        
        Selection[] choseFrom;
        uint totalVote;
        address[] voted; // An array to store who has already voted 
        Selection[] votedChoices; // An array to store voter's choices 
        Selection result;
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

    modifier newParticipantCheck(string memory name){
        require(bytes(name).length > 0, "Participant name is empty");
        require(participantName[name] == address(0x0), "Participant already registered");

        require(msg.value >= registrationPrice, "Asset not enough to register");
        require(msg.value == registrationPrice, "Amount sent not equal to the registration price");
        _;
    }

    // Do this when connecting to wallet 
    function registerParticipant(string memory _name) newParticipantCheck(_name) public payable {
        Participant memory newParticipant = Participant(msg.sender, _name, address(0x00));
        participants[msg.sender] = newParticipant;
        participantName[_name] = msg.sender;

        emit participantRegistered(_name);
    }

    modifier participantLookUpCheck(string memory name){
        require(bytes(name).length > 0, "Participant name is empty");
        require(participantName[name] != address(0x0), "Can't find the name in all participants");
        _;
    }

    function lookUpParticipant(string memory _name) participantLookUpCheck(_name) public view returns (address) {
        return participantName[_name];
    }

    //       /// Delegate your vote to the voter `to`.
    // function delegate(address to) external {
    //     // assigns reference
    //     Voter storage sender = voters[msg.sender];
    //     require(!sender.voted, "You already voted.");

    //     require(to != msg.sender, "Self-delegation is disallowed.");

    //     // Forward the delegation as long as
    //     // `to` also delegated.
    //     // In general, such loops are very dangerous,
    //     // because if they run too long, they might
    //     // need more gas than is available in a block.
    //     // In this case, the delegation will not be executed,
    //     // but in other situations, such loops might
    //     // cause a contract to get "stuck" completely.
    //     while (voters[to].delegate != address(0)) {
    //         to = voters[to].delegate;

    //         // We found a loop in the delegation, not allowed.
    //         require(to != msg.sender, "Found loop in delegation.");
    //     }

    //     // Since `sender` is a reference, this
    //     // modifies `voters[msg.sender].voted`
    //     Voter storage delegate_ = voters[to];

    //     // Voters cannot delegate to wallets that cannot vote.
    //     require(delegate_.weight >= 1);
    //     sender.voted = true;
    //     sender.delegate = to;
    //     if (delegate_.voted) {
    //         // If the delegate already voted,
    //         // directly add to the number of votes
    //         proposals[delegate_.vote].voteCount += sender.weight;
    //     } else {
    //         // If the delegate did not vote yet,
    //         // add to her weight.
    //         delegate_.weight += sender.weight;
    //     }
    // }

    // function cancel delegation


    modifier newPollCreateionCheck(string memory name, string memory desc, uint dur, Selection[] memory sel) 
    {
        require(bytes(name).length > 0, "Poll name is empty");
        require(bytes(desc).length > 0, "Poll description is empty");
        require(dur > 0, "Poll duration is empty");
        require(sel.length > 0, "Choice to select from not given");
        
        _;
    }

    function createPoll(string memory name, string memory desc, uint dur, bool blind, bool aboutDAO, Selection[] memory sel) 
        newPollCreateionCheck(name, desc, dur, sel) public
    {

        require(participants[msg.sender].participantAddr != address(0x00), "Participant not registered in the system");

        address[] memory voted;
        Selection[] memory votedChoices;
        Selection result;
        PollEvent memory newPoll = PollEvent(State.VOTING, nextPollId, name, desc, dur, blind, aboutDAO, sel, 0, voted, votedChoices, result);
        polls[nextPollId] = newPoll;

        emit pollCreated(msg.sender, name, dur, blind, aboutDAO);
    }

    modifier voteCheck(uint pollId, Selection choice) 
    {
        PollEvent storage thisPoll = polls[pollId];
        require(thisPoll.pollId > 0, "Poll not created");
        require(thisPoll.state == State.VOTING, "The poll has ended");
        //require(bytes(choice).length > 0, "No choice made yet");

        _;
    }

    function vote(uint pollId, Selection choice)
        voteCheck(pollId, choice) public 
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
    
    // //end votes -> change to the time later 
    // // Return to all adresses 
    // function endVote()
    //     public
    //     inState(State.Voting)
    //     onlyOfficial
    // {
    //     state = State.Ended;
    //     finalResult = countResult; //move result from private countResult to public finalResult
    //     emit voteEnded(finalResult);
    // }

    // function viewTempResult()


    function viewResult(uint pollId) public view returns (Selection)
    {
        PollEvent memory thisPoll = polls[pollId];

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

        return thisPoll.result;
    }
}


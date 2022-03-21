# Whitepaper 

## Introduction 
Online voting is a trend that is gaining momentum in our society. It lowers the organizational costs and potentially increase voter turning. It eliminates the needs to prepare ballot papers and open polling stations, which means voters can voter as long as there is a secure internet connections. Our application is designed to allow users to create a voting events with many features using blockchain technologies. Also, this application is very useful in an open source community. People can propose a change of design or new development ideas, and stakeholders in the community can vote to pass or reject this proposal. 

## Features
1.	The resources, including the power to organize an event and vote an event, are shared among community.
2.	The decision of proposed events is made by everyone in the community.
3.	The accountability of voting results lies in every individual in the community.

## Basic Functions
### Participant ```struct Participant```
-	can create a voting event with various features such as blind voting and tags.
-	can vote in any event as long as a gas fee is paid.
- can re-vote in any ongoing event without paying any extra fees.

### Voting Event ```struct PollEvent```
-   is associated with a voting event id ```uint pollId``` and can be viewed in public ```mapping(uint => PollEvent) public polls```;
-	has a mechanism to end the voting with timed stop ```uint votingDuration```;
-   has a mechanism to present results in real time or encrypted them before poll ends ```bool blind```.


### Poll Result ```struct PollResult```
-   is associated with a voting event id ```uint pollId```, but can not be viewed publicly. ```mapping(uint => PollResult) private pollResults```;
-   can present events having a tie ```bool tie```.

## Additional Functions
-   Filter with blind voting 
-   Filter with votes created by me
-   Filter with poll type (a concrete proposal, such as saving🐰 or protect 🌲; or proposals on directions of changing the dao/dapp)

## How related to front end (wireframe, maybe insertign it
- View 1: Connect to wallet, login/ register (p.1)
```
event participantRegistered(string name);
event participantLoggedIn(string name);
```

- View 2: create a poll event (p.3) 
```
event pollCreated(address organizer, string name, uint dur, bool blind, bool aboutDAO);
```

- View 3: view result (p.6) 
```
event resultViewed(bool tie, Selection[] result, State state, bool blind);
```

- View 4: view one poll and vote (p.5)
```
event pollViewed(PollEvent poll);
event voteDone(address voter, bool voted);
```

- View 5: view multiple polls with filters (p.2)
```
event pollsViewed(uint[] pollIds);
```

- No control event, only determined by a poll's starting time and voting duration
```
event voteEnded(bool tie, Selection[] result);
```

## References

### Skeleton ballot contract code:
- https://github.com/jacksonng77/ballot/blob/master/ballot.sol
- https://docs.soliditylang.org/en/v0.8.13/solidity-by-example.html

### Some famous DAO projects descriptions
- Snapshot: https://github.com/Dapp-Learning-DAO/Dapp-Learning/tree/main/basic/40-snapshot
- DAOhaus https://github.com/Dapp-Learning-DAO/Dapp-Learning/blob/main/dao/DAOhaus/About-DAOhaus.md
- Aragon https://github.com/Dapp-Learning-DAO/Dapp-Learning/tree/main/dao/Aragon

### Web3
- lecture recording: https://github.com/sparklin0812/dapp-tutorial
- alchemy: https://github.com/alchemyplatform/hello-world-part-four-tutorial
- alchemy: https://docs.alchemy.com/alchemy/tutorials/hello-world-smart-contract/part-4

## Some Philosophical Detours
- We find it interesting that DAO is pronounced the same way in a Chinese word "道". The saying by Chinese philosopher Lao Tzu, "道可道, 非常道", meaning that "the true way cannot be taught", precisely depicts the intricacies of DAO.
- The idea of timed stop follows what Neo–Confucian philosopher Wang Yangming said "你未看此花时，此花与汝同归于寂；你来看此花时，则此花颜色一时明白起来", which means that "the flower only blooms when you see it". By analogy to this, the voting only stops when someone checks it status, such as voting or reviewing results, in this contract. Aave also updates its interest rates in a similar way.

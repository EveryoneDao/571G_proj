# Whitepaper 

## Play with The Project
- Register into the platform with your metamask wallet connected under ropsten testnet: https://everyonedao.netlify.app/

- Please get some testnet tokens from the faucet: https://faucet.egorfine.com/
before playing with the website

- Familiarize with some features with the walkthrough video: https://youtu.be/x8E5bG7jZxU

## Project Descriptions 

- See wireframe about frontend web design: [docs/wireframe.pdf](docs/wireframe.pdf)

- See report about motivation, implementations, and code reflections: [docs/Report.pdf](docs/Report.pdf)

- See features from the report
    - multiple events (Figure 4)
    - re-vote (Figure 12)
    - autonomously timed stop (see section 5.2)
    - trust-based blind result view (see section 7.3)
    - tag filters in the dashboard (Figure 5)
    - tie status

- Workshop recording [TODO]

## Build a DAO of your own community
- Essential command lines after downloading the repo: [docs/command_lines_walkthrough.md](docs/command_lines_walkthrough.md)

- .env setup instructions: [docs/env.md](docs/env.md)

- Instructions for deploying your smart contract: [docs/Deploy_your_Smart_Contracts.pdf](docs/Deploy_your_Smart_Contracts.pdf)

- Instructions for deploying the website [TODO]

## References

### News
- https://www.vice.com/en/article/bvn5am/andrew-yangs-web3-lobbying-group-wants-to-end-poverty-with-vote-buying
- https://blog.coinbase.com/cryptos-emergence-as-a-geopolitical-force-30f29d62e562

### Ballot contract starter code
- https://github.com/jacksonng77/ballot/blob/master/ballot.sol
- https://docs.soliditylang.org/en/v0.8.13/solidity-by-example.html

### Some famous DAO projects’ descriptions
- Snapshot: https://snapshot.org/#/
- DAOhaus https://daohaus.club/
- Aragon https://github.com/Dapp-Learning-DAO/Dapp-Learning/tree/main/dao/Aragon

### Web3
- lecture recording: https://github.com/sparklin0812/dapp-tutorial
- alchemy: https://github.com/alchemyplatform/hello-world-part-four-tutorial
- alchemy: https://docs.alchemy.com/alchemy/tutorials/hello-world-smart-contract/part-4

## Some Philosophical Detours
- We find it interesting that DAO is pronounced the same way in a Chinese word "道". The saying by Chinese philosopher Lao Tzu, "道可道, 非常道", meaning that "the true way cannot be taught", precisely depicts the intricacies of DAO.
- The idea of timed stop follows what Neo–Confucian philosopher Wang Yangming said "你未看此花时，此花与汝同归于寂；你来看此花时，则此花颜色一时明白起来", which means that "the flower only blooms when you see it". By analogy to this, the poll only stops when someone checks it status, such as voting or reviewing results, in this contract. Aave also updates its interest rates in a similar way.


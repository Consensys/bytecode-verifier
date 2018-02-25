# Breaking down Bytecode
Open source projects benefit from community contributions and more than one pair of inspective eyes, which would be made possible with not only publicly accessible source code, but more detail walk-through of some of rationale/insight behind.

This post breaks down the bytecode compiled from [solidity complier (a.k.a. solc)](https://github.com/ethereum/solc-js) and highlight the structure of the bytecode which hopefully help developers better understand the [bytecode verifier tool](https://github.com/ConsenSys/bytecode-verifier).

(apparently, always refer to [solidity official documentation](http://solidity.readthedocs.io/en/develop/) for ultimate source of reference in case of version update.)

We will illustrate through an example: **[DigiMarketCrowdsale contract on etherscan](https://kovan.etherscan.io/address/0xc2e5a20673803fc1df4c71d98a56cefa33a2d0e8) on Kovan testnet**.

# Smart Contract Structure
![digix crowdsale contract structure](../master/assets/digi_crowdsale_structure.png)

As we could see from [DigixCrowdsale Contract Code](../master/assets/DigiMarketCrowdsale.sol), the part we are interested in are the crowdsale related contracts whose structure is shown above. There are multiple layers of inheritance, which results in a more complicated (*until you understand it*) bytecode.

# Bytecode from Blockchain

Breaking down the huge chunk of bytecode, it comprises of the following components all concatenated together.
```shell
|-- Actual Deployed Code of DigiMarketCrowdsale.sol
|-- Constructor of RefundableCrowdsale.sol
|-- Actual deployed code of RefundableCrowdsale.sol
|-- Swarm Hash (generated on runtime) of RefundableCrowdsale.sol
|-- Constructor of CappedCrowdsale.sol
|-- Actual deployed code of CappedCrowdsale.sol
|-- Swarm hash for CappedCrowdsale.sol
|-- Swarm hash for the entire contract, i.e. DigiMarketCrowdsale.sol
```

To see the corresponding bytecode respect to each components above, see this [from_blockchain.txt with comment](../master/assets/from_blockchain.txt).

It's clear that only the *direct parent* or *depth of inheritance of 1* are included in the deployed code, which in our case is `RefundableCrowdsale contract` and `CappedCrowdsale contract`

# Bytecode from Etherscan

This [from_etherscan.txt](../master/assets/from_etherscan.txt) is a break-down of the bytecode provided on etherscan.

Noticing that there are a couple of differences compared to what's been actually stored on chain, Etherscan:
- prepends constructor of `DigiMarketCrowdsale` contract. (which is an intermediate bytecode generated only during contract creation, and it does make sense to store only the deployed code not the creation code on-chain)
- includes bytecode for contracts and their Swarm Hashes with higher depth of inheritance.
- append *Initialization Parameters* to the bytecode, which also was only used during creation and not stored in actual deployed code.

**IMPORTANT!**: one could notice that on [etherscan](https://kovan.etherscan.io/address/0xc2e5a20673803fc1df4c71d98a56cefa33a2d0e8#code), they claimed that *Swarm source* is `bzzr://1229ce8b9f64190c5013afdf7e662806ba3a541af549d0c11b8e0376b6795e71`, which is believed to be the swarm source of `CappedCrowdsale`. The real swarm hash for the entire `DigiMarketCrowdsale.sol` should be `bzzr://809cc4332e02f7e2b4e72ab517175ce5b3cd934c9def2916cc3360b1a6e69598`
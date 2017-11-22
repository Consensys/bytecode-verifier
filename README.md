# Bytecode Verifier
*Bytecode Verifier* is a handy commandline tool for verifying locally compiled bytecode of a target Solidity contract against its actual bytecode stored in Etheruem Blockchain provided its contract address. This tool:

* **integrity/correctness of bytecode**: what's actually being stored on chain is correctly compiled from particular contract, which might be helpful in case of non-trivial potential high-value holder contract deployment(e.g. MultiSig Wallet), especially the contract is deployed through a third party platform.
* **Minimimal effort, simple to use**: solidity compiler envolves overtime with minor and some major changes, which complicates the verification of bytecode. (as recurring "bytecode doesn't match" questions being asked on Ethereum Stack Exchange). *Bytecode Verifier* has been tested against latest version all the way back to some of the oldest deployed contracts.
* **Testnet friendly**: most projects launch on testnet before deploying the contract system to mainnet, this tool supports Rinkeby, Kovan and Ropsten Testnet, which constitute three active, well-maintained testnets that most ethereum developers use.

# Installation
Prefer global install:
```shell
npm install eth-bytecode-verifier -g
```

If successfully installed, try the `-h` or `--help` to read a brief info about this tool.
```shell
ethv --help
```
![ethv_help](../master/assets/ethv_help.png)

# Quick Usage

## ethv verify \<chainChoice>
*! Currently this tool can verify contracts on: mainnet, kovan, ropsten and rinkeby (NOTE: for contracts on Rinkeby, only compiler version no earlier than **0.4.9**)!*
1. Save the contract code into a file with name `*YourContractName*.sol`.
 *If your contract imports other contract in a separate file or it consists of multiple contracts, please do name the file as the main contract since that's what's the bytecode we tend to verify.(e.g. `contract StandardToken is Token {}`, then `StandardToken.sol` should be the file name.)*

2. The `ethv` verifier will prompt 4 questions. Among which, be careful about the format of compiler version specification. If you are not sure, try run `ethv compiler` first, and copy the legitimate version string from the output.

3. If bytecode of your local file checks out with what's actually on the blockchain address, then terminal will return positive feedback, otherwise red bold alert feedback will be returned.

#### Example1: Golem_MultiSigWallet (mainnet)
![golem_multisig](../master/example/GolemMultisig/ethv_golem_multisig.png)

#### Example2: Oraclize (kovan)
![oraclize_kovan](../master/example/Oraclize(kovan)/oraclize_kovan.png)

*For more example: please go to [example subfolder](https://github.com/ConsenSys/bytecode-verifier/tree/master/example)*

## ethv --list

To quickly get a list of formal major release version of solidity compiler.

![ethv_list](../master/assets/ethv_list.png)

## ethv compiler

To look up for an intermediate "nightly" version of solidity compiler

![ethv_compiler](../master/assets/ethv_compiler.png)

# Contributing
This bytecode verifier is entirely open sourced, anyone in the community is free to use in any purpose. (see MIT License for details) More importantly, any issues or pull request are more than welcomed. According `npm package` can be found (here)[https://www.npmjs.com/package/eth-bytecode-verifier].

# Acknowledgement 
Big thanks and great gratitude to [ConsenSys Diligence](https://medium.com/@c.diligence) for making this project possible.

# Bytecode Verifier
The purpose of this tool is to verify that the Contract Source on etherscan matches the bytecode that's actually on the blockchain.  If the code shown on etherscan does not match the blockchain, the tool must display a danger sign.  The purpose of the tool is to warn people if the Contract Source information on etherscan has been tampered with.

# Installation
Prefer global install:
```shell
npm install eth-bytecode-verifier -g
```

Or install as per project base dev-dependency:
```shell
npm install --save-dev eth-bytecode-verifier
```

If successfully installed, try the `-h` or `--help` to read a brief info about this tool.
```shell
ethv --help
```
![ethv_help](../master/assets/ethv_help.png)

# Usage

## ethv --list

To quickly get a list of formal major release version of solidity compiler.

![ethv_list](../master/assets/ethv_list.png)

## ethv compiler

To look up for an intermediate "nightly" version of solidity compiler

![ethv_compiler](../master/assets/ethv_compiler.png)
## ethv verify

1. Save the contract code into a file with name `*YourContractName*.sol`.
 *If your contract imports other contract in a separate file or it consists of multiple contracts, please do name the file as the main contract since that's what's the bytecode we tend to verify.(e.g. `contract StandardToken is Token {}`, then `StandardToken.sol` should be the file name.)*

2. The `ethv` verifier will prompt 4 questions. Among which, be careful about the format of compiler version specification. If you are not sure, try run `ethv compiler` first, and copy the legitimate version string from the output.

3. If bytecode of your local file checks out with what's actually on the blockchain address, then terminal will return positive feedback, otherwise red bold alert feedback will be returned.

#### Example: Golem_MultiSigWallet
![golem_multisig](../master/example/GolemMultisig/ethv_golem_multisig.png)

*For more example: please go to [example subfolder](https://github.com/ConsenSys/bytecode-verifier/tree/master/example)*

# Contributing
This bytecode verifier is entirely open sourced, anyone in the community is free to use in any purpose. (see MIT License for details) More importantly, any issues or pull request are more than welcomed. According `npm package` can be found (here)[https://www.npmjs.com/package/eth-bytecode-verifier].

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

# Usage 

## verifier-help 
Run this command anywhere and console will output a help text on how to use verifier and what parameters need to be passed on.

Example Screenshot:
![help_text](../assets/verifier-help.png)

## solc-version 
Run this command anywhere and console will output a list of available solidity compiler versions you can choose from.

Example Screenshot:
![solc_version](../assets/solc-version.png)


## verify [solc_version] [file_name] [contract_address] [optimizer_enable]
Copy the contract code and pasted it into a file in your current directory, name it with the exact same name as the contract with `.sol` extentions. Then run this command, if not sure about the solidity compiler version, run `solc-version` for more detail. 

Example Screenshot:
![file_upload](../assets/file_upload.png)
![verify](../assets/verify.png)
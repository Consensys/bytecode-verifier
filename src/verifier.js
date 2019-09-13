const solc = require('solc');
const Web3 = require('web3');
const fs = require('fs');
const chalk = require('chalk');
/*
  Function [verifier]
*/

const verifier = (answers, provider) =>{
  var web3 = new Web3( new Web3.providers.HttpProvider(provider));
  let solc_version = answers['solc_version'];
  let file_name = answers['file_name'];
  let contract_address = answers['contract_address'];
  let is_optimized = (answers['is_optimized'] === "1") ? true : false;
  let file_folder = answers['file_folder'];

  console.log('Current working directory: '+file_folder)
  // make sure the file to be compiled in under current folder
  var file_path = file_folder +'/'+file_name;
  console.log('File being compiled and compared: '+file_name);
  // read contract file as input or log err message otherwise
  var input = fs.readFileSync(file_path,'utf8');
  var bytecode_from_compiler;
  var bytecode_from_blockchain;
  console.log('==========================================')
  console.log('Compiler Version: '+solc_version)
  // use specified solc version on the fly by loading from github
  console.log(chalk.bold.green('Compiling in progress, ')+' Please be patient...')

  solc.loadRemoteVersion(solc_version, function(err, solc_specific){
  	if(err){
  		console.log('Solc failed to loaded'+err);
	  }
	  
	var input_json = {  language: "Solidity",
						sources: 
							{file: {"content": input} },
						settings: {
									optimizer: {
										// disabled by default
										enabled: is_optimized,
										runs: 200
									},
									outputSelection: {
									"*": {
										"*": [ "*" ]
										}
									}
  								}
					
						}	
  	// if solc successfully loaded, compile the contract and get the JSON output
  	var output = JSON.parse(solc_specific.compile(JSON.stringify(input_json)));
	  // get bytecode from JSON output
	let solc_minor = parseInt(solc_version.match(/v\d+?\.\d+?\.\d+?[+-]/gi)[0].match(/\.\d+/g)[0].slice(1))
	let solc_patch = parseInt(solc_version.match(/v\d+?\.\d+?\.\d+?[+-]/gi)[0].match(/\.\d+/g)[1].slice(1))

	try {
		// single contract
		var bytecode = output["contracts"][''][file_name.slice(0,file_name.length-4)]['evm']['deployedBytecode']['object']
	} catch (err) {
		// multi-contract file. using the contract with the same name as the file_name
		console.log("Multi contract file detected. Compiling the main contract: " + file_name.slice(0,file_name.length-4))
		var bytecode = output["contracts"]["file"][file_name.slice(0,file_name.length-4)]['evm']['deployedBytecode']['object']
	}

    if ((solc_minor >= 4) && (solc_patch >= 7)){
      // if solc version is at least 0.4.7, then swarm hash is included into the bytecode.
      // every bytecode starts with a fixed opcode: "PUSH1 0x60 PUSH1 0x40 MSTORE"
    	// which is 6060604052 in bytecode whose length is 10
      
    	// every bytecode from compiler would have constructor bytecode inserted before actual deployed code.
    	// the starting point is a fixed opcode: "CALLDATASIZE ISZERO"
		// which is 3615 in bytecode

		if (solc_minor >= 4 && solc_patch >= 22) {
			// if solc version is at least 0.4.22, initial bytecode has 6080... instead of 6060...
			var starting_point = bytecode.lastIndexOf('6080604052');
			// a165627a7a72305820 is a fixed prefix of swarm info that was appended to contract bytecode
			// the beginning of swarm_info is always the ending point of the actual contract bytecode

		} else if (solc_patch < 4 && solc_patch >= 7) {
			// if solc version is at least 0.4.7, then swarm hash is included into the bytecode.
			// every bytecode starts with a fixed opcode: "PUSH1 0x60 PUSH1 0x40 MSTORE"
			// which is 6060604052 in bytecode whose length is 10
			// var fixed_prefix= bytecode.slice(0,10);

			// every bytecode from compiler may or may not have constructor bytecode inserted before
			// actual deployed code (since constructor is optional).So there might be multiple matching
			// prefix of "6060604052", and actual deployed code starts at the last such pattern.
			var starting_point = bytecode.lastIndexOf('6060604052');
			// a165627a7a72305820 is a fixed prefix of swarm info that was appended to contract bytecode
			// the beginning of swarm_info is always the ending point of the actual contract bytecode
		}
		
		// var starting_point = (bytecode.search('3615') >= 0) ? bytecode.search('3615') : 0;
	
    	// a165627a7a72305820 is a fixed prefix of swarm info that was appended to contract bytecode
    	// the beginning of swarm_info is always the ending point of the actual contract bytecode
		var ending_point = bytecode.search('a165627a7a72305820');
		
		
    	// construct the actual deployed bytecode
    	bytecode_from_compiler = '0x' + bytecode.slice(starting_point, ending_point);
    	console.log()
    	console.log('==========================================')
		console.log('Finish compiling contract using solc compiler...');
		// testify with result from blockchain until the compile finishes.
    	testify_with_blockchain(solc_version);
    }
  	else{
	  bytecode_from_compiler = '0x'+bytecode;
      	console.log()
    	console.log('==========================================')
		console.log('Finishing compiling contract using solc compiler...');
    	// testify with result from blockchain until the compile finishes.
    	testify_with_blockchain(solc_version);
    }
  });

  function testify_with_blockchain(solc_version){
  	// using web3 getCode function to read from blockchain
  	web3.eth.getCode(contract_address)
  	.then(output =>{
      if (parseInt(solc_version.match(/v\d+?\.\d+?\.\d+?[+-]/gi)[0].match(/\.\d+/g)[0].slice(1)) >= 4
       && parseInt(solc_version.match(/v\d+?\.\d+?\.\d+?[+-]/gi)[0].match(/\.\d+/g)[1].slice(1)) >= 7){
        // code stored at the contract address has no constructor or contract creation bytecode,
    		// only with swarm metadata appending at the back, therefore to get the actual deployed bytecode,
    		// just slice out the trailing swarm metadata.
    		var ending_point = output.search('a165627a7a72305820');

    		var swarm_hash_full = output.slice(output.lastIndexOf("a165627a7a72305820"), -4);
        var swarm_hash = swarm_hash_full.slice(18);
  
    		bytecode_from_blockchain = output.slice(0,ending_point);
    		console.log()
    		console.log('==========================================')
    		console.log('Finishing retrieving bytecode from blockchain...');
    		console.log("Corresponding swarm hash is: bzzr:/" + swarm_hash);

    		if (bytecode_from_blockchain == bytecode_from_compiler){
    			console.log()
    			console.log('==========================================')
    			console.log(chalk.bold.underline.green("Bytecode Verified!!"))
    		}
    		else{
    			console.log()
    			console.log('==========================================')
    			console.log(chalk.bold.underline.red("Bytecode doesn't match!!"))
    		}
      }
      // if the solc version is less than 0.4.7, then just directly compared the two.
      else{
		bytecode_from_blockchain = output;
    		console.log()
    		console.log('==========================================')
    		console.log('Finishing retrieving bytecode from blockchain...');

    		if (bytecode_from_blockchain == bytecode_from_compiler){
    			console.log()
    			console.log('==========================================')
    			console.log(chalk.bold.underline.green("Bytecode Verified!!"))
    		}
    		else{
    			console.log()
    			console.log('==========================================')
    			console.log(chalk.bold.underline.red("Bytecode doesn't match!!"))
    		}
	  }

  	});
  }

};

module.exports = {verifier};

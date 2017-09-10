const solc = require('solc');
const Web3 = require('web3');
const web3 = new Web3( new Web3.providers.HttpProvider("https://mainnet.infura.io"));
const fs = require('fs');

// get solc version from the first param on terminal console 
var solc_version = process.argv[2]
// get file name to compile from the second param on terminal console
var file_name = process.argv[3];
// get contract address from the third param on terminal console
var contract_address = process.argv[4];
// get choice of optimization (0:no,1:yes) from the fourth param on the terminal console
var is_optimized = process.argv[5];
// get the current folder path
var file_folder = __dirname;
// make sure the file to be compiled in under current folder
var file_path = file_folder +'/'+file_name; 

// read contract file as input or log err message otherwise
var input = fs.readFileSync(file_path,'utf8');
var bytecode_from_compiler;
var bytecode_from_blockchain;
console.log('==========================================')
console.log('Compiler Version: '+solc_version)
// use specified solc version on the fly by loading from github
solc.loadRemoteVersion(solc_version, function(err, solc_specific){
	if(err){
		console.log('Solc failed to loaded'+err);
	} 
	// if solc successfully loaded, compile the contract and get the JSON output
	var output = solc_specific.compile(input, is_optimized);
	// get bytecode from JSON output
	var bytecode = output['contracts'][':'+''+file_name.slice(0,file_name.length-4)]['bytecode'];
	// every bytecode starts with a fixed opcode: "PUSH1 0x60 PUSH1 0x40 MSTORE"
	// which is 6060604052 in bytecode whose length is 10
	var fixed_prefix= bytecode.slice(0,10);
	// every bytecode from compiler would have constructor bytecode inserted before actual deployed code.
	// the starting point is a fixed opcode: "CALLDATASIZE ISZERO"
	// which is 3615 in bytecode
	var starting_point = bytecode.search('3615');
	var remaining_part = bytecode.slice(starting_point);
	// a165627a7a72305820 is a fixed prefix of swarm info that was appended to contract bytecode
	// the beginning of swarm_info is always the ending point of the actual contract bytecode
	var ending_point = bytecode.search('a165627a7a72305820');
	// construct the actual deployed bytecode
	bytecode_from_compiler = '0x'+fixed_prefix + bytecode.slice(starting_point, ending_point);

	// the length of swarm prefix is 18
	var swarm_starting = ending_point + 18;
	// the length of swarm suffix is 4 (which is 0029, a trailing substring you see in every contract's bytecode)
	var swarm_ending = bytecode.length - 4;
	var swarm_hash = bytecode.slice(swarm_starting,swarm_ending);
	console.log()
	console.log('==========================================')
	console.log('result is written in "from_compiler.txt" file');
	console.log('Corresponding swarm hash is: 0x'+swarm_hash);
	fs.writeFileSync('from_compiler.txt',+bytecode_from_compiler, 'utf8');
	// testify with result from blockchain until the compile finishes.
	testify_with_blochchain();
});

function testify_with_blochchain(){
	// using web3 getCode function to read from blockchain
	web3.eth.getCode(contract_address)
	.then(output =>{
		// code stored at the contract address has no constructor or contract creation bytecode,
		// only with swarm metadata appending at the back, therefore to get the actual deployed bytecode,
		// just slice out the trailing swarm metadata.
		var ending_point = output.search('a165627a7a72305820');
		var swarm_starting = ending_point + 18;
		var swarm_ending = output.length -4;
		var swarm_hash = output.slice(swarm_starting, swarm_ending);
		bytecode_from_blockchain = output.slice(0,ending_point);

		fs.writeFileSync('from_blockchain.txt', bytecode_from_blockchain, 'utf8');
		console.log()
		console.log('==========================================')
		console.log('result is written in "from_blockchain.txt" file');
		console.log("Corresponding swarm hash is: 0x" + swarm_hash);

		if (bytecode_from_blockchain == bytecode_from_compiler){
			console.log()
			console.log('==========================================')
			console.log("Bytecode Verified!!")
		}
		else{
			console.log()
			console.log('==========================================')
			console.log("Bytecode doesn't match!!")
		}		
	});	
}


const solc = require('solc');
var solc_version = process.argv[2]
const solc_specific = solc.useVersion(solc_version);

const Web3 = require('web3');
const web3 = new Web3( new Web3.providers.HttpProvider("https://mainnet.infura.io"));

const fs = require('fs');

var file_folder = __dirname;
var file_name = process.argv[3];
var contract_address = process.argv[4];
var is_optimized = process.argv[5];

var file_path = file_folder +'/'+file_name; 

var input = fs.readFileSync(file_path,'utf8');
console.log('==========================================')
console.log('Compiler Version: '+solc_specific.version())
var bytecode = solc_specific.compile(input,is_optimized)['contracts'][':'+''+file_name.slice(0,file_name.length-4)]['bytecode'];

fixed_prefix= bytecode.slice(0,10);
starting_point = bytecode.search('3615');
remaining_part = bytecode.slice(starting_point);
ending_point = bytecode.search('a165627a7a72305820');
result = fixed_prefix + bytecode.slice(starting_point, ending_point);

swarm_starting = ending_point + 18;
swarm_ending = bytecode.length - 4;
swarm_hash = bytecode.slice(swarm_starting,swarm_ending);
console.log()
console.log('==========================================')
console.log('result is written in "from_compiler.txt" file');
console.log('Corresponding swarm hash is: 0x'+swarm_hash);
fs.writeFileSync('from_compiler.txt','0x'+result, 'utf8');



web3.eth.getCode(contract_address)
.then(output =>{
	var ending_point = output.search('a165627a7a72305820');
	var swarm_starting = ending_point + 18;
	var swarm_ending = output.length -4;
	var swarm_hash = output.slice(swarm_starting, swarm_ending);
	output = output.slice(0,ending_point);
	fs.writeFileSync('from_blockchain.txt', output, 'utf8');
	console.log()
	console.log('==========================================')
	console.log('result is written in "from_blockchain.txt" file');
	console.log("Corresponding swarm hash is: 0x" + swarm_hash);

	if (result = output){
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


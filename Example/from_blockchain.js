const Web3 = require('web3');
const web3 = new Web3( new Web3.providers.HttpProvider("https://mainnet.infura.io"));
const fs = require('fs')

web3.eth.getCode('0x851b7f3ab81bd8df354f0d7640efcd7288553419')
.then(output =>{
	var ending_point = output.search('a165627a7a72305820');
	var swarm_starting = ending_point + 18;
	var swarm_ending = output.length -4;
	var swarm_hash = output.slice(swarm_starting, swarm_ending);
	output = output.slice(0,ending_point);
	fs.writeFileSync('from_blockchain.txt', output, 'utf8');
	console.log('result is written in "from_blockchain.txt" file');
	console.log("Corresponding swarm hash is: 0x" + swarm_hash)
});


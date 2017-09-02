const solc = require('solc');
const solcV0410 = solc.useVersion('v0.4.10+commit.f0d539ae');
const fs = require('fs');

var input = fs.readFileSync('/home/alex/Desktop/dev/consensys/bytecode-verifier/Example/GnosisAuction.sol','utf8');
console.log(solcV0410.version())
var bytecode = solcV0410.compile(input,0)['contracts'][':MultiSigWalletWithDailyLimit']['bytecode'];

fixed_prefix= bytecode.slice(0,10);
starting_point = bytecode.search('3615');
remaining_part = bytecode.slice(starting_point);
ending_point = bytecode.search('a165627a7a72305820');
result = fixed_prefix + bytecode.slice(starting_point, ending_point);

swarm_starting = ending_point + 18;
swarm_ending = bytecode.length - 4;
swarm_hash = bytecode.slice(swarm_starting,swarm_ending);

console.log('result is written in "from_compiler.txt" file');
console.log('Corresponding swarm hash is: 0x'+swarm_hash);
fs.writeFileSync('from_compiler.txt','0x'+result, 'utf8');
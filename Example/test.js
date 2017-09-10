const solc = require('solc');
var test = 'hello!'
solc.loadRemoteVersion('v0.4.10+commit.f0d539ae', function(err, solcV) {
    if (err) {
        // An error was encountered, display and quit
        console.log(err)
    }
    console.log(solcV)
    var output = solcV.compile("contract t { function g() {} }", 1);
    console.log(output);
});

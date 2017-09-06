const solc = require('solc');

solc.loadRemoteVersion('v0.4.11-nightly.2017.3.29+commit.fefb3fad', function(err, solcV) {
    if (err) {
        // An error was encountered, display and quit
        console.log(err)
    }

    var output = solcV.compile("contract t { function g() {} }", 0, (output) => {
        console.log(output);
    });
});

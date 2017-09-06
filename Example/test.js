const solc = require('solc');

solc.loadRemoteVersion('nightly.2017.3.29+commit.fefb3fad', function(err, solcV) {
    if (err) {
        // An error was encountered, display and quit
        console.log(err)
    }

    var output = solcV.compile("contract t { function g() {} }", 1);
    console.log(output);
});

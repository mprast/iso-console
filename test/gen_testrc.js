const fs = require("fs");
const path = require("path");
// as of babel 6.22.2 there's no way to 
// pass a plugin parameters via the 
// command line (at least none that I can
// find); the only way to pass them is 
// through babelrc. this script generates a 
// new file that we can use to configure 
// babel for our tests.
// cf. https://github.com/babel/babel/issues/4800

// you made me do this babel. jesus.

fs.readFile(path.join(__dirname, "..", ".babelrc"), (err, data) => {
    var babelrc = JSON.parse(data); 

    // disable the split-brain plugin, since we don't need 
    // code-splitting for tests.
    const sbIndex = babelrc["plugins"].findIndex((element) => {
        return (Array.isArray(element) && element[0] == "split-brain") ||
            (element == "split-brain");
    });

    babelrc["plugins"][sbIndex] = ["split-brain", {disabled: true}];

    const outFile = fs.open(path.join(__dirname, "babelrc_test"),"w", (err, fd) => {
        fs.write(fd, JSON.stringify(babelrc), (err, written, string) => {});
    });
});

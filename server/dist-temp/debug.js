// debug.ts — overwrite with this exact content
console.log("DEBUG-A: top-level log");
setTimeout(function () {
    console.log("DEBUG-B: still alive after 1s");
    // show process info then exit
    console.error("DEBUG-ERR: exiting with code 0");
    process.exit(0);
}, 1000);

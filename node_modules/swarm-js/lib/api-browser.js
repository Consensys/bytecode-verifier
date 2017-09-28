var unavailable = function unavailable() {
  throw "This swarm.js function isn't available on the browser.";
};

var fsp = { readFile: unavailable };
var files = { download: unavailable, safeDownloadArchived: unavailable, directoryTree: unavailable };
var os = { platform: unavailable, arch: unavailable };
var path = { join: unavailable, slice: unavailable };
var child_process = { spawn: unavailable };
var swarm = require("./swarm");

module.exports = swarm({ fsp: fsp, files: files, os: os, path: path, child_process: child_process });
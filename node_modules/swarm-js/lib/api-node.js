var fsp = require("fs-promise");
var files = require("./files.js");
var os = require("os");
var path = require("path");
var child_process = require("child_process");
var swarm = require("./swarm");

module.exports = swarm({ fsp: fsp, files: files, os: os, path: path, child_process: child_process });
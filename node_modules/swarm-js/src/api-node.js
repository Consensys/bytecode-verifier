const fsp = require("fs-promise");
const files = require("./files.js");
const os = require("os");
const path = require("path");
const child_process = require("child_process");
const swarm = require("./swarm");

module.exports = swarm({fsp, files, os, path, child_process});

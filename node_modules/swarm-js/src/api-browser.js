const unavailable = () => { throw "This swarm.js function isn't available on the browser."; }

const fsp = {readFile: unavailable};
const files = {download: unavailable, safeDownloadArchived: unavailable, directoryTree: unavailable};
const os = {platform: unavailable, arch: unavailable};
const path = {join: unavailable, slice: unavailable};
const child_process = {spawn: unavailable};
const swarm = require("./swarm");

module.exports = swarm({fsp, files, os, path, child_process});

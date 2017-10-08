const list = require('./list.json');
const chalk = require('chalk');
/**
 * function [solcVersionList]
 * return { string }
 */
 var solcVersionList = ()=>{
  console.log("================================")
  console.log('')
  console.log('latestRelease: '+chalk.bold.underline.green(list['latestRelease']))
  console.log();
  console.log("Here is a list of solc versions from formal major releases:")
  console.log();
  for (var short_version in list['releases']){
    console.log(chalk.bold.yellow(short_version)+' : '+list['releases'][short_version].slice(8,-3));
  }
  console.log();
}

module.exports = {solcVersionList,};

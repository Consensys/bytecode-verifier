// instantiate the list JSON object.
const list = require('./list.json');
const chalk = require('chalk');
/*
 * Function [compiler_look_up]
 * Return list of compiler versions
 */

 const compiler_look_up = (answers)=>{
   let version = answers['compiler_version_tag'];

   console.log('\n===========================================')
   console.log('Looking for all compiler with version tag: '+ chalk.bold.yellow(version));
   console.log()
   list['builds'].forEach(item =>{
     // if version matches, then output the detail.
     if (item['version'] == version){
       if (item['path'].includes('nightly')){
         console.log(item['path'].slice(8,-3));
       }
       else {
         console.log();
         console.log(chalk.bold.yellow('Formal major release version: '));
         console.log(item['path'].slice(8,-3));
       }
     }
   });
   console.log();
 }

module.exports = {compiler_look_up};

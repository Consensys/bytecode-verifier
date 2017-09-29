#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');

const {prompt} = require('inquirer');

const {solcVersionList } = require('./solcVersion');
const {verifier} = require('./verifier');
const {compiler_look_up} = require('./compilerList');

// craft question for verifier parameters.
const verifier_question = [
  {
    type: 'input',
    name:'solc_version',
    message: 'Enter compiler version. (e.g. v0.4.10+commit.f0d539ae).'
  },
  {
    type: 'input',
    name: 'file_name',
    message: 'Enter the contract file name. (e.g. MultiSigWalletWithDailyLimit.sol)'
  },
  {
    type: 'input',
    name: 'contract_address',
    message: 'Enter the contract address on blockchain. (e.g. 0x851b7f3ab81bd8df354f0d7640efcd7288553419)'
  },
  {
    type: 'input',
    name:'is_optimized',
    message: '0 for not optimized, 1 for optimized.'
  }
];
const compiler_question = [
  {
    type: 'input',
    name: 'compiler_version_tag',
    message: 'Enter the major released version. (e.g. 0.4.10, 0.3.8 etc.)'
  }
]
program
  .version('0.1.3')
  .description('=========  Ethereum Bytecode Verifier  ==========='+'\n'+
  chalk.yellow(
		figlet.textSync('eth-Verifier',{horizontalLayout:'default'})
  )+'\n'+'   ===============================================')
  .option('-l, --list', 'list of formal released Solidity Compiler')


program
  .command('verify')
  .description('Verify a contract against bytecode on Blockchain')
  .action(() => {
    prompt(verifier_question)
      .then( (answers) =>{
      answers['file_folder'] = process.cwd();
      verifier(answers);
    })
      .catch(err => {
        console.log(err);
      });
  });

program
  .command('compiler')
  .description('Complete compiler version look up (major release plus all nightly commits)')
  .action(()=>{
    prompt(compiler_question)
      .then((answers)=>{
        compiler_look_up(answers);
      })
      .catch(err=>{
        console.log(err);
      });
  });



  program.parse(process.argv);

  if (program.list) solcVersionList();

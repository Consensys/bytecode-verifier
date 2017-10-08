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
  .version('0.2.1')
  .description('=========  Ethereum Bytecode Verifier  ==========='+'\n'+
  chalk.yellow(
		figlet.textSync('eth-Verifier',{horizontalLayout:'default'})
  )+'\n'+'   ===============================================')
  .option('-l, --list', 'list of formal released Solidity Compiler')


program
  .command('verify <chainChoice>')
  .description('Verify a contract against bytecode on Blockchain')
  .action((chainChoice) => {
    if (typeof chainChoice == 'undefined'){
      console.log('Please specify a chain (e.g. mainnet)');
    }
    else{
      console.log('You\'ve chosen: '+chainChoice);
      
      const net_to_provider = {
        'mainnet':'https://mainnet.infura.io',
        'ropsten': 'https://ropsten.infura.io',
        'kovan': 'https://kovan.infura.io',
        'rinkeby': 'https://rinkeby.infura.io',
      }
      
      if (chainChoice == 'mainnet' || chainChoice == 'ropsten'
        || chainChoice=='kovan' || chainChoice== 'rinkeby'){
        
        var provider = net_to_provider[chainChoice];
        // After confirming the chain choice, prompt question. 
        prompt(verifier_question)
          .then( (answers) =>{
          answers['file_folder'] = process.cwd();
          verifier(answers, provider);
        })
          .catch(err => {
            console.log(err);
          });
      }
      else{
        console.log(chalk.red.bold('Invalid chain choice')+' Your current choice is by default: mainchain');
        console.log(chalk.green.bold('Please choose from: ')+chalk.underline('mainnet')+' , '+chalk.underline('ropsten')+' , '+
        chalk.underline('kovan')+' , '+chalk.underline('rinkeby'));
      }
    }
  });

program
  .command('compiler')
  .description('Complete compiler version look up (major release plus all nightly commits)')
  .action(()=>{
    prompt(compiler_question)
      .then((answers, provider)=>{
        compiler_look_up(answers);
      })
      .catch(err=>{
        console.log(err);
      });
  });



  program.parse(process.argv);

  if (program.list) solcVersionList();
  
  
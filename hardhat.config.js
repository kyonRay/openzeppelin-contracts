/// ENVVAR
// - COMPILE_VERSION:   compiler version (default: 0.8.20)
// - SRC:               contracts folder to compile (default: contracts)
// - COMPILE_MODE:      production modes enables optimizations (default: development)
// - IR:                enable IR compilation (default: false)
// - COVERAGE:          enable coverage report
// - ENABLE_GAS_REPORT: enable gas report
// - COINMARKETCAP:     coinmarkercat api key for USD value in gas report
// - CI:                output gas report to file instead of stdout

const fs = require('fs');
const path = require('path');

const { argv } = require('yargs/yargs')()
  .env('')
  .options({
    // Compilation settings
    compiler: {
      alias: 'compileVersion',
      type: 'string',
      default: '0.8.24',
    },
    src: {
      alias: 'source',
      type: 'string',
      default: 'contracts',
    },
    mode: {
      alias: 'compileMode',
      type: 'string',
      choices: ['production', 'development'],
      default: 'development',
    },
    ir: {
      alias: 'enableIR',
      type: 'boolean',
      default: false,
    },
    evm: {
      alias: 'evmVersion',
      type: 'string',
      default: 'paris',
    },
    // Extra modules
    coverage: {
      type: 'boolean',
      default: false,
    },
    gas: {
      alias: 'enableGasReport',
      type: 'boolean',
      default: false,
    },
    coinmarketcap: {
      alias: 'coinmarketcapApiKey',
      type: 'string',
    },
  });

require('@nomicfoundation/hardhat-chai-matchers');
require('@nomicfoundation/hardhat-ethers');
require('hardhat-exposed');
require('hardhat-gas-reporter');
require('hardhat-ignore-warnings');
require('solidity-coverage');
require('solidity-docgen');

for (const f of fs.readdirSync(path.join(__dirname, 'hardhat'))) {
  require(path.join(__dirname, 'hardhat', f));
}

const withOptimizations = argv.gas || argv.coverage || argv.compileMode === 'production';
const allowUnlimitedContractSize = argv.gas || argv.coverage || argv.compileMode === 'development';

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: argv.compiler,
    settings: {
      optimizer: {
        enabled: withOptimizations,
        runs: 200,
      },
      evmVersion: argv.evm,
      viaIR: withOptimizations && argv.ir,
      outputSelection: { '*': { '*': ['storageLayout'] } },
    },
  },
  warnings: {
    'contracts-exposed/**/*': {
      'code-size': 'off',
      'initcode-size': 'off',
    },
    '*': {
      'code-size': withOptimizations,
      'unused-param': !argv.coverage, // coverage causes unused-param warnings
      'transient-storage': false,
      default: 'error',
    },
  },
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 20300,
      accounts: [
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
        '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d', // 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
        '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a', // 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
        '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6', // 0x90F79bf6EB2c4f870365E785982E1f101E93b906
        '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a', // 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
        '0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba', // 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc
        '0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e', // 0x976EA74026E726554dB657fA54763abd0C3a0aa9
        '0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356', // 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955
        '0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97', // 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f
      ],
    },
    hardhat: {
      // hardfork: argv.evm,
      allowUnlimitedContractSize,
      initialBaseFeePerGas: argv.coverage ? 0 : undefined,
    },
  },
  exposed: {
    imports: true,
    initializers: true,
    exclude: ['vendor/**/*', '**/*WithInit.sol'],
  },
  gasReporter: {
    enabled: argv.gas,
    showMethodSig: true,
    includeBytecodeInJSON: true,
    currency: 'USD',
    coinmarketcap: argv.coinmarketcap,
  },
  paths: {
    sources: argv.src,
  },
  docgen: require('./docs/config'),
};

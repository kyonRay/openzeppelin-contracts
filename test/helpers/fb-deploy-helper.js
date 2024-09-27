const { ethers } = require('hardhat');

async function deployFBContract(name, args, opts = undefined) {
  let contract = await ethers.deployContract(name, args, opts);
  const txHash = contract.deploymentTransaction().hash;
  const receipt = await ethers.provider.getTransactionReceipt(txHash);
  contract = contract.attach(receipt.contractAddress);
  return contract;
}

async function mineFB(number = 1) {
  const accounts = await ethers.getSigners();
  const [holder] = accounts;

  const contract = await deployFBContract('$ERC20', ['ERC20', 'FBC']);
  if (number > 1) {
    for (let i = 1; i < number; i++) {
      await contract.$_mint(holder, 100000n);
    }
  }
}

module.exports = { mineFB, deployFBContract };

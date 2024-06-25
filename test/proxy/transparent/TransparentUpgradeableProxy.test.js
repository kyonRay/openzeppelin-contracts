const { ethers } = require('hardhat');
const shouldBehaveLikeProxy = require('../Proxy.behaviour');
const shouldBehaveLikeTransparentUpgradeableProxy = require('./TransparentUpgradeableProxy.behaviour');
const { deployFBContract } = require('../../helpers/fb-deploy-helper');

async function fixture() {
  const [owner, other, ...accounts] = await ethers.getSigners();

  const implementation = await deployFBContract('DummyImplementation');

  const createProxy = function (logic, initData, opts = undefined) {
    return deployFBContract('TransparentUpgradeableProxy', [logic, owner, initData], opts);
  };

  return { nonContractAddress: owner, owner, other, accounts, implementation, createProxy };
}

describe('TransparentUpgradeableProxy', function () {
  beforeEach(async function () {
    Object.assign(this, await fixture());
  });

  shouldBehaveLikeProxy();

  // createProxy, owner, otherAccounts
  shouldBehaveLikeTransparentUpgradeableProxy();
});

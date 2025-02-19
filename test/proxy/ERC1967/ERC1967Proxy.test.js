const { ethers } = require('hardhat');
const { deployFBContract } = require('../../helpers/fb-deploy-helper');

const shouldBehaveLikeProxy = require('../Proxy.behaviour');

const fixture = async () => {
  const [nonContractAddress] = await ethers.getSigners();

  const implementation = await deployFBContract('DummyImplementation');

  const createProxy = (implementation, initData, opts) =>
    deployFBContract('ERC1967Proxy', [implementation, initData], opts);

  return { nonContractAddress, implementation, createProxy };
};

describe('ERC1967Proxy', function () {
  before(async function () {
    Object.assign(this, await fixture());
  });

  shouldBehaveLikeProxy();
});

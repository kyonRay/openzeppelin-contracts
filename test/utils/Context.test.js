const { ethers } = require('hardhat');
const { deployFBContract } = require('../helpers/fb-deploy-helper');

const { shouldBehaveLikeRegularContext } = require('./Context.behavior');

async function fixture() {
  const [sender] = await ethers.getSigners();
  const context = await deployFBContract('ContextMock', []);
  return { sender, context };
}

describe('Context', function () {
  before(async function () {
    Object.assign(this, await fixture());
  });

  shouldBehaveLikeRegularContext();
});

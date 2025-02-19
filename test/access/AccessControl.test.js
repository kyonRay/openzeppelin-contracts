const { ethers } = require('hardhat');
const { deployFBContract } = require('../helpers/fb-deploy-helper');

const { DEFAULT_ADMIN_ROLE, shouldBehaveLikeAccessControl } = require('./AccessControl.behavior');

async function fixture() {
  const [defaultAdmin, ...accounts] = await ethers.getSigners();
  const mock = await deployFBContract('$AccessControl');
  await mock.$_grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
  return { mock, defaultAdmin, accounts };
}

describe('AccessControl', function () {
  beforeEach(async function () {
    Object.assign(this, await fixture());
  });

  shouldBehaveLikeAccessControl();
});

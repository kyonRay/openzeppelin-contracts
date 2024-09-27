const { ethers } = require('hardhat');
const { deployFBContract } = require('../../helpers/fb-deploy-helper');

const {
  DEFAULT_ADMIN_ROLE,
  shouldBehaveLikeAccessControl,
  shouldBehaveLikeAccessControlEnumerable,
} = require('../AccessControl.behavior');

async function fixture() {
  const [defaultAdmin, ...accounts] = await ethers.getSigners();
  const mock = await deployFBContract('$AccessControlEnumerable');
  await mock.$_grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
  return { mock, defaultAdmin, accounts };
}

describe('AccessControlEnumerable', function () {
  beforeEach(async function () {
    Object.assign(this, await fixture());
  });

  shouldBehaveLikeAccessControl();
  shouldBehaveLikeAccessControlEnumerable();
});

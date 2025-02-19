const { ethers } = require('hardhat');
const { expect } = require('chai');
const { deployFBContract } = require('../../helpers/fb-deploy-helper');

const time = require('../../helpers/time');

const {
  shouldBehaveLikeAccessControl,
  shouldBehaveLikeAccessControlDefaultAdminRules,
} = require('../AccessControl.behavior');

async function fixture() {
  const delay = time.duration.hours(10);
  const [defaultAdmin, ...accounts] = await ethers.getSigners();
  const mock = await deployFBContract('$AccessControlDefaultAdminRules', [delay, defaultAdmin]);
  return { mock, defaultAdmin, delay, accounts };
}

describe('AccessControlDefaultAdminRules', function () {
  beforeEach(async function () {
    Object.assign(this, await fixture());
  });

  it('initial admin not zero', async function () {
    await expect(deployFBContract('$AccessControlDefaultAdminRules', [this.delay, ethers.ZeroAddress]))
      .to.be.revertedWithCustomError(this.mock, 'AccessControlInvalidDefaultAdmin')
      .withArgs(ethers.ZeroAddress);
  });

  shouldBehaveLikeAccessControl();
  shouldBehaveLikeAccessControlDefaultAdminRules();
});

const { ethers, network } = require('hardhat');
const { expect } = require('chai');
const { loadFixture, mine } = require('@nomicfoundation/hardhat-network-helpers');
const env = require('hardhat');
const { mineFB } = require('./helpers/fb-deploy-helper');

async function fixture() {
  return {};
}

describe('Environment sanity', function () {
  beforeEach(async function () {
    if (env.network.name === 'hardhat') {
      Object.assign(this, await loadFixture(fixture));
    } else {
      Object.assign(this, await fixture());
    }
  });

  describe('snapshot', function () {
    let blockNumberBefore;

    it('cache and mine', async function () {
      blockNumberBefore = await ethers.provider.getBlockNumber();
      if (env.network.name === 'hardhat') {
        await mine();
      } else {
        await mineFB();
      }
      expect(await ethers.provider.getBlockNumber()).to.equal(blockNumberBefore + 1);
    });
    if (network.name === 'hardhat') {
      it('check snapshot', async function () {
        expect(await ethers.provider.getBlockNumber()).to.equal(blockNumberBefore);
      });
    }
  });
});

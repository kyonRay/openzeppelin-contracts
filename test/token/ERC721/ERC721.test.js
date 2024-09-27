const { ethers } = require('hardhat');
const { deployFBContract } = require('../../helpers/fb-deploy-helper');

const { shouldBehaveLikeERC721, shouldBehaveLikeERC721Metadata } = require('./ERC721.behavior');

const name = 'Non Fungible Token';
const symbol = 'NFT';

async function fixture() {
  return {
    accounts: await ethers.getSigners(),
    token: await deployFBContract('$ERC721', [name, symbol]),
  };
}

describe('ERC721', function () {
  beforeEach(async function () {
    Object.assign(this, await fixture());
  });

  shouldBehaveLikeERC721();
  shouldBehaveLikeERC721Metadata(name, symbol);
});

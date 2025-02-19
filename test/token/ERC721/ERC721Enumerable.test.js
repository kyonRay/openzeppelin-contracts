const { ethers } = require('hardhat');
const { deployFBContract } = require('../../helpers/fb-deploy-helper');

const {
  shouldBehaveLikeERC721,
  shouldBehaveLikeERC721Metadata,
  shouldBehaveLikeERC721Enumerable,
} = require('./ERC721.behavior');

const name = 'Non Fungible Token';
const symbol = 'NFT';

async function fixture() {
  return {
    accounts: await ethers.getSigners(),
    token: await deployFBContract('$ERC721Enumerable', [name, symbol]),
  };
}

describe('ERC721', function () {
  beforeEach(async function () {
    Object.assign(this, await fixture());
  });

  shouldBehaveLikeERC721();
  shouldBehaveLikeERC721Metadata(name, symbol);
  shouldBehaveLikeERC721Enumerable();
});

const { ethers } = require('hardhat');
const { expect } = require('chai');
const { deployFBContract } = require('../../../helpers/fb-deploy-helper');

const name = 'Non Fungible Token';
const symbol = 'NFT';
const tokenId = 1n;

describe('ERC721Holder', function () {
  it('receives an ERC721 token', async function () {
    const [owner] = await ethers.getSigners();

    const token = await deployFBContract('$ERC721', [name, symbol]);
    await token.$_mint(owner, tokenId);

    const receiver = await deployFBContract('$ERC721Holder');
    await token.connect(owner).safeTransferFrom(owner, receiver, tokenId);

    expect(await token.ownerOf(tokenId)).to.equal(receiver);
  });
});

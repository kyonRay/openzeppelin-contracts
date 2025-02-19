const { ethers, network } = require('hardhat');
const { expect } = require('chai');
const { deployFBContract } = require('../../../helpers/fb-deploy-helper');

const name = 'My Token';
const symbol = 'MTKN';
const initialSupply = 100n;

async function fixture() {
  const [holder, recipient, approved] = await ethers.getSigners();

  const token = await deployFBContract('$ERC20Pausable', [name, symbol]);
  await token.$_mint(holder, initialSupply);

  return { holder, recipient, approved, token };
}

describe('ERC20Pausable', function () {
  beforeEach(async function () {
    Object.assign(this, await fixture());
  });

  describe('pausable token', function () {
    describe('transfer', function () {
      it('allows to transfer when unpaused', async function () {
        const initValueOfHolder = await this.token.balanceOf(this.holder);
        const initValueOfReceipt = await this.token.balanceOf(this.recipient);

        const tx = await this.token.connect(this.holder).transfer(this.recipient, initialSupply);
        if (network.name === 'hardhat') {
          await expect(tx).to.changeTokenBalances(
            this.token,
            [this.holder, this.recipient],
            [-initialSupply, initialSupply],
          );
        } else {
          expect(await this.token.balanceOf(this.holder)).to.equal(initValueOfHolder - initialSupply);
          expect(await this.token.balanceOf(this.recipient)).to.equal(initValueOfReceipt + initialSupply);
        }
      });

      it('allows to transfer when paused and then unpaused', async function () {
        await this.token.$_pause();
        await this.token.$_unpause();
        const initValueOfHolder = await this.token.balanceOf(this.holder);
        const initValueOfReceipt = await this.token.balanceOf(this.recipient);
        const tx = await this.token.connect(this.holder).transfer(this.recipient, initialSupply);
        if (network.name === 'hardhat') {
          await expect(tx).to.changeTokenBalances(
            this.token,
            [this.holder, this.recipient],
            [-initialSupply, initialSupply],
          );
        } else {
          expect(await this.token.balanceOf(this.holder)).to.equal(initValueOfHolder - initialSupply);
          expect(await this.token.balanceOf(this.recipient)).to.equal(initValueOfReceipt + initialSupply);
        }
      });

      it('reverts when trying to transfer when paused', async function () {
        await this.token.$_pause();

        await expect(
          this.token.connect(this.holder).transfer(this.recipient, initialSupply),
        ).to.be.revertedWithCustomError(this.token, 'EnforcedPause');
      });
    });

    describe('transfer from', function () {
      const allowance = 40n;

      beforeEach(async function () {
        await this.token.connect(this.holder).approve(this.approved, allowance);
      });

      it('allows to transfer from when unpaused', async function () {
        const initValueOfHolder = await this.token.balanceOf(this.holder);
        const initValueOfReceipt = await this.token.balanceOf(this.recipient);

        const tx = await this.token.connect(this.approved).transferFrom(this.holder, this.recipient, allowance);
        if (network.name === 'hardhat') {
          await expect(tx).to.changeTokenBalances(this.token, [this.holder, this.recipient], [-allowance, allowance]);
        } else {
          expect(await this.token.balanceOf(this.holder)).to.equal(initValueOfHolder - allowance);
          expect(await this.token.balanceOf(this.recipient)).to.equal(initValueOfReceipt + allowance);
        }
      });

      it('allows to transfer when paused and then unpaused', async function () {
        await this.token.$_pause();
        await this.token.$_unpause();
        const initValueOfHolder = await this.token.balanceOf(this.holder);
        const initValueOfReceipt = await this.token.balanceOf(this.recipient);

        const tx = await this.token.connect(this.approved).transferFrom(this.holder, this.recipient, allowance);
        if (network.name === 'hardhat') {
          await expect(tx).to.changeTokenBalances(this.token, [this.holder, this.recipient], [-allowance, allowance]);
        } else {
          expect(await this.token.balanceOf(this.holder)).to.equal(initValueOfHolder - allowance);
          expect(await this.token.balanceOf(this.recipient)).to.equal(initValueOfReceipt + allowance);
        }
      });

      it('reverts when trying to transfer from when paused', async function () {
        await this.token.$_pause();

        await expect(
          this.token.connect(this.approved).transferFrom(this.holder, this.recipient, allowance),
        ).to.be.revertedWithCustomError(this.token, 'EnforcedPause');
      });
    });

    describe('mint', function () {
      const value = 42n;

      it('allows to mint when unpaused', async function () {
        const initValueOfReceipent = await this.token.balanceOf(this.recipient);
        const tx = await this.token.$_mint(this.recipient, value);
        if (network.name === 'hardhat') {
          await expect(tx).to.changeTokenBalance(this.token, this.recipient, value);
        } else {
          expect(await this.token.balanceOf(this.recipient)).to.equal(initValueOfReceipent + value);
        }
      });

      it('allows to mint when paused and then unpaused', async function () {
        await this.token.$_pause();
        await this.token.$_unpause();
        const initValueOfReceipent = await this.token.balanceOf(this.recipient);
        const tx = await this.token.$_mint(this.recipient, value);
        if (network.name === 'hardhat') {
          await expect(tx).to.changeTokenBalance(this.token, this.recipient, value);
        } else {
          expect(await this.token.balanceOf(this.recipient)).to.equal(initValueOfReceipent + value);
        }
      });

      it('reverts when trying to mint when paused', async function () {
        await this.token.$_pause();

        await expect(this.token.$_mint(this.recipient, value)).to.be.revertedWithCustomError(
          this.token,
          'EnforcedPause',
        );
      });
    });

    describe('burn', function () {
      const value = 42n;

      it('allows to burn when unpaused', async function () {
        const initValueOfHolder = await this.token.balanceOf(this.holder);
        const tx = await this.token.$_burn(this.holder, value);
        if (network.name === 'hardhat') {
          await expect(tx).to.changeTokenBalance(this.token, this.holder, -value);
        } else {
          expect(await this.token.balanceOf(this.holder)).to.equal(initValueOfHolder - value);
        }
      });

      it('allows to burn when paused and then unpaused', async function () {
        await this.token.$_pause();
        await this.token.$_unpause();
        const initValueOfHolder = await this.token.balanceOf(this.holder);
        const tx = await this.token.$_burn(this.holder, value);
        if (network.name === 'hardhat') {
          await expect(tx).to.changeTokenBalance(this.token, this.holder, -value);
        } else {
          expect(await this.token.balanceOf(this.holder)).to.equal(initValueOfHolder - value);
        }
      });

      it('reverts when trying to burn when paused', async function () {
        await this.token.$_pause();

        await expect(this.token.$_burn(this.holder, value)).to.be.revertedWithCustomError(this.token, 'EnforcedPause');
      });
    });
  });
});

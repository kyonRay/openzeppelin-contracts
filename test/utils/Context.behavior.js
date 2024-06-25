const { expect } = require('chai');
const { deployFBContract } = require('../helpers/fb-deploy-helper');

async function fixture() {
  return { contextHelper: await deployFBContract('ContextMockCaller', []) };
}
function shouldBehaveLikeRegularContext() {
  before(async function () {
    Object.assign(this, await fixture());
  });

  describe('msgSender', function () {
    it('returns the transaction sender when called from an EOA', async function () {
      await expect(this.context.connect(this.sender).msgSender()).to.emit(this.context, 'Sender').withArgs(this.sender);
    });

    it('returns the transaction sender when called from another contract', async function () {
      await expect(this.contextHelper.connect(this.sender).callSender(this.context))
        .to.emit(this.context, 'Sender')
        .withArgs(this.contextHelper);
    });
  });

  describe('msgData', function () {
    const args = [42n, 'OpenZeppelin'];

    it('returns the transaction data when called from an EOA', async function () {
      const callData = this.context.interface.encodeFunctionData('msgData', args);

      await expect(this.context.msgData(...args))
        .to.emit(this.context, 'Data')
        .withArgs(callData, ...args);
    });

    it('returns the transaction sender when from another contract', async function () {
      const callData = this.context.interface.encodeFunctionData('msgData', args);

      await expect(this.contextHelper.callData(this.context, ...args))
        .to.emit(this.context, 'Data')
        .withArgs(callData, ...args);
    });
  });
}

module.exports = {
  shouldBehaveLikeRegularContext,
};

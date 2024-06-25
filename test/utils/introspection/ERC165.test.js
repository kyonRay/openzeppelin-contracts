const { deployFBContract } = require('../../helpers/fb-deploy-helper');

const { shouldSupportInterfaces } = require('./SupportsInterface.behavior');

async function fixture() {
  return {
    mock: await deployFBContract('$ERC165'),
  };
}

describe('ERC165', function () {
  before(async function () {
    Object.assign(this, await fixture());
  });

  shouldSupportInterfaces();
});

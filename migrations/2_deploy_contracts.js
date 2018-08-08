const WakERC20Token = artifacts.require('./WakERC20Token.sol');

module.exports = function (deployer, network, accounts) {
    deployer.deploy(WakERC20Token, accounts[0], 1000, {from: accounts[0]});
};

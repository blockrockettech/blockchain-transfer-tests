pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol';

contract WakERC20Token is StandardToken, DetailedERC20 {
    constructor(address _initialAccount, uint256 _initialBalance) DetailedERC20("Wakelet Token", "WAK", 18) public {
        balances[_initialAccount] = _initialBalance;
        totalSupply_ = _initialBalance;
    }
}
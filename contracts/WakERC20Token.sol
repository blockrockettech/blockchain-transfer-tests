pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";


contract WakERC20Token is StandardToken, DetailedERC20 {

    constructor(address _initialAccount, uint256 _initialBalance)
    DetailedERC20("Wakelet Token", "WAK", 18)
    public {
        balances[_initialAccount] = _initialBalance;
        totalSupply_ = _initialBalance;
    }

    /**
    * @dev Transfer token to multiple addresses
    * @param _addresses The addresses to transfer to.
    * @param _values The amount values to be transferred.
    */
    function batchTransfer(address[] _addresses, uint256[] _values) public returns (bool) {
        for (uint i = 0; i < _addresses.length; i++) {
            transfer(_addresses[i], _values[i]);
        }
    }
}
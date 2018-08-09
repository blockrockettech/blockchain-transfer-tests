pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";

import "./strings.sol";


contract WakERC20Token is StandardToken, DetailedERC20 {

    using strings for *;

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

    function split(string str) constant returns (string, string) {
        bytes memory strBytes = bytes(str);

        bytes memory addressRes = new bytes(42);
        for (uint i = 0; i < 42; i++) {
            addressRes[i] = strBytes[i];
        }

        return (string(addressRes), "sss");
    }

    function chop(string str) constant returns (address[]) {
        var s = str.toSlice();
        var delim = ",".toSlice();
        var parts = new address[](s.count(delim) + 1);
        for (uint i = 0; i < parts.length; i++) {
            parts[i] = address(stringToBytes32(s.split(delim).toString()));
        }
        return parts;
    }

    function stringToBytes32(string memory source) returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

    function convert(uint256 n) returns (bytes32) {
        return bytes32(n);
    }
}
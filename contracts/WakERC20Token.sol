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

    function batchTransferViaSplit(string addresses, string amounts) public returns (bool) {
        var addressesSlice = addresses.toSlice();
        var amountsSlice = amounts.toSlice();

        var delim = ",".toSlice();

        var addressCount = addressesSlice.count(delim);
        var amountCount = amountsSlice.count(delim);

        require(addressCount == amountCount, "Incorrect number of deliminators");

        var addressParts = new address[](addressCount + 1);
        var amountsParts = new uint256[](amountCount + 1);

        for (uint i = 0; i < addressParts.length; i++) {

            string memory addStr = addressesSlice.split(delim).toString();
            addressParts[i] = parseAddr(addStr);

            string memory amountStr = amountsSlice.split(delim).toString();
            amountsParts[i] = stringToUint(amountStr);

            transfer(addressParts[i], amountsParts[i]);
        }

        return true;
    }

    function parseAddr(string _a) internal returns (address){
        bytes memory tmp = bytes(_a);
        uint160 iaddr = 0;
        uint160 b1;
        uint160 b2;
        for (uint i = 2; i < 2 + 2 * 20; i += 2) {
            iaddr *= 256;
            b1 = uint160(tmp[i]);
            b2 = uint160(tmp[i + 1]);
            if ((b1 >= 97) && (b1 <= 102)) b1 -= 87;
            else if ((b1 >= 48) && (b1 <= 57)) b1 -= 48;
            if ((b2 >= 97) && (b2 <= 102)) b2 -= 87;
            else if ((b2 >= 48) && (b2 <= 57)) b2 -= 48;
            iaddr += (b1 * 16 + b2);
        }
        return address(iaddr);
    }

    function stringToUint(string s) constant returns (uint result) {
        bytes memory b = bytes(s);
        uint i;
        result = 0;
        for (i = 0; i < b.length; i++) {
            uint c = uint(b[i]);
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
    }

}

# Blockchain transfer tests

Simple, quick and dirty tests for gathering information on transfer blockchain assets between two parties.

* Ethereum
  * [ERC20](https://theethereum.wiki/w/index.php/ERC20_Token_Standard) (based on [OpenZeppelin StandardToken implementation](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC20/StandardToken.sol))
* Stellar 
  * Custom Asset

#### Tests

1) Vanilla ERC20 `function transfer(address _to, uint256 _value)`
2) ERC20 batch transfer based on two arrays `function transfer(address[] _address, uint256[] _values)`
    - index based access to `to` and `value` with the assumption is coming from a single account
3) ERC20 batch transfer based on single large `function transfer(string _data)`
    - `data` containing fixed length variables consisting of `<to><from><amount>`
4) Stellar custom asset transfer between two parties

#### Criteria

* Cost
* Transaction Throughput
* Open / Transparent

#### Other things to consider

* Reputation / Model (usage)
* Staking
* Public / Private

### Stellar tests

 - Issuer - http://testnet.stellarchain.io/address/GDKU4KVLSQZLNYWI262LCAUJA7E2C42WA3OR5HEBHE76QB5SFV6D65LB
 - Receiver - http://testnet.stellarchain.io/address/GAPASLMI6GMNV5KQCJNZJOPFAWWOFVUUI74WRROE5UFZH3M5VWNVY7ET

Sending [10] transaction [10] times:

[29406.010240018368] milliseconds.
[29526.779772043228] milliseconds.
[16902.48921096325] milliseconds.
[28168.857064008713] milliseconds.
[26407.937089025974] milliseconds.
[29968.64904600382] milliseconds.
[24758.33659297228] milliseconds.
[22514.300498008728] milliseconds.
[27960.556167006493] milliseconds.
[34913.40477001667] milliseconds.


29406 + 29526 + 16902 + 28168 + 26407 + 29968 + 24758 + 22514 + 27960 + 34913

Approx [270522] milliseconds = [270.522] seconds = **[2.7] seconds on average for 10 transactions**

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


#### Results

|#| Costs  | Throughout  | Openness  |
|-|--------|-------------|-----------|
|1|        |             |           |
|2|        |             |           |
|3|        |             |           |
|4|        |             |           |

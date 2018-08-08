# Blockchain transfer tests

Simple, quick and dirty tests for gathering information on transfer blockchain assets between two parties.

* Ethereum
  * [ERC20](https://theethereum.wiki/w/index.php/ERC20_Token_Standard) (based on [OpenZeppelin StandardToken implementation](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC20/StandardToken.sol))
* Stellar 
  * Custom Asset

### Tests

1) Vanilla ERC20 `function transfer(address _to, uint256 _value)`
2) ERC20 batch transfer based on two arrays `function transfer(address[] _address, uint256[] _values)`
    - index based access to `to` and `value` with the assumption is coming from a single account
3) ERC20 batch transfer based on single large `function transfer(string _data)`
    - `data` containing fixed length variables consisting of `<to><from><amount>`
4) Stellar custom asset transfer between two parties

### Criteria

* Cost
* Transaction Throughput
* Open / Transparent

### Other considerations

* Reputation / Model (usage)
* Staking
* Public / Private

### Stellar test
 
- Issuer - http://testnet.stellarchain.io/address/GDKU4KVLSQZLNYWI262LCAUJA7E2C42WA3OR5HEBHE76QB5SFV6D65LB
- Receiver - http://testnet.stellarchain.io/address/GAPASLMI6GMNV5KQCJNZJOPFAWWOFVUUI74WRROE5UFZH3M5VWNVY7ET

#### Individual Transactions

Sending a batch of [10] single transactions, [10] tests ran:

* Results = [29406.010240018368], [29526.779772043228], [16902.48921096325], [28168.857064008713], [26407.937089025974], 
[29968.64904600382], [24758.33659297228], [22514.300498008728], [27960.556167006493], [34913.40477001667] (_milliseconds_)

* Cost: **For 100 transactions = 0.001 XLM = 0.0048 USD** (1 XLM = $0.21)
 
* Throughput: Approx [270522] milliseconds = [270.522] seconds = **[2.7] seconds on average for 10 transactions**

* Open = **all transactions are viewable on the public chain**, see testnet links above.

#### Batch transactions 

Stellar supports sending 20 operations in a single transaction.

Test is sending 1 asset, to 20 different accounts in a single transaction.

* Results = [5697.706137001514], [2679.0476800203323], [4000.0358299613], [3683.633010983467], [2880.026881992817], 
[6189.717738986015], [3649.631403028965], [3672.308954000473], [3311.3769469857216], [3800.43593198061] (_milliseconds_)

5697 + 2679 + 4000 + 3683 + 2880 + 6189 + 3649 + 3672 + 3311 + 3800

#### Opinions 

* Cost: **For 10 transactions, each containing 20 operations = 200 OPS = 0.002 XLM = 0.0096 USD** (1 XLM = $0.21)

* Throughput: Approx [39560] milliseconds = [39.56] seconds = **[3.956] seconds on average for 20 operations* = [0.198] seconds a transaction*

* Open = **all transactions are viewable on the public chain**, see testnet links above.

#### Caveats

* Running Stellar on TestNet you are rate limited
* Not running against owned/hosted stellar core & horizon nodes may reduce throughput

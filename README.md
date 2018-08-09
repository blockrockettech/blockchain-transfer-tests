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

## Stellar Test
 
- Issuer - http://testnet.stellarchain.io/address/GDKU4KVLSQZLNYWI262LCAUJA7E2C42WA3OR5HEBHE76QB5SFV6D65LB
- Receiver - http://testnet.stellarchain.io/address/GAPASLMI6GMNV5KQCJNZJOPFAWWOFVUUI74WRROE5UFZH3M5VWNVY7ET
- KIN has also published some test details here - https://medium.com/inside-kin/stellar-load-testing-results-for-the-kin-ecosystem-64c4d8676e69

##### Individual Transactions

Sending a batch of [10] single transactions, [10] tests ran:

* Results = [29406.010240018368], [29526.779772043228], [16902.48921096325], [28168.857064008713], [26407.937089025974], 
[29968.64904600382], [24758.33659297228], [22514.300498008728], [27960.556167006493], [34913.40477001667] (_milliseconds_)

* Cost: **For 100 transactions = 0.001 XLM = 0.0048 USD** (1 XLM = $0.21)
 
* Throughput: Approx [270522] milliseconds = [270.522] seconds = **[2.7] seconds on average for 10 transactions**

* Open = **all transactions are viewable on the public chain**, see testnet links above.

##### Batch transactions 

Stellar supports sending 20 operations in a single transaction.

Test is sending 1 asset, to 20 different accounts in a single transaction.

* Results = [5697.706137001514], [2679.0476800203323], [4000.0358299613], [3683.633010983467], [2880.026881992817], 
[6189.717738986015], [3649.631403028965], [3672.308954000473], [3311.3769469857216], [3800.43593198061] (_milliseconds_)

* Cost: **For 10 transactions, each containing 20 operations = 200 OPS = 0.002 XLM = 0.0096 USD** (1 XLM = $0.21)

* Throughput: Approx [39560] milliseconds = [39.56] seconds = **[3.956] seconds on average for 20 operations* = [0.198] seconds a transaction*

* Open = **all transactions are viewable on the public chain**, see testnet links above.

##### Opinions

* Reputation/usage
    - Reputation is not as high as Ethereum but is growing due to low costs and high transaction fees
    - Usage is also not as high as Ethereum bu is also grow.  
    - 700k accounts (8th Aug 2018)
    - Upto 1.1 million operations submitted as part of 350k transactions (as a peak daily throughput)
    

* Staking 
    - staking could be achieved on chain by using a custom asset/address - by where user can stake by sending to a address which would need to manage the balances of those who have sent the assets.
    - Voting for example could happen with a custom asset i.e a new asset is created of fixed supply, each voter receives an asset, the voter then sends to a specific address to tally up votes. 

* Public/Private - Stellar is a public blockchain solution
 
##### Caveats

* Running Stellar on TestNet you are rate limited
* Not running against owned/hosted stellar core & horizon nodes may reduce throughput


## Ethereum Test

### Vanilla single address transfer

* Standard ERC20 "out-of-the-box" transfer
  * This takes approx 36621 gas at a price of 5 gwei is 0.07 USD
    
* Batch transfer (send multiple addresses and values)
   * Due to gas limit there is a finite number of iterations you can perform. This gas limit is variable. At time of writing is was 7983268. Therefore you need to stay under this ceiling or risk the transaction failing.
   * Locally, we could send (at a price of 5 gwei) *gas prices can be a LOT higher at times of network congestion*:
     * 10 - 323332 gas | 0.00161666 ETH |
     * 10 (single address) - 188332 gas | 0.00094166 ETH | 0.34 USD
     * 20 (single address) - 338815 gas | 0.001694075 ETH | 0.61 USD
     * 30 (single address) - 489299 gas | 0.002446495 ETH | 0.89 USD
     * 40 (single address) - 639785 gas | 0.003198925 ETH | 1.16 USD
     * 50 (single address) - 790273 gas | 0.003951365 ETH | 1.43 USD
     * 60 (single address) - 940762 gas | 0.00470381 ETH  | 1.70 USD
     * 70 (single address) - 1091253 gas | 0.005456265 ETH | 1.97 USD
     * 80 (single address) - 1241745 gas | 0.006208725 ETH | 2.25 USD
     * 90 (single address) - 1392239  gas | 0.006961195 ETH | 2.52 USD
     * 100 (single address) - 1527734 gas | 0.00763867 ETH  | 2.76 USD
  * These results when plotted show a linear increase in gas usage as the number of transactions increased
  * We proved the gas costs were consistnet across environments by running some tests on Ropsten (test Ethereum blockchain) to ensure the numbers where consistent. [tx](https://ropsten.etherscan.io/tx/0xbf63f6760942ea37213b2c937d2369daa86dc0745df7cb495d376783c6f8d9af)    

# Blockchain transfer tests

Simple, quick and dirty tests for gathering information on transfer blockchain assets between two parties.

* Ethereum
  * [ERC20](https://theethereum.wiki/w/index.php/ERC20_Token_Standard) (based on [OpenZeppelin StandardToken implementation](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC20/StandardToken.sol))
* Stellar 
  * Custom Asset called `TestTx` issued by account [GDKU4KVLSQZLNYWI262LCAUJA7E2C42WA3OR5HEBHE76QB5SFV6D65LB](http://testnet.stellarchain.io/address/GDKU4KVLSQZLNYWI262LCAUJA7E2C42WA3OR5HEBHE76QB5SFV6D65LB)

### Tests

Scenarios covered

* Ethereum
    1. Single ERC20 `function transfer(address _to, uint256 _value)`
    2. ERC20 batch transfer based on two arrays `function transfer(address[] _addressed, uint256[] _values)` 
    3. ERC20 batch transfer based on two strings `function transfer(string _addressed, string _values)`
* Stellar 
    1. Single `payment` operation between two parties
    2. Batching `payment` operations, each one in a separate transaction
    3. Batching `payment` operations in transactions containing the max of 20 ops per transaction
    
### Criteria

* Cost
* Transaction Throughput
* Open / Transparent

### Other considerations

* Reputation / Model (usage)
* Staking
* Public / Private

### Assumptions

* All accounts, public & private keys, are known to the application/test
* All tests run against Stellar testnet, Ganache CLI and Ropsten testnet

## Stellarg
 
- Issuer - http://testnet.stellarchain.io/address/GDKU4KVLSQZLNYWI262LCAUJA7E2C42WA3OR5HEBHE76QB5SFV6D65LB
- Receiver - http://testnet.stellarchain.io/address/GAPASLMI6GMNV5KQCJNZJOPFAWWOFVUUI74WRROE5UFZH3M5VWNVY7ET
- KIN has also published some test details here - https://medium.com/inside-kin/stellar-load-testing-results-for-the-kin-ecosystem-64c4d8676e69
- All tests run against Testnet which may not be as reliable or a fast as running your own Horizon & Core nodes and submitting transaction to mainnet
- Open = **all transactions are viewable on the public chain**, see testnet links above.

## Scripts used:

* Manually invoked scripts within `./stellar`
* Send single - `node ./stellar/sending-single-transaction.js`
* Send batch, single transactions - `node ./stellar/send-10-transactions.js`
* Send batch, multiple operation - `node ./stellar/send-batch-of-20-payments-in-one-transaction.js`

#### 1. Single payment

Sending a single payment operation in a single transaction.

* Results [2315.3910809755325], [2303.581296980381], [6151.933712005615], [1844.822910964489], [4264.791642963886],
 [5725.793302953243], [5857.996351957321], [1371.8538349866867], [4544.312110960484], [5319.755360007286] =  (_milliseconds_)

2315 + 2303 + 6151 + 1844 + 4264 + 5725 + 5857 + 1371 + 4544 + 5319

* Cost: **For 10 transactions = 0.0001 XLM = 0.00048 USD** (1 XLM = $0.21)
 
* Throughput: Approx [39693] milliseconds = [39.693] seconds = **[3.96] seconds on average for 10 transactions**

#### 2. Batch payments, singular transactions

Sending a batch of [10] single transactions, [10] tests ran:

* Results = [29406.010240018368], [29526.779772043228], [16902.48921096325], [28168.857064008713], [26407.937089025974], 
[29968.64904600382], [24758.33659297228], [22514.300498008728], [27960.556167006493], [34913.40477001667] (_milliseconds_)

* Cost: **For 100 transactions = 0.001 XLM = 0.0048 USD** (1 XLM = $0.21)
 
* Throughput: Approx [270522] milliseconds = [270.522] seconds = **[2.7] seconds on average for 10 transactions**

#### 3. Batch payments, batch operations

Stellar supports sending 20 operations in a single transaction.

Test is sending 1 asset, to 20 different accounts in a single transaction.

* Results = [5697.706137001514], [2679.0476800203323], [4000.0358299613], [3683.633010983467], [2880.026881992817], 
[6189.717738986015], [3649.631403028965], [3672.308954000473], [3311.3769469857216], [3800.43593198061] (_milliseconds_)

* Cost: **For 10 transactions, each containing 20 operations = 200 OPS = 0.002 XLM = 0.0096 USD** (1 XLM = $0.21)

* Throughput: Approx [39560] milliseconds = [39.56] seconds = **[3.956] seconds on average for 20 operations* = [0.198] seconds a transaction*

#### Opinions

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

* Ethereum Blockchain (applicable to all tests below)
  * Transaction throughput: All Ethereum transactions must provide a gas price and be accepted by a miner. "Safe" gas prices change due to network conditions. On the main net blocks are currently mined approx. every 15 seconds. With reasonable gas the transaction would expect to be mined within 0 - 3 minutes. 
  * Open and Transparent: All transactions are open and transparent to all on the blockchain and can be viewed using block explorers.
                      
### Vanilla single address transfer

* Standard ERC20 "out-of-the-box" transfer
  * Cost: This takes approx 36621 gas at a price of 5 gwei is 0.07 USD
     

### Batch transfer (via passed arrays)
      
* Batch transfer (send multiple addresses and values)
   * Due to gas limit there is a finite number of iterations you can perform. This gas limit is variable. At time of writing is was 7983268. Therefore you need to stay under this ceiling or risk the transaction failing.
   * Cost: Locally, we tested at a price of 5 gwei *Note: gas prices can be a LOT higher at times of network congestion*:
     * 10 | 323332 gas | 0.00161666 ETH | 0.58 USD
     * 10 | 188332 gas | 0.00094166 ETH | 0.34 USD
     * 20 | 338815 gas | 0.001694075 ETH | 0.61 USD
     * 30 | 489299 gas | 0.002446495 ETH | 0.89 USD
     * 40 | 639785 gas | 0.003198925 ETH | 1.16 USD
     * 50 | 790273 gas | 0.003951365 ETH | 1.43 USD
     * 60 | 940762 gas | 0.00470381 ETH  | 1.70 USD
     * 70 | 1091253 gas | 0.005456265 ETH | 1.97 USD
     * 80 | 1241745 gas | 0.006208725 ETH | 2.25 USD
     * 90 | 1392239  gas | 0.006961195 ETH | 2.52 USD
     * 100 | 1527734 gas | 0.00763867 ETH  | 2.76 USD
  * These results when plotted show a linear increase in gas usage as the number of transactions increased
  * We proved the gas costs were consistent across environments by running some tests on Ropsten (test Ethereum blockchain) to ensure the numbers where consistent. [tx](https://ropsten.etherscan.io/tx/0xbf63f6760942ea37213b2c937d2369daa86dc0745df7cb495d376783c6f8d9af)    

### Batch transfer (via splitting strings)

* Split string Batch transfer (send multiple addresses and values)
  * Due to gas limit there is a finite number of iterations you can perform. This gas limit is variable. At time of writing is was 7983268. Therefore you need to stay under this ceiling or risk the transaction failing.
  * Cost: Locally, we tested at a price of 5 gwei *Note: gas prices can be a LOT higher at times of network congestion*: 
    *  10  | 5 GWEI    |   548765 | 0.002743825 ETH | 0.99 USD |
    *  20  | 5 GWEI    |  1059136 | 0.00529568 ETH  | 1.92 USD |
    *  30  | 5 GWEI    |  1569589 | 0.007847945 ETH | 2.84 USD |
    *  40  | 5 GWEI    |  2080123 | 0.010400615 ETH | 3.76 USD |
    *  50  | 5 GWEI    |  2590875 | 0.012954375 ETH | 4.69 USD |
    *  60  | 5 GWEI    |  3101434 | 0.01550717 ETH  | 5.61 USD |
    *  70  | 5 GWEI    |  3612349 | 0.018061745 ETH | 6.54 USD |
    *  80  | 5 GWEI    |  4123068 | 0.02061534 ETH  | 7.46 USD |
    *  90  | 5 GWEI    |  4634007 | 0.023170035 ETH | 8.39 USD |
    *  100 | 5 GWEI    |  5130167 | 0.025650835 ETH | 9.28 USD |
  
### Opinions

* Reputation/usage
    - Ethereum is the most utilised Blockchain by transaction volume and adoption due to it's maturity and the ability to run "smart-contracts" upon it.
    - X accounts (8th Aug 2018)
    - Upto X million operations submitted
    
* Staking 
    - Staking can be achieved via "smart-contracts" with bespoke logic
    - Voting can be achieved via "smart-contracts" with bespoke logic

* Public/Private - Ethereum is a public blockchain solution  

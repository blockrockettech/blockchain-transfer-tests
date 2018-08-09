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

## Stellar
 
- Issuer - [GDKU4KVLSQZLNYWI262LCAUJA7E2C42WA3OR5HEBHE76QB5SFV6D65LB](http://testnet.stellarchain.io/address/GDKU4KVLSQZLNYWI262LCAUJA7E2C42WA3OR5HEBHE76QB5SFV6D65LB)
- Receiver - [GAPASLMI6GMNV5KQCJNZJOPFAWWOFVUUI74WRROE5UFZH3M5VWNVY7ET](http://testnet.stellarchain.io/address/GAPASLMI6GMNV5KQCJNZJOPFAWWOFVUUI74WRROE5UFZH3M5VWNVY7ET)
- KIN has also published some test details here - [stellar-load-testing-results-for-the-kin-ecosystem](https://medium.com/inside-kin/stellar-load-testing-results-for-the-kin-ecosystem-64c4d8676e69)
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
    - Reputation is not as high as Ethereum but is growing due to low costs and high transaction throughput.
    - Usage is also not as high as Ethereum bu is also growing with daily operations submitted overtaking ethereum on some days. 
    - 200k+ active accounts (8th Aug 2018)
    - Upto 1.1 million operations submitted as part of 350k transactions (as a peak daily throughput)

* Staking 
    - Staking could be achieved on chain by using a custom asset/address - by where user can stake by sending to a address which would need to manage the balances of those who have sent the assets.
    - Voting for example could happen with a custom asset i.e a new asset is created of fixed supply, each voter receives an asset, the voter then sends to a specific address to tally up votes. 

* Public/Private - Stellar is a public blockchain solution

* Stellar is a much simpler Blockchain technology which focus on issuance and movement of assets. 
Simple smart contract scan be derived but there is it does not provide a turning complete smart contract solution. 
The lightening protocol is being to the network with a slated 2018 roll out.
 
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
```
.------------------------------------------------------------------------.
|                    WakERC20Token Gas Costs (Basic)                     |
|------------------------------------------------------------------------|
|      function      | gas price | gas user |    gas cost     | USD cost |
|--------------------|-----------|----------|-----------------|----------|
| transfer           | 5 GWEI    |    36599 | 0.000182995 ETH | 0.07 USD |
| batchTransfer (1)  | 5 GWEI    |    52835 | 0.000264175 ETH | 0.10 USD |
| batchTransfer (10) | 5 GWEI    |   323332 | 0.00161666 ETH  | 0.59 USD |
'------------------------------------------------------------------------'
```
     

### Batch transfer (via passed arrays)
      
* Batch transfer (send multiple addresses and values)
   * Due to gas limit there is a finite number of iterations you can perform. This gas limit is variable. At time of writing is was 7983268. Therefore you need to stay under this ceiling or risk the transaction failing.
   * Cost: Locally, we tested at a price of 5 gwei *Note: gas prices can be a LOT higher at times of network congestion*:
```
.-------------------------------------------------------------------------.
|                     WakERC20Token Gas Costs (Batch)                     |
|-------------------------------------------------------------------------|
|      function       | gas price | gas user |    gas cost     | USD cost |
|---------------------|-----------|----------|-----------------|----------|
| batchTransfer (10)  | 5 GWEI    |   188332 | 0.00094166 ETH  | 0.34 USD |
| batchTransfer (20)  | 5 GWEI    |   338815 | 0.001694075 ETH | 0.61 USD |
| batchTransfer (30)  | 5 GWEI    |   489299 | 0.002446495 ETH | 0.89 USD |
| batchTransfer (40)  | 5 GWEI    |   639785 | 0.003198925 ETH | 1.16 USD |
| batchTransfer (50)  | 5 GWEI    |   790273 | 0.003951365 ETH | 1.43 USD |
| batchTransfer (60)  | 5 GWEI    |   940762 | 0.00470381 ETH  | 1.70 USD |
| batchTransfer (70)  | 5 GWEI    |  1091253 | 0.005456265 ETH | 1.97 USD |
| batchTransfer (80)  | 5 GWEI    |  1241745 | 0.006208725 ETH | 2.25 USD |
| batchTransfer (90)  | 5 GWEI    |  1392239 | 0.006961195 ETH | 2.52 USD |
| batchTransfer (100) | 5 GWEI    |  1527734 | 0.00763867 ETH  | 2.76 USD |
'-------------------------------------------------------------------------'
```  
  * These results when plotted show a linear increase in gas usage as the number of transactions increased
  * We proved the gas costs were consistent across environments by running some tests on Ropsten (test Ethereum blockchain) to ensure the numbers where consistent. [tx](https://ropsten.etherscan.io/tx/0xbf63f6760942ea37213b2c937d2369daa86dc0745df7cb495d376783c6f8d9af)    
```
WakERC20Token Gas Costs (Batch)
 1527734.00 ┤        ╭
 1304500.33 ┤      ╭─╯
 1081266.67 ┤     ╭╯
  858033.00 ┤   ╭─╯
  634799.33 ┤  ╭╯
  411565.67 ┤╭─╯
  188332.00 ┼╯
```

### Batch transfer (via splitting strings)

* Split string Batch transfer (send multiple addresses and values)
  * Due to gas limit there is a finite number of iterations you can perform. This gas limit is variable. At time of writing is was 7983268. Therefore you need to stay under this ceiling or risk the transaction failing.
  * Cost: Locally, we tested at a price of 5 gwei *Note: gas prices can be a LOT higher at times of network congestion*: 
```
.---------------------------------------------------------------------------------.
|                 WakERC20Token Gas Costs (Batch (Split String))                  |
|---------------------------------------------------------------------------------|
|          function           | gas price | gas user |    gas cost     | USD cost |
|-----------------------------|-----------|----------|-----------------|----------|
| batchTransferViaSplit (10)  | 5 GWEI    |   548765 | 0.002743825 ETH | 0.99 USD |
| batchTransferViaSplit (20)  | 5 GWEI    |  1059136 | 0.00529568 ETH  | 1.92 USD |
| batchTransferViaSplit (30)  | 5 GWEI    |  1569589 | 0.007847945 ETH | 2.84 USD |
| batchTransferViaSplit (40)  | 5 GWEI    |  2080123 | 0.010400615 ETH | 3.76 USD |
| batchTransferViaSplit (50)  | 5 GWEI    |  2590875 | 0.012954375 ETH | 4.69 USD |
| batchTransferViaSplit (60)  | 5 GWEI    |  3101434 | 0.01550717 ETH  | 5.61 USD |
| batchTransferViaSplit (70)  | 5 GWEI    |  3612349 | 0.018061745 ETH | 6.54 USD |
| batchTransferViaSplit (80)  | 5 GWEI    |  4123068 | 0.02061534 ETH  | 7.46 USD |
| batchTransferViaSplit (90)  | 5 GWEI    |  4634007 | 0.023170035 ETH | 8.39 USD |
| batchTransferViaSplit (100) | 5 GWEI    |  5130167 | 0.025650835 ETH | 9.28 USD |
'---------------------------------------------------------------------------------'
```  
  * These results when plotted show a linear increase in gas usage as the number of transactions increased
    * On average the simple splitting we perform was 3 times more expensive
```
WakERC20Token Gas Costs (Batch (Split String))
 5130167.00 ┤        ╭
 4366600.00 ┤       ╭╯
 3603033.00 ┤     ╭─╯
 2839466.00 ┤    ╭╯
 2075899.00 ┤  ╭─╯
 1312332.00 ┤ ╭╯
  548765.00 ┼─╯

```  
### Opinions

* Reputation/usage
    - Ethereum is the most utilised Blockchain by transaction volume and adoption due to it's maturity and the ability to run "smart-contracts" upon it.
    - X accounts (8th Aug 2018)
    - Upto X million operations submitted
    
* Staking 
    - Staking can be achieved via "smart-contracts" with bespoke logic
    - Voting can be achieved via "smart-contracts" with bespoke logic

* Public/Private - Ethereum is a public blockchain solution  

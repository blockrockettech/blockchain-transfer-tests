const weiToEther = require('./helpers/weiToEther');
const weiToGwei = require('./helpers/weiToGwei');
const lodash = require('lodash');

const WakERC20Token = artifacts.require('WakERC20Token');

const AsciiTable = require('ascii-table');
const AsciiChart = require('asciichart');

contract('WakERC20Token', function (
    [
        _,
        owner,
        recipient,
        account1,
        account2,
        account3,
        account4,
        account5,
        account6,
        account7,
        account8,
        account9,
        account10
    ]
) {
    const initialBalance = 100;
    const gasReport = [];
    const gasBatchReport = [];
    const gasBatchSplitReport = [];

    beforeEach(async function () {
        this.token = await WakERC20Token.new(owner, initialBalance);
    });

    describe('total supply', function () {
        it('returns the total amount of tokens', async function () {
            const totalSupply = await this.token.totalSupply();
            assert.equal(totalSupply, 100);
        });
    });

    describe('basic transfer to single amount', function () {

        const to = recipient;
        const amount = 100;

        it('transfers the requested amount', async function () {
            const tx = await this.token.transfer(to, amount, {from: owner});
            const txGas = await calculateGasCost(tx);
            gasReport.push({msg: 'transfer', ...txGas});

            const senderBalance = await this.token.balanceOf(owner);
            assert.equal(senderBalance, 0);

            const recipientBalance = await this.token.balanceOf(to);
            assert.equal(recipientBalance, amount);

            const logs = tx.logs;
            assert.equal(logs.length, 1);
            assert.equal(logs[0].event, 'Transfer');
            assert.equal(logs[0].args.from, owner);
            assert.equal(logs[0].args.to, to);
            assert(logs[0].args.value.eq(amount));
        });
    });

    describe('batch transfer to multiple addresses', function () {

        const to = recipient;
        const amount = 1;

        const batchToAddresses = [
            account1,
            account2,
            account3,
            account4,
            account5,
            account6,
            account7,
            account8,
            account9,
            account10
        ];
        const batchAmounts = batchToAddresses.map(() => amount);

        it('should confirm with a single address batch', async function () {
            const tx = await this.token.batchTransfer([to], [amount], {from: owner});
            const txGas = await calculateGasCost(tx);
            gasReport.push({msg: 'batchTransfer (1)', ...txGas});

            const senderBalance = await this.token.balanceOf(owner);
            assert.equal(senderBalance, initialBalance - amount);

            const recipientBalance = await this.token.balanceOf(to);
            assert.equal(recipientBalance, amount);

            const logs = tx.logs;
            assert.equal(logs.length, 1);
            assert.equal(logs[0].event, 'Transfer');
            assert.equal(logs[0].args.from, owner);
            assert.equal(logs[0].args.to, to);
            assert(logs[0].args.value.eq(amount));
        });

        it('should confirm with a 10 address batch (mixed addresses)', async function () {
            const tx = await this.token.batchTransfer(batchToAddresses, batchAmounts, {from: owner});
            const txGas = await calculateGasCost(tx);
            gasReport.push({msg: 'batchTransfer (10)', ...txGas});

            const senderBalance = await this.token.balanceOf(owner);
            assert.equal(senderBalance, initialBalance - (amount * batchToAddresses.length));

            batchToAddresses.forEach(async (account) => {
                const balance = await this.token.balanceOf(account);
                assert.equal(balance, amount);
            });

            const logs = tx.logs;
            assert.equal(logs.length, batchToAddresses.length);
            batchToAddresses.forEach(async (account, i) => {
                assert.equal(logs[i].event, 'Transfer');
                assert.equal(logs[i].args.from, owner);
                assert.equal(logs[i].args.to, account);
                assert(logs[i].args.value.eq(amount));
            });
        });

        [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].forEach((batchSize) => {
            const dynamicToAddresses = [...Array(batchSize).keys()].map(() => account1);
            const dynamicAmounts = dynamicToAddresses.map(() => amount);

            it(`should confirm with a ${batchSize} address batch (single address)`, async function () {

                const tx = await this.token.batchTransfer(dynamicToAddresses, dynamicAmounts, {from: owner});
                const txGas = await calculateGasCost(tx);
                gasBatchReport.push({msg: `batchTransfer (${batchSize})`, ...txGas});

                const senderBalance = await this.token.balanceOf(owner);
                assert.equal(senderBalance, initialBalance - (amount * dynamicToAddresses.length));

                dynamicToAddresses.forEach(async (account) => {
                    const balance = await this.token.balanceOf(account);
                    assert.equal(balance, amount * dynamicToAddresses.length);
                });
            });
        });
    });

    describe('Batch transfer via string split', function () {
        const amount = 1;

        const testDataRange = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

        testDataRange.forEach((val) => {
            const toAddresses = lodash.range(0, val).map(() => account1).join(',');
            const amounts = lodash.range(0, val).map(() => amount).join(',');

            it(`should split and transfer to many [${val}]`, async function () {
                const tx = await await this.token.batchTransferViaSplit(toAddresses, amounts, {from: owner});
                const txGas = await calculateGasCost(tx);
                gasBatchSplitReport.push({msg: `batchTransferViaSplit (${val})`, ...txGas});
            });
        });
    });

    after(async function () {

        if (gasBatchReport.length > 0) {
            console.log('\n');

            const fx = 361.95;

            let table = new AsciiTable('WakERC20Token Gas Costs (Basic)');
            table.setHeading('function', 'gas price', 'gas user', 'gas cost', 'USD cost');
            gasReport.forEach((gasTx) => {
                table.addRow(gasTx.msg, `${weiToGwei(gasTx.gasPrice)} GWEI`, gasTx.gasUsed, `${weiToEther(gasTx.gasCost)} ETH`, `${(weiToEther(gasTx.gasCost) * fx).toFixed(2)} USD`);
            });
            console.log(table.toString());
            console.log('\n');

            let batchTable = new AsciiTable('WakERC20Token Gas Costs (Batch)');
            batchTable.setHeading('function', 'gas price', 'gas user', 'gas cost', 'USD cost');
            gasBatchReport.forEach((gasTx) => {
                batchTable.addRow(gasTx.msg, `${weiToGwei(gasTx.gasPrice)} GWEI`, gasTx.gasUsed, `${weiToEther(gasTx.gasCost)} ETH`, `${(weiToEther(gasTx.gasCost) * fx).toFixed(2)} USD`);
            });

            console.log(batchTable.toString());
            console.log('\n');

            let batchSplitTable = new AsciiTable('WakERC20Token Gas Costs (Batch (Split String))');
            batchSplitTable.setHeading('function', 'gas price', 'gas user', 'gas cost', 'USD cost');
            gasBatchSplitReport.forEach((gasTx) => {
                batchSplitTable.addRow(gasTx.msg, `${weiToGwei(gasTx.gasPrice)} GWEI`, gasTx.gasUsed, `${weiToEther(gasTx.gasCost)} ETH`, `${(weiToEther(gasTx.gasCost) * fx).toFixed(2)} USD`);
            });

            console.log(batchSplitTable.toString());
            console.log('\n');

            console.log('WakERC20Token Gas Costs (Batch)');
            if (gasBatchReport.length > 1) {
                console.log(AsciiChart.plot(gasBatchReport.map((gasTx) => gasTx.gasUsed), {height: 6}));
            }
            console.log('\n');

            console.log('WakERC20Token Gas Costs (Batch (Split String))');
            if (gasBatchSplitReport.length > 1) {
                console.log(AsciiChart.plot(gasBatchSplitReport.map((gasTx) => gasTx.gasUsed), {height: 6}));
            }
            console.log('\n');
        }
    });

    const calculateGasCost = async (receipt) => {
        const tx = await web3.eth.getTransaction(receipt.tx);
        const gasPrice = tx.gasPrice;
        return {
            gasPrice: gasPrice,
            gasUsed: receipt.receipt.gasUsed,
            gasCost: gasPrice.mul(receipt.receipt.gasUsed)
        };
    };

});

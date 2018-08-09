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

    describe('transfer', function () {
        describe('when the recipient is valid', function () {
            const to = recipient;

            describe('when the sender has enough balance', function () {
                const amount = 100;

                it('transfers the requested amount', async function () {
                    const tx = await this.token.transfer(to, amount, {from: owner});
                    const txGas = await calculateGasCost(tx);
                    gasReport.push({msg: 'transfer', ...txGas});

                    const senderBalance = await this.token.balanceOf(owner);
                    assert.equal(senderBalance, 0);

                    const recipientBalance = await this.token.balanceOf(to);
                    assert.equal(recipientBalance, amount);
                });

                it('emits a transfer event', async function () {
                    const {logs} = await this.token.transfer(to, amount, {from: owner});

                    assert.equal(logs.length, 1);
                    assert.equal(logs[0].event, 'Transfer');
                    assert.equal(logs[0].args.from, owner);
                    assert.equal(logs[0].args.to, to);
                    assert(logs[0].args.value.eq(amount));
                });
            });
        });
    });

    describe('transfer multiple', function () {
        describe('when the recipient is valid', function () {
            const to = recipient;

            describe('when the sender has enough balance', function () {
                const amount = 100;

                it('single transfer of the requested amount', async function () {
                    const tx = await this.token.batchTransfer([to], [amount], {from: owner});
                    const txGas = await calculateGasCost(tx);
                    gasReport.push({msg: 'batchTransfer (1)', ...txGas});

                    const senderBalance = await this.token.balanceOf(owner);
                    assert.equal(senderBalance, 0);

                    const recipientBalance = await this.token.balanceOf(to);
                    assert.equal(recipientBalance, amount);
                });

                it('emits a transfer event', async function () {
                    const {logs} = await this.token.batchTransfer([to], [amount], {from: owner});

                    assert.equal(logs.length, 1);
                    assert.equal(logs[0].event, 'Transfer');
                    assert.equal(logs[0].args.from, owner);
                    assert.equal(logs[0].args.to, to);
                    assert(logs[0].args.value.eq(amount));
                });
            });

            describe('when the sender has enough balance', function () {
                const amount = 1;
                const toAddresses = [
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
                const amounts = toAddresses.map(() => amount);

                it('batch transfers the requested amount  (multiple - 10)', async function () {
                    const tx = await this.token.batchTransfer(toAddresses, amounts, {from: owner});
                    const txGas = await calculateGasCost(tx);
                    gasReport.push({msg: 'batchTransfer (10)', ...txGas});

                    const senderBalance = await this.token.balanceOf(owner);
                    assert.equal(senderBalance, initialBalance - (amount * toAddresses.length));

                    toAddresses.forEach(async (account) => {
                        const balance = await this.token.balanceOf(account);
                        assert.equal(balance, amount);
                    });
                });

                it('emits a transfer event', async function () {
                    const {logs} = await this.token.batchTransfer(toAddresses, amounts, {from: owner});

                    assert.equal(logs.length, toAddresses.length);
                    toAddresses.forEach(async (account, i) => {
                        assert.equal(logs[i].event, 'Transfer');
                        assert.equal(logs[i].args.from, owner);
                        assert.equal(logs[i].args.to, account);
                        assert(logs[i].args.value.eq(amount));
                    });

                });
            });

            describe('when the sender has enough balance', function () {
                const amount = 1;

                const testDataRange = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
                testDataRange.forEach((val) => {
                    const toAddresses = [...Array(val).keys()].map(() => account1);
                    const amounts = toAddresses.map(() => amount);

                    it(`batch transfers the requested amount to the same address ${val} times`, async function () {

                        const tx = await this.token.batchTransfer(toAddresses, amounts, {from: owner});
                        const txGas = await calculateGasCost(tx);
                        gasBatchReport.push({msg: `batchTransfer [single address] (${val})`, ...txGas});

                        const senderBalance = await this.token.balanceOf(owner);
                        assert.equal(senderBalance, initialBalance - (amount * toAddresses.length));

                        toAddresses.forEach(async (account) => {
                            const balance = await this.token.balanceOf(account);
                            assert.equal(balance, amount * toAddresses.length);
                        });
                    });
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
                gasBatchSplitReport.push({msg: `batchTransferViaSplit [string, string] (${val})`, ...txGas});
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

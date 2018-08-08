
const weiToEther = require('./helpers/weiToEther');

const WakERC20Token = artifacts.require('WakERC20Token');

const AsciiTable = require('ascii-table')

contract('WakERC20Token', function ([
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
                                    ]) {

    const calculateGasCost = async (receipt) => {
        const tx = await web3.eth.getTransaction(receipt.tx);
        const gasPrice = tx.gasPrice;
        return {
            gasPrice: gasPrice,
            gasUsed: receipt.receipt.gasUsed,
            gasCost: gasPrice.mul(receipt.receipt.gasUsed)
        };
    };

    const initialBalance = 100;
    const gasReport = [];

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
        describe('when the recipient is not the zero address', function () {
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
        describe('when the recipient is not the zero address', function () {
            const to = recipient;

            describe('when the sender has enough balance (single)', function () {
                const amount = 100;

                it('transfers the requested amount', async function () {
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

            describe('when the sender has enough balance (multiple - 10)', function () {
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

                it('transfers the requested amount', async function () {
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
        });
    });

    after(async function() {

        console.log('\n');

        let table = new AsciiTable('WakERC20Token Gas Costs');
        table.setHeading('function', 'gas price', 'gas user', 'gas cost');

        gasReport.forEach((gasTx) => {
            table.addRow(gasTx.msg, gasTx.gasPrice, gasTx.gasUsed, `${weiToEther(gasTx.gasCost)} ETH`)
        });

        console.log(table.toString())
    });
});

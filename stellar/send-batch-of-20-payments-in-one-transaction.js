const StellarSdk = require('stellar-sdk');
const _ = require('lodash');
const Accounts = require('./accounts');

const {performance} = require('perf_hooks');

StellarSdk.Network.useTestNetwork();

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

(async function () {

    const ISSUER = "issuer";
    const AMOUNT = "1";
    const ASSET_CODE = "TestTx";

    const {secretKey: fromSecretKey, publicKey: fromPublicKey} = Accounts.get(ISSUER);

    const issuer = await server.loadAccount(fromPublicKey);

    const accountsToPay = _.range(0, 20);

    let transactionBuilder = new StellarSdk.TransactionBuilder(issuer);

    // Add X operations
    _.forEach(accountsToPay, (acc) => {
        console.log(`Sending [${AMOUNT}] of [${ASSET_CODE}] to [account_${acc}]`);

        const {publicKey: toPublicKey} = Accounts.get(`account_${acc}`);
        transactionBuilder
            .addOperation(StellarSdk.Operation.payment({
                destination: toPublicKey,
                asset: new StellarSdk.Asset(ASSET_CODE, fromPublicKey),
                amount: AMOUNT
            }));
    });

    // Build it
    const transaction = transactionBuilder.build();

    // Sign it
    transaction.sign(StellarSdk.Keypair.fromSecret(fromSecretKey));

    const before = performance.now();

    // Submit it
    return server.submitTransaction(transaction)
        .then((receipt) => {
            // console.log(receipt);

            let {hash} = receipt;

            const after = performance.now();

            console.log(`Sending batch of [${accountsToPay}] operations in a single transaction [${after - before}] milliseconds.`);
            console.log(`Issuer - http://testnet.stellarchain.io/address/${fromPublicKey}`);
            console.log(`Txs - https://testnet.steexp.com/tx/${hash}`);
        })
        .catch((error) => {
            const {status, data} = error.response;
            console.log({status, data});
            console.log(_.get(data, 'extras.result_codes'));
        });
})();

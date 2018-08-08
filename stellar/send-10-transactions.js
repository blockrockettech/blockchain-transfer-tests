const StellarSdk = require('stellar-sdk');
const _ = require('lodash');
const Accounts = require('./accounts');

const {performance} = require('perf_hooks');

StellarSdk.Network.useTestNetwork();

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

(async function () {

    const RECEIVER = "jimmy";
    const ISSUER = "issuer";
    const AMOUNT = "1";
    const ASSET_CODE = "TestTx";

    const {publicKey: assetIssuerPublicKey} = Accounts.get(ISSUER);
    const {secretKey: fromSecretKey, publicKey: fromPublicKey} = Accounts.get(ISSUER);
    const {publicKey: toPublicKey} = Accounts.get(RECEIVER);

    const issuer = await server.loadAccount(fromPublicKey);

    const VOLUME = 10;

    const tests = _.range(0, VOLUME);

    const before = performance.now();

    let promises = _.map(tests, () => {

        let transaction = new StellarSdk.TransactionBuilder(issuer)
            .addOperation(StellarSdk.Operation.payment({
                destination: toPublicKey,
                asset: new StellarSdk.Asset(ASSET_CODE, assetIssuerPublicKey),
                amount: AMOUNT
            }))
            .build();

        transaction.sign(StellarSdk.Keypair.fromSecret(fromSecretKey));

        return server.submitTransaction(transaction);
    });

    Promise.all(promises)
        .then(() => {
            const after = performance.now();

            console.log(`Sending [${VOLUME}] transaction [${ after - before}] milliseconds.`);

            console.log(`Issuer - http://testnet.stellarchain.io/address/${fromPublicKey}`);
            console.log(`Receiver - http://testnet.stellarchain.io/address/${toPublicKey}`);
        })
        .catch((error) => {
            console.log(error);
        });
})();

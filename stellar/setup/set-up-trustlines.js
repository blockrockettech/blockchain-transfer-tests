const StellarSdk = require('stellar-sdk');
const Accounts = require('../accounts');

StellarSdk.Network.useTestNetwork();

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

(async function () {

    const RECEIVER = "jimmy";
    const ISSUER = "issuer";

    const LIMIT = '1000000000'; // massive limit

    const ASSET_CODE = 'TestTx';

    const {secretKey: fromSecretKey, publicKey: fromPublicKey} = Accounts.get(ISSUER);
    const {secretKey: toSecretKey, publicKey: toPublicKey} = Accounts.get(RECEIVER);

    const fromAccount = await server.loadAccount(fromPublicKey);

    let transaction = new StellarSdk.TransactionBuilder(fromAccount) // the account who pays the fee
        .addOperation(StellarSdk.Operation.changeTrust({
            asset: new StellarSdk.Asset(ASSET_CODE, fromPublicKey),
            limit: LIMIT,
            source: toPublicKey
        }))
        .build();

    // Requester then signs the transaction
    transaction.sign(StellarSdk.Keypair.fromSecret(toSecretKey));

    // Issuer then signs the transaction
    transaction.sign(StellarSdk.Keypair.fromSecret(fromSecretKey));

    return server.submitTransaction(transaction)
        .then((result) => {

            console.log(`Issuer - http://testnet.stellarchain.io/address/${fromPublicKey}`);
            console.log(`Receiver - http://testnet.stellarchain.io/address/${toPublicKey}`);

            console.log(JSON.stringify(result, null, 4));
        })
        .catch((error) => {
            const {status, data} = error.response;
            console.log({status, data});

            console.log(_.get(data, 'extras.result_codes'));
        });
})();

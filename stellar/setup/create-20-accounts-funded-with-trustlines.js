const StellarSdk = require('stellar-sdk');
const _ = require('lodash');

const axios = require('axios');

const Accounts = require('../accounts');

StellarSdk.Network.useTestNetwork();

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const ISSUER = "issuer";
const ASSET_CODE = 'TestTx';
const LIMIT = '1000000000';

(async function () {

    const {publicKey: fromPublicKey} = Accounts.get(ISSUER);
    const fromAccount = await server.loadAccount(fromPublicKey);

    const accountsToMake = _.range(0, 20);

    const createdAccounts = _.map(accountsToMake, (acc) => {
        return createAndFundAccount(`account_${acc}`);
    });

    return Promise.all(createdAccounts)
        .then(() => {
            return Promise.all(_.map(accountsToMake, (acc) => {
                return setupTrustline(fromAccount, `account_${acc}`);
            }));
        })
        .then(() => {
            console.log("Complete");
        });
})();

function setupTrustline(fromAccount, accountName) {

    const {secretKey: toSecretKey, publicKey: toPublicKey} = Accounts.get(accountName);

    const {secretKey: fromSecretKey, publicKey: fromPublicKey} = Accounts.get(ISSUER);

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

    return server.submitTransaction(transaction);
}

function createAndFundAccount(accountName) {
    if (Accounts.exists(accountName)) {
        console.log("Account already created");
        return Promise.resolve(Accounts.get(accountName));
    }

    // Create new keypair
    const pair = StellarSdk.Keypair.random();

    console.log(`Creating account for [${accountName}] | secret = [${pair.secret()}] publicKey = [${pair.publicKey()}]`);

    // return both for testing purposes
    let account = {
        secretKey: pair.secret(),
        publicKey: pair.publicKey(),
    };
    Accounts.set(accountName, account);

    console.log(`FRIEND-BOT: Funding account with public key of [${account.publicKey}]`);

    // for example
    // https://friendbot.stellar.org/?addr=GDJY6ELYMCKP4RQ56CZFL3XWUUVJMBRZD3EXZT6QK2PZDFT6HGSHO6KP
    return axios.get(`https://friendbot.stellar.org/?addr=${account.publicKey}`)
        .then((response) => {
            const {status, data} = response;
            console.log({status, data});
        })
        .catch((error) => {
            const {status, data} = error.response;
            console.error({status, data});
        });
}

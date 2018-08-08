const StellarSdk = require('stellar-sdk');
const axios = require('axios');
const Accounts = require('./accounts');

StellarSdk.Network.useTestNetwork();

(async function () {

    const RECEIVER = "jimmy";

    if (Accounts.exists(RECEIVER)) {
        console.log("Account already created");
        return Promise.resolve(Accounts.get(RECEIVER));
    }

    // Create new keypair
    const pair = StellarSdk.Keypair.random();

    console.log(`Creating account for [${RECEIVER}] | secret = [${pair.secret()}] publicKey = [${pair.publicKey()}]`);

    // return both for testing purposes
    let account = {
        secretKey: pair.secret(),
        publicKey: pair.publicKey(),
    };
    Accounts.set(RECEIVER, account);

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
})();

const BigNumber = require("bignumber.js");
const Web3 = require("web3");

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545/")); // Use this URL if you're going to use Ganache Truffle.

const tos = []; // Fill this array with the Ethereum addresses where you want to send the asset to.

const privateKeys = []; // Fill this array with the private keys of Ethereum addresses which will send the asset.

function randomNumber(type) {
    return Math.floor(Math.random() * (type === "tos") ? tos.length : privateKeys.length);
}

async function sendEtherBot() {
    try {
        const tosRandomNumber = randomNumber("tos"), to = tos[tosRandomNumber],
            amount = new BigNumber(Math.random() * 0.1).multipliedBy(new BigNumber(Math.pow(10, 18))).toFixed(),
            privateKey = privateKeys[randomNumber("privateKeys")],
            from = web3.eth.accounts.privateKeyToAccount(privateKey).address;

        const [count, estimatedGas, gasPrice] = await Promise.all([
            web3.eth.getTransactionCount(from),
            web3.eth.estimateGas({from: from, to: to, value: amount}),
            web3.eth.getGasPrice(),
        ]);

        const signedTx = await web3.eth.accounts.signTransaction({
                from: from, to: to, gas: estimatedGas, nonce: count, value: amount,
                gasPrice: new BigNumber(gasPrice).toFixed(),
            }, privateKey,
        );

        await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    } catch (e) {

    }
}

async function main() {
    setInterval(async () => {
        await sendEtherBot();
    }, 5000);
}

main().then();
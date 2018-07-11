const ethers = require('ethers');
const {unsign} = require('@warren-bank/ethereumjs-tx-sign');
var request = require('request');

let lastBlock = 5932378;

class Block {
    constructor(id, count, addresses) {
        this.id = id;
        this.count = count;
        this.wallets = addresses;
    }
}

class Address {
    constructor(publicKey, address, amount) {
        this.publicKey = publicKey;
        this.address = address;
        this.amount = amount;
    }
}

function send(block) {
    let requestBody = JSON.stringify(block);
    console.log(requestBody);
    request.post({
        url: 'https://a3f4a9af.ngrok.io/blocks',
        body: block,
        json: true
    });
}

async function rusher() {
    console.log("Rush");

    let providers = ethers.providers;
    let provider = providers.getDefaultProvider('mainnet');

    for (i = lastBlock; i > 0; i--) {
        var addresses = [];
        var keys = [];
        console.log("Block Number: " + i);
        let block = await provider.getBlock(i);
        let transactions = block.transactions;

        console.log("Transactions: " + transactions.length);

        for (let j = 0; j < transactions.length; j++) {
            let transaction = await provider.getTransaction(transactions[j]);
            let rawMessage = transaction.raw;
            let {publicKey, address} = unsign(rawMessage);

            let balance = await provider.getBalance(address);
            if (balance.toString() === "0") {
                continue;
            }

            let entry = new Address(publicKey, address, balance.toString());

            if (!keys.includes(publicKey)) {
                keys.push(publicKey);
                addresses.push(entry);
            }
        }

        send(new Block(i, addresses.length, addresses));
    }
}

rusher();
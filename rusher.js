const ethers = require('ethers');
const {unsign} = require('@warren-bank/ethereumjs-tx-sign');
var request = require('request');

var url;

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
        url: url,
        body: block,
        json: true,
        keepAlive: true
    });
}

function rusher(blockId, provider) {
    console.log("Rush");
    provider.getBlock(blockId).then(function (block) {
        console.log("Block Number: " + blockId);

        let transactions = block.transactions;

        console.log("Transactions: " + transactions.length);

        let promises = [];
        let addresses = [];
        for (let j = 0; j < transactions.length; j++) {
            promises.push(
                new Promise(function (resolve, reject) {
                    provider.getTransaction(transactions[j])
                        .then(function (transaction) {
                            let rawMessage = transaction.raw;
                            let {publicKey, address} = unsign(rawMessage);

                            return new Promise(function (resolve, reject) {
                                let entry = new Address(publicKey, address, 0);
                                resolve(entry);
                            });
                        })
                        .then(function (entry) {
                            return new Promise(function (resolve, reject) {
                                provider.getBalance(entry.address).then(function (balance) {
                                    entry.amount = balance.toString();
                                    resolve(entry)
                                });
                            })
                        })
                        .then(function (entry) {
                            addresses.push(entry);
                            resolve(entry);
                        });
                }))
        }

        Promise.all(promises).then(function (addresses) {
            addresses = addresses.filter(address => address.amount !== "0");
            send(new Block(blockId, addresses.length, addresses));
        });
    }).catch(console.log);
}

function run() {
    let providers = ethers.providers;
    let provider = providers.getDefaultProvider('mainnet');

    url = process.argv[2];
    if (url === undefined) {
        throw new Error('Collector url was not provided!');
    }

    let blockId = parseInt(process.argv[3]);
    if (blockId !== undefined && !Number.isInteger(blockId)) {
        throw new Error('Not a valid block number was provided!');
    }

    rusher(blockId, provider);
}

run();
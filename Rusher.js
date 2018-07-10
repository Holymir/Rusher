const ethers = require('ethers');
const log = require('./logToFile');
const fs = require('fs');

let addresses = new Set();
let fromBlock = 5932741;

async function rusher() {
    console.log("Rush");
    readFromSet();

    let providers = ethers.providers;
    let provider = providers.getDefaultProvider('mainnet');

    for (i = fromBlock; i > 0; i--) {
        log("Block Number: " + i);
        console.log("Block Number: " + i);
        let block = await provider.getBlock(i);
        let transactions = block.transactions;

        log("Transactions: " + transactions.length);
        console.log("Transactions: " + transactions.length);

        for (let j = 0; j < transactions.length; j++) {
            let transaction = await provider.getTransaction(transactions[j]);
            if (!addresses.has(transaction.to)) {
                let balance = await provider.getBalance(transaction.to);
                if (balance.toString() !== "0") {
                    addresses.add(transaction.to);
                    log(transaction.to);
                    console.log(transaction.to);
                }
            }
            if (!addresses.has(transaction.from)) {
                let balance = await provider.getBalance(transaction.from);
                if (balance.toString() !== "0") {
                    addresses.add(transaction.from);
                    log(transaction.from);
                    console.log(transaction.from);
                }

            }
        }
    }
}

function readFromSet() {
    fs.readFile("log.txt", "utf8", function(err, text){
        let textByLine = text.split("\n");
        for (const i of textByLine) {
            addresses.add(i.replace("\r", ""));
        }
    });
}

rusher();
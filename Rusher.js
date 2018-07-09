const ethers = require('ethers');
const log = require('log-to-file');

let lastBlock = 5932382;
let addresses = [];

async function rusher() {
    console.log("Rush");

    let providers = ethers.providers;
    let provider = providers.getDefaultProvider('mainnet');
    let isWritten = false;

    for (i = lastBlock; i > 0; i--) {
        log("Block Number: " + i);
        console.log("Block Number: " + i);
        let block = await provider.getBlock(i);
        let transactions = block.transactions;

        log("Transactions: " + transactions.length);
        console.log("Transactions: " + transactions.length);

        for (let j = 0; j < transactions.length; j++) {
            let transaction = await provider.getTransaction(transactions[j]);
            isWritten = false;
            for (let k = 0; k < addresses.length; k++) {
                if (addresses[k] === transaction.to) {
                    isWritten = true;
                }
            }
            if (!isWritten) {
                addresses.push(transaction.to);
                log(transaction.to);
                console.log(transaction.to)
            }
        }

    }
}

rusher();
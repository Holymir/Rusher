const ethers = require('ethers');
// const addresses = require('./Rusher');
let counter = 0;


function checkCheck() {
    let a = new Date().getTime();
    while (true) {
        let wallet = ethers.Wallet.createRandom();
        counter++;
        if (counter === 100) {
            break
        }
    }
    let b = new Date().getTime();
    console.log(b-a);
}
checkCheck();
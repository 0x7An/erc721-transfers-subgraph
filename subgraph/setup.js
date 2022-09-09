// load deployed_contract.json and for each contract, call the setup function
// with the arguments from the json file

const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

const contracts = JSON.parse(fs.readFileSync('deployed_contracts.json', 'utf8'));

async function setup(address, name, symbol, baseURI) {
    try {
        const { exec } = require('child_process');
        exec(`graph add subgraph/`, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(stdout);
        });

        console.log('setBaseURI', tx);
    } catch (error) {
        console.log(error);
    }
}

async function main() {
    contracts.forEach(async (contract) => {
        console.log(contract.address);
        await setup(contract.address, contract.name, contract.symbol, contract.baseURI);
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
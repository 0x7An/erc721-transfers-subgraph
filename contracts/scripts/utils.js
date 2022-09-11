const { randAnimalType, randColor } = require('@ngneat/falso');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const configPath = path.join(__dirname, '../..', 'deployed_contracts.json');

async function seedSubgraph(address) {
    const sedCommand = `sed -i '' 's/address: ".*"/address: "${address}"/g' ../subgraph/subgraph.yaml`;
    await exec(sedCommand);
}

async function createName() {
    const firstWord = randColor({ length: 5 })[0];
    const secondWord = randAnimalType({ capitalize: true }) + 's';
    const contractName = firstWord + ' ' + secondWord;
    const symbol = firstWord.toUpperCase().substring(0, 2) + secondWord.toUpperCase().substring(0, 2);
    return { contractName, symbol };
}

async function saveDeployedContract(contractConfig) {
    try {
        if (!fs.existsSync(configPath)) fs.writeFileSync(configPath, JSON.stringify([]));
        const configData = fs.readFileSync(configPath, 'utf8');
        const configArray = JSON.parse(configData);
        configArray.push(contractConfig);
        fs.writeFileSync(configPath, JSON.stringify(configArray, null, 2));
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    seedSubgraph,
    saveDeployedContract,
    createName,
}
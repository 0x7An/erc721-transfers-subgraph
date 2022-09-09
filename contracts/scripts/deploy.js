const hre = require('hardhat');
const { randAnimalType, randColor } = require('@ngneat/falso');
const fs = require('fs');
const path = require('path');

async function deployContract() {
  const ERC721 = await hre.ethers.getContractFactory('ERC721StandardToken');

  const deployer = await hre.ethers.getSigners();
  const deployerAddress = await deployer[0].getAddress();

  const firstWord = randColor({ length: 5 })[0];
  const secondWord = randAnimalType({ capitalize: true }) + 's';

  const contractName = firstWord + ' ' + secondWord;
  const symbol = firstWord.toUpperCase().substring(0, 2) + secondWord.toUpperCase().substring(0, 2);

  const erc721 = await ERC721.deploy(contractName, symbol, 10000);
  let contractDeployed = await erc721.deployed();

  const config = {
    name: contractName,
    symbol,
    address: erc721.address,
    deployer: deployerAddress,
    createdAt: new Date().toISOString(),
  };

  const filePath = path.join(__dirname, '../..', 'deployed_contracts.json');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }

  const configData = fs.readFileSync(filePath, 'utf8');
  const configArray = JSON.parse(configData);
  configArray.push(config);
  fs.writeFileSync(filePath, JSON.stringify(configArray, null, 2));

  console.log('Contract deployed to:', erc721.address);
  await contractDeployed.flipSaleState();
}

async function main() {
  for (let i = 0; i < 10; i++) {
    await deployContract();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const hre = require('hardhat');
const contracts = require('../../deployed_contracts.json');

async function mint(contractAddress, fromAddress) {
  try {
    const ERC721 = await hre.ethers.getContractFactory('ERC721StandardToken');
    const contract = await ERC721.attach(contractAddress);
    let contractDeployed = await contract.deployed();

    if (!contractDeployed) {
      throw new Error('Contract not deployed');
    }

    // call setBaseURI function
    // const tx = await contractDeployed.setBaseURI('https://us-central1-bayc-metadata.cloudfunctions.net/api/tokens/');

    let tx = await contractDeployed.mint(1, {
      // from: "0xb1e04b696c913a0892cc6dffe604ee5397c98094",
      value: hre.ethers.utils.parseEther('1'),
      gasLimit: 511977,
      gasPrice: 999000,
    });

    const accounts = await hre.ethers.getSigners();

    let receipt = await tx.wait();

    tx = await contractDeployed.transferFrom(fromAddress, accounts[1].address, receipt.events[0].args.tokenId.toString(), {
      from: fromAddress,
    })

    return receipt.events[0].args.tokenId.toString()
  } catch (error) {
    console.log(error);
  }
}

// declare main funtion to loop over a list and call mint function
async function main() {
  const accounts = await hre.ethers.getSigners();
  console.log(contracts.length + ' contracts found');
  const tokenId = await mint(contracts[contracts.length - 1].address, accounts[0].address);
  console.log(`🟢 ${accounts[0].address} minted one ${contracts[contracts.length - 1].name} #"${tokenId}"`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

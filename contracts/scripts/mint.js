const hre = require('hardhat');
const contracts = require('../../deployed_contracts.json');

async function mint(address) {
  try {
    const ERC721 = await hre.ethers.getContractFactory('ERC721StandardToken');
    const contract = await ERC721.attach(address);
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

    // console.log('mint', tx);

    // get info from transaction hash
    let receipt = await tx.wait();

    // get all accounts
    const accounts = await hre.ethers.getSigners();

    tx = await contractDeployed.transferFrom(accounts[0].address, accounts[1].address, receipt.events[0].args.tokenId.toString(), {
      from: accounts[0].address,
    })

    console.log('transfer', tx);
  } catch (error) {
    console.log(error);
  }
}

// declare main funtion to loop over a list and call mint function
async function main() {
  console.log(contracts)

  contracts.forEach(async (contract) => {
    console.log(contract.address)
    await mint(contract.address);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

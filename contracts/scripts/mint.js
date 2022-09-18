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
    await contractDeployed.mint(1, {
      // from: "0xb1e04b696c913a0892cc6dffe604ee5397c98094",
      value: hre.ethers.utils.parseEther('0.1'),
      gasLimit: 511977,
      gasPrice: 999000,
    });

    let tx = await contractDeployed.mint(1, {
      // from: "0xb1e04b696c913a0892cc6dffe604ee5397c98094",
      value: hre.ethers.utils.parseEther('0.1'),
      gasLimit: 511977,
      gasPrice: 999000,
    });

    const accounts = await hre.ethers.getSigners();

    let receipt = await tx.wait();

    // tx = await contractDeployed.transferFrom(fromAddress, accounts[1].address, receipt.events[0].args.tokenId.toString(), {
    //   from: fromAddress,
    // })

    return receipt.events[0].args.tokenId.toString()
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  const accounts = await hre.ethers.getSigners();
  console.log(contracts.length + ' contracts found');

  for (let i = 0; i < 10; i++) {
    const contract = contracts[contracts.length - 1];
    const tokenId = await mint(contract.address, accounts[0].address);

    console.log(`🟢 ${accounts[0].address} minted one ${contracts[contracts.length - 1].name} #"${tokenId}"`);

    let balance = await accounts[0].getBalance();

    console.log('Account 0 balance: ', balance);
    if (balance < hre.ethers.utils.parseEther('0.1')) {
      console.log('Account 0 balance is lower then 0.1 ether');
      break;
    }
  }

  

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

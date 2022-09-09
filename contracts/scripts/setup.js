const hre = require('hardhat');
const ERC721_ADDRESS = process.env.ERC721_ADDRESS;

async function main() {
  const Bayc = await hre.ethers.getContractFactory('BoredApeYachtClub');
  const contract = await Bayc.attach(ERC721_ADDRESS);

  let boredApeYachtClub = await contract.deployed();
  let tx = await boredApeYachtClub.flipSaleState();

  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

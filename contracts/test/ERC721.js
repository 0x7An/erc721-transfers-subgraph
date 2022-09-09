const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC721", function () {
  beforeEach(async function () {
    const ERC721 = await ethers.getContractFactory("ERC721");
    this.contract = await ERC721.deploy('TEST', 'TEST', 10000)

    await this.contract.deployed();

    await this.contract.setBaseURI("https://");
    await this.contract.flipStateSale();
  });

  it("Should return the baseURI", async function () {
    await this.contract.mint(1, {
      value: hre.ethers.utils.parseEther('1'),
      gasLimit: 511977,
      gasPrice: 999000,
    });
    expect(await erc721.baseURI()).to.not.be.null;
    expect(await erc721.baseURI()).to.equal("https://");
    expect(await this.contract.tokenURI(1)).to.equal("https://1");
  });

  it("Should return the contract name", async function () {
    expect(await this.contract.name()).to.equal("TEST");
  });

  it("Should return the contract symbol", async function () {
    expect(await this.contract.symbol()).to.equal("TEST");
  });

  it("Should be able to transfer", async function () {
    await this.contract.mint(1, {
      value: hre.ethers.utils.parseEther('1'),
      gasLimit: 511977,
      gasPrice: 999000,
    });

    await this.contract.transferFrom(
      await this.contract.ownerOf(1),
      await this.contract.ownerOf(1),
      1
    );
  });

  it("Should not be able to mint if contract is paused", async function () {
    await this.contract.flipStateSale();
    await expect(
      this.contract.mint(1, {
        value: hre.ethers.utils.parseEther('1'),
        gasLimit: 511977,
        gasPrice: 999000,
      })
    ).to.be.revertedWith("Sale must be active to mint");
  });
})

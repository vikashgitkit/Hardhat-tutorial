const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("Swiss contract", function () {
  // Fixture to deploy the contract
  async function deployTokenFixture() {
    const [owner, gameController, addr2] = await ethers.getSigners(); // Get signers, including gameController
    
    // Deploy the contract with gameController address (required by the constructor)
    const hardhatToken = await ethers.deployContract("Swiss", [gameController.address]);

    // Return necessary data for the test
    return { hardhatToken, owner, gameController, addr2 };
  }

  // Deployment test suite
  describe("Deployment", function () {
    it("Should set the correct gameController", async function () {
      const { hardhatToken, gameController } = await loadFixture(deployTokenFixture);

      // Check if the gameController is set correctly
      expect(await hardhatToken.gameController()).to.equal(gameController.address);
    });
  });

  // Start game function test suite
  describe("startGame function", function () {
    it("Should start the game when called by gameController", async function () {
      const { hardhatToken, gameController } = await loadFixture(deployTokenFixture);

      // Interact with the contract using gameController to start the game
      await hardhatToken.connect(gameController).startGame();

      // Validate if the game is running by calling the isRunning() method
      expect(await hardhatToken.isRunning()).to.equal(true);
    });

    it("Should fail to start the game when called by non-gameController", async function () {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

      // Attempt to start the game with the owner (not the gameController)
      await expect(hardhatToken.connect(owner).startGame()).to.be.revertedWithCustomError(
        hardhatToken, "OwnableUnauthorizedAccount"
      ).withArgs(owner.address); // Check that the custom error includes the owner's address
    });
  });
});

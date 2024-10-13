const { expect } = require("chai");

describe("Token contract", function () {
  it("Deployment should startGame", async function () {
    const [owner, gameController] = await ethers.getSigners(); // Get signers for owner and game controller

    // Correct method to deploy the contract with the gameController address
    const TokenFactory = await ethers.getContractFactory("Swiss");

    // Deploy the contract with gameController address
    const hardhatToken = await TokenFactory.deploy(gameController.address);

    // Wait for deployment to finish
    await hardhatToken.waitForDeployment();

    // Interact with the contract using connect() to specify the gameController (the owner)
    await hardhatToken.connect(gameController).startGame();

    // Validate if the game is running by calling the isRunning() method
    expect(await hardhatToken.isRunning()).to.equal(true);
  });
});

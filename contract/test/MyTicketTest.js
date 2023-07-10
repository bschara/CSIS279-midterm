// const { ethers } = require("hardhat");
// const { expect } = require("chai");

// // Define a test suite for the MyToken contract
// describe("MyToken contract", () => {

//   // Define variables to be used across multiple tests
//   let myToken;
//   let owner;
//   let user1;
//   let user2;
//   const collectionName = "Test Collection";
//   const collectionTicketPrice = 1;
//   const collectionTicketCount = 10;
//   const collectionOrganizerAddress = "0x1234567890123456789012345678901234567890";
//   const ticketName = "Test Ticket";
//   const ticketPlace = "Test Place";
//   const ticketDate = "Test Date";

//   // Define a function to deploy the MyToken contract before each test
//   beforeEach(async () => {
//     [owner, user1, user2] = await ethers.getSigners();
//     const MyToken = await ethers.getContractFactory("MyToken");
//     myToken = await MyToken.deploy();
//     await myToken.deployed();
    
//     // Create a collection before each test
//     await myToken.createCollection(collectionName, ticketPlace, ticketDate, collectionTicketPrice, collectionTicketCount, collectionOrganizerAddress);
//   });

//   // Define a test case to ensure that a token can be minted
//   describe("Minting a Token", () => {
//     it("Should allow the owner to mint a token", async () => {
//       await myToken.createCollection(collectionName, ticketPlace, ticketDate, collectionTicketPrice, collectionTicketCount, collectionOrganizerAddress);
//       const collection = await myToken.getCollection(0);
//       const tokenIdToMint = collection.tokenIds[collection.tokenIds.length - 1];
//       if (await myToken.exists(tokenIdToMint)) {
//         // Token already minted, skip test
//         return;
//       }
//       await myToken.mint(0, user1.address);
//       expect(await myToken.ownerOf(tokenIdToMint)).to.equal(user1.address);
//     });
//   });
  
// describe("get collectiob", () => {
//   it("should get the collection by tokenId", async () => {
  
//   })
// })

// });


// Importing required libraries and the contract being tested
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  let myToken;

  beforeEach(async function () {
    // Deploying the contract before each test
    const MyToken = await ethers.getContractFactory("MyToken");
    myToken = await MyToken.deploy();
    await myToken.deployed();
  });

  describe("getCollectionByTokenId", function () {
    it("should return the correct collection for a given token ID", async function () {
      // Creating a new collection and minting a token for testing
      const name = "My Collection";
      const place = "Online";
      const date = "2022-01-01";
      const ticketPrice = ethers.utils.parseEther("0.01");
      const ticketCount = 5;
      const organizerAddress = ethers.constants.AddressZero;
      await myToken.createCollection(name, place, date, ticketPrice, ticketCount, organizerAddress);
      const tokenId = 1;
      const ownerAddress = ethers.constants.AddressZero;
      await myToken.mint(0, ownerAddress);

      // Getting the collection for the token ID and asserting that it is correct
      const collection = await myToken.getCollectionByTokenId(tokenId);
      expect(collection.name).to.equal(name);
      expect(collection.tokenIds).to.deep.equal([tokenId]);
      expect(collection.ticketCount).to.equal(ticketCount);
      expect(collection.ticketSold).to.equal(0);
    });

    it("should throw an error if the given token ID does not exist", async function () {
      // Asserting that an error is thrown when attempting to get a collection for a nonexistent token ID
      await expect(myToken.getCollectionByTokenId(1)).to.be.revertedWith("Token not found in any collection");
    });
  });
});

// // SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.13;

// import "./ViolinCoin.sol";
// import "./Riff.sol";

// contract RiffFactory {

//     struct riffToken {
//         string name;
//         string ticker;
//         string tokenImageUrl;
//         uint256 fundingRaised;
//         address tokenAddress;
//         address creatorAddress;
//     }

//     mapping(address => riffToken) public addressToRiffTokenMapping;

//     uint constant DECIMALS = 10 * 18;
//     uint256 constant MAX_SUPPLY = 1000000 * DECIMALS;
//     uint256 constant INIT_SUPPLY = 20 * MAX_SUPPLY / 100;

//     uint256 constant RIFFTOKEN_FUNDING_GOAL = 24 ether;

//     uint256 constant RIFFTOKEN_CREATION_FEE = 0.0001 ether;

//     address[] tokens;
//     suint256 tokenCount;

//     /*
//      * Create a riff token with name, ticker, and image.
//      */
//     function createRiffToken(string memory name, string memory ticker, string memory imageUrl) public payable returns(address) {
//         require(msg.value >= RIFFTOKEN_CREATION_FEE, "Invalid token creation fee");

//         ViolinCoin violinCoin = new ViolinCoin(msg.sender, name, ticker, uint8(DECIMALS));
//         address violinCoinAddress = address(violinCoin);
//         riffToken memory newToken = riffToken(name, ticker, imageUrl, 0, violinCoinAddress, msg.sender);
//         addressToRiffTokenMapping[violinCoinAddress] = newToken;
//         return violinCoinAddress;
//     }

//     function buyRiffToken(address riffTokenAddress, suint256 quantity) public payable returns (uint) {
//         // check if memecoin is listed
//         require(addressToRiffTokenMapping[riffTokenAddress].tokenAddress!=address(0), "Token is not listed on the platform");

//         riffToken storage listedToken = addressToRiffTokenMapping[riffTokenAddress];

//         ViolinCoin violinCoinCt = ViolinCoin(riffTokenAddress);

//         require(addressToRiffTokenMapping[riffTokenAddress].fundingRaised >= RIFFTOKEN_FUNDING_GOAL, "Token has not reached the funding goal yet");

//         // check to ensure there is enough supply to facilitate the purchase
//         suint256 currentSupply = suint256(violinCoinCt.totalSupply());
//     }

// }

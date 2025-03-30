// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/RiffFactory.sol";
import "../src/ViolinCoin.sol";

contract RiffFactoryTest is Test {
    RiffFactory factory;
    address deployer = address(0x123);
    address user1 = address(0x456);
    
    uint256 constant CREATION_FEE = 0.0001 ether;

    function setUp() public {
        vm.startPrank(deployer);
        factory = new RiffFactory();
        vm.stopPrank();
    }

    function test_CreateRiffToken() public {
        // Set up user with some ETH
        vm.deal(user1, 1 ether);
        
        // Define token params
        string memory name = "Violin Token";
        string memory ticker = "VIOLIN";
        string memory imageUrl = "https://example.com/violin.png";
        
        // Create token as user1
        vm.startPrank(user1);
        
        // Create token and pay fee
        address tokenAddress = factory.createRiffToken{value: CREATION_FEE}(
            name,
            ticker,
            imageUrl
        );
        
        vm.stopPrank();
        
        // Verify token was created properly
        ViolinCoin token = ViolinCoin(tokenAddress);
        
        // Check token properties
        assertEq(token.name(), name);
        assertEq(token.symbol(), ticker);
        
        // Verify the mapping was updated correctly
        (string memory storedName, string memory storedTicker, string memory storedImageUrl) = 
            factory.addressToRiffTokenMapping(tokenAddress);
            
        assertEq(storedName, name);
        assertEq(storedTicker, ticker);
        assertEq(storedImageUrl, imageUrl);
        
        // Check owner is set correctly
        assertEq(token.owner(), user1);
    }
    
    function test_RevertWhenFeeInsufficient() public {
        vm.deal(user1, 1 ether);
        vm.startPrank(user1);
        
        // Try to create with less than required fee
        vm.expectRevert("Invalid token creation fee");
        factory.createRiffToken{value: 0.00005 ether}(
            "Test Token",
            "TEST",
            "https://example.com/test.png"
        );
        
        vm.stopPrank();
    }
    
    function test_FactoryReceivesFee() public {
        vm.deal(user1, 1 ether);
        
        uint256 factoryBalanceBefore = address(factory).balance;
        
        vm.startPrank(user1);
        factory.createRiffToken{value: CREATION_FEE}(
            "Test Token",
            "TEST",
            "https://example.com/test.png"
        );
        vm.stopPrank();
        
        uint256 factoryBalanceAfter = address(factory).balance;
        assertEq(factoryBalanceAfter, factoryBalanceBefore + CREATION_FEE);
    }
}
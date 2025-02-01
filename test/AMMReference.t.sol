// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "solmate/tokens/ERC20.sol";
import {MockERC20} from "solmate/test/utils/mocks/MockERC20.sol";

import "../src/AMMReference.sol";
import {Test, console} from "forge-std/Test.sol";

contract AMMReferenceTest is Test {
    AMMReference public amm;
    SERC20 baseAsset;
    SERC20 quoteAsset;

    uint256 constant WAD = 1e18;
    uint8 constant WAD_ZEROS = 18;

    address constant SWAPPER1_ADDR = address(123);
    address constant SWAPPER2_ADDR = address(456);

    function setUp() public {
        baseAsset = new SERC20("Circle", "USDC");
        quoteAsset = new SERC20("Chainlink", "LINK");

        // Start with pool price 1 LINK = 20 USDC
        amm = new AMMReference(SERC20(address(baseAsset)), SERC20(address(quoteAsset)), WAD, 25 * WAD);
        baseAsset.mint(saddress(address(this)), suint256(200000 * WAD));
        quoteAsset.mint(saddress(address(this)), suint256(10000 * WAD));
        baseAsset.approve(saddress(address(amm)), suint256(200000 * WAD));
        quoteAsset.approve(saddress(address(amm)), suint256(10000 * WAD));
        amm.addLiquidity(suint256(200000 * WAD), suint256(10000 * WAD));

        // Two swappers start with 50k units of each, LINK and USDC
        baseAsset.mint(saddress(SWAPPER1_ADDR), suint256(50000 * WAD));
        quoteAsset.mint(saddress(SWAPPER1_ADDR), suint256(50000 * WAD));
        baseAsset.mint(saddress(SWAPPER2_ADDR), suint256(50000 * WAD));
        quoteAsset.mint(saddress(SWAPPER2_ADDR), suint256(50000 * WAD));
    }

    function test_PriceUp() public {
        vm.startPrank(SWAPPER1_ADDR);

        uint256 priceT0 = amm.getPrice();
        uint256 swapperBaseT0 = baseAsset.balanceOf();
        uint256 swapperQuoteT0 = quoteAsset.balanceOf();

        baseAsset.approve(saddress(address(amm)), suint256(30000 * WAD));
        amm.swap(suint256(30000 * WAD), suint256(0));

        assertLt(priceT0, amm.getPrice());
        assertGt(swapperBaseT0, baseAsset.balanceOf());
        assertLt(swapperQuoteT0, quoteAsset.balanceOf());

        vm.stopPrank();
    }

    function test_PriceNetDown() public {
        uint256 priceT0 = amm.getPrice();
        vm.startPrank(SWAPPER1_ADDR);
        baseAsset.approve(saddress(address(amm)), suint256(5000 * WAD));
        amm.swap(suint256(5000 * WAD), suint256(0));

        vm.startPrank(SWAPPER2_ADDR);
        quoteAsset.approve(saddress(address(amm)), suint256(5000 * WAD));
        amm.swap(suint256(0), suint256(5000 * WAD));

        assertGt(priceT0, amm.getPrice());

        vm.stopPrank();
    }

    function test_PriceReveal() public {
        // Shouldn't see price when 1 LINK = 20 USDC
        vm.expectRevert();
        amm.getPriceGated();

        // Should see price when 1 LINK = 31 USDC after this swap
        vm.startPrank(SWAPPER1_ADDR);
        baseAsset.approve(saddress(address(amm)), suint256(50000 * WAD));
        amm.swap(suint256(50000 * WAD), suint256(0));
        vm.stopPrank();
        amm.getPriceGated();
    }
}

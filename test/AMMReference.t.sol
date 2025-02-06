// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "lib/solmate/src/tokens/ERC20.sol";
import {MockERC20} from "lib/solmate/src/test/utils/mocks/MockERC20.sol";

import "../src/AMMReference.sol";
import {Test, console} from "lib/forge-std/src/Test.sol";

contract AMMReferenceTest is Test {
    AMMReference public amm;
    SERC20 baseAsset;
    SERC20 quoteAsset;

    address testAdmin = address(0xabcd);

    uint256 constant WAD = 1e18;
    uint8 constant WAD_ZEROS = 18;

    address constant SWAPPER1_ADDR = address(123);
    address constant SWAPPER2_ADDR = address(456);

    address constant NON_LISTENER_ADDR = address(789);

    function setUp() public {
        baseAsset = new SERC20("Circle", "USDC");
        quoteAsset = new SERC20("Chainlink", "LINK");

        // Start with pool price 1 LINK = 20 USDC
        amm = new AMMReference(SERC20(address(baseAsset)), SERC20(address(quoteAsset)), WAD, 25 * WAD, testAdmin);
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

        // Another address that starts with 50k units of each, LINK and USDC
        baseAsset.mint(saddress(NON_LISTENER_ADDR), suint256(50000 * WAD));
        quoteAsset.mint(saddress(NON_LISTENER_ADDR), suint256(50000 * WAD));

        // Request violin access for test accounts
        vm.startPrank(SWAPPER1_ADDR);
        amm.listen();
        vm.stopPrank();

        vm.startPrank(SWAPPER2_ADDR);
        amm.listen();
        vm.stopPrank();
    }

    function test_PriceUp() public {
        vm.startPrank(SWAPPER1_ADDR);
        vm.warp(block.timestamp + 11);

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
        vm.startPrank(SWAPPER1_ADDR);
        vm.warp(block.timestamp + 11);
        uint256 priceT0 = amm.getPrice();
        baseAsset.approve(saddress(address(amm)), suint256(5000 * WAD));
        amm.swap(suint256(5000 * WAD), suint256(0));
        vm.stopPrank();

        vm.startPrank(SWAPPER2_ADDR);
        vm.warp(block.timestamp + 11);
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
        vm.warp(block.timestamp + 11);
        baseAsset.approve(saddress(address(amm)), suint256(50000 * WAD));
        amm.swap(suint256(50000 * WAD), suint256(0));
        vm.stopPrank();
        amm.getPriceGated();
    }

    function test_SwapTiming() public {
        vm.startPrank(SWAPPER1_ADDR);

        baseAsset.approve(saddress(address(amm)), suint256(50000 * WAD));

        // Immediately attempt another swap
        // Should revert due to timing restriction
        vm.expectRevert("Must wait 10 seconds before calling swap");
        amm.swap(suint256(50000 * WAD), suint256(0));

        // Wait 10 seconds and try again
        vm.warp(block.timestamp + 11);
        amm.swap(suint256(50000 * WAD), suint256(0));
        vm.stopPrank();
    }

    function test_Access() public {
        // Non-listener should not be able to call swap
        vm.startPrank(NON_LISTENER_ADDR);
        vm.expectRevert("Only violin can call this function");
        amm.swap(suint256(50000 * WAD), suint256(0));
        vm.stopPrank();

        // Unauthorized call to getPriceGated should revert
        vm.startPrank(NON_LISTENER_ADDR);
        vm.expectRevert();
        amm.getPriceGated();
        vm.stopPrank();

        // After the address gains listener status, they can call swap
        vm.startPrank(NON_LISTENER_ADDR);
        baseAsset.approve(saddress(address(amm)), suint256(50000 * WAD));
        amm.listen();
        vm.warp(block.timestamp + 11);
        amm.swap(suint256(50000 * WAD), suint256(0));
        amm.getPriceGated();
        vm.stopPrank();
    }

    function test_ZeroSwap() public {
        vm.startPrank(SWAPPER1_ADDR);
        amm.listen();
        vm.warp(block.timestamp + 11);
        uint256 priceT0 = amm.getPrice();
        baseAsset.approve(saddress(address(amm)), suint256(50000 * WAD));
        
        amm.swap(suint256(0), suint256(0));
        vm.stopPrank();

        vm.startPrank(SWAPPER2_ADDR);
        amm.listen();
        vm.warp(block.timestamp + 11);
        quoteAsset.approve(saddress(address(amm)), suint256(50000 * WAD));
        amm.swap(suint256(0), suint256(0));

        assertEq(priceT0, amm.getPrice());
        vm.stopPrank();
    }

    function test_LiquidityInvariance() public {
        uint256 baseBefore = amm.getBaseReserve();
        uint256 quoteBefore = amm.getQuoteReserve();

        uint256 invariantBefore = baseBefore * quoteBefore;

        // Have two different listeners perform swaps
        vm.startPrank(SWAPPER1_ADDR);
        vm.warp(block.timestamp + 11);
        baseAsset.approve(saddress(address(amm)), suint256(50000 * WAD));
        amm.swap(suint256(500 * WAD), suint256(0));
        vm.stopPrank();

        vm.startPrank(SWAPPER2_ADDR);
        vm.warp(block.timestamp + 11);
        quoteAsset.approve(saddress(address(amm)), suint256(20000 * WAD));
        amm.swap(suint256(0), suint256(200 * WAD));
        vm.stopPrank();

        uint256 baseAfter = amm.getBaseReserve();
        uint256 quoteAfter = amm.getQuoteReserve();

        uint256 invariantAfter = baseAfter * quoteAfter;

        // Allow a small tolerance for rounding error.
        assertApproxEqAbs(invariantBefore, invariantAfter, 1e15);
    }
}

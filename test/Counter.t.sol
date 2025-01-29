// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {AMM} from "../src/Counter.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol, uint8 decimals) ERC20(name, symbol, decimals) {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

contract CounterTest is Test {
    AMM public amm;
    MockERC20 public baseAsset;
    MockERC20 public quoteAsset;

    function setUp() public {
        baseAsset = new MockERC20("Base Asset", "BASE", 18);
        quoteAsset = new MockERC20("Quote Asset", "QUOTE", 18);
        amm = new AMM(baseAsset, quoteAsset, 1e18, 1e18);

        baseAsset.mint(address(this), 1000 * 1e18);
        quoteAsset.mint(address(this), 1000 * 1e18);
    }

    function test_AddLiquidity() public {
        baseAsset.approve(address(amm), 100 * 1e18);
        quoteAsset.approve(address(amm), 100 * 1e18);

        amm.addLiquidity(100 * 1e18, 100 * 1e18);

        assertEq(baseAsset.balanceOf(address(amm)), 100 * 1e18);
        assertEq(quoteAsset.balanceOf(address(amm)), 100 * 1e18);
    }

    function test_Swap() public {
        baseAsset.approve(address(amm), 100 * 1e18);
        quoteAsset.approve(address(amm), 100 * 1e18);

        uint256 baseIn = 10 * 1e18;
        uint256 quoteOut = 5 * 1e18;

        console.log("BEFORE SWAP - baseIn:", baseIn);
        console.log("Before swap - quoteOut:", quoteOut);

        (uint256 baseOut, uint256 quoteIn) = amm.swap(baseIn, quoteOut);

        console.log("AFTER SWAP - baseOut:", baseOut);
        console.log("AFTER SWAP - quoteIn:", quoteIn);

        assertEq(baseOut, 0);
        assertEq(quoteIn, 0);
    }

    function test_GetPrice() public {
        baseAsset.approve(address(amm), 100 * 1e18);
        quoteAsset.approve(address(amm), 100 * 1e18);

        amm.addLiquidity(100 * 1e18, 100 * 1e18);

        uint256 price = amm.getPrice(1e18);

        assertEq(price, 1e18);
    }
}

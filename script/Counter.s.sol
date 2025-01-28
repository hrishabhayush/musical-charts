// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {AMM} from "../src/Counter.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol, uint8 decimals) ERC20(name, symbol, decimals) {}
}

contract CounterScript is Script {
    AMM public amm;
    MockERC20 public baseAsset;
    MockERC20 public quoteAsset;

    function setUp() public {
        baseAsset = new MockERC20("Base Asset", "BASE", 18);
        quoteAsset = new MockERC20("Quote Asset", "QUOTE", 18);
    }

    function run() public {
        vm.startBroadcast();

        amm = new AMM(baseAsset, quoteAsset, 1e18, 1e18);

        vm.stopBroadcast();
    }
}

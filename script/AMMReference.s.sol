// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "lib/forge-std/src/Script.sol";
import {AMMReference} from "../src/AMMReference.sol";
import {ERC20} from "lib/solmate/src/tokens/ERC20.sol";
import {SERC20} from "../src/SERC20.sol";

contract MockERC20 is SERC20 {
    constructor(string memory name, string memory symbol) SERC20(name, symbol) {}
}

contract CounterScript is Script {
    AMMReference public amm;
    MockERC20 public baseAsset;
    MockERC20 public quoteAsset;

    function setUp() public {
        baseAsset = new MockERC20("Base Asset", "BASE");
        quoteAsset = new MockERC20("Quote Asset", "QUOTE");
    }

    function run() public {
        vm.startBroadcast();

        address admin = address(0x14dC79964da2C08b23698B3D3cc7Ca32193d9955);

        amm = new AMMReference(baseAsset, quoteAsset, 1e18, 1e18, admin);

        vm.stopBroadcast();
    }
}

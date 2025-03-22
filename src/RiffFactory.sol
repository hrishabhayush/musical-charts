// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./ViolinCoin.sol";

contract RiffFactory {

    uint constant DECIMALS = 10 * 18;
    uint256 constant MAX_SUPPLY = 1000000 * DECIMALS;
    uint256 constant INIT_SUPPLY = 20 * MAX_SUPPLY / 100;

    saddress[] tokens;
    suint256 tokenCount;

    function createRiffToken(string memory name, string memory symbol, string memory imageUrl) private returns(saddress) {

        ViolinCoin violinCoin = new ViolinCoin(msg.sender, name, symbol, uint8(DECIMALS));
        saddress violinCoinAddress = saddress(violinCoin);
        return violinCoinAddress;
    }
}
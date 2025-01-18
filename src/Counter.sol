// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "solmate/tokens/ERC20.sol";
import "solmate/utils/FixedPointMathLib.sol";
import "solmate/utils/ReentrancyGuard.sol";

contract AMM is ReentrancyGuard {
    ERC20 public baseAsset;
    ERC20 public quoteAsset;

    uint256 wad;
    uint256 priceReveal;

    uint256 baseReserve;
    uint256 quoteReserve;

    constructor(
        ERC20 _baseAsset,
        ERC20 _quoteAsset,
        uint256 _wad,
        uint256 _priceReveal
    ) {
        baseAsset = _baseAsset;
        quoteAsset = _quoteAsset;
        wad = _wad;
        priceReveal = _priceReveal;
    }

    function addLiquidity(uint256 baseAmount, uint256 quoteAmount) external {
        baseReserve = baseReserve + baseAmount;
        quoteReserve = quoteReserve + quoteAmount;

        baseAsset.transferFrom(msg.sender, address(this), baseAmount);
        quoteAsset.transferFrom(msg.sender, address(this), quoteAmount);
    }

    function swap(uint256 baseIn, uint256 quoteOut)
        external
        nonReentrant
        returns (uint256 baseOut, uint256 quoteIn)
    {
        if (baseIn > 0) {
            (baseOut, quoteReserve) = _swap(
                baseAsset,
                quoteAsset,
                baseReserve,
                quoteReserve,
                baseIn
            );
        }

        if (quoteOut > 0) {
            (quoteOut, baseReserve) = _swap(
                quoteAsset,
                baseAsset,
                quoteReserve,
                baseReserve,
                quoteOut
            );
        }
    }

    function _swap(
        ERC20 tokenIn,
        ERC20 tokenOut,
        uint256 reserveIn,
        uint256 reserveOut,
        uint256 amountIn
    ) internal returns (uint256 amountOut, uint256 reserveOutNew) {
        uint256 numerator = mulDivDown(reserveOut, amountIn, wad);
        uint256 denominator = reserveIn + amountIn;

        amountOut = mulDivDown(numerator, wad, denominator);

        reserveIn = reserveIn + amountIn;
        reserveOutNew = reserveOut - amountOut;

        tokenIn.transferFrom(msg.sender, address(this), amountIn);
        tokenOut.transfer(msg.sender, amountOut);
    }

    function getPrice(uint256 price) external view returns (uint256) {
        return mulDivDown(baseReserve, wad, quoteReserve);
    }

    function mulDivDown(
        uint256 x,
        uint256 y,
        uint256 denominator
    ) internal pure returns (uint256 z) {
        require(
            denominator != 0 && (z = x * y / denominator) <= type(uint256).max,
            "overflow or division by zero"
        );

        z = (x * y) / denominator;
    }
}


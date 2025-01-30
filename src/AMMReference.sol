/*
 * SPDX-License-Identifier: UNLICENSED
 *
 * AMM that hides the price of quote asset until it's above some threshold.
 *
 */
pragma solidity ^0.8.13;

import "solmate/tokens/ERC20.sol";
import "solmate/utils/FixedPointMathLib.sol";
import "solmate/utils/ReentrancyGuard.sol";

import "./SERC20.sol";

contract AMMReference is ReentrancyGuard {
    SERC20 public baseAsset;
    SERC20 public quoteAsset;

    suint256 wad;
    suint256 priceReveal;

    suint256 baseReserve;
    suint256 quoteReserve;

    constructor(
        SERC20 _baseAsset,
        SERC20 _quoteAsset,
        uint256 _wad,
        uint256 _priceReveal
    ) {
        baseAsset = _baseAsset;
        quoteAsset = _quoteAsset;

        // Stored as suint256 for convenience. Not actually shielded bc it's a
        // transparent parameter in the constructor
        wad = suint256(_wad);
        priceReveal = suint256(_priceReveal);
    }

    /*
     * Add liquidity to pool. No LP rewards in this implementation.
     */
    function addLiquidity(suint256 baseAmount, suint256 quoteAmount) external {
        baseReserve = baseReserve + baseAmount;
        quoteReserve = quoteReserve + quoteAmount;

        saddress ssender = saddress(msg.sender);
        saddress sthis = saddress(address(this));
        baseAsset.transferFrom(ssender, sthis, baseAmount);
        quoteAsset.transferFrom(ssender, sthis, quoteAmount);
    }

    /*
     * Wrapper around swap so calldata for trade looks the same regardless of
     * direction.
     */
    function swap(
        suint256 baseIn,
        suint256 quoteIn
    ) public nonReentrant {
        suint256 baseOut;
        suint256 quoteOut;
        
        (baseOut, baseReserve, quoteReserve) = _swap(
            baseAsset,
            quoteAsset,
            baseReserve,
            quoteReserve,
            baseIn
        );
        (quoteOut, quoteReserve, baseReserve) = _swap(
            quoteAsset,
            baseAsset,
            quoteReserve,
            baseReserve,
            quoteIn
        );
    }

    /*
     * Swap for cfAMM. No fees.
     */
    function _swap(
        SERC20 tokenIn,
        SERC20 tokenOut,
        suint256 reserveIn,
        suint256 reserveOut,
        suint256 amountIn
    )
        internal
        returns (
            suint256 amountOut,
            suint256 reserveInNew,
            suint256 reserveOutNew
        )
    {
        suint256 numerator = mulDivDown(reserveOut, amountIn, wad);
        suint256 denominator = reserveIn + amountIn;
        amountOut = mulDivDown(numerator, wad, denominator);

        reserveInNew = reserveIn + amountIn;
        reserveOutNew = reserveOut - amountOut;

        saddress ssender = saddress(msg.sender);
        saddress sthis = saddress(address(this));
        tokenIn.transferFrom(ssender, sthis, amountIn);
        tokenOut.transfer(ssender, amountOut);
    }

    /*
     * Only returns price if it's above priceReveal threshold.
     */
    function getPriceGated()
        external
        view
        requirePriceSufficient
        returns (uint256 price)
    {
        return uint256(_computePrice());
    }

    /*
     * Bypasses priceReveal threshold. For testing purposes.
     */
    function getPrice() external view returns (uint256 price) {
        return uint256(_computePrice());
    }

    /*
     * Compute price of quote asset.
     */
    function _computePrice() internal view returns (suint256 price) {
        price = mulDivDown(baseReserve, wad, quoteReserve);
    }

    /*
     * For wad math.
     */
    function mulDivDown(
        suint256 x,
        suint256 y,
        suint256 denominator
    ) internal pure returns (suint256 z) {
        require(
            denominator != suint256(0) &&
                (y == suint256(0) ||
                    x <= suint256(type(uint256).max) / y),
            "Overflow or division by zero"
        );
        z = (x * y) / denominator;
    }

    /*
     * Assert price of quote asset above priceReveal threshold.
     */
    modifier requirePriceSufficient() {
        require(
            _computePrice() >= priceReveal,
            "Price of quote asset is not high enough."
        );
        _;
    }
}
import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import { Music2, Quote } from "lucide-react";
import { ethers } from "ethers";
import { createShieldedWalletClient, getShieldedContract, seismicDevnet } from "seismic-viem";
import { privateKeyToAccount } from "viem/accounts";
import { http } from "viem";

const MusicGenerator: React.FC = () => {
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [riffBalance, setRiffBalance] = useState<number>(0);
  const [usdcBalance, setUsdcBalance] = useState<number>(0);
  const [swapAmount, setSwapAmount] = useState<string>(""); // Amount to swap
  const [isUsdcToRiff, setIsUsdcToRiff] = useState(true); // Direction of swap

  // Contract details
  const RIFF_AMM_ADDRESS = "0xA708f04ead68EB183E6af05c4CFC5F6019a48eAF";
  const QUOTE_TOKEN_ADDRESS = "0xB3f387955B64D930f76DD5e8502EbEBd015Bd1a6";
  const VIOLIN_PRIVATE_KEY = "0xe36297b22a6e3628b9d072850ba1ccfd6d8d42a8f017452829adf45acbe84504";
  const RPC_URL = "https://node-2.seismicdev.net/rpc";
  const ABI = [
    {
      name: "getPrice",
      type: "function",
      stateMutability: "view",
      inputs: [],
      outputs: [{ type: "uint256" }],
    },
    {
      name: "swap",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [
        { name: "baseIn", type: "uint256" },
        { name: "quoteIn", type: "uint256" },
      ],
      outputs: [],
    },
    {
      name: "balanceOf",
      type: "function",
      stateMutatability: "view",
      inputs: [],
      outputs: [{ type: "uint256" }],
    },
    {
      name: "addLiquidity", 
      type: "function",
      stateMutability: "nonpayable",
      inputs: [
        { name: "baseAmount", type: "uint256" },
        { name: "quoteAmount", type: "uint256"},
      ],
      outputs: [],
    }
  ] as const;

  const addLiquidity = async () => {
    try {
      console.log('\n==== Adding initial liquidity ===');

      const walletClient = await createShieldedWalletClient({
        chain: seismicDevnet,
        transport: http(RPC_URL),
        account: privateKeyToAccount(VIOLIN_PRIVATE_KEY),
      })

      const riffContract = getShieldedContract({
        address: RIFF_AMM_ADDRESS as `0x${string}`,
        client: walletClient,
        abi: ABI,
      })

      const baseAmount = BigInt(1e18); // 1 RIFF
      const quoteAmount = BigInt(1e20); // 20 USDC

      console.log('Adding liquidity:', {
        baseAmount: baseAmount.toString(),
        quoteAmount: quoteAmount.toString()
      });
      
      const tx = await riffContract.dwrite.addLiquidity([baseAmount, quoteAmount]);
      console.log('Transaction Hash:', tx);
      console.log('=== Liquidity successfully added');
    } catch (error) {
      console.error('error adding liqudity', error);
    }
  }
  // Fetch token price
  const fetchTokenPrice = async (): Promise<number> => {
    try {
      const walletClient = await createShieldedWalletClient({
        chain: seismicDevnet,
        transport: http(RPC_URL),
        account: privateKeyToAccount(VIOLIN_PRIVATE_KEY),
      });

      const riffContract = getShieldedContract({
        address: RIFF_AMM_ADDRESS as `0x${string}`,
        client: walletClient,
        abi: ABI,
      });

      const currentPrice = await riffContract.read.getPrice() as number;
      const formattedPrice = parseFloat(ethers.formatUnits(currentPrice, 18));

      setCurrentPrice(formattedPrice);

      if (previousPrice !== 0) {
        const change = ((formattedPrice - currentPrice) / currentPrice) * 100;
        setPriceChange(change);
      }

      setPreviousPrice(formattedPrice);
      return formattedPrice;
    } catch (error) {
      console.error("Error fetching price:", error);
      return 0;
    }
  };

  // Fetch balances
  const fetchBalances = async () => {
    try {
      const walletClient = await createShieldedWalletClient({
        chain: seismicDevnet,
        transport: http(RPC_URL),
        account: privateKeyToAccount(VIOLIN_PRIVATE_KEY),
      });

      const riffContract = getShieldedContract({
        address: RIFF_AMM_ADDRESS as `0x${string}`,
        client: walletClient,
        abi: ABI,
      });

      const quoteContract = getShieldedContract({
        address: QUOTE_TOKEN_ADDRESS,
        client: walletClient,
        abi: ABI,
      })

      const riffBalanceRaw = await riffContract.read.getPrice();
      const usdcBalanceRaw = await quoteContract.read.getPrice();

      setRiffBalance(Number(riffBalanceRaw) / 1e18);
      setUsdcBalance(Number(usdcBalanceRaw) / 1e18);
    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  };

  // Perform swap
  const performSwap = async () => {
    try {
      const walletClient = await createShieldedWalletClient({
        chain: seismicDevnet,
        transport: http(RPC_URL),
        account: privateKeyToAccount(VIOLIN_PRIVATE_KEY),
      });

      const riffContract = getShieldedContract({
        address: RIFF_AMM_ADDRESS as `0x${string}`,
        client: walletClient,
        abi: ABI,
      });

      const amount = BigInt(parseFloat(swapAmount) * 1e18);

      if (isUsdcToRiff) {
        await riffContract.write.swap([BigInt(0), amount]);
      } else {
        await riffContract.write.swap([amount, BigInt(0)]);
      }

      fetchBalances(); // Refresh balances after swap
      setSwapAmount(""); // Clear input
    } catch (error) {
      console.error("Error performing swap:", error);
    }
  };

  // Play music based on price change
  const playMusic = async () => {
    await Tone.start();

    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const now = Tone.now();

    const currentPrice = await fetchTokenPrice();
    let percentageChange = 0;

    if (previousPrice !== null) {
      percentageChange = ((currentPrice - previousPrice) / previousPrice) * 100;
    }

    const notes = percentageChange > 0 ? ["D5", "F5", "A5"] : ["C3", "E3", "G3"];
    const duration = Math.min(3, Math.abs(percentageChange) / 10);

    notes.forEach((note, i) => {
      synth.triggerAttack(note, now + i * 0.5);
    });
    synth.triggerRelease(notes, now + duration);
  };

  // Fetch balances and price on mount
  useEffect(() => {
    const initializePool = async () => {
      await addLiquidity();
      const price = await fetchTokenPrice();
      setPreviousPrice(price);
    }
    
    initializePool();

    const interval = setInterval(fetchTokenPrice, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <button
        onClick={playMusic}
        className="w-full bg-coffee hover:bg-coyote transition-colors text-isabelline font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md"
      >
        <Music2 className="w-5 h-5" />
        Listen to the Charts
      </button>

      <div className="space-y-4 mt-6">
        <input
          type="text"
          value={swapAmount}
          onChange={(e) => setSwapAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full bg-isabelline text-coyote text-2xl font-medium p-4 rounded-xl border border-timberwolf outline-none"
        />

        <button
          onClick={() => setIsUsdcToRiff(!isUsdcToRiff)}
          className="w-full bg-timberwolf text-coffee font-medium py-3 px-4 rounded-xl shadow-md"
        >
          {isUsdcToRiff ? "Switch to RIFF to USDC" : "Switch to USDC to RIFF"}
        </button>

        <button
          onClick={performSwap}
          className="w-full bg-coyote hover:bg-coffee transition-colors text-isabelline font-medium py-3 px-4 rounded-xl shadow-md"
        >
          {isUsdcToRiff ? "Swap USDC to RIFF" : "Swap RIFF to USDC"}
        </button>
      </div>
    </div>
  );
};

export default MusicGenerator;
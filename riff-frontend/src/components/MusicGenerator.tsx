import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import { Music2 } from "lucide-react";
import { ethers } from 'ethers';  

interface MusicGeneratorProps {
  setCurrentPrice: (price: number) => void;
  setPriceChange: (change: number) => void;
}

const MusicGenerator: React.FC<MusicGeneratorProps> = ({ setCurrentPrice, setPriceChange }) => {
  const [showAudio, setShowAudio] = useState(false);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<number>(0);

  // Contract details
  const RIFF_AMM_ADDRESS = "0x166fECf590d20Bd7Df523a8B55b074e3db1d38C3";
  const ABI = [
    "function getSpotPrice() external view returns (uint256)",
    "function buyExactBase(uint256 baseAmount) external returns (uint256)",
    "function sellExactBase(uint256 baseAmount) external returns (uint256)"
  ];
  const VIOLIN_PRIVATE_KEY="0xe36297b22a6e3628b9d072850ba1ccfd6d8d42a8f017452829adf45acbe84504"

  // Function to fetch the current token price
  const fetchTokenPrice = async (): Promise<number> => {
    try {
      const provider = new ethers.JsonRpcProvider("https://node-2.seismicdev.net/rpc");
      const contract = new ethers.Contract(RIFF_AMM_ADDRESS, ABI, provider);

      const price = await contract.getSpotPrice();
      const formattedPrice = parseFloat(ethers.formatUnits(price, 18));
      
      // Update current price in parent component
      setCurrentPrice(formattedPrice);
      
      // Calculate and update price change if we have a previous price
      if (previousPrice !== null) {
        const change = ((formattedPrice - previousPrice) / previousPrice) * 100;
        setPriceChange(change);
      }

      return formattedPrice;
    } catch (error) {
      console.error("Error fetching price:", error);
      return 0;
    }
  };
  
  // Function to fetch token balances
  const fetchBalances = async () => {
    try {
        const provider = new ethers.JsonRpcProvider("https://node-2.seismicdev.net/rpc");
        const wallet = new ethers.Wallet(VIOLIN_PRIVATE_KEY, provider);
        const contract = new ethers.Contract(RIFF_AMM_ADDRESS, ABI, wallet);

        const usdcBalanceRaw = await contract.balanceOf(wallet.address); // Fetch USDC balance

        setUsdcBalance(parseFloat(ethers.formatUnits(usdcBalanceRaw, 18)));
    } catch (error) {
        console.error("Error fetching balances:", error);
    }
  };

  // Add interval to fetch price regularly
  useEffect(() => {
    const fetchInitialPrice = async () => {
      const price = await fetchTokenPrice();
      setPreviousPrice(price);
    };

    fetchInitialPrice();

    // Update price every 10 seconds
    const interval = setInterval(fetchTokenPrice, 10000);

    return () => clearInterval(interval);
  }, []);

  const playMusic = async () => {
    await Tone.start(); // Ensure AudioContext is running

    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const now = Tone.now();

    // Fetch the current price
    const currentPrice = await fetchTokenPrice();

    // Calculate percentage change
    let percentageChange = 0;
    if (previousPrice !== null) {
      percentageChange = ((currentPrice - previousPrice) / previousPrice) * 100;
    }
    setPreviousPrice(currentPrice); // Update the previous price

    // Determine notes based on percentage change
    let notes: string[];
    if (percentageChange > 0) {
      notes = ["D5", "F5", "A5"]; // High-pitched notes for positive change
    } else if (percentageChange < 0) {
      notes = ["C4", "E4", "G4"]; // Low-pitched notes for negative change
    } else {
      console.log("it prints this")
      notes = ["C3", "E3", "G3"]; // Neutral notes for no change
    }

    // Adjust duration or intensity based on magnitude of change
    const duration = Math.min(3, Math.abs(percentageChange) / 10); // Cap duration at 3 seconds

    // Play the notes
    notes.forEach((note, i) => {
      synth.triggerAttack(note, now + i * 0.5);
    });
    synth.triggerRelease(notes, now + duration);
  };

  return (
    <div className="relative">
      <button
        onClick={playMusic}
        className="w-full bg-coffee hover:bg-coyote transition-colors text-isabelline font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md"
      >
        <Music2 className="w-5 h-5" />
        Listen to the Charts
      </button>
    </div>
  );
};

export default MusicGenerator;
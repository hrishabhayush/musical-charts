// src/App.tsx
import React, { useState } from 'react';
import { ArrowDown, TrendingUp } from 'lucide-react';
import { FloatingMountains } from './components/FloatingMountains';
import MusicGenerator from './components/MusicGenerator';
import { createShieldedWalletClient, getShieldedContract, seismicDevnet } from 'seismic-viem';
import { http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

function App() {
  const [usdcAmount, setUsdcAmount] = useState<string>('');
  const [riffBalance, setRiffBalance] = useState<number>(0);
  const [isUsdcToRiff, setIsUsdcToRiff] = useState(true);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);

  // Contract details
  const RIFF_AMM_ADDRESS = "0x166fECf590d20Bd7Df523a8B55b074e3db1d38C3";
  const VIOLIN_PRIVATE_KEY = "0xe36297b22a6e3628b9d072850ba1ccfd6d8d42a8f017452829adf45acbe84504";
  const RPC_URL = "https://node-2.seismicdev.net/rpc";
  const ABI = [
    {
      name: 'getPrice',
      type: 'function',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ type: 'uint256' }]
    },
    {
      name: 'swap',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'baseIn', type: 'suint256' },
        { name: 'quoteIn', type: 'suint256' }
      ],
      outputs: []
    }
  ] as const;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setUsdcAmount(value);
    }
  };

  const performSwap = async () => {
    try {
      console.log(`\n=== Starting ${isUsdcToRiff ? 'USDC to RIFF' : 'RIFF to USDC'} Swap ===`);
      console.log('Amount:', usdcAmount);
      
      // Create shielded wallet client
      const walletClient = await createShieldedWalletClient({
        chain: seismicDevnet,
        transport: http(RPC_URL),
        account: privateKeyToAccount(VIOLIN_PRIVATE_KEY as `0x${string}`),
      });

      // Get shielded contract
      const contract = getShieldedContract({
        address: RIFF_AMM_ADDRESS as `0x${string}`,
        client: walletClient,
        abi: ABI,
      });

      console.log('Wallet Address:', walletClient.account.address);

      let initialPrice;
      // Get initial price
      try {
        initialPrice = await contract.read.getPrice();
        console.log('Initial Price:', initialPrice);
      } catch (error) {
        console.error('Error getting initial price:', error);
        throw error;
      }

      const amount = BigInt(parseFloat(usdcAmount) * 1e18);
      console.log('Parsed Amount:', amount.toString());

      let tx;
      try {
        if (isUsdcToRiff) {
          console.log('Executing swap transaction...');
          // For USDC to RIFF: baseIn = 0, quoteIn = amount
          tx = await contract.write.swap([BigInt(0), amount]);
        } else {
          console.log('Executing swap transaction...');
          // For RIFF to USDC: baseIn = amount, quoteIn = 0
          tx = await contract.write.swap([amount, BigInt(0)]);
        }
      } catch (error) {
        console.error('Error executing swap:', error);
        throw error;
      }

      console.log('Transaction Hash:', tx);
      console.log('Waiting for transaction confirmation...');
      
      // Get final price after swap
      const finalPrice = await contract.read.getPrice();
      console.log('Final Price:', finalPrice);
      
      // Calculate price impact
      const priceImpact = ((Number(finalPrice) - Number(initialPrice)) / Number(initialPrice)) * 100;
      console.log('Price Impact:', priceImpact.toFixed(4) + '%');

      // Clear input after successful swap
      setUsdcAmount('');
      console.log('=== Swap Completed Successfully ===\n');
    } catch (error: any) {
      console.error("\n=== Swap Failed ===");
      console.error("Error details:", error);
      if (error.data) {
        console.error("Error data:", error.data);
      }
      if (error.transaction) {
        console.error("Transaction:", error.transaction);
      }
      console.error("=== End Error ===\n");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-isabelline via-timberwolf to-timberwolf-2 flex items-center justify-center p-4 overflow-hidden font-arial">
      <div className="absolute top-4 right-4 z-50 flex gap-4">
        <div className="bg-coffee text-isabelline px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          {currentPrice ? `${currentPrice.toFixed(6)} USDC` : 'Loading...'}
          {priceChange !== 0 && (
            <span className={priceChange > 0 ? 'text-green-400' : 'text-red-400'}>
              ({priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}%)
            </span>
          )}
        </div>
        <div className="bg-coffee text-isabelline px-4 py-2 rounded-lg shadow-md">
          RIFF Balance: {riffBalance.toFixed(2)}
        </div>
      </div>

      <FloatingMountains />
      <div className="relative z-50 bg-white/80 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md border border-timberwolf-2 shadow-lg">
        <div className="space-y-6">
          {/* From Section */}
          <div className="space-y-2">
            <label className="text-coffee text-sm font-medium">From</label>
            <div className="bg-isabelline rounded-xl p-4 border border-timberwolf">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-coffee font-medium">
                    {isUsdcToRiff ? 'USDC' : 'RIFF'}
                  </span>
                </div>
              </div>
              <input
                type="text"
                value={usdcAmount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full bg-transparent text-coyote text-2xl font-medium mt-2 outline-none placeholder-coffee/50"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={() => setIsUsdcToRiff(!isUsdcToRiff)}
              className="bg-coffee p-2 rounded-full border border-coyote hover:bg-coyote transition-colors"
            >
              <ArrowDown className="w-5 h-5 text-isabelline" />
            </button>
          </div>

          {/* To Section */}
          <div className="space-y-2">
            <label className="text-coffee text-sm font-medium">To</label>
            <div className="bg-isabelline rounded-xl p-4 border border-timberwolf">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-coffee font-medium">
                    {isUsdcToRiff ? 'RIFF' : 'USDC'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <button
            onClick={performSwap}
            disabled={!usdcAmount || parseFloat(usdcAmount) <= 0}
            className="w-full bg-coyote hover:bg-coffee transition-colors text-isabelline font-medium py-3 px-4 rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUsdcToRiff ? 'Swap USDC to RIFF' : 'Swap RIFF to USDC'}
          </button>

          {/* Music Generator */}
          <MusicGenerator 
            setCurrentPrice={setCurrentPrice}
            setPriceChange={setPriceChange}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
// components/EncryptedBondingCurve.tsx
import React, { useState } from 'react';

interface EncryptedBondingCurveProps {
  initialAssetName?: string;
  onConnect?: () => void;
  onPlayToggle?: (isPlaying: boolean) => void;
  onVolumeChange?: (volume: number) => void;
  onBuy?: () => void;
  onSell?: () => void;
}

const EncryptedBondingCurve: React.FC<EncryptedBondingCurveProps> = ({
  initialAssetName = "AI Violin Bond",
  onConnect,
  onPlayToggle,
  onVolumeChange,
  onBuy,
  onSell
}) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50);

  const togglePlay = () => {
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);
    
    if (onPlayToggle) {
      onPlayToggle(newPlayState);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value);
    setVolume(newVolume);
    
    if (onVolumeChange) {
      onVolumeChange(newVolume);
    }
  };

  const handleConnect = () => {
    setConnected(true);
    
    if (onConnect) {
      onConnect();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto bg-gray-900 text-gray-100 rounded-lg p-6 mt-8">
      <div className="flex items-center w-full mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-purple-500 rounded-md"></div>
          <h1 className="text-xl font-medium">Melodic Bonding Curve</h1>
        </div>
        <div className="ml-auto flex space-x-4">
          <button className="px-3 py-1 opacity-60 hover:opacity-100">Trade</button>
          <button className="px-3 py-1 opacity-60 hover:opacity-100">Explore</button>
          <button className="px-3 py-1 opacity-60 hover:opacity-100">Pool</button>
        </div>
        {connected && (
          <div className="ml-4 text-xs bg-gray-800 px-2 py-1 rounded-full border border-gray-700">
            0x0D18...2E68
          </div>
        )}
      </div>

      <div className="w-full bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex space-x-2 mb-4">
          <button className="bg-gray-700 text-white px-4 py-2 rounded-full">Listen</button>
          <button className="text-white px-4 py-2 rounded-full">Info</button>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-1">Asset</div>
          <div className="flex">
            <input
              className="bg-gray-700 rounded-lg p-3 w-full text-2xl"
              value={initialAssetName}
              readOnly
            />
            <div className="ml-2 flex items-center">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                V
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">Encrypted Price - Listen to hear movements</div>
        </div>

        <div className="border-t border-gray-700 my-4"></div>

        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-1">Music Generator</div>
          <div className="flex items-center">
            <button 
              onClick={togglePlay}
              className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 ${isPlaying ? 'bg-purple-600' : 'bg-purple-500'}`}
            >
              {isPlaying ? (
                <span className="text-xl">■</span>
              ) : (
                <span className="text-xl">▶</span>
              )}
            </button>
            
            <div className="flex-1">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-gray-500 mt-1">Volume</div>
            </div>
          </div>
        </div>
      </div>

      {!connected ? (
        <button 
          onClick={handleConnect} 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
        >
          Connect to Ethereum
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-4 w-full">
          <button 
            onClick={onBuy}
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Buy Bond
          </button>
          <button 
            onClick={onSell}
            className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Sell Bond
          </button>
        </div>
      )}

      <div className="mt-6 text-sm text-center text-gray-500">
        Melodic Bonding Curve is an interface where price is represented as music
        <div className="mt-1">
          <a href="#" className="text-purple-400 hover:underline">Learn more</a> about encrypted price discovery
        </div>
      </div>
    </div>
  );
};

export default EncryptedBondingCurve;
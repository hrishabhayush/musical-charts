"use client"
import React, { useState } from 'react';
import Layout from '../../components/layout';
import Hero from '../../components/Hero';
import EncryptedBondingCurve from '../../components/EncryptedBondingCurve';
import Music from '../../components/Music';

const Home: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50);
  const [connected, setConnected] = useState<boolean>(false);
  const [currentPriceMovement, setCurrentPriceMovement] = useState<'up' | 'down' | 'stable'>('stable');

  const handlePlayToggle = (playing: boolean) => {
    setIsPlaying(playing);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const handleConnect = () => {
    setConnected(true);
  };

  const handlePriceChange = (direction: 'up' | 'down' | 'stable') => {
    setCurrentPriceMovement(direction);
    
    // In a full implementation, you might want to display a notification
    // or visual indicator of the price movement
    console.log(`Price movement detected: ${direction}`);
  };

  return (
    <Layout>
      <Hero />
      
      <div className="mt-16">
        <EncryptedBondingCurve 
          initialAssetName="AI Violin Bond #1"
          onConnect={handleConnect}
          onPlayToggle={handlePlayToggle}
          onVolumeChange={handleVolumeChange}
        />
      </div>
      
      {/* Music component handles the audio generation but doesn't display anything */}
      <Music 
        isPlaying={isPlaying}
        volume={volume}
        assetId="violin-bond-1"
        onPriceChange={handlePriceChange}
      />
      
      {/* Price movement indicator */}
      {isPlaying && (
        <div className="fixed bottom-4 right-4 p-3 rounded-lg bg-gray-800 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="text-sm">Price Movement:</div>
            <div className={`w-3 h-3 rounded-full ${
              currentPriceMovement === 'up' 
                ? 'bg-green-500' 
                : currentPriceMovement === 'down' 
                  ? 'bg-red-500' 
                  : 'bg-gray-500'
            }`}></div>
            <div className="text-sm">
              {currentPriceMovement === 'up' 
                ? 'Rising' 
                : currentPriceMovement === 'down' 
                  ? 'Falling' 
                  : 'Stable'}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Home;
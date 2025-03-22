// components/Music.tsx
"use client";
import React, { useEffect, useState } from 'react';

interface PricePoint {
  timestamp: number;
  encryptedPrice: string;
}

interface MusicProps {
  isPlaying: boolean;
  volume: number;
  assetId?: string;
  onPriceChange?: (direction: 'up' | 'down' | 'stable') => void;
}

const Music: React.FC<MusicProps> = ({ 
  isPlaying, 
  volume, 
  assetId = 'default',
  onPriceChange 
}) => {
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [currentPriceDirection, setCurrentPriceDirection] = useState<'up' | 'down' | 'stable'>('stable');
  
  // This would be replaced with actual price data fetching
  useEffect(() => {
    const fetchEncryptedPriceData = async () => {
      try {
        // Simulate API call
        // In production, this would fetch from your backend
        console.log(`Fetching price data for asset: ${assetId}`);
        
        // Mock data
        const mockData: PricePoint[] = [
          { timestamp: Date.now(), encryptedPrice: 'encrypted_string_1' },
          { timestamp: Date.now() - 5000, encryptedPrice: 'encrypted_string_2' },
          { timestamp: Date.now() - 10000, encryptedPrice: 'encrypted_string_3' },
        ];
        
        setPriceHistory(mockData);
        
        // Randomly simulate price changes for demo purposes
        const directions: Array<'up' | 'down' | 'stable'> = ['up', 'down', 'stable'];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        
        setCurrentPriceDirection(randomDirection);
        
        if (onPriceChange) {
          onPriceChange(randomDirection);
        }
      } catch (error) {
        console.error("Failed to fetch encrypted price data:", error);
      }
    };

    // Only fetch when playing
    if (isPlaying) {
      fetchEncryptedPriceData();
      
      // Set up interval for continuous updates while playing
      const intervalId = setInterval(fetchEncryptedPriceData, 5000);
      return () => clearInterval(intervalId);
    }
  }, [isPlaying, assetId, onPriceChange]);

  // Apply volume changes
  useEffect(() => {
    console.log(`Volume changed to: ${volume}%`);
    // In a real implementation, this would adjust the actual audio volume
  }, [volume]);

  // This component doesn't render anything visible
  // It only manages the audio generation based on props
  return (
    <div className="hidden">
      {isPlaying && (
        <div data-testid="music-playing" data-direction={currentPriceDirection} data-volume={volume}>
          {/* This hidden div can be used for testing */}
        </div>
      )}
    </div>
  );
};

export default Music;
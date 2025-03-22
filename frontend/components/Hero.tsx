"use client";
// components/Hero.tsx
import React from 'react';
import { useRouter } from 'next/navigation';

interface HeroProps {
  title?: string;
  subtitle?: string;
}

const Hero: React.FC<HeroProps> = ({
  title = "Experience Price as Music",
  subtitle = "Listen to market movements through AI-generated violin compositions"
}) => {
  const router = useRouter();
  
  return (
    <div className="relative py-16 md:py-24 bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-900 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-900 opacity-10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto text-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
          {title}
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={() => router.push('/trade')} 
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-lg text-lg font-medium transition-colors"
          >
            Start Trading
          </button>
          <button 
            onClick={() => router.push('/learn')}
            className="bg-gray-800 hover:bg-gray-700 text-white py-3 px-8 rounded-lg text-lg font-medium transition-colors"
          >
            How It Works
          </button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-purple-600 rounded-lg mb-4 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Violin</h3>
            <p className="text-gray-400">
              Our AI translates encrypted price data into beautiful violin compositions
            </p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-purple-600 rounded-lg mb-4 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Encrypted Prices</h3>
            <p className="text-gray-400">
              Bonding curve prices are fully encrypted, leading to a sound-first trading experience
            </p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl">
            <div className="w-12 h-12 bg-purple-600 rounded-lg mb-4 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Trading</h3>
            <p className="text-gray-400">
              Trade with confidence on our encrypted bonding curve platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
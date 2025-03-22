// components/Appbar.tsx
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Appbar: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  
  const isActive = (path: string): boolean => {
    return router.pathname === path;
  };
  
  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold">V</span>
                </div>
                <span className="text-xl font-semibold text-white">MelodicCurve</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/">
              <span className={`px-2 py-1 rounded-md ${isActive('/') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white'}`}>
                Home
              </span>
            </Link>
            <Link href="/trade">
              <span className={`px-2 py-1 rounded-md ${isActive('/trade') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white'}`}>
                Trade
              </span>
            </Link>
            <Link href="/explore">
              <span className={`px-2 py-1 rounded-md ${isActive('/explore') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white'}`}>
                Explore
              </span>
            </Link>
            <Link href="/pool">
              <span className={`px-2 py-1 rounded-md ${isActive('/pool') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white'}`}>
                Pool
              </span>
            </Link>
          </nav>
          
          <div className="flex items-center">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Connect Wallet
            </button>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden ml-4 text-gray-400 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-2">
            <div className="flex flex-col space-y-2 pb-3">
              <Link href="/">
                <span className={`block px-3 py-2 rounded-md ${isActive('/') ? 'bg-gray-800 text-white' : 'text-gray-300'}`}>
                  Home
                </span>
              </Link>
              <Link href="/trade">
                <span className={`block px-3 py-2 rounded-md ${isActive('/trade') ? 'bg-gray-800 text-white' : 'text-gray-300'}`}>
                  Trade
                </span>
              </Link>
              <Link href="/explore">
                <span className={`block px-3 py-2 rounded-md ${isActive('/explore') ? 'bg-gray-800 text-white' : 'text-gray-300'}`}>
                  Explore
                </span>
              </Link>
              <Link href="/pool">
                <span className={`block px-3 py-2 rounded-md ${isActive('/pool') ? 'bg-gray-800 text-white' : 'text-gray-300'}`}>
                  Pool
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Appbar;
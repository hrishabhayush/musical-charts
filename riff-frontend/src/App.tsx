// src/App.tsx
import React, { useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { FloatingMountains } from './components/FloatingMountains';
import MusicGenerator from './components/MusicGenerator';

function App() {
  const [usdcAmount, setUsdcAmount] = useState<string>('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setUsdcAmount(value);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-isabelline via-timberwolf to-timberwolf-2 flex items-center justify-center p-4 overflow-hidden font-arial">
      <FloatingMountains />
      <div className="relative z-50 bg-white/80 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md border border-timberwolf-2 shadow-lg">
        <div className="space-y-6">
          {/* From Section */}
          <div className="space-y-2">
            <label className="text-coffee text-sm font-medium">From</label>
            <div className="bg-isabelline rounded-xl p-4 border border-timberwolf">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-coffee font-medium">USDC</span>
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
            <div className="bg-coffee p-2 rounded-full border border-coyote">
              <ArrowDown className="w-5 h-5 text-isabelline" />
            </div>
          </div>

          {/* To Section */}
          <div className="space-y-2">
            <label className="text-coffee text-sm font-medium">To</label>
            <div className="bg-isabelline rounded-xl p-4 border border-timberwolf">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-coffee font-medium">RIFF</span>
                </div>
              </div>
            </div>
          </div>

          {/* Music Generator */}
          <MusicGenerator />
        </div>
      </div>
    </div>
  );
}

export default App;
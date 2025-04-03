import React from "react";
import { FloatingMountains } from "./components/FloatingMountains";
import MusicGenerator from "./components/MusicGenerator";

function App() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-isabelline via-timberwolf to-timberwolf-2 flex items-center justify-center p-4 overflow-hidden font-arial">
      {/* Top-right floating balances */}
      <div className="absolute top-4 right-4 z-50 flex gap-4">
        <div className="bg-coffee text-isabelline px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
          {/* Placeholder for price and percentage change */}
          <span>Loading...</span>
        </div>
        <div className="bg-coffee text-isabelline px-4 py-2 rounded-lg shadow-md">
          {/* Placeholder for RIFF balance */}
          <span>RIFF Balance: 0.00</span>
        </div>
      </div>

      {/* Background animation */}
      <FloatingMountains />

      {/* Main content */}
      <div className="relative z-50 bg-white/80 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md border border-timberwolf-2 shadow-lg">
        <div className="space-y-6">
          {/* Music Generator Component */}
          <MusicGenerator />
        </div>
      </div>
    </div>
  );
}

export default App;
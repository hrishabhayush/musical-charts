// import React, { useState } from 'react';
// import { Coins, Music2, ArrowDown } from 'lucide-react';

// function App() {
//   const [usdcAmount, setUsdcAmount] = useState<string>('');
//   const [showAudio, setShowAudio] = useState(false);

//   const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     if (/^\d*\.?\d*$/.test(value)) {
//       setUsdcAmount(value);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-isabelline via-timberwolf to-timberwolf-2 flex items-center justify-center p-4">
//       <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md border border-timberwolf-2 shadow-lg">
//         <div className="space-y-6">
//           {/* From Section */}
//           <div className="space-y-2">
//             <label className="text-coffee text-sm font-medium">From</label>
//             <div className="bg-isabelline rounded-xl p-4 border border-timberwolf">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   {/* <div className="bg-coffee p-2 rounded-full">
//                     <Coins className="w-5 h-5 text-isabelline" />
//                   </div> */} 
//                   {/* TODO: Add a div that holds the image of the token for now hardcode it but it should be fetching it from somewhere. */}
//                   <span className="text-coffee font-medium">USDC</span>
//                 </div>
//               </div>
//               <input
//                 type="text"
//                 value={usdcAmount}
//                 onChange={handleAmountChange}
//                 placeholder="0.00"
//                 className="w-full bg-transparent text-coyote text-2xl font-medium mt-2 outline-none placeholder-coffee/50"
//               />
//             </div>
//           </div>

//           <div className="flex justify-center">
//             <div className="bg-coffee p-2 rounded-full border border-coyote">
//               <ArrowDown className="w-5 h-5 text-isabelline" />
//             </div>
//           </div>

//           {/* To Section */}
//           <div className="space-y-2">
//             <label className="text-coffee text-sm font-medium">To</label>
//             <div className="bg-isabelline rounded-xl p-4 border border-timberwolf">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   {/* <div className="bg-coyote p-2 rounded-full">
//                     <Coins className="w-5 h-5 text-isabelline" />
//                   </div> */}
//                   {/* TODO: Add a div that holds the image of the token for now hardcode it but it should be fetching it from somewhere. */}
//                   <span className="text-coffee font-medium">RIFF</span>
//                 </div>
//               </div>
//               {/* <div className="text-2xl font-medium text-coyote mt-2">***.**</div> */}
//             </div>
//           </div>

//           {/* Listen to Charts Button */}
//           <button
//             onClick={() => setShowAudio(true)}
//             className="w-full bg-coffee hover:bg-coyote transition-colors text-isabelline font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md"
//           >
//             <Music2 className="w-5 h-5" />
//             Listen to the Charts
//           </button>

//           {/* Audio Player and Trade Button */}
//           {showAudio && (
//             <div className="space-y-4">
//               <div className="bg-isabelline rounded-xl p-4 border border-timberwolf">
//                 <audio
//                   controls
//                   className="w-full"
//                   src="https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav"
//                 >
//                   Your browser does not support the audio element.
//                 </audio>
//               </div>
              
//               <button className="w-full bg-coyote hover:bg-coffee transition-colors text-isabelline font-medium py-3 px-4 rounded-xl shadow-md">
//                 Trade Now
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState } from 'react';
import { Coins, Music2, ArrowDown } from 'lucide-react';
import { FloatingMountains } from './components/FloatingMountains';

function App() {
  const [usdcAmount, setUsdcAmount] = useState<string>('');
  const [showAudio, setShowAudio] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setUsdcAmount(value);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-isabelline via-timberwolf to-timberwolf-2 flex items-center justify-center p-4 overflow-hidden">
      <FloatingMountains />
      <div className="relative z-50 bg-white/80 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md border border-timberwolf-2 shadow-lg">
        <div className="space-y-6">
          {/* From Section */}
          <div className="space-y-2">
            <label className="text-coffee text-sm font-medium">From</label>
            <div className="bg-isabelline rounded-xl p-4 border border-timberwolf">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-coffee p-2 rounded-full">
                    <Coins className="w-5 h-5 text-isabelline" />
                  </div>
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
                  <div className="bg-coyote p-2 rounded-full">
                    <Coins className="w-5 h-5 text-isabelline" />
                  </div>
                  <span className="text-coffee font-medium">MYSTERY</span>
                </div>
              </div>
              <div className="text-2xl font-medium text-coyote mt-2">***.**</div>
            </div>
          </div>

          {/* Listen to Charts Button */}
          <button
            onClick={() => setShowAudio(true)}
            className="w-full bg-coffee hover:bg-coyote transition-colors text-isabelline font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md"
          >
            <Music2 className="w-5 h-5" />
            Listen to the Charts
          </button>

          {/* Audio Player and Trade Button */}
          {showAudio && (
            <div className="space-y-4">
              <div className="bg-isabelline rounded-xl p-4 border border-timberwolf">
                <audio
                  controls
                  className="w-full"
                  src="https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav"
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
              
              <button className="w-full bg-coyote hover:bg-coffee transition-colors text-isabelline font-medium py-3 px-4 rounded-xl shadow-md">
                Trade Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
import React from "react";
import * as Tone from "tone";
import { useState } from "react";
import { Music2 } from "lucide-react";

const MusicGenerator: React.FC = () => {
const [showAudio, setShowAudio] = useState(false);
  const playMusic = async () => {
    await Tone.start(); // Ensure AudioContext is running

    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const now = Tone.now();

    // Mock price data (replace this with blockchain data later)
    const priceNumber = Math.random() * 200; // Random price between 0 and 200

    // Generate melody based on price
    const notes = priceNumber > 100 ? ["D4", "F4", "A4"] : ["C3", "E3", "G3"];
    
    notes.forEach((note, i) => {
      synth.triggerAttack(note, now + i * 0.5);
    });

    synth.triggerRelease(notes, now + 3);
  };

  return (
    <div>
      <button
        onClick={async () => {
          await playMusic(); // Call the playMusic function
          setShowAudio(true); // Update the state to show the audio player and trade button
        }}
        className="w-full bg-coffee hover:bg-coyote transition-colors text-isabelline font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md"
      >
        <Music2 className="w-5 h-5" />
        Listen to the Charts
      </button>

      {/* Audio Player and Trade Button */}
      {showAudio && (
        <div className="space-y-4">
          <div className="bg-isabelline rounded-xl p-4 border border-timberwolf">
            <p className="text-center text-timberwolf">Music is playing...</p>
          </div>
          
          <button className="w-full bg-coyote hover:bg-coffee transition-colors text-isabelline font-medium py-3 px-4 rounded-xl shadow-md">
            Trade Now
          </button>
        </div>
      )}
    </div>
  );
};

export default MusicGenerator;

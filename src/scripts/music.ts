import * as mm from "@magenta/music";
import * as Tone from "tone";

/**
 * Converts a float value to violin music and plays it.
 * @param floatValue The float number to map to music.
 */
export async function generateViolinMusicFromFloat(floatValue: number) {
    // Load Magenta RNN model
    const rnn = new mm.MusicRNN(
        "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn"
    );
    await rnn.initialize();

    // Map float to violin note range (55 to 103 in MIDI)
    const basePitch = 55 + Math.floor((floatValue % 1) * (103 - 55));

    // Determine sequence length and rhythm based on float value
    const sequenceLength = (Math.floor(floatValue) % 8) + 4; // 4 to 12 notes
    const noteDuration = (floatValue % 0.5) + 0.1; // 0.1s to 0.6s

    // Generate a simple melody
    let seedNotes: mm.NoteSequence.Note[] = [];
    for (let i = 0; i < sequenceLength; i++) {
        let pitch = basePitch + (i % 4) * 2; // Slight variations in melody
        seedNotes.push({
            pitch: pitch,
            startTime: i * noteDuration,
            endTime: (i + 1) * noteDuration,
            velocity: 80, // default velocity
            instrument: 0, // default instrument
            program: 0, // default program
            isDrum: false, // default isDrum
            quantizedStartStep: 0, // default quantizedStartStep
            quantizedEndStep: 0, // default quantizedEndStep
            numerator: 0, // default numerator
            denominator: 0, // default denominator
            voice: 0, // default voice
            pitchName: 0, // default pitchName
            part: 0, // default part
            toJSON: () => ({}), // default toJSON
        });
    }

    const seed: mm.INoteSequence = {
        notes: seedNotes,
        totalTime: sequenceLength * noteDuration,
    };

    // Generate continuation using Magenta AI
    const generatedSequence = await rnn.continueSequence(seed, 32, 1.2);

    // Play the generated MIDI using a violin sound
    await playViolinMIDI(generatedSequence);

    // Download as MIDI file
    downloadMIDI(generatedSequence, `violin_music_${floatValue}.mid`);
}

/**
 * Plays the generated MIDI sequence with a violin sound using Tone.js.
 */
async function playViolinMIDI(noteSequence: mm.INoteSequence) {
    await Tone.start();

    const synth = new Tone.Sampler({
        urls: {
            A4: "https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/violin-mp3/A4.mp3",
            C5: "https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/violin-mp3/C5.mp3",
        },
        release: 1,
        baseUrl: "https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/violin-mp3/",
    }).toDestination();

    noteSequence.notes?.forEach((note:any) => {
        synth.triggerAttackRelease(
            Tone.Frequency(note.pitch, "midi").toNote(),
            note?.endTime - note.startTime,
            Tone.now() + note.startTime
        );
    });
}

/**
 * Downloads the generated MIDI sequence as a file.
 */
function downloadMIDI(noteSequence: mm.INoteSequence, filename: string) {
    const midi = mm.sequenceProtoToMidi(noteSequence);
    const blob = new Blob([midi], { type: "audio/midi" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Example usage
generateViolinMusicFromFloat(3.1415);

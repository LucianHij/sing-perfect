/**
 * Convert frequency (Hz) to MIDI note number
 */
export function frequencyToMidi(frequency: number): number {
  return 12 * Math.log2(frequency / 440) + 69;
}

/**
 * Convert MIDI note number to note name
 */
export function midiToNoteName(midi: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  const note = noteNames[Math.round(midi) % 12];
  return `${note}${octave}`;
}

/**
 * Convert frequency to note name
 */
export function frequencyToNote(frequency: number): string {
  const midi = frequencyToMidi(frequency);
  return midiToNoteName(midi);
}

/**
 * Convert note name to frequency
 */
export function noteToFrequency(noteName: string): number {
  const noteMap: { [key: string]: number } = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
    'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
  };

  const match = noteName.match(/^([A-G][#b]?)(\d+)$/);
  if (!match) return 0;

  const [, note, octaveStr] = match;
  const octave = parseInt(octaveStr, 10);
  const semitone = noteMap[note] + (octave + 1) * 12;

  return 440 * Math.pow(2, (semitone - 69) / 12);
}

/**
 * Calculate the difference between two frequencies in cents
 * (100 cents = 1 semitone)
 */
export function getCentsDifference(freq1: number, freq2: number): number {
  return 1200 * Math.log2(freq1 / freq2);
}

/**
 * Format time in MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Create an audio context (handles browser prefixing)
 */
export function createAudioContext(): AudioContext {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  return new AudioContextClass();
}

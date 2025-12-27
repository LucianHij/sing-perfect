import type { Note, PitchDataPoint } from '../types';
import { noteToFrequency } from './audioUtils';

/**
 * Generate mock reference notes for "Happy Birthday"
 */
export function generateMockReferenceNotes(): Note[] {
  const melody = [
    // Measure 1: "Hap-py"
    { note: 'C4', duration: 0.5, measure: 1, index: 0 },
    { note: 'C4', duration: 0.5, measure: 1, index: 1 },
    // Measure 2: "birth-day"
    { note: 'D4', duration: 1.0, measure: 2, index: 0 },
    { note: 'C4', duration: 1.0, measure: 2, index: 1 },
    // Measure 3: "to"
    { note: 'F4', duration: 1.0, measure: 3, index: 0 },
    // Measure 4: "you"
    { note: 'E4', duration: 2.0, measure: 4, index: 0 },
    // Measure 5: "Hap-py"
    { note: 'C4', duration: 0.5, measure: 5, index: 0 },
    { note: 'C4', duration: 0.5, measure: 5, index: 1 },
    // Measure 6: "birth-day"
    { note: 'D4', duration: 1.0, measure: 6, index: 0 },
    { note: 'C4', duration: 1.0, measure: 6, index: 1 },
    // Measure 7: "to"
    { note: 'G4', duration: 1.0, measure: 7, index: 0 },
    // Measure 8: "you"
    { note: 'F4', duration: 2.0, measure: 8, index: 0 },
  ];

  let currentTime = 0;
  return melody.map((item) => {
    const note: Note = {
      pitch: item.note,
      frequency: noteToFrequency(item.note),
      startTime: currentTime,
      duration: item.duration,
      measure: item.measure,
      noteIndex: item.index,
    };
    currentTime += item.duration;
    return note;
  });
}

/**
 * Generate mock user pitch data with some intentional errors
 */
export function generateMockUserPitchData(referenceNotes: Note[]): PitchDataPoint[] {
  const pitchData: PitchDataPoint[] = [];

  referenceNotes.forEach((note, index) => {
    // Add some variation to simulate real singing
    const samples = Math.floor(note.duration / 0.05); // Sample every 50ms

    for (let i = 0; i < samples; i++) {
      const time = note.startTime + (i * note.duration) / samples;
      let frequency = note.frequency;

      // Introduce some errors for demonstration
      if (index === 4) {
        // Make note 5 (F4) flat
        frequency *= 0.97; // About 50 cents flat
      } else if (index === 9) {
        // Make note 10 slightly sharp
        frequency *= 1.02; // About 35 cents sharp
      } else {
        // Add slight random variation
        frequency *= 1 + (Math.random() - 0.5) * 0.01;
      }

      pitchData.push({
        time,
        frequency,
        note: note.pitch,
        confidence: 0.95 + Math.random() * 0.05,
      });
    }
  });

  return pitchData;
}

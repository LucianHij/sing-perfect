import { PitchAnalyzer } from './pitchDetection';
import { createAudioContext, frequencyToNote } from './audioUtils';
import type { Note, PitchDataPoint } from '../types';

/**
 * Extract melody (notes with timing) from an audio file
 */
export class MelodyExtractor {
  /**
   * Extract notes from an audio file by analyzing pitch over time
   */
  async extractFromAudioFile(audioFile: File): Promise<Note[]> {
    try {
      // Load audio file
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioContext = createAudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Analyze pitch throughout the audio
      const analyzer = new PitchAnalyzer(audioContext);
      const pitchData = await analyzer.analyzeAudioFile(audioBuffer);

      // Convert pitch data to notes with duration
      const notes = this.pitchDataToNotes(pitchData);

      return notes;
    } catch (error) {
      console.error('Error extracting melody from audio:', error);
      throw new Error('Failed to extract melody from audio file');
    }
  }

  /**
   * Convert continuous pitch data into discrete notes with start times and durations
   */
  private pitchDataToNotes(pitchData: PitchDataPoint[]): Note[] {
    if (pitchData.length === 0) return [];

    const notes: Note[] = [];
    const MIN_NOTE_DURATION = 0.1; // Minimum 100ms for a note
    const PITCH_TOLERANCE_CENTS = 50; // Notes within 50 cents are considered the same

    let currentNote: Note | null = null;
    let currentMeasure = 1;
    let measureStartTime = 0;
    const MEASURE_DURATION = 4.0; // Assume 4 seconds per measure (can be made dynamic)

    for (let i = 0; i < pitchData.length; i++) {
      const point = pitchData[i];
      const noteName = frequencyToNote(point.frequency);

      // Update measure number based on time
      if (point.time - measureStartTime >= MEASURE_DURATION) {
        currentMeasure++;
        measureStartTime = point.time;
      }

      if (!currentNote) {
        // Start a new note
        currentNote = {
          pitch: noteName,
          frequency: point.frequency,
          startTime: point.time,
          duration: 0,
          measure: currentMeasure,
          noteIndex: notes.filter(n => n.measure === currentMeasure).length,
        };
      } else {
        // Check if this is the same note or a new note
        const centsDiff = Math.abs(1200 * Math.log2(point.frequency / currentNote.frequency));

        if (centsDiff < PITCH_TOLERANCE_CENTS) {
          // Same note, extend duration
          currentNote.duration = point.time - currentNote.startTime;
        } else {
          // Different note - save current note if it meets minimum duration
          if (currentNote.duration >= MIN_NOTE_DURATION) {
            notes.push({ ...currentNote });
          }

          // Start new note
          currentNote = {
            pitch: noteName,
            frequency: point.frequency,
            startTime: point.time,
            duration: 0,
            measure: currentMeasure,
            noteIndex: notes.filter(n => n.measure === currentMeasure).length,
          };
        }
      }
    }

    // Add the last note if valid
    if (currentNote && currentNote.duration >= MIN_NOTE_DURATION) {
      notes.push(currentNote);
    }

    return notes;
  }

  /**
   * Simplify melody by removing very short notes and smoothing
   */
  simplifyMelody(notes: Note[], minDuration: number = 0.2): Note[] {
    return notes
      .filter(note => note.duration >= minDuration)
      .map((note, _index, arr) => {
        // Re-index notes within each measure
        const notesInMeasure = arr.filter(n => n.measure === note.measure);
        const noteIndex = notesInMeasure.findIndex(n => n.startTime === note.startTime);

        return {
          ...note,
          noteIndex,
        };
      });
  }

  /**
   * Quantize note timing to a grid (e.g., eighth notes, quarter notes)
   */
  quantizeToGrid(notes: Note[], gridSize: number = 0.25): Note[] {
    return notes.map(note => {
      const quantizedStart = Math.round(note.startTime / gridSize) * gridSize;
      const quantizedDuration = Math.round(note.duration / gridSize) * gridSize;

      return {
        ...note,
        startTime: quantizedStart,
        duration: Math.max(gridSize, quantizedDuration), // Ensure minimum duration
      };
    });
  }
}

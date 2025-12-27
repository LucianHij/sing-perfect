import type { Note, PitchDataPoint, AnalysisResult, NoteResult, RhythmMeasure } from '../types';
import { getCentsDifference, getCentsDifferenceOctaveInvariant } from './audioUtils';

const PITCH_TOLERANCE_CENTS = 50; // 50 cents = half a semitone
const RHYTHM_TOLERANCE_MS = 100; // 100ms timing tolerance
const USE_OCTAVE_INVARIANT = true; // Compare notes ignoring octave differences (allows men to sing women's songs and vice versa)

export class AnalysisEngine {
  /**
   * Compare user's performance against reference notes
   */
  analyzePerformance(
    referenceNotes: Note[],
    userPitchData: PitchDataPoint[]
  ): AnalysisResult {
    const noteResults = this.compareNotes(referenceNotes, userPitchData);
    const rhythmTimeline = this.analyzeRhythm(referenceNotes, userPitchData);

    // Calculate accuracies
    const pitchAccuracy = this.calculatePitchAccuracy(noteResults);
    const rhythmAccuracy = this.calculateRhythmAccuracy(rhythmTimeline);
    const overallScore = (pitchAccuracy + rhythmAccuracy) / 2;

    return {
      pitchAccuracy,
      rhythmAccuracy,
      overallScore,
      noteResults,
      pitchData: userPitchData,
      rhythmTimeline,
    };
  }

  private compareNotes(referenceNotes: Note[], userPitchData: PitchDataPoint[]): NoteResult[] {
    const results: NoteResult[] = [];

    for (const expectedNote of referenceNotes) {
      // Find user's pitch data around the expected time
      const timeWindow = 0.2; // 200ms window
      const relevantPitches = userPitchData.filter(
        (p) =>
          p.time >= expectedNote.startTime - timeWindow &&
          p.time <= expectedNote.startTime + expectedNote.duration + timeWindow
      );

      if (relevantPitches.length === 0) {
        // Note was not sung
        results.push({
          expected: expectedNote,
          actual: null,
          status: 'incorrect',
        });
        continue;
      }

      // Get the most confident pitch in the window
      const actualPitch = relevantPitches.reduce((prev, current) =>
        current.confidence > prev.confidence ? current : prev
      );

      // Compare frequencies (with or without octave sensitivity)
      // Octave-invariant mode: C4 and C5 are considered the same note
      // This allows men to sing women's songs (or vice versa) in their natural range
      const centsDiff = USE_OCTAVE_INVARIANT
        ? getCentsDifferenceOctaveInvariant(actualPitch.frequency, expectedNote.frequency)
        : Math.abs(getCentsDifference(actualPitch.frequency, expectedNote.frequency));

      const timingDiff = Math.abs(actualPitch.time - expectedNote.startTime);

      let status: 'correct' | 'incorrect' | 'close';
      if (centsDiff < PITCH_TOLERANCE_CENTS / 2) {
        status = 'correct';
      } else if (centsDiff < PITCH_TOLERANCE_CENTS) {
        status = 'close';
      } else {
        status = 'incorrect';
      }

      results.push({
        expected: expectedNote,
        actual: actualPitch,
        status,
        pitchDifference: actualPitch.frequency - expectedNote.frequency,
        timingDifference: timingDiff,
      });
    }

    return results;
  }

  private analyzeRhythm(referenceNotes: Note[], userPitchData: PitchDataPoint[]): RhythmMeasure[] {
    // Group notes by measure
    const measureMap = new Map<number, Note[]>();
    referenceNotes.forEach((note) => {
      if (!measureMap.has(note.measure)) {
        measureMap.set(note.measure, []);
      }
      measureMap.get(note.measure)!.push(note);
    });

    const rhythmTimeline: RhythmMeasure[] = [];

    measureMap.forEach((notes, measureNum) => {
      if (notes.length === 0) return;

      // Calculate average timing difference for this measure
      let totalDiff = 0;
      let count = 0;

      notes.forEach((expectedNote) => {
        const timeWindow = 0.3;
        const relevantPitches = userPitchData.filter(
          (p) =>
            p.time >= expectedNote.startTime - timeWindow &&
            p.time <= expectedNote.startTime + expectedNote.duration + timeWindow
        );

        if (relevantPitches.length > 0) {
          const actualPitch = relevantPitches[0];
          totalDiff += actualPitch.time - expectedNote.startTime;
          count++;
        }
      });

      if (count === 0) {
        rhythmTimeline.push({
          measure: measureNum,
          status: 'on-beat',
          difference: 0,
        });
        return;
      }

      const avgDiff = totalDiff / count;
      const toleranceSec = RHYTHM_TOLERANCE_MS / 1000;

      let status: 'on-beat' | 'rushed' | 'dragged';
      if (Math.abs(avgDiff) < toleranceSec) {
        status = 'on-beat';
      } else if (avgDiff > 0) {
        status = 'dragged';
      } else {
        status = 'rushed';
      }

      rhythmTimeline.push({
        measure: measureNum,
        status,
        difference: avgDiff,
      });
    });

    return rhythmTimeline.sort((a, b) => a.measure - b.measure);
  }

  private calculatePitchAccuracy(noteResults: NoteResult[]): number {
    if (noteResults.length === 0) return 0;

    const correctNotes = noteResults.filter((r) => r.status === 'correct').length;
    const closeNotes = noteResults.filter((r) => r.status === 'close').length;

    // Correct notes = 100%, close notes = 50%, incorrect = 0%
    const score = (correctNotes + closeNotes * 0.5) / noteResults.length;
    return Math.round(score * 100);
  }

  private calculateRhythmAccuracy(rhythmTimeline: RhythmMeasure[]): number {
    if (rhythmTimeline.length === 0) return 0;

    const onBeatMeasures = rhythmTimeline.filter((m) => m.status === 'on-beat').length;
    return Math.round((onBeatMeasures / rhythmTimeline.length) * 100);
  }
}

export interface Note {
  pitch: string; // e.g., "C4", "D#5"
  frequency: number; // Hz
  startTime: number; // seconds
  duration: number; // seconds
  measure: number;
  noteIndex: number;
}

export interface AnalysisResult {
  pitchAccuracy: number; // percentage
  rhythmAccuracy: number; // percentage
  overallScore: number; // percentage
  noteResults: NoteResult[];
  pitchData: PitchDataPoint[];
  rhythmTimeline: RhythmMeasure[];
}

export interface NoteResult {
  expected: Note;
  actual: PitchDataPoint | null;
  status: 'correct' | 'incorrect' | 'close';
  pitchDifference?: number; // Hz
  timingDifference?: number; // seconds
}

export interface PitchDataPoint {
  time: number; // seconds
  frequency: number; // Hz
  note: string; // e.g., "C4"
  confidence: number; // 0-1
}

export interface RhythmMeasure {
  measure: number;
  status: 'on-beat' | 'rushed' | 'dragged';
  difference: number; // seconds (positive = rushed, negative = dragged)
}

export interface UploadedFiles {
  referenceAudio: File | null;
  sheetMusic: File | null;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
}

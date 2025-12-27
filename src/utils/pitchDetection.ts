import { PitchDetector } from 'pitchy';
import { frequencyToNote } from './audioUtils';
import type { PitchDataPoint } from '../types';

export class PitchAnalyzer {
  private audioContext: AudioContext;
  private analyzerNode: AnalyserNode;
  private detector: PitchDetector<Float32Array> | null = null;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.analyzerNode = audioContext.createAnalyser();
    this.analyzerNode.fftSize = 2048;
  }

  async analyzeAudioFile(audioBuffer: AudioBuffer): Promise<PitchDataPoint[]> {
    const pitchData: PitchDataPoint[] = [];
    const sampleRate = audioBuffer.sampleRate;
    const channelData = audioBuffer.getChannelData(0); // Use first channel

    // Initialize pitch detector
    const detector = PitchDetector.forFloat32Array(this.analyzerNode.fftSize);
    const input = new Float32Array(this.analyzerNode.fftSize);

    // Analyze in chunks (every 10ms)
    const hopSize = Math.floor(sampleRate * 0.01); // 10ms hop
    const totalSamples = channelData.length;

    for (let i = 0; i < totalSamples - this.analyzerNode.fftSize; i += hopSize) {
      // Copy chunk to input buffer
      input.set(channelData.slice(i, i + this.analyzerNode.fftSize));

      // Detect pitch
      const [pitch, clarity] = detector.findPitch(input, sampleRate);

      // Only include confident detections (clarity > 0.9)
      if (clarity > 0.9 && pitch > 0) {
        const time = i / sampleRate;
        const noteName = frequencyToNote(pitch);

        pitchData.push({
          time,
          frequency: pitch,
          note: noteName,
          confidence: clarity,
        });
      }
    }

    return pitchData;
  }

  async analyzeRecording(audioBlob: Blob): Promise<PitchDataPoint[]> {
    // Convert blob to audio buffer
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

    return this.analyzeAudioFile(audioBuffer);
  }

  connectSource(source: MediaStreamAudioSourceNode): void {
    source.connect(this.analyzerNode);
  }

  getRealTimePitch(): [number, number] | null {
    if (!this.detector) {
      this.detector = PitchDetector.forFloat32Array(this.analyzerNode.fftSize);
    }

    // Create buffer each time to avoid TypeScript ArrayBuffer strict type checking issues
    const buffer = new Float32Array(this.analyzerNode.fftSize);
    this.analyzerNode.getFloatTimeDomainData(buffer);
    const [pitch, clarity] = this.detector.findPitch(buffer, this.audioContext.sampleRate);

    if (clarity > 0.9 && pitch > 0) {
      return [pitch, clarity];
    }

    return null;
  }
}

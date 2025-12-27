declare module 'pitchy' {
  export class PitchDetector<T extends Float32Array> {
    static forFloat32Array(bufferSize: number): PitchDetector<Float32Array>;
    findPitch(input: ArrayLike<number>, sampleRate: number): [number, number];
  }
}

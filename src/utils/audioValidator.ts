/**
 * Validate audio files before processing
 */
export class AudioValidator {
  /**
   * Check if audio file is valid and suitable for analysis
   */
  static async validateAudioFile(file: File): Promise<{ valid: boolean; error?: string }> {
    // Check file size (max 50MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: 'File is too large. Please use audio files under 50MB.',
      };
    }

    // Check file type
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/flac', 'audio/mp3'];
    const validExtensions = ['.mp3', '.wav', '.ogg', '.webm', '.flac', '.m4a'];

    const isValidType = validTypes.some(type => file.type.includes(type));
    const isValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!isValidType && !isValidExtension) {
      return {
        valid: false,
        error: 'Unsupported file format. Please use MP3, WAV, OGG, FLAC, or M4A files.',
      };
    }

    // Check if file is actually readable as audio
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await file.slice(0, Math.min(file.size, 1024 * 1024)).arrayBuffer();

      try {
        await audioContext.decodeAudioData(arrayBuffer);
        audioContext.close();
      } catch (decodeError) {
        audioContext.close();
        return {
          valid: false,
          error: 'File appears to be corrupted or not a valid audio file.',
        };
      }
    } catch (error) {
      return {
        valid: false,
        error: 'Unable to read audio file. Please try a different file.',
      };
    }

    return { valid: true };
  }

  /**
   * Get audio file duration
   */
  static async getAudioDuration(file: File): Promise<number> {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const duration = audioBuffer.duration;
      audioContext.close();
      return duration;
    } catch (error) {
      console.error('Error getting audio duration:', error);
      return 0;
    }
  }

  /**
   * Check if audio has sufficient vocal content (not instrumental only)
   */
  static async checkForVocalContent(_file: File): Promise<boolean> {
    // This is a simplified check - in production, you'd use more sophisticated analysis
    // For now, just return true and let the pitch detection handle it
    return true;
  }
}

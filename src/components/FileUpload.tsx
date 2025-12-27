import React, { useRef, useState } from 'react';
import { Upload, FileAudio, AlertCircle } from 'lucide-react';
import { AudioValidator } from '../utils/audioValidator';
import { InfoBox } from './ui';

interface FileUploadProps {
  onAudioUpload: (file: File) => void;
  audioFile: File | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onAudioUpload,
  audioFile,
}) => {
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsValidating(true);
      setAudioError(null);

      // Validate audio file
      const validation = await AudioValidator.validateAudioFile(file);

      if (!validation.valid) {
        setAudioError(validation.error || 'Invalid audio file');
        setIsValidating(false);
        // Reset input
        if (audioInputRef.current) {
          audioInputRef.current.value = '';
        }
        return;
      }

      setIsValidating(false);
      onAudioUpload(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="flex justify-center">
        {/* Reference Audio Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            onChange={handleAudioChange}
            className="hidden"
            id="audio-upload"
          />
          <label
            htmlFor="audio-upload"
            className="cursor-pointer flex flex-col items-center justify-center space-y-4"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <FileAudio className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">Reference Audio</p>
              <p className="text-sm text-gray-500 mt-1">
                {audioFile ? audioFile.name : 'Click to upload audio file'}
              </p>
              <p className="text-xs text-gray-400 mt-2">MP3, WAV, or other audio format</p>
            </div>
            {!audioFile && !isValidating && (
              <div className="flex items-center space-x-2 text-blue-600">
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Upload File</span>
              </div>
            )}
            {isValidating && (
              <div className="text-blue-600 text-sm font-medium">⏳ Validating file...</div>
            )}
            {audioFile && !isValidating && (
              <div className="text-green-600 text-sm font-medium">✓ File uploaded</div>
            )}
          </label>
          {audioError && (
            <div className="flex items-center space-x-2 text-red-600 text-sm font-medium mt-3 px-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{audioError}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <InfoBox variant="success" title="Tips for best results:">
          <ul className="space-y-1">
            <li>• <strong>Clear Audio:</strong> Use vocal recordings without heavy instrumentation</li>
            <li>• <strong>File Quality:</strong> Higher quality audio (WAV, FLAC) works better than compressed MP3</li>
            <li>• <strong>Duration:</strong> Start with shorter songs (30-60 seconds) for quicker analysis</li>
            <li>• <strong>Volume:</strong> Ensure the reference audio has clear, audible vocals</li>
          </ul>
        </InfoBox>

        <InfoBox variant="tip" title="🎵 Octave Flexibility:">
          <p>
            You can sing in your natural vocal range! If you're a man singing a woman's song (or vice versa),
            the app will recognize notes correctly even if you're an octave lower or higher.
            For example, singing C4 when the reference is C5 is marked as <strong>correct</strong> ✓
          </p>
        </InfoBox>
      </div>
    </div>
  );
};

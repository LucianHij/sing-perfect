import React, { useRef } from 'react';
import { Upload, Music, FileAudio } from 'lucide-react';

interface FileUploadProps {
  onAudioUpload: (file: File) => void;
  onSheetMusicUpload: (file: File) => void;
  audioFile: File | null;
  sheetMusicFile: File | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onAudioUpload,
  onSheetMusicUpload,
  audioFile,
  sheetMusicFile,
}) => {
  const audioInputRef = useRef<HTMLInputElement>(null);
  const sheetMusicInputRef = useRef<HTMLInputElement>(null);

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAudioUpload(file);
    }
  };

  const handleSheetMusicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSheetMusicUpload(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            {!audioFile && (
              <div className="flex items-center space-x-2 text-blue-600">
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Upload File</span>
              </div>
            )}
            {audioFile && (
              <div className="text-green-600 text-sm font-medium">✓ File uploaded</div>
            )}
          </label>
        </div>

        {/* Sheet Music Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-500 transition-colors">
          <input
            ref={sheetMusicInputRef}
            type="file"
            accept="image/*,.pdf,.xml,.musicxml"
            onChange={handleSheetMusicChange}
            className="hidden"
            id="sheet-music-upload"
          />
          <label
            htmlFor="sheet-music-upload"
            className="cursor-pointer flex flex-col items-center justify-center space-y-4"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <Music className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">Sheet Music</p>
              <p className="text-sm text-gray-500 mt-1">
                {sheetMusicFile ? sheetMusicFile.name : 'Click to upload sheet music'}
              </p>
              <p className="text-xs text-gray-400 mt-2">PDF, PNG, JPG, or MusicXML</p>
            </div>
            {!sheetMusicFile && (
              <div className="flex items-center space-x-2 text-purple-600">
                <Upload className="w-4 h-4" />
                <span className="text-sm font-medium">Upload File</span>
              </div>
            )}
            {sheetMusicFile && (
              <div className="text-green-600 text-sm font-medium">✓ File uploaded</div>
            )}
          </label>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> You can upload just audio, just sheet music, or both. The analysis
          will adapt based on what you provide.
        </p>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause } from 'lucide-react';
import { formatTime } from '../utils/audioUtils';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  referenceAudio?: File | null;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  referenceAudio,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const referenceAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (referenceAudioRef.current) {
        referenceAudioRef.current.pause();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      // If reference audio exists, play it along with recording
      if (referenceAudio && referenceAudioRef.current) {
        referenceAudioRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (referenceAudioRef.current) {
        referenceAudioRef.current.pause();
        referenceAudioRef.current.currentTime = 0;
      }
    }
  };

  const togglePlayback = () => {
    if (referenceAudioRef.current) {
      if (isPlaying) {
        referenceAudioRef.current.pause();
      } else {
        referenceAudioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Create object URL for reference audio
  useEffect(() => {
    if (referenceAudio) {
      const url = URL.createObjectURL(referenceAudio);
      referenceAudioRef.current = new Audio(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [referenceAudio]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Record Your Performance</h2>
          <p className="text-gray-600">
            {referenceAudio
              ? 'The reference audio will play while you record'
              : 'Record yourself singing'}
          </p>
        </div>

        {/* Waveform Visualization Placeholder */}
        {isRecording && (
          <div className="mb-6 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
            <div className="flex space-x-1 items-end h-24">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 bg-blue-500 rounded-t animate-pulse"
                  style={{
                    height: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className="text-5xl font-mono font-bold text-gray-900">
            {formatTime(duration)}
          </div>
          {isRecording && (
            <div className="mt-2 text-red-600 flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
              <span className="font-semibold">Recording in Progress</span>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-4">
          {!isRecording ? (
            <>
              <button
                onClick={startRecording}
                className="flex items-center space-x-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-colors shadow-lg"
              >
                <Mic className="w-6 h-6" />
                <span>Start Recording</span>
              </button>

              {referenceAudio && (
                <button
                  onClick={togglePlayback}
                  className="flex items-center space-x-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors shadow-lg"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5" />
                      <span>Pause Preview</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      <span>Preview Audio</span>
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center space-x-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-semibold transition-colors shadow-lg"
            >
              <Square className="w-6 h-6" />
              <span>Stop Recording</span>
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Recording Tips:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Find a quiet environment to minimize background noise</li>
            <li>• Keep a consistent distance from your microphone</li>
            <li>• {referenceAudio ? 'Sing along with the reference track' : 'Sing clearly and confidently'}</li>
            <li>• Click "Stop Recording" when you finish the song</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

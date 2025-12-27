import { useState } from 'react';
import { Music } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { AudioRecorder } from './components/AudioRecorder';
import { AnalysisProgress } from './components/AnalysisProgress';
import { ResultsView } from './components/ResultsView';
// import { PitchAnalyzer } from './utils/pitchDetection';
import { AnalysisEngine } from './utils/analysisEngine';
import { generateMockReferenceNotes, generateMockUserPitchData } from './utils/mockData';
// import { createAudioContext } from './utils/audioUtils';
import type { UploadedFiles, AnalysisResult } from './types';

type AppState = 'upload' | 'record' | 'analyzing' | 'results';
type AnalysisStatus = 'processing' | 'detecting' | 'comparing' | 'complete';

function App() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('processing');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    referenceAudio: null,
    sheetMusic: null,
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleAudioUpload = (file: File) => {
    setUploadedFiles((prev) => ({ ...prev, referenceAudio: file }));
  };

  const handleSheetMusicUpload = (file: File) => {
    setUploadedFiles((prev) => ({ ...prev, sheetMusic: file }));
  };

  const handleStartRecording = () => {
    setAppState('record');
  };

  const handleRecordingComplete = async (_audioBlob: Blob) => {
    setAppState('analyzing');
    setAnalysisStatus('processing');

    try {
      // Simulate processing steps with delays for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAnalysisStatus('detecting');

      // For this demo, we'll use mock data
      // In production, you would:
      // 1. Extract reference notes from sheet music or reference audio
      // 2. Analyze the user's recording using PitchAnalyzer
      // 3. Compare them using AnalysisEngine

      // Uncomment for production use:
      // const audioContext = createAudioContext();
      // const analyzer = new PitchAnalyzer(audioContext);

      // For demo: Use mock data
      const referenceNotes = generateMockReferenceNotes();

      await new Promise((resolve) => setTimeout(resolve, 1500));
      setAnalysisStatus('comparing');

      // In production:
      // const userPitchData = await analyzer.analyzeRecording(audioBlob);

      // For demo:
      const userPitchData = generateMockUserPitchData(referenceNotes);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Analyze performance
      const engine = new AnalysisEngine();
      const result = engine.analyzePerformance(referenceNotes, userPitchData);

      setAnalysisStatus('complete');
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAnalysisResult(result);
      setAppState('results');
    } catch (error) {
      console.error('Analysis error:', error);
      alert('An error occurred during analysis. Please try again.');
      setAppState('record');
    }
  };

  const handleTryAgain = () => {
    setAnalysisResult(null);
    setAppState('upload');
  };

  const canProceedToRecording = uploadedFiles.referenceAudio || uploadedFiles.sheetMusic;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <Music className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SingPerfect</h1>
            <span className="text-sm text-gray-500">Learn Pitch & Rhythm Accuracy</span>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-4">
          <div
            className={`flex items-center space-x-2 ${
              appState === 'upload' ? 'text-blue-600 font-semibold' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                appState === 'upload'
                  ? 'bg-blue-600 text-white'
                  : ['record', 'analyzing', 'results'].includes(appState)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {['record', 'analyzing', 'results'].includes(appState) ? '✓' : '1'}
            </div>
            <span>Upload Files</span>
          </div>

          <div className="w-12 h-1 bg-gray-300"></div>

          <div
            className={`flex items-center space-x-2 ${
              appState === 'record' ? 'text-blue-600 font-semibold' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                appState === 'record'
                  ? 'bg-blue-600 text-white'
                  : ['analyzing', 'results'].includes(appState)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {['analyzing', 'results'].includes(appState) ? '✓' : '2'}
            </div>
            <span>Record</span>
          </div>

          <div className="w-12 h-1 bg-gray-300"></div>

          <div
            className={`flex items-center space-x-2 ${
              appState === 'results' ? 'text-blue-600 font-semibold' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                appState === 'results'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {appState === 'results' ? '✓' : '3'}
            </div>
            <span>Results</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {appState === 'upload' && (
          <>
            <FileUpload
              onAudioUpload={handleAudioUpload}
              onSheetMusicUpload={handleSheetMusicUpload}
              audioFile={uploadedFiles.referenceAudio}
              sheetMusicFile={uploadedFiles.sheetMusic}
            />

            <div className="flex justify-center mt-8">
              <button
                onClick={handleStartRecording}
                disabled={!canProceedToRecording}
                className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                  canProceedToRecording
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue to Recording
              </button>
            </div>
          </>
        )}

        {appState === 'record' && (
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            referenceAudio={uploadedFiles.referenceAudio}
          />
        )}

        {appState === 'analyzing' && <AnalysisProgress status={analysisStatus} />}

        {appState === 'results' && analysisResult && (
          <ResultsView result={analysisResult} onTryAgain={handleTryAgain} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p className="text-sm">
            Practice makes perfect. Keep singing and track your progress over time.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

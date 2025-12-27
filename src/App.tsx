import { useState } from 'react';
import { Music } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { AudioRecorder } from './components/AudioRecorder';
import { AnalysisProgress } from './components/AnalysisProgress';
import { ResultsView } from './components/ResultsView';
import { Button } from './components/ui';
import { PitchAnalyzer } from './utils/pitchDetection';
import { AnalysisEngine } from './utils/analysisEngine';
import { MelodyExtractor } from './utils/melodyExtractor';
import { generateMockReferenceNotes } from './utils/mockData';
import { createAudioContext } from './utils/audioUtils';
import type { UploadedFiles, AnalysisResult, Note } from './types';

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

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setAppState('analyzing');
    setAnalysisStatus('processing');

    try {
      // Step 1: Extract reference notes
      let referenceNotes: Note[];

      if (uploadedFiles.referenceAudio) {
        // Extract melody from reference audio
        console.log('Extracting melody from reference audio...');
        const melodyExtractor = new MelodyExtractor();
        const extractedNotes = await melodyExtractor.extractFromAudioFile(uploadedFiles.referenceAudio);

        // Simplify and quantize for better comparison
        const simplifiedNotes = melodyExtractor.simplifyMelody(extractedNotes, 0.15);
        referenceNotes = melodyExtractor.quantizeToGrid(simplifiedNotes, 0.125); // Eighth note grid

        console.log(`Extracted ${referenceNotes.length} notes from reference audio`);
      } else if (uploadedFiles.sheetMusic) {
        // TODO: Parse sheet music (MusicXML or OMR)
        // For now, use mock data as fallback
        console.log('Sheet music parsing not yet implemented, using mock data');
        referenceNotes = generateMockReferenceNotes();
      } else {
        // Should not happen due to validation, but just in case
        throw new Error('No reference material provided');
      }

      setAnalysisStatus('detecting');

      // Step 2: Analyze user's recording
      console.log('Analyzing your recording...');
      const audioContext = createAudioContext();
      const analyzer = new PitchAnalyzer(audioContext);
      const userPitchData = await analyzer.analyzeRecording(audioBlob);

      console.log(`Detected ${userPitchData.length} pitch points from your recording`);

      setAnalysisStatus('comparing');

      // Step 3: Compare performance
      console.log('Comparing your performance to reference...');
      const engine = new AnalysisEngine();
      const result = engine.analyzePerformance(referenceNotes, userPitchData);

      setAnalysisStatus('complete');
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAnalysisResult(result);
      setAppState('results');
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Analysis failed: ${errorMessage}\n\nPlease try again with a different audio file.`);
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
              <Button
                onClick={handleStartRecording}
                disabled={!canProceedToRecording}
                variant="primary"
                size="lg"
              >
                Continue to Recording
              </Button>
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

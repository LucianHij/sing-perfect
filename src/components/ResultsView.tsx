import React, { useState } from 'react';
import { Award, TrendingUp, Music2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import type { AnalysisResult, NoteResult } from '../types';
import { PitchGraph } from './PitchGraph';
import { RhythmTimeline } from './RhythmTimeline';

interface ResultsViewProps {
  result: AnalysisResult;
  onTryAgain: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onTryAgain }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'Excellent!';
    if (score >= 80) return 'Great!';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Practice';
  };

  const getNoteStatusBadge = (status: NoteResult['status']) => {
    switch (status) {
      case 'correct':
        return <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded">✓ Correct</span>;
      case 'close':
        return <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">~ Close</span>;
      case 'incorrect':
        return <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">✗ Incorrect</span>;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Overall Score Card */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Award className="w-10 h-10" />
            <h2 className="text-3xl font-bold">Your Performance Score</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Overall Score */}
          <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center backdrop-blur-sm">
            <div className="text-6xl font-bold mb-2">{result.overallScore}%</div>
            <div className="text-xl font-semibold">{getScoreGrade(result.overallScore)}</div>
            <div className="text-sm opacity-90 mt-2">Overall Score</div>
          </div>

          {/* Pitch Accuracy */}
          <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center backdrop-blur-sm">
            <div className="flex items-center justify-center mb-2">
              <Music2 className="w-6 h-6 mr-2" />
              <div className="text-4xl font-bold">{result.pitchAccuracy}%</div>
            </div>
            <div className="text-lg font-semibold">Pitch Accuracy</div>
            <div className="text-sm opacity-90 mt-2">
              {result.noteResults.filter(n => n.status === 'correct').length} of {result.noteResults.length} notes
            </div>
          </div>

          {/* Rhythm Accuracy */}
          <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center backdrop-blur-sm">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-6 h-6 mr-2" />
              <div className="text-4xl font-bold">{result.rhythmAccuracy}%</div>
            </div>
            <div className="text-lg font-semibold">Rhythm Accuracy</div>
            <div className="text-sm opacity-90 mt-2">
              {result.rhythmTimeline.filter(m => m.status === 'on-beat').length} of {result.rhythmTimeline.length} measures
            </div>
          </div>
        </div>

        <button
          onClick={onTryAgain}
          className="mt-6 w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Try Again
        </button>
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PitchGraph
          referenceNotes={result.noteResults.map(nr => nr.expected)}
          userPitchData={result.pitchData}
        />
        <RhythmTimeline rhythmTimeline={result.rhythmTimeline} />
      </div>

      {/* Note-by-Note Breakdown */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Note-by-Note Breakdown</h3>
          </div>
          {showDetails ? (
            <ChevronUp className="w-6 h-6 text-gray-500" />
          ) : (
            <ChevronDown className="w-6 h-6 text-gray-500" />
          )}
        </button>

        {showDetails && (
          <div className="mt-6 space-y-3">
            <div className="grid grid-cols-6 gap-4 px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700">
              <div>Measure</div>
              <div>Note</div>
              <div>Expected</div>
              <div>Actual</div>
              <div>Difference</div>
              <div>Status</div>
            </div>

            {result.noteResults.map((noteResult, index) => (
              <div
                key={index}
                className="grid grid-cols-6 gap-4 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-gray-900 font-medium">
                  {noteResult.expected.measure}
                </div>
                <div className="text-gray-900 font-medium">
                  {index + 1}
                </div>
                <div className="text-gray-700">
                  {noteResult.expected.pitch} ({noteResult.expected.frequency.toFixed(2)} Hz)
                </div>
                <div className="text-gray-700">
                  {noteResult.actual
                    ? `${noteResult.actual.note} (${noteResult.actual.frequency.toFixed(2)} Hz)`
                    : 'Not sung'}
                </div>
                <div className={`font-medium ${
                  noteResult.pitchDifference
                    ? Math.abs(noteResult.pitchDifference) < 5
                      ? 'text-green-600'
                      : 'text-red-600'
                    : 'text-gray-400'
                }`}>
                  {noteResult.pitchDifference
                    ? `${noteResult.pitchDifference > 0 ? '+' : ''}${noteResult.pitchDifference.toFixed(2)} Hz`
                    : '-'}
                </div>
                <div>{getNoteStatusBadge(noteResult.status)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback and Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-3">Practice Tips:</h3>
        <ul className="space-y-2 text-blue-800">
          {result.pitchAccuracy < 70 && (
            <li>• Focus on matching the pitch more closely. Use a piano or tuner to practice individual notes.</li>
          )}
          {result.rhythmAccuracy < 70 && (
            <li>• Work on your timing. Try using a metronome while practicing.</li>
          )}
          {result.noteResults.filter(n => n.status === 'incorrect').length > 0 && (
            <li>• Pay special attention to the notes marked as incorrect in the breakdown above.</li>
          )}
          {result.overallScore >= 80 && (
            <li>• Great job! Keep practicing to maintain consistency and try more challenging songs.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

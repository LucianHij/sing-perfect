# SingPerfect - Singing Practice Feedback System

A web application that helps beginner singers learn pitch and rhythm accuracy through objective, visual feedback.

## Features

- **File Upload**: Upload reference audio and/or sheet music
- **Audio Recording**: Record your singing performance using your device's microphone
- **Pitch Analysis**: Real-time pitch detection comparing your performance to reference notes
- **Rhythm Analysis**: Measure-by-measure timing analysis showing if you're on-beat, rushing, or dragging
- **Visual Feedback**:
  - Color-coded note results (correct, close, incorrect)
  - Pitch comparison graphs showing expected vs actual frequency
  - Rhythm timeline with detailed timing feedback
- **Performance Scoring**: Overall score with separate pitch and rhythm accuracy metrics
- **Detailed Breakdown**: Note-by-note analysis showing specific pitch differences

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Audio Processing**: Web Audio API + Pitchy (pitch detection)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How to Use

1. **Upload Files** (Step 1)
   - Upload a reference audio file (MP3, WAV, etc.)
   - Optionally upload sheet music (PDF, PNG, JPG, or MusicXML)
   - You need at least one file to proceed

2. **Record Your Performance** (Step 2)
   - Click "Start Recording" to begin
   - If you uploaded reference audio, it will play while you record
   - Sing along and click "Stop Recording" when finished

3. **View Results** (Step 3)
   - See your overall score and pitch/rhythm accuracy
   - Review the pitch comparison graph
   - Check the rhythm timeline for timing issues
   - Expand the note-by-note breakdown for detailed feedback

## Current Implementation Status

### Completed
- ✅ Full UI/UX workflow
- ✅ File upload system
- ✅ Audio recording with Web Audio API
- ✅ Pitch detection engine (Pitchy)
- ✅ Analysis engine for comparing performances
- ✅ Results visualization (graphs, timelines, scores)
- ✅ Demo mode with mock data

### In Progress / Future Enhancements
- 🔄 Real audio analysis (currently using mock data for demo)
- 🔄 Sheet music OCR/parsing
- 🔄 Extract reference notes from audio files
- 🔄 Real-time pitch feedback during recording
- 🔄 Progress tracking across multiple sessions
- 🔄 More songs and reference materials
- 🔄 Advanced vocal technique analysis

## Architecture

### Key Components

- **App.tsx**: Main application orchestrator, manages app state flow
- **FileUpload.tsx**: Handles audio and sheet music file uploads
- **AudioRecorder.tsx**: Records user's singing using Web Audio API
- **AnalysisProgress.tsx**: Shows analysis progress with status updates
- **ResultsView.tsx**: Displays comprehensive performance results
- **PitchGraph.tsx**: Visualizes pitch comparison using line charts
- **RhythmTimeline.tsx**: Shows measure-by-measure timing analysis

### Utilities

- **pitchDetection.ts**: Pitch analysis using Pitchy library
- **analysisEngine.ts**: Compares user performance to reference
- **audioUtils.ts**: Audio helper functions (frequency conversions, etc.)
- **mockData.ts**: Generates demo data for "Happy Birthday"

## Browser Compatibility

Requires a modern browser with support for:
- Web Audio API
- MediaRecorder API
- ES2020+ features

Recommended: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## License

MIT

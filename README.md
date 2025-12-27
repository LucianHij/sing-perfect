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

### Quick Start

1. **Upload Files** (Step 1)
   - Upload a reference audio file with clear vocals (MP3, WAV, FLAC recommended)
   - OR upload sheet music (PDF, PNG, JPG, or MusicXML)
   - At least one file is required
   - **Tip**: Shorter songs (30-60 seconds) process faster

2. **Record Your Performance** (Step 2)
   - Click "Start Recording" and allow microphone access
   - Sing along (reference audio will play if uploaded)
   - Click "Stop Recording" when finished

3. **View Results** (Step 3)
   - See your overall score and pitch/rhythm accuracy
   - Review the pitch comparison graph (blue = expected, red = your pitch)
   - Check the rhythm timeline for timing issues
   - Expand note-by-note breakdown for detailed feedback

### Analysis Modes

- **Reference Audio Only**: App extracts melody and compares your singing
- **Sheet Music Only**: App compares your pitch to written notes (uses mock data currently)
- **Both**: Most comprehensive analysis with audio playback and notation reference

## Current Implementation Status

### ✅ Completed Features
- Full UI/UX workflow with step-by-step guidance
- File upload system with validation
- Audio recording with Web Audio API
- **Real pitch detection** from user recordings (Pitchy)
- **Melody extraction** from reference audio files
- **Note segmentation** and duration estimation
- Analysis engine for comparing performances
- Results visualization (graphs, timelines, scores)
- Error handling and file validation
- Audio file quality checks

### 🔄 In Progress / Future Enhancements
- Sheet music OCR/parsing (MusicXML support planned)
- Real-time pitch feedback during recording
- Progress tracking across multiple sessions
- Advanced vocal technique analysis (vibrato, breath support)
- Multi-voice harmony support
- Mobile app versions

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

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Note, PitchDataPoint } from '../types';

interface PitchGraphProps {
  referenceNotes: Note[];
  userPitchData: PitchDataPoint[];
}

export const PitchGraph: React.FC<PitchGraphProps> = ({ referenceNotes, userPitchData }) => {
  // Prepare data for the chart
  const chartData = React.useMemo(() => {
    // Create a combined timeline
    const timePoints = new Set<number>();

    // Add all reference note times
    referenceNotes.forEach(note => {
      timePoints.add(note.startTime);
      timePoints.add(note.startTime + note.duration);
    });

    // Add user pitch data times (sample every 100ms)
    userPitchData.forEach((point, index) => {
      if (index % 2 === 0) { // Sample every other point to reduce density
        timePoints.add(Math.round(point.time * 10) / 10);
      }
    });

    const sortedTimes = Array.from(timePoints).sort((a, b) => a - b);

    return sortedTimes.map(time => {
      // Find expected frequency at this time
      const activeNote = referenceNotes.find(
        note => time >= note.startTime && time <= note.startTime + note.duration
      );

      // Find actual user pitch at this time
      const userPitch = userPitchData.find(
        pitch => Math.abs(pitch.time - time) < 0.1
      );

      return {
        time: time.toFixed(2),
        expected: activeNote ? activeNote.frequency : null,
        actual: userPitch ? userPitch.frequency : null,
      };
    });
  }, [referenceNotes, userPitchData]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Pitch Comparison</h3>
      <p className="text-sm text-gray-600 mb-6">
        Blue line shows the expected pitch, red line shows your actual pitch
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            label={{ value: 'Frequency (Hz)', angle: -90, position: 'insideLeft' }}
            domain={['auto', 'auto']}
          />
          <Tooltip
            formatter={(value: number | undefined) => value ? [`${value.toFixed(2)} Hz`, ''] : ['N/A', '']}
            labelFormatter={(label) => `Time: ${label}s`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="expected"
            stroke="#3B82F6"
            strokeWidth={2}
            name="Expected Pitch"
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#EF4444"
            strokeWidth={2}
            name="Your Pitch"
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-1 bg-blue-500"></div>
          <span className="text-gray-700">Expected Pitch</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-1 bg-red-500"></div>
          <span className="text-gray-700">Your Pitch</span>
        </div>
      </div>
    </div>
  );
};

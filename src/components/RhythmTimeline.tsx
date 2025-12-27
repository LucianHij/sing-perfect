import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import type { RhythmMeasure } from '../types';
import { Card } from './ui';

interface RhythmTimelineProps {
  rhythmTimeline: RhythmMeasure[];
}

export const RhythmTimeline: React.FC<RhythmTimelineProps> = ({ rhythmTimeline }) => {
  const getStatusIcon = (status: RhythmMeasure['status']) => {
    switch (status) {
      case 'on-beat':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rushed':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'dragged':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: RhythmMeasure['status']) => {
    switch (status) {
      case 'on-beat':
        return 'bg-green-100 border-green-300';
      case 'rushed':
        return 'bg-orange-100 border-orange-300';
      case 'dragged':
        return 'bg-yellow-100 border-yellow-300';
    }
  };

  const getStatusText = (measure: RhythmMeasure) => {
    switch (measure.status) {
      case 'on-beat':
        return 'On beat';
      case 'rushed':
        return `Rushed by ${Math.abs(measure.difference).toFixed(2)}s`;
      case 'dragged':
        return `Dragged by ${Math.abs(measure.difference).toFixed(2)}s`;
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-bold text-gray-900 mb-4">Rhythm Timeline</h3>
      <p className="text-sm text-gray-600 mb-6">
        Measure-by-measure timing analysis
      </p>

      <div className="space-y-3">
        {rhythmTimeline.map((measure) => (
          <div
            key={measure.measure}
            className={`flex items-center justify-between p-4 border rounded-lg ${getStatusColor(
              measure.status
            )}`}
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(measure.status)}
              <div>
                <div className="font-semibold text-gray-900">Measure {measure.measure}</div>
                <div className="text-sm text-gray-600">{getStatusText(measure)}</div>
              </div>
            </div>

            {/* Visual indicator */}
            <div className="flex items-center space-x-2">
              {measure.status === 'rushed' && (
                <div className="text-orange-600 text-sm font-medium">→ Too fast</div>
              )}
              {measure.status === 'dragged' && (
                <div className="text-yellow-600 text-sm font-medium">← Too slow</div>
              )}
              {measure.status === 'on-beat' && (
                <div className="text-green-600 text-sm font-medium">✓ Perfect</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {rhythmTimeline.filter((m) => m.status === 'on-beat').length}
            </div>
            <div className="text-gray-600">On Beat</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {rhythmTimeline.filter((m) => m.status === 'rushed').length}
            </div>
            <div className="text-gray-600">Rushed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {rhythmTimeline.filter((m) => m.status === 'dragged').length}
            </div>
            <div className="text-gray-600">Dragged</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

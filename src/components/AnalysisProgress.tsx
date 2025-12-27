import React from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface AnalysisProgressProps {
  status: 'processing' | 'detecting' | 'comparing' | 'complete';
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ status }) => {
  const steps = [
    { id: 'processing', label: 'Audio processed', completed: ['detecting', 'comparing', 'complete'].includes(status) },
    { id: 'detecting', label: 'Detecting pitch and rhythm', completed: ['comparing', 'complete'].includes(status) },
    { id: 'comparing', label: 'Comparing to reference', completed: ['complete'].includes(status) },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Performance</h2>
          <p className="text-gray-600">This may take a few moments...</p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {step.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : status === step.id ? (
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                )}
              </div>
              <div className="flex-1">
                <div
                  className={`font-medium ${
                    step.completed
                      ? 'text-green-600'
                      : status === step.id
                      ? 'text-blue-600'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Animated Progress Bar */}
        <div className="mt-8">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out"
              style={{
                width:
                  status === 'processing'
                    ? '25%'
                    : status === 'detecting'
                    ? '50%'
                    : status === 'comparing'
                    ? '75%'
                    : '100%',
              }}
            ></div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Estimated time remaining: {status === 'complete' ? '0' : '10-15'} seconds
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Brain, CheckCircle } from 'lucide-react';

interface AnalysisProgressProps {
  progress: number;
}

export function AnalysisProgress({ progress }: AnalysisProgressProps) {
  const stages = [
    { name: 'Tokenizing text', threshold: 20 },
    { name: 'Identifying arguments', threshold: 40 },
    { name: 'Extracting claims', threshold: 60 },
    { name: 'Analyzing evidence', threshold: 80 },
    { name: 'Generating report', threshold: 95 }
  ];

  const currentStage = stages.findIndex(stage => progress < stage.threshold);
  const activeStageIndex = currentStage === -1 ? stages.length - 1 : Math.max(0, currentStage - 1);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Brain className="h-5 w-5 text-blue-600 animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Analyzing Text</h3>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700">Progress</span>
          <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stages */}
      <div className="space-y-3">
        {stages.map((stage, index) => {
          const isCompleted = progress >= stage.threshold;
          const isActive = index === activeStageIndex;
          
          return (
            <div
              key={stage.name}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-blue-50 border border-blue-200' : 
                isCompleted ? 'bg-green-50' : 'bg-slate-50'
              }`}
            >
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                isCompleted ? 'bg-green-500' :
                isActive ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              
              <span className={`text-sm font-medium ${
                isCompleted ? 'text-green-700' :
                isActive ? 'text-blue-700' : 'text-slate-600'
              }`}>
                {stage.name}
              </span>
              
              {isActive && (
                <div className="ml-auto">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
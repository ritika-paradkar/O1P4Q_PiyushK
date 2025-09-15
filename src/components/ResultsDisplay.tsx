import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Target, Shield, CheckCircle, AlertTriangle, TrendingUp, BarChart3 } from 'lucide-react';
import type { AnalysisResult } from '../App';

interface ResultsDisplayProps {
  results: AnalysisResult;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [expandedSections, setExpandedSections] = useState({
    thesis: true,
    arguments: true,
    claims: false,
    statistics: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'premise': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'conclusion': return 'bg-green-100 text-green-800 border-green-200';
      case 'evidence': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-50';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="h-5 w-5 text-slate-600" />
          <h2 className="text-xl font-semibold text-slate-800">Analysis Results</h2>
        </div>

        {/* Main Thesis */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('thesis')}
            className="flex items-center gap-2 w-full text-left p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-150 transition-colors duration-200"
          >
            {expandedSections.thesis ? (
              <ChevronDown className="h-4 w-4 text-blue-600" />
            ) : (
              <ChevronRight className="h-4 w-4 text-blue-600" />
            )}
            <Target className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">Main Thesis</span>
          </button>
          
          {expandedSections.thesis && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <p className="text-slate-700 leading-relaxed">{results.mainThesis}</p>
            </div>
          )}
        </div>

        {/* Arguments Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('arguments')}
            className="flex items-center gap-2 w-full text-left p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg hover:from-slate-100 hover:to-slate-150 transition-colors duration-200"
          >
            {expandedSections.arguments ? (
              <ChevronDown className="h-4 w-4 text-slate-600" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-600" />
            )}
            <Shield className="h-4 w-4 text-slate-600" />
            <span className="font-medium text-slate-800">
              Arguments ({results.arguments.length})
            </span>
          </button>
          
          {expandedSections.arguments && (
            <div className="mt-4 space-y-3">
              {results.arguments.map((argument) => (
                <div key={argument.id} className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(argument.type)}`}>
                        {argument.type}
                      </span>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(argument.confidence)}`}>
                        {argument.confidence}% confidence
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-700 mb-3 leading-relaxed">{argument.text}</p>
                  
                  {argument.sources.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Sources:</span>
                      <div className="flex flex-wrap gap-1">
                        {argument.sources.map((source, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-100 text-xs text-slate-600 rounded">
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Claims Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('claims')}
            className="flex items-center gap-2 w-full text-left p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-150 transition-colors duration-200"
          >
            {expandedSections.claims ? (
              <ChevronDown className="h-4 w-4 text-green-600" />
            ) : (
              <ChevronRight className="h-4 w-4 text-green-600" />
            )}
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-800">
              Claims ({results.claims.length})
            </span>
          </button>
          
          {expandedSections.claims && (
            <div className="mt-4 space-y-4">
              {results.claims.map((claim) => (
                <div key={claim.id} className="p-4 bg-white border border-slate-200 rounded-lg">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(claim.confidence)}`}>
                      {claim.confidence}% confidence
                    </div>
                  </div>
                  
                  <p className="text-slate-700 mb-4 leading-relaxed">{claim.text}</p>
                  
                  {claim.evidence.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-green-700 mb-2">Supporting Evidence:</h4>
                      <div className="space-y-2">
                        {claim.evidence.map((evidence, idx) => (
                          <div key={idx} className="p-2 bg-green-50 border-l-2 border-green-400 text-sm text-slate-600">
                            {evidence}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {claim.contradictions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Contradictions:
                      </h4>
                      <div className="space-y-2">
                        {claim.contradictions.map((contradiction, idx) => (
                          <div key={idx} className="p-2 bg-red-50 border-l-2 border-red-400 text-sm text-slate-600">
                            {contradiction}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistics Section */}
        <div>
          <button
            onClick={() => toggleSection('statistics')}
            className="flex items-center gap-2 w-full text-left p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-150 transition-colors duration-200"
          >
            {expandedSections.statistics ? (
              <ChevronDown className="h-4 w-4 text-purple-600" />
            ) : (
              <ChevronRight className="h-4 w-4 text-purple-600" />
            )}
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span className="font-medium text-purple-800">Analysis Statistics</span>
          </button>
          
          {expandedSections.statistics && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-slate-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{results.statistics.totalSentences}</div>
                <div className="text-sm text-slate-600">Total Sentences</div>
              </div>
              
              <div className="p-4 bg-white border border-slate-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{results.statistics.argumentativeSentences}</div>
                <div className="text-sm text-slate-600">Argumentative</div>
              </div>
              
              <div className="p-4 bg-white border border-slate-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-slate-600">{results.statistics.neutralSentences}</div>
                <div className="text-sm text-slate-600">Neutral</div>
              </div>
              
              <div className="p-4 bg-white border border-slate-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(results.statistics.averageConfidence)}%
                </div>
                <div className="text-sm text-slate-600">Avg Confidence</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
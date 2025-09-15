import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Brain, Target, Shield, CheckCircle, AlertCircle, Info, Trash2 } from 'lucide-react';
import { TextAnalyzer } from './components/TextAnalyzer';
import { ResultsDisplay } from './components/ResultsDisplay';
import { FileUpload } from './components/FileUpload';
import { AnalysisProgress } from './components/AnalysisProgress';
import { ExportOptions } from './components/ExportOptions';

export interface AnalysisResult {
  id: string;
  text: string;
  timestamp: Date;
  mainThesis: string;
  arguments: Array<{
    id: string;
    type: 'premise' | 'conclusion' | 'evidence';
    text: string;
    confidence: number;
    position: { start: number; end: number };
    sources: string[];
  }>;
  claims: Array<{
    id: string;
    text: string;
    confidence: number;
    evidence: string[];
    contradictions: string[];
  }>;
  statistics: {
    totalSentences: number;
    argumentativeSentences: number;
    neutralSentences: number;
    averageConfidence: number;
  };
}

function App() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (content: string, filename: string) => {
    setInputText(content);
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const analyzer = new TextAnalyzer();
      const result = await analyzer.analyze(inputText);
      
      setResults(result);
      setAnalysisHistory(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 analyses
      setAnalysisProgress(100);
      
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisProgress(0);
      }, 500);
    } catch (error) {
      console.error('Analysis failed:', error);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const clearHistory = () => {
    setAnalysisHistory([]);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800">ArgumentMiner</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Advanced text analysis tool for identifying arguments, claims, and supporting evidence in textual content
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-slate-800">Text Input</h2>
              </div>
              
              <FileUpload onFileUpload={handleFileUpload} />
              
              <div className="mt-4">
                <label htmlFor="text-input" className="block text-sm font-medium text-slate-700 mb-2">
                  Or paste your text here:
                </label>
                <textarea
                  id="text-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter text to analyze for arguments, claims, and evidence..."
                  className="w-full h-64 p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-slate-500">
                    {inputText.length} characters
                  </span>
                  <button
                    onClick={handleAnalyze}
                    disabled={!inputText.trim() || isAnalyzing}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                  >
                    <Target className="h-4 w-4" />
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
                  </button>
                </div>
              </div>
            </div>

            {/* Analysis Progress */}
            {isAnalyzing && (
              <AnalysisProgress progress={analysisProgress} />
            )}

            {/* Analysis History */}
            {analysisHistory.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5 text-slate-600" />
                    <h3 className="text-lg font-semibold text-slate-800">Analysis History</h3>
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-slate-500 hover:text-red-600 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {analysisHistory.map((analysis, index) => (
                    <div
                      key={analysis.id}
                      onClick={() => setResults(analysis)}
                      className="p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-slate-700 truncate flex-1">
                          {analysis.text.substring(0, 100)}...
                        </p>
                        <span className="text-xs text-slate-500 ml-2 whitespace-nowrap">
                          {analysis.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span>{analysis.arguments.length} arguments</span>
                        <span>{analysis.claims.length} claims</span>
                        <span>{Math.round(analysis.statistics.averageConfidence)}% avg confidence</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results ? (
              <>
                <ResultsDisplay results={results} />
                <ExportOptions results={results} />
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="p-4 bg-slate-100 rounded-full inline-block mb-4">
                  <Brain className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Ready to Analyze</h3>
                <p className="text-slate-500">
                  Upload a file or paste text to begin argument mining analysis
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="p-3 bg-blue-100 rounded-full inline-block mb-4">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Argument Detection</h3>
            <p className="text-slate-600">
              Identifies premises, conclusions, and argumentative discourse markers with confidence scoring
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="p-3 bg-purple-100 rounded-full inline-block mb-4">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Evidence Analysis</h3>
            <p className="text-slate-600">
              Maps supporting evidence to claims and detects contradictory information
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="p-3 bg-green-100 rounded-full inline-block mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Structured Output</h3>
            <p className="text-slate-600">
              Generates hierarchical argument structures with multiple export formats
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
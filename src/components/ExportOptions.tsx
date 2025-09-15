import React, { useState } from 'react';
import { Download, FileText, Code, FileImage, CheckCircle } from 'lucide-react';
import type { AnalysisResult } from '../App';

interface ExportOptionsProps {
  results: AnalysisResult;
}

export function ExportOptions({ results }: ExportOptionsProps) {
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `argument-analysis-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    setExportStatus('JSON exported successfully!');
    setTimeout(() => setExportStatus(null), 3000);
  };

  const exportAsCSV = () => {
    const csvRows = [];
    
    // Header
    csvRows.push(['Type', 'Text', 'Confidence', 'Sources'].join(','));
    
    // Arguments
    results.arguments.forEach(arg => {
      csvRows.push([
        `"${arg.type}"`,
        `"${arg.text.replace(/"/g, '""')}"`,
        arg.confidence,
        `"${arg.sources.join('; ')}"`
      ].join(','));
    });
    
    // Claims
    results.claims.forEach(claim => {
      csvRows.push([
        '"claim"',
        `"${claim.text.replace(/"/g, '""')}"`,
        claim.confidence,
        `"${claim.evidence.join('; ')}"`
      ].join(','));
    });

    const csvString = csvRows.join('\n');
    const dataBlob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `argument-analysis-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    setExportStatus('CSV exported successfully!');
    setTimeout(() => setExportStatus(null), 3000);
  };

  const exportAsReport = () => {
    const reportContent = `
ARGUMENT ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}

MAIN THESIS:
${results.mainThesis}

ANALYSIS STATISTICS:
- Total Sentences: ${results.statistics.totalSentences}
- Argumentative Sentences: ${results.statistics.argumentativeSentences}
- Neutral Sentences: ${results.statistics.neutralSentences}
- Average Confidence: ${Math.round(results.statistics.averageConfidence)}%

IDENTIFIED ARGUMENTS (${results.arguments.length}):
${results.arguments.map((arg, index) => `
${index + 1}. [${arg.type.toUpperCase()}] (${arg.confidence}% confidence)
   ${arg.text}
   ${arg.sources.length > 0 ? `Sources: ${arg.sources.join(', ')}` : 'No sources identified'}
`).join('')}

EXTRACTED CLAIMS (${results.claims.length}):
${results.claims.map((claim, index) => `
${index + 1}. (${claim.confidence}% confidence)
   ${claim.text}
   ${claim.evidence.length > 0 ? `Supporting Evidence: ${claim.evidence.join(' | ')}` : 'No supporting evidence found'}
   ${claim.contradictions.length > 0 ? `Contradictions: ${claim.contradictions.join(' | ')}` : 'No contradictions found'}
`).join('')}

END OF REPORT
    `;

    const dataBlob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `argument-analysis-report-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    setExportStatus('Report exported successfully!');
    setTimeout(() => setExportStatus(null), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Download className="h-5 w-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-800">Export Results</h3>
      </div>

      {exportStatus && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-700">{exportStatus}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={exportAsJSON}
          className="flex flex-col items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200"
        >
          <Code className="h-8 w-8 text-blue-600 mb-2" />
          <span className="font-medium text-slate-800">JSON</span>
          <span className="text-xs text-slate-500 text-center">
            Structured data format
          </span>
        </button>

        <button
          onClick={exportAsCSV}
          className="flex flex-col items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200"
        >
          <FileImage className="h-8 w-8 text-green-600 mb-2" />
          <span className="font-medium text-slate-800">CSV</span>
          <span className="text-xs text-slate-500 text-center">
            Spreadsheet format
          </span>
        </button>

        <button
          onClick={exportAsReport}
          className="flex flex-col items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200"
        >
          <FileText className="h-8 w-8 text-purple-600 mb-2" />
          <span className="font-medium text-slate-800">Report</span>
          <span className="text-xs text-slate-500 text-center">
            Human-readable format
          </span>
        </button>
      </div>
    </div>
  );
}
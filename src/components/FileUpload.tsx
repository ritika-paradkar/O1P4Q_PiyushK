import React, { useRef, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (content: string, filename: string) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.txt')) {
      setUploadError('Please upload a text file, PDF, or Word document');
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileUpload(content, file.name);
    };

    reader.onerror = () => {
      setUploadError('Error reading file. Please try again.');
    };

    reader.readAsText(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="mb-4">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'
          }
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".txt,.pdf,.doc,.docx"
          onChange={handleFileInputChange}
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className={`p-3 rounded-full ${dragActive ? 'bg-blue-100' : 'bg-slate-100'}`}>
            <Upload className={`h-6 w-6 ${dragActive ? 'text-blue-600' : 'text-slate-500'}`} />
          </div>
          
          <div>
            <p className="text-lg font-medium text-slate-700 mb-1">
              {dragActive ? 'Drop your file here' : 'Upload a document'}
            </p>
            <p className="text-sm text-slate-500">
              Drag and drop or click to browse (.txt, .pdf, .doc, .docx)
            </p>
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-700">{uploadError}</span>
        </div>
      )}
    </div>
  );
}
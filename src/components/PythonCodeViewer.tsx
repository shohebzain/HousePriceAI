import React, { useState } from 'react';
import { PYTHON_CODE_FILES, PythonCodeFile } from '../ml/pythonSourceCode';
import {
  Code2,
  Copy,
  Check,
  Download,
  Terminal,
  FileCode,
  BookOpen,
} from 'lucide-react';

export const PythonCodeViewer: React.FC = () => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeFile = PYTHON_CODE_FILES[activeFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = (file: PythonCodeFile) => {
    const blob = new Blob([file.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Code2 className="w-5 h-5 text-blue-600" />
              <span>Production Python Machine Learning Source Code</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ready-to-run Python ML pipeline with Scikit-learn, XGBoost, Pandas, FastAPI, and model serialization
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleDownloadFile(activeFile)}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded-lg border border-blue-200 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {activeFile.filename}</span>
            </button>
          </div>
        </div>

        {/* Quick Instructions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-1">1. Install Dependencies</span>
            <code className="font-mono text-[11px] text-blue-700 bg-white p-1 rounded border border-slate-200 block">
              pip install -r requirements.txt
            </code>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-1">2. Train Regression Models</span>
            <code className="font-mono text-[11px] text-blue-700 bg-white p-1 rounded border border-slate-200 block">
              python train_model.py
            </code>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-1">3. Launch Prediction API</span>
            <code className="font-mono text-[11px] text-blue-700 bg-white p-1 rounded border border-slate-200 block">
              uvicorn app_api:app --reload
            </code>
          </div>
        </div>
      </div>

      {/* Code Viewer Container */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-lg overflow-hidden">
        {/* Tab Headers */}
        <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 gap-2">
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
            {PYTHON_CODE_FILES.map((file, idx) => {
              const isActive = activeFileIndex === idx;
              return (
                <button
                  key={file.filename}
                  onClick={() => {
                    setActiveFileIndex(idx);
                    setCopied(false);
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-blue-400 font-bold border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{file.filename}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-md border border-slate-700 transition-colors font-mono cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* File Description */}
        <div className="px-5 py-2 bg-slate-900/60 border-b border-slate-800/80 text-xs text-slate-400 flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>{activeFile.description}</span>
        </div>

        {/* Code Content */}
        <div className="p-5 max-h-[600px] overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed">
          <pre className="whitespace-pre-wrap">{activeFile.code}</pre>
        </div>
      </div>
    </div>
  );
};

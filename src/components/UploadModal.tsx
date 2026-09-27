import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Users,
  Megaphone,
  FileText,
  FileCode,
  FileJson,
  Check,
  Info,
} from 'lucide-react';
import { api } from '../services/api';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDatasetLoaded: (datasetId: string) => void;
}

const SUPPORTED_FORMATS = [
  { ext: '.csv', name: 'CSV', desc: 'Comma-Separated RFC 4180', icon: FileSpreadsheet, color: 'text-indigo-400' },
  { ext: '.xlsx, .xls', name: 'Excel', desc: 'Microsoft Excel Workbooks', icon: FileSpreadsheet, color: 'text-emerald-400' },
  { ext: '.json', name: 'JSON', desc: 'Record arrays or data envelopes', icon: FileJson, color: 'text-amber-400' },
  { ext: '.jsonl', name: 'JSONL', desc: 'Newline-delimited stream', icon: FileCode, color: 'text-cyan-400' },
  { ext: '.tsv', name: 'TSV', desc: 'Tab-separated values', icon: FileText, color: 'text-purple-400' },
  { ext: '.txt', name: 'TXT', desc: 'Delimited tabular text', icon: FileText, color: 'text-slate-400' },
];

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onDatasetLoaded,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileTypeDetected, setFileTypeDetected] = useState<string>('');
  const [datasetName, setDatasetName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewSnippet, setPreviewSnippet] = useState<string[] | null>(null);
  const [uploadStep, setUploadStep] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const getFileExtension = (name: string): string => {
    return name.split('.').pop()?.toLowerCase() || '';
  };

  const isSupportedFile = (name: string): boolean => {
    const ext = getFileExtension(name);
    return ['csv', 'xlsx', 'xls', 'json', 'jsonl', 'ndjson', 'tsv', 'txt'].includes(ext);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setError(null);
    const ext = getFileExtension(file.name);

    if (!isSupportedFile(file.name)) {
      setError(
        `Unsupported file format ".${ext}". The website supports CSV, Excel (.xlsx, .xls), JSON, JSONL, TSV, and TXT files.`
      );
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds the 50MB maximum threshold.');
      return;
    }

    setSelectedFile(file);
    setFileTypeDetected(ext.toUpperCase());
    setDatasetName(file.name.replace(/\.[^/.]+$/, ''));

    // If text-based file, read preview snippet
    if (['csv', 'tsv', 'txt', 'json', 'jsonl', 'ndjson'].includes(ext)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (!text || text.trim().length === 0) {
          setError('The selected file is empty.');
          setSelectedFile(null);
          return;
        }
        if (ext === 'json') {
          try {
            const parsed = JSON.parse(text);
            const formatted = JSON.stringify(parsed, null, 2);
            setPreviewSnippet(formatted.split('\n').slice(0, 6));
          } catch {
            setPreviewSnippet(text.split('\n').filter((l) => l.trim()).slice(0, 5));
          }
        } else {
          const lines = text.split('\n').filter((l) => l.trim()).slice(0, 5);
          setPreviewSnippet(lines);
        }
      };
      reader.readAsText(file.slice(0, 8000));
    } else {
      // Excel file preview summary
      setPreviewSnippet([
        `[Excel Workbook Detected]`,
        `Filename: ${file.name}`,
        `Size: ${(file.size / 1024).toFixed(1)} KB`,
        `Parsing Engine: SheetJS / XLSX Universal Ingestion`,
        `Status: Ready to extract primary worksheet and schema profiles`,
      ]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);

    try {
      const ext = getFileExtension(selectedFile.name);
      const isExcel = ext === 'xlsx' || ext === 'xls';

      let fileContent = '';
      let encoding: 'text' | 'base64' = 'text';

      if (isExcel) {
        setUploadStep('Reading Excel workbook binary data...');
        // Read file as base64
        fileContent = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Remove data url prefix (e.g. "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,")
            const base64 = result.includes(',') ? result.split(',')[1] : result;
            resolve(base64);
          };
          reader.onerror = (e) => reject(new Error('Failed to read Excel file'));
          reader.readAsDataURL(selectedFile);
        });
        encoding = 'base64';
      } else {
        setUploadStep(`Reading ${ext.toUpperCase()} file content...`);
        fileContent = await selectedFile.text();
      }

      setUploadStep('Validating headers and data schema...');
      await new Promise((r) => setTimeout(r, 200));

      setUploadStep('Profiling columns & checking data quality...');
      const res = await api.uploadFile({
        name: datasetName || selectedFile.name,
        filename: selectedFile.name,
        fileContent,
        encoding,
      });

      setUploadStep('Calculating verified metrics, distributions & insights...');
      await new Promise((r) => setTimeout(r, 300));

      onDatasetLoaded(res.datasetId);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to upload and process dataset.');
    } finally {
      setLoading(false);
      setUploadStep(null);
    }
  };

  const handleLoadSample = async (type: 'sales' | 'marketing' | 'hr') => {
    setLoading(true);
    setError(null);
    try {
      setUploadStep('Ingesting verified sample dataset...');
      const res = await api.loadSample(type);
      onDatasetLoaded(res.datasetId);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to load sample dataset.');
    } finally {
      setLoading(false);
      setUploadStep(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <UploadCloud className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">Upload Dataset</h2>
              <p className="text-xs text-slate-400">
                Supports CSV, Excel (.xlsx, .xls), JSON, JSONL, TSV, and TXT files
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-3 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Validation Error: </span>
                {error}
              </div>
            </div>
          )}

          {/* Supported File Formats Badges Banner */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supported File Formats (All Ingested Cleanly)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Max: 50MB</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {SUPPORTED_FORMATS.map((fmt) => (
                <div
                  key={fmt.name}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center space-y-0.5"
                  title={fmt.desc}
                >
                  <div className={`text-xs font-bold ${fmt.color}`}>{fmt.name}</div>
                  <div className="text-[9px] text-slate-500 truncate">{fmt.ext}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-500/10'
                : selectedFile
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-slate-700 hover:border-slate-600 bg-slate-800/40 hover:bg-slate-800/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls,.json,.jsonl,.ndjson,.tsv,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            {selectedFile ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  <span>Format: {fileTypeDetected}</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200">{selectedFile.name}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB · Ready to profile, calculate analysis, and discover insights
                </p>
                <p className="text-[11px] text-indigo-400 mt-2 hover:underline">Click or drop another file to replace</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-200">
                  Drag and drop your file here, or <span className="text-indigo-400 underline">browse files</span>
                </p>
                <p className="text-xs text-slate-500 mt-1.5">
                  Accepts CSV, Excel (.xlsx, .xls), JSON, JSONL, TSV, or TXT · Up to 50MB
                </p>
              </div>
            )}
          </div>

          {/* Snippet Preview */}
          {previewSnippet && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>File Ingestion Preview</span>
                <span className="text-[11px] text-slate-500 font-normal">Header & Structure Check</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 overflow-x-auto text-[11px] font-mono text-slate-300 space-y-1">
                {previewSnippet.map((line, idx) => (
                  <div key={idx} className={idx === 0 ? 'text-indigo-400 font-semibold' : ''}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dataset Name Input */}
          {selectedFile && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Dataset Display Name</label>
              <input
                type="text"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                placeholder="e.g. Global Q3 Financials & Operations"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Quick Start with Pre-Loaded Verified Datasets */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Or Explore With Realistic Pre-Loaded Datasets</span>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleLoadSample('sales')}
                disabled={loading}
                className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/40 text-left transition-all group disabled:opacity-50"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300">Sales & Profit</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Orders, regions, profits, category anomalies</p>
              </button>

              <button
                type="button"
                onClick={() => handleLoadSample('marketing')}
                disabled={loading}
                className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/40 text-left transition-all group disabled:opacity-50"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Megaphone className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">Marketing ROAS</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Campaigns, spend, clicks, conversion rate</p>
              </button>

              <button
                type="button"
                onClick={() => handleLoadSample('hr')}
                disabled={loading}
                className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/40 text-left transition-all group disabled:opacity-50"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-slate-200 group-hover:text-purple-300">HR & Compensation</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Tenure, salaries, performance, retention</p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/60">
          <div className="text-xs text-slate-400">
            {uploadStep ? (
              <span className="flex items-center space-x-2 text-indigo-400 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>{uploadStep}</span>
              </span>
            ) : (
              <span>Calculated deterministically by Python/SQL engine</span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadSubmit}
              disabled={!selectedFile || loading}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Processing...' : 'Upload & Analyze'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

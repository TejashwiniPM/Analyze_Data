import React from 'react';
import {
  UploadCloud,
  Sparkles,
  BarChart3,
  Search,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
  Database,
  ArrowRight,
  Layers,
  Zap,
  HelpCircle,
  FileText,
  Sliders,
  Lightbulb,
  FileSpreadsheet,
  FileJson,
  FileCode,
} from 'lucide-react';
import { NavigationTab } from '../types';

interface HomePageProps {
  onOpenUpload: () => void;
  onTrySample: () => void;
  onNavigate: (tab: NavigationTab) => void;
}

const SUPPORTED_FORMATS = [
  { name: 'CSV', ext: '.csv', desc: 'RFC 4180 comma-separated with auto-header profiling', icon: FileSpreadsheet, color: 'text-indigo-400', border: 'border-indigo-500/30' },
  { name: 'Excel', ext: '.xlsx, .xls', desc: 'Full workbook & worksheet ingestion with SheetJS', icon: FileSpreadsheet, color: 'text-emerald-400', border: 'border-emerald-500/30' },
  { name: 'JSON', ext: '.json', desc: 'Standard array of records or data envelope objects', icon: FileJson, color: 'text-amber-400', border: 'border-amber-500/30' },
  { name: 'JSONL', ext: '.jsonl, .ndjson', desc: 'Newline-delimited stream format for modern data pipes', icon: FileCode, color: 'text-cyan-400', border: 'border-cyan-500/30' },
  { name: 'TSV', ext: '.tsv', desc: 'Tab-delimited records with typed numerical casting', icon: FileText, color: 'text-purple-400', border: 'border-purple-500/30' },
  { name: 'TXT', ext: '.txt', desc: 'Tabular delimited text with automated separator detection', icon: FileText, color: 'text-slate-400', border: 'border-slate-500/30' },
];

export const HomePage: React.FC<HomePageProps> = ({
  onOpenUpload,
  onTrySample,
  onNavigate,
}) => {
  return (
    <div className="space-y-20 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center pt-8 pb-12 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-[#111439]/25 via-[#283287]/20 to-transparent blur-3xl rounded-full -z-10 pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Next-Generation Analytical Intelligence Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-100 max-w-4xl mx-auto leading-tight">
          Your <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">AI Data Analyst</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Upload your data. Understand what it means. Ask questions. Discover insights.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Open Live Dashboard</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white font-semibold text-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
          >
            <UploadCloud className="w-4 h-4 text-indigo-400" />
            <span>Upload Dataset</span>
          </button>

          <button
            onClick={onTrySample}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white font-semibold text-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Try Sample Dataset</span>
          </button>
        </div>

        {/* Quick Access to Live Dashboards */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-xs font-semibold text-slate-200 flex items-center space-x-2 transition-all shadow-md group"
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>KPI Dashboard</span>
            <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400" />
          </button>

          <button
            onClick={() => onNavigate('analysis')}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-xs font-semibold text-slate-200 flex items-center space-x-2 transition-all shadow-md group"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Analysis Dashboard (Correlations & Pivot)</span>
            <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
          </button>

          <button
            onClick={() => onNavigate('insights')}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-xs font-semibold text-slate-200 flex items-center space-x-2 transition-all shadow-md group"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Insights Dashboard (Verified Findings)</span>
            <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
          </button>
        </div>

        {/* Core Architecture Principle Card */}
        <div className="mt-12 max-w-2xl mx-auto p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-2xl shadow-indigo-500/5">
          <div className="flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Guaranteed Calculation Integrity</span>
          </div>
          <p className="text-base sm:text-lg font-semibold text-slate-100">
            &ldquo;Python/SQL calculates the facts. AI explains the facts.&rdquo;
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic computational math prevents LLM hallucinations. AI clarifies verified results into clear business intelligence.
          </p>
        </div>
      </section>

      {/* Visual Workflow Flow */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            The Product Journey
          </h2>
          <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-100">
            How Analyze Data Works
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Analyze Data combines traditional data analysis with AI-powered explanations so users can understand their data without needing to write complex SQL or Python code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Step 1: Upload */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="text-[10px] font-bold uppercase text-indigo-400 tracking-wider">Step 1</div>
            <h4 className="text-base font-bold text-slate-100 mt-1">Upload Any Format</h4>
            <p className="text-xs text-slate-400 mt-2">
              Ingest CSV, Excel (.xlsx/.xls), JSON, JSONL, TSV, or TXT. Automated schema and delimiter parsing.
            </p>
          </div>

          {/* Step 2: Analyze */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6" />
            </div>
            <div className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider">Step 2</div>
            <h4 className="text-base font-bold text-slate-100 mt-1">Analyze</h4>
            <p className="text-xs text-slate-400 mt-2">
              Python/SQL calculations determine profiles, quality scores (0-100), statistical distributions, and KPIs.
            </p>
          </div>

          {/* Step 3: Visualize */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="text-[10px] font-bold uppercase text-teal-400 tracking-wider">Step 3</div>
            <h4 className="text-base font-bold text-slate-100 mt-1">Visualize</h4>
            <p className="text-xs text-slate-400 mt-2">
              Charts are auto-assembled: monthly time-series, categorical comparisons, rankings, and histograms.
            </p>
          </div>

          {/* Step 4: Understand */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col items-center text-center group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div className="text-[10px] font-bold uppercase text-purple-400 tracking-wider">Step 4</div>
            <h4 className="text-base font-bold text-slate-100 mt-1">Understand</h4>
            <p className="text-xs text-slate-400 mt-2">
              AI translates calculated facts into actionable narratives, answers natural language questions, and generates reports.
            </p>
          </div>
        </div>
      </section>

      {/* Supported File Formats Section */}
      <section className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Universal Ingestion Pipeline</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
              Supported File Formats & Compatibility
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Drop any structured dataset directly into Analyze Data. We automatically parse delimiters, cast types, infer identifiers and dates, and generate deterministic mathematical statistics.
            </p>
          </div>

          <button
            onClick={onOpenUpload}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 transition-all flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Any Supported File</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {SUPPORTED_FORMATS.map((fmt) => {
            const Icon = fmt.icon;
            return (
              <div
                key={fmt.name}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className={`w-4 h-4 ${fmt.color}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{fmt.name}</h4>
                      <code className="text-[10px] text-slate-500 font-mono">{fmt.ext}</code>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Ready
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{fmt.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Analysis Dashboard Pillar */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 flex flex-col justify-between space-y-4 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Deep Statistical Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore Pearson correlation matrices, descriptive measure statistics (Mean, Median, Std Dev, Q1, Q3), and interactive 2-way Cross-Tabulation Pivot matrices.
            </p>
          </div>
          <button
            onClick={() => onNavigate('analysis')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1.5 transition-colors"
          >
            <span>Open Analysis Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Insights Dashboard Pillar */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 flex flex-col justify-between space-y-4 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Verified Insights Dashboard</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthesizes calculated facts, contextual interpretations, and boundaries. Delivers high-impact strategic playbooks and executive action recommendations.
            </p>
          </div>
          <button
            onClick={() => onNavigate('insights')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1.5 transition-colors"
          >
            <span>Open Insights Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Data Quality Pillar */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 flex flex-col justify-between space-y-4 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Data Quality & Auto-Cleaning</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detect duplicate rows, inconsistent casing, statistical outliers, and missing cells before making strategic decisions. Clean datasets with 1-click transparency.
            </p>
          </div>
          <button
            onClick={() => onNavigate('quality')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1.5 transition-colors"
          >
            <span>Explore Data Quality Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Ask My Data Pillar */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 flex flex-col justify-between space-y-4 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Ask My Data in Plain English</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask &ldquo;Why did revenue decline in March?&rdquo; or &ldquo;Which region performed best?&rdquo; The backend calculates exact answers before AI explains them.
            </p>
          </div>
          <button
            onClick={() => onNavigate('ask')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1.5 transition-colors"
          >
            <span>Open Ask My Data Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Executive Management Reports Pillar */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 flex flex-col justify-between space-y-4 transition-all md:col-span-2 lg:col-span-2">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Executive Management Reports</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate boardroom-ready briefing memos featuring executive summaries, key trends, segment winners, anomalies, and recommended investigative follow-ups.
            </p>
          </div>
          <button
            onClick={() => onNavigate('reports')}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center space-x-1.5 transition-colors"
          >
            <span>Generate Business Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Trust & Discipline Banner */}
      <section className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
          Built for High Trust Business Decisions
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Every AI insight separates <strong>FACT</strong> (the calculated numbers), <strong>INTERPRETATION</strong> (the pattern context), and <strong>LIMITATION</strong> (what the dataset cannot prove). No false causation. No hallucinations.
        </p>
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            View Active Analytics Dashboard
          </button>
        </div>
      </section>
    </div>
  );
};

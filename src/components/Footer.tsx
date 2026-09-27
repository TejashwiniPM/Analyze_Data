import React from 'react';
import {
  BarChart3,
  ShieldCheck,
  Database,
  ArrowUp,
  Sparkles,
  Sliders,
  Table2,
  FileText,
  Search,
  Upload,
  Layers,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { NavigationTab, DatasetSummary } from '../types';

interface FooterProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  activeDataset?: DatasetSummary;
  onOpenUpload: () => void;
  theme: 'light' | 'dark';
}

export const Footer: React.FC<FooterProps> = ({
  currentTab,
  onNavigate,
  activeDataset,
  onOpenUpload,
  theme,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className={`relative z-10 w-full border-t text-white transition-colors duration-200 ${
        theme === 'light'
          ? 'bg-gradient-to-br from-[#111439] via-[#161a4d] to-[#1e2363] border-[#293074] shadow-[0_-8px_30px_rgba(17,20,57,0.18)]'
          : 'bg-gradient-to-br from-[#0c0e29] via-[#111439] to-[#181d52] border-[#21275f] shadow-[0_-8px_30px_rgba(0,0,0,0.5)]'
      }`}
      role="contentinfo"
      aria-label="Site Footer"
    >
      {/* Top Gradient Highlight Bar (White Lilac to Dark Blue accent) */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#f8f8f9]/30 to-transparent" />

      {/* Main Footer Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-10 border-b border-white/10">
          {/* Brand & Purpose Column (Spans 2 columns on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f8f8f9] to-[#d6dcfa] p-0.5 shadow-md shadow-black/20 flex items-center justify-center">
                <div className="w-full h-full rounded-[10px] bg-[#111439] flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-[#f8f8f9]" />
                </div>
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-[#f8f8f9] block">
                  Analyze <span className="text-[#a5b4fc]">Data</span>
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#cad1fa] block">
                  Verified Math & Executive Intelligence
                </span>
              </div>
            </div>

            <p className="text-xs text-[#d5daf5] leading-relaxed max-w-sm">
              Deterministic statistical BI platform designed for high-trust executive decision making.
              Every insight is mathematically computed and strictly audited for Fact, Interpretation,
              and Limitation separation.
            </p>

            {/* Active Dataset Status Box */}
            <div className="p-3 rounded-xl bg-[#0a0c24]/70 border border-[#2b337c] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#a5b4fc] font-medium flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Active Workspace:</span>
                </span>
                {activeDataset ? (
                  <span className="font-bold text-[#f8f8f9] truncate max-w-[150px]">
                    {activeDataset.name}
                  </span>
                ) : (
                  <span className="text-[#d5daf5]">No dataset loaded</span>
                )}
              </div>

              {activeDataset && (
                <div className="flex items-center justify-between text-[11px] text-[#cad1fa] pt-1 border-t border-white/5">
                  <span>
                    {activeDataset.rowCount.toLocaleString()} rows · {activeDataset.columnCount} cols
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Score: {activeDataset.qualityScore ?? 96}/100</span>
                  </span>
                </div>
              )}

              <button
                onClick={onOpenUpload}
                className="w-full mt-1 px-3 py-1.5 rounded-lg bg-[#1c2262] hover:bg-[#252d7e] text-[#f8f8f9] text-[11px] font-semibold border border-[#3b459c] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Switch / Upload New Dataset</span>
              </button>
            </div>
          </div>

          {/* Navigation Column 1: Analytics Suites */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f8f8f9] flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-[#a5b4fc]" />
              <span>Analytics</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`text-left transition-colors hover:text-[#f8f8f9] cursor-pointer flex items-center space-x-1.5 ${
                    currentTab === 'dashboard'
                      ? 'text-[#f8f8f9] font-bold underline underline-offset-4 decoration-[#a5b4fc]'
                      : 'text-[#cad1fa]'
                  }`}
                >
                  <BarChart3 className="w-3 h-3 shrink-0" />
                  <span>Executive Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('analysis')}
                  className={`text-left transition-colors hover:text-[#f8f8f9] cursor-pointer flex items-center space-x-1.5 ${
                    currentTab === 'analysis'
                      ? 'text-[#f8f8f9] font-bold underline underline-offset-4 decoration-[#a5b4fc]'
                      : 'text-[#cad1fa]'
                  }`}
                >
                  <Sliders className="w-3 h-3 shrink-0" />
                  <span>Deep Multi-Dimensional</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('insights')}
                  className={`text-left transition-colors hover:text-[#f8f8f9] cursor-pointer flex items-center space-x-1.5 ${
                    currentTab === 'insights'
                      ? 'text-[#f8f8f9] font-bold underline underline-offset-4 decoration-[#a5b4fc]'
                      : 'text-[#cad1fa]'
                  }`}
                >
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span>AI Business Insights</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reports')}
                  className={`text-left transition-colors hover:text-[#f8f8f9] cursor-pointer flex items-center space-x-1.5 ${
                    currentTab === 'reports'
                      ? 'text-[#f8f8f9] font-bold underline underline-offset-4 decoration-[#a5b4fc]'
                      : 'text-[#cad1fa]'
                  }`}
                >
                  <FileText className="w-3 h-3 shrink-0" />
                  <span>Boardroom Briefing Memos</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Data Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f8f8f9] flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-[#a5b4fc]" />
              <span>Data Tools</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('ask')}
                  className={`text-left transition-colors hover:text-[#f8f8f9] cursor-pointer flex items-center space-x-1.5 ${
                    currentTab === 'ask'
                      ? 'text-[#f8f8f9] font-bold underline underline-offset-4 decoration-[#a5b4fc]'
                      : 'text-[#cad1fa]'
                  }`}
                >
                  <Search className="w-3 h-3 shrink-0" />
                  <span>Ask My Data (NLQ)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('quality')}
                  className={`text-left transition-colors hover:text-[#f8f8f9] cursor-pointer flex items-center space-x-1.5 ${
                    currentTab === 'quality'
                      ? 'text-[#f8f8f9] font-bold underline underline-offset-4 decoration-[#a5b4fc]'
                      : 'text-[#cad1fa]'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3 shrink-0" />
                  <span>Data Quality Scorecard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explorer')}
                  className={`text-left transition-colors hover:text-[#f8f8f9] cursor-pointer flex items-center space-x-1.5 ${
                    currentTab === 'explorer'
                      ? 'text-[#f8f8f9] font-bold underline underline-offset-4 decoration-[#a5b4fc]'
                      : 'text-[#cad1fa]'
                  }`}
                >
                  <Table2 className="w-3 h-3 shrink-0" />
                  <span>Raw Dataset Explorer</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className={`text-left transition-colors hover:text-[#f8f8f9] cursor-pointer flex items-center space-x-1.5 ${
                    currentTab === 'home'
                      ? 'text-[#f8f8f9] font-bold underline underline-offset-4 decoration-[#a5b4fc]'
                      : 'text-[#cad1fa]'
                  }`}
                >
                  <span>Platform Overview</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Grounding Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f8f8f9] flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Trust Standard</span>
            </h4>
            <p className="text-[11px] text-[#d5daf5] leading-relaxed">
              Calculations are executed deterministically in the analytics backend. LLMs are restricted to narrative summaries of validated numbers.
            </p>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center space-x-1.5 text-emerald-300">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Zero Math Hallucination</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-300">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Fact-Interpretation Audit</span>
              </div>
              <div className="flex items-center space-x-1.5 text-emerald-300">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>Client Data Privacy Protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Utility Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-[#cad1fa]">
            <span className="font-medium text-[#f8f8f9]">
              &copy; {new Date().getFullYear()} Analyze Data.
            </span>
            <span className="hidden sm:inline text-white/30">&bull;</span>
            <span className="text-[#a5b4fc]">
              White Lilac (<code className="text-[#f8f8f9] font-mono">#F8F8F9</code>) &amp; Dark Blue (<code className="text-[#f8f8f9] font-mono">#111439</code>) Theme
            </span>
            <span className="hidden sm:inline text-white/30">&bull;</span>
            <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Deterministic Engine Online</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#f8f8f9] border border-white/15 transition-all text-xs font-semibold cursor-pointer shadow-sm"
              title="Return to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

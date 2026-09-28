import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Type,
  FilterX,
  Sparkles,
  RefreshCw,
  Clock,
  ArrowRight,
  BarChart3,
  Database,
  Sliders,
} from 'lucide-react';
import { api } from '../services/api';
import { DataQualityReport, DataQualityIssue, NavigationTab } from '../types';

interface DataQualityPageProps {
  datasetId: string;
  onRefreshDataset: () => void;
  onNavigate?: (tab: NavigationTab) => void;
}

export const DataQualityPage: React.FC<DataQualityPageProps> = ({ datasetId, onRefreshDataset, onNavigate }) => {
  const [report, setReport] = useState<DataQualityReport | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cleaningAction, setCleaningAction] = useState<string | null>(null);
  const [cleanSummary, setCleanSummary] = useState<string | null>(null);

  const loadQuality = async (overrideId?: string) => {
    const idToFetch = overrideId || datasetId;
    setLoading(true);
    try {
      const data = await api.getQuality(idToFetch);
      setReport(data.qualityReport);
      setHistory(data.cleaningHistory || []);
    } catch (err) {
      console.error(err);
      if (idToFetch !== 'sales-default-01') {
        try {
          const fallback = await api.getQuality('sales-default-01');
          setReport(fallback.qualityReport);
          setHistory(fallback.cleaningHistory || []);
        } catch {
          // ignore
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (datasetId) loadQuality();
  }, [datasetId]);

  const handleApplyClean = async (action: 'remove_duplicates' | 'normalize_categories' | 'drop_missing' | 'all') => {
    setCleaningAction(action);
    setCleanSummary(null);
    try {
      const res = await api.cleanData(datasetId, action);
      setCleanSummary(res.summary);
      setReport(res.qualityReport);
      onRefreshDataset();
      await loadQuality();
    } catch (err: any) {
      alert(err.message || 'Cleaning failed');
    } finally {
      setCleaningAction(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-4 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-300">Auditing dataset quality & consistency checks...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <h3 className="text-xl font-bold text-slate-100">Quality Audit Unavailable</h3>
        <p className="text-xs text-slate-400">Could not retrieve quality metrics for the current dataset.</p>
        <div className="flex items-center justify-center gap-3">
          {onNavigate && (
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Open KPI Dashboard</span>
            </button>
          )}
          <button
            onClick={() => loadQuality('sales-default-01')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            Load Sample Quality Audit
          </button>
        </div>
      </div>
    );
  }

  const scoreColor =
    report.score >= 85
      ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
      : report.score >= 70
      ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
      : 'text-rose-400 border-rose-500/30 bg-rose-500/10';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header and Quality Gauge */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Automated Data Hygiene & Quality Audit</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Data Quality Assessment
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Clean datasets produce trustworthy business insights. Never silently modify data—all hygiene corrections are tracked and verified.
          </p>
        </div>

        {/* Score Badge */}
        <div className={`p-4 rounded-2xl border flex items-center space-x-4 shrink-0 ${scoreColor}`}>
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Health Index</div>
            <div className="text-3xl font-black">{report.score} <span className="text-base font-normal">/ 100</span></div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-950/40 flex items-center justify-center font-bold text-lg">
            {report.score >= 85 ? 'A' : report.score >= 70 ? 'B' : 'C'}
          </div>
        </div>
      </div>

      {/* Cleaning Success Alert */}
      {cleanSummary && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{cleanSummary}</span>
          </div>
          <button
            onClick={() => setCleanSummary(null)}
            className="text-[11px] font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Interactive One-Click Cleaning Workbench */}
      <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Automated Data Cleaning Pipeline</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Run selective corrections with real-time before/after row count validation
            </p>
          </div>
          <button
            onClick={() => handleApplyClean('all')}
            disabled={!!cleaningAction}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply All Recommended Cleaners</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Action 1: Remove Duplicates */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span className="flex items-center space-x-1.5">
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Deduplication</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">{report.duplicateRowsCount} found</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Removes exact duplicate rows that inflate counts and skew metrics.
              </p>
            </div>
            <button
              onClick={() => handleApplyClean('remove_duplicates')}
              disabled={report.duplicateRowsCount === 0 || !!cleaningAction}
              className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {cleaningAction === 'remove_duplicates' ? 'Deduplicating...' : 'Remove Duplicates'}
            </button>
          </div>

          {/* Action 2: Normalize Casing & Spacing */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span className="flex items-center space-x-1.5">
                  <Type className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Normalize Casing</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Categories</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Standardizes &ldquo;furniture&rdquo; vs &ldquo;Furniture&rdquo; and trims stray whitespaces.
              </p>
            </div>
            <button
              onClick={() => handleApplyClean('normalize_categories')}
              disabled={!!cleaningAction}
              className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors disabled:opacity-40"
            >
              {cleaningAction === 'normalize_categories' ? 'Normalizing...' : 'Standardize Text'}
            </button>
          </div>

          {/* Action 3: Handle Incomplete Rows */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span className="flex items-center space-x-1.5">
                  <FilterX className="w-3.5 h-3.5 text-amber-400" />
                  <span>Handle Missing Rows</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">{report.missingPercentage}% missing</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Drops rows missing critical dimension values to ensure calculation purity.
              </p>
            </div>
            <button
              onClick={() => handleApplyClean('drop_missing')}
              disabled={report.missingValueCells === 0 || !!cleaningAction}
              className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {cleaningAction === 'drop_missing' ? 'Dropping...' : 'Drop Incomplete'}
            </button>
          </div>
        </div>
      </section>

      {/* Systematic Checks Grid */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Core Audit Checks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {report.checks.map((check, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start space-x-3"
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  check.passed
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {check.passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">{check.name}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{check.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detected Issues List */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Detected Quality Issues ({report.issues.length})
        </h2>

        {report.issues.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-200">No Quality Issues Detected</h4>
            <p className="text-xs text-slate-400">The current dataset satisfies all analytical consistency standards.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {report.issues.map((issue) => (
              <div
                key={issue.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        issue.severity === 'high'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : issue.severity === 'medium'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {issue.severity}
                    </span>
                    <h4 className="text-xs font-bold text-slate-100">{issue.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400">{issue.description}</p>
                </div>

                {issue.autoFixable && issue.fixAction && (
                  <button
                    onClick={() => handleApplyClean(issue.fixAction as any)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold border border-slate-700 transition-colors shrink-0"
                  >
                    Quick Fix
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cleaning History Trail */}
      {history.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Audit Trail & Cleaning History</span>
          </h2>
          <div className="space-y-2">
            {history.map((h, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between text-slate-300"
              >
                <div>
                  <span className="font-semibold text-slate-200">{h.summary}</span>
                  <span className="text-[11px] text-slate-500 ml-2">
                    (Rows: {h.rowsBefore} &rarr; {h.rowsAfter})
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(h.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

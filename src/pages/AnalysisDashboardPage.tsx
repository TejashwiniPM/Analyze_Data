import React, { useState, useEffect } from 'react';
import {
  GitCommit,
  TrendingUp,
  Table,
  BarChart2,
  Sliders,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Home,
  Filter,
  RefreshCw,
  Search,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  ChevronRight,
  Database,
  ArrowUpRight,
  ArrowDownRight,
  Maximize2,
} from 'lucide-react';
import { api } from '../services/api';
import {
  AnalysisBundle,
  CrossTabMatrix,
  CorrelationPair,
  NavigationTab,
} from '../types';

interface AnalysisDashboardPageProps {
  datasetId: string;
  onNavigate: (tab: NavigationTab, initialQuery?: string) => void;
}

export const AnalysisDashboardPage: React.FC<AnalysisDashboardPageProps> = ({
  datasetId,
  onNavigate,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisBundle | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'correlations' | 'distributions' | 'crosstab' | 'dimensions'>('correlations');

  // CrossTab dynamic state
  const [crossTab, setCrossTab] = useState<CrossTabMatrix | null>(null);
  const [selectedRowDim, setSelectedRowDim] = useState<string>('');
  const [selectedColDim, setSelectedColDim] = useState<string>('');
  const [selectedMeasure, setSelectedMeasure] = useState<string>('');
  const [loadingCrossTab, setLoadingCrossTab] = useState(false);

  // Search & filter
  const [correlationSearch, setCorrelationSearch] = useState('');
  const [selectedPair, setSelectedPair] = useState<CorrelationPair | null>(null);

  const loadAnalysis = async (overrideId?: string) => {
    const idToFetch = overrideId || datasetId;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAnalysis(idToFetch);
      setAnalysisData(data);
      if (data.defaultCrossTab) {
        setCrossTab(data.defaultCrossTab);
        setSelectedRowDim(data.defaultCrossTab.rowDimension);
        setSelectedColDim(data.defaultCrossTab.colDimension);
        setSelectedMeasure(data.defaultCrossTab.measure);
      } else if (data.dimensions.length >= 2 && data.measures.length >= 1) {
        setSelectedRowDim(data.dimensions[0]);
        setSelectedColDim(data.dimensions[1]);
        setSelectedMeasure(data.measures[0]);
      }
      if (data.correlations.length > 0) {
        setSelectedPair(data.correlations[0]);
      }
    } catch (err: any) {
      if (idToFetch !== 'sales-default-01') {
        try {
          const fallback = await api.getAnalysis('sales-default-01');
          setAnalysisData(fallback);
          if (fallback.defaultCrossTab) {
            setCrossTab(fallback.defaultCrossTab);
            setSelectedRowDim(fallback.defaultCrossTab.rowDimension);
            setSelectedColDim(fallback.defaultCrossTab.colDimension);
            setSelectedMeasure(fallback.defaultCrossTab.measure);
          }
          if (fallback.correlations.length > 0) {
            setSelectedPair(fallback.correlations[0]);
          }
          return;
        } catch {
          // ignore fallback error
        }
      }
      setError(err.message || 'Failed to load analysis dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (datasetId) {
      loadAnalysis();
    }
  }, [datasetId]);

  const handleUpdateCrossTab = async () => {
    if (!selectedRowDim || !selectedColDim || !selectedMeasure) return;
    setLoadingCrossTab(true);
    try {
      const matrix = await api.getCrossTab(datasetId, selectedRowDim, selectedColDim, selectedMeasure);
      setCrossTab(matrix);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingCrossTab(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-4 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-300">Computing mathematical analysis & statistical distributions...</p>
        <p className="text-xs text-slate-500">Calculating Pearson correlation matrix, descriptive statistics, and pivot aggregates</p>
      </div>
    );
  }

  if (error || !analysisData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/20">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-100">Unable to load statistical analysis</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">{error || 'Statistical analysis unavailable.'}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span>Open KPI Dashboard</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Home className="w-4 h-4 text-indigo-400" />
            <span>Home</span>
          </button>
          <button
            type="button"
            onClick={() => loadAnalysis('sales-default-01')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load Sample Analysis</span>
          </button>
          <button
            type="button"
            onClick={() => loadAnalysis()}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  const filteredCorrelations = analysisData.correlations.filter((pair) => {
    if (!correlationSearch) return true;
    const term = correlationSearch.toLowerCase();
    return (
      pair.measureA.toLowerCase().includes(term) ||
      pair.measureB.toLowerCase().includes(term) ||
      pair.interpretation.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner Header */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl shadow-indigo-500/5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-medium text-indigo-400">
            <Sliders className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Deep Statistical Analysis & Exploration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            {analysisData.name} — Statistical Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Deterministic descriptive statistics, cross-tabulation pivot tables, and Pearson correlation coefficients across verified numerical measures.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-center space-x-2">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              <strong>{analysisData.rowCount.toLocaleString()}</strong> rows · <strong>{analysisData.measures.length}</strong> measures
            </span>
          </div>

          <button
            onClick={() => onNavigate('ask', `Analyze key drivers and correlations in ${analysisData.name}`)}
            className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ask AI About Analysis</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('correlations')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeSubTab === 'correlations'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Correlations & Drivers ({analysisData.correlations.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('distributions')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeSubTab === 'distributions'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Measure Distributions ({analysisData.distributions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('crosstab')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeSubTab === 'crosstab'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>Multi-Dimensional Cross-Tab (Pivot)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('dimensions')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeSubTab === 'dimensions'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Dimensions & Pareto Breakdown ({analysisData.categoricalBreakdowns.length})</span>
        </button>
      </div>

      {/* VIEW 1: CORRELATIONS & DRIVERS */}
      {activeSubTab === 'correlations' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <span>Pearson Correlation Matrix & Drivers</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  Range: -1.00 to +1.00
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Quantifies linear relationships between numeric variables. High coefficients signify potential business levers.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search measures..."
                value={correlationSearch}
                onChange={(e) => setCorrelationSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {analysisData.correlations.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
              This dataset requires at least two numeric measure columns to compute correlation pairs.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Correlation List */}
              <div className="lg:col-span-2 space-y-3">
                {filteredCorrelations.map((pair, idx) => {
                  const isPositive = pair.coefficient > 0;
                  const isStrong = Math.abs(pair.coefficient) >= 0.7;
                  const isModerate = Math.abs(pair.coefficient) >= 0.3;
                  const isSelected =
                    selectedPair?.measureA === pair.measureA && selectedPair?.measureB === pair.measureB;

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedPair(pair)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800/90 border-indigo-500 ring-1 ring-indigo-500'
                          : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-sm text-slate-200 truncate">
                              {pair.measureA.replace(/_/g, ' ')}
                            </span>
                            <span className="text-slate-500 text-xs">↔</span>
                            <span className="font-semibold text-sm text-slate-200 truncate">
                              {pair.measureB.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1">{pair.interpretation}</p>
                        </div>

                        <div className="flex items-center space-x-3 shrink-0">
                          <div className="text-right">
                            <div
                              className={`text-base font-bold font-mono ${
                                isPositive
                                  ? pair.coefficient >= 0.3
                                    ? 'text-emerald-400'
                                    : 'text-slate-300'
                                  : pair.coefficient <= -0.3
                                  ? 'text-rose-400'
                                  : 'text-slate-300'
                              }`}
                            >
                              {pair.coefficient > 0 ? `+${pair.coefficient.toFixed(2)}` : pair.coefficient.toFixed(2)}
                            </div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                              {pair.strength.replace(/_/g, ' ')}
                            </div>
                          </div>

                          <ChevronRight className="w-4 h-4 text-slate-600" />
                        </div>
                      </div>

                      {/* Bar indicator */}
                      <div className="mt-3 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                        <div className="w-1/2 flex justify-end">
                          {pair.coefficient < 0 && (
                            <div
                              className="h-full bg-rose-500 rounded-l-full"
                              style={{ width: `${Math.min(100, Math.abs(pair.coefficient) * 100)}%` }}
                            />
                          )}
                        </div>
                        <div className="w-1/2 flex justify-start">
                          {pair.coefficient > 0 && (
                            <div
                              className="h-full bg-emerald-500 rounded-r-full"
                              style={{ width: `${Math.min(100, pair.coefficient * 100)}%` }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detail Inspection Card */}
              {selectedPair && (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-6 h-fit sticky top-24">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Correlation Deep Dive</span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-100">
                        {selectedPair.measureA.replace(/_/g, ' ')} vs {selectedPair.measureB.replace(/_/g, ' ')}
                      </h4>
                      <div className="mt-2 flex items-center space-x-3">
                        <span className="text-2xl font-extrabold text-indigo-400 font-mono">
                          {selectedPair.coefficient > 0
                            ? `+${selectedPair.coefficient.toFixed(3)}`
                            : selectedPair.coefficient.toFixed(3)}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                          {selectedPair.strength.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Business Interpretation
                      </div>
                      <p>{selectedPair.interpretation}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
                      <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                        Statistical Boundary Note
                      </div>
                      Correlation establishes co-movement, not causation. Latent confounding variables or seasonality may influence both measures.
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      onNavigate(
                        'ask',
                        `What explains the correlation between ${selectedPair.measureA} and ${selectedPair.measureB}?`
                      )
                    }
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <span>Investigate This Driver in Ask My Data</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: DISTRIBUTIONS & DESCRIPTIVE STATS */}
      {activeSubTab === 'distributions' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Descriptive Statistics & Measure Distributions
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Exact calculations of Central Tendency (Mean, Median), Dispersion (Std Dev, Range), Quartiles (Q1, Q3), and Outliers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysisData.distributions.map((dist, idx) => {
              const iqr = dist.q3 - dist.q1;
              const range = dist.max - dist.min;

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                        {dist.column}
                      </span>
                      {dist.outlierCount > 0 && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {dist.outlierCount} outliers
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-slate-100">{dist.label}</h4>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                        <div className="text-[10px] text-slate-500 uppercase">Mean (Average)</div>
                        <div className="text-sm font-semibold text-slate-200 mt-0.5 font-mono">
                          {dist.mean.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                        <div className="text-[10px] text-slate-500 uppercase">Median (P50)</div>
                        <div className="text-sm font-semibold text-slate-200 mt-0.5 font-mono">
                          {dist.median.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                        <div className="text-[10px] text-slate-500 uppercase">Min / Max</div>
                        <div className="text-xs font-semibold text-slate-300 mt-0.5 font-mono">
                          {dist.min.toLocaleString()} — {dist.max.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                        <div className="text-[10px] text-slate-500 uppercase">Std Deviation (σ)</div>
                        <div className="text-xs font-semibold text-slate-300 mt-0.5 font-mono">
                          {dist.stdDev.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>

                    {/* Quartile Box Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>Min: {dist.min.toLocaleString()}</span>
                        <span>Q1: {dist.q1.toLocaleString()}</span>
                        <span>Q3: {dist.q3.toLocaleString()}</span>
                        <span>Max: {dist.max.toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-950 rounded-full border border-slate-800 relative overflow-hidden flex">
                        <div className="h-full bg-indigo-500/40 rounded-full w-full" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>IQR: {iqr.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
                    <button
                      onClick={() =>
                        onNavigate('ask', `Are there any unusual outliers in ${dist.column}?`)
                      }
                      className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
                    >
                      <span>Analyze Outliers</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: MULTI-DIMENSIONAL CROSS-TAB PIVOT */}
      {activeSubTab === 'crosstab' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <span>Interactive Pivot Matrix</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Calculated Deterministically
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Slice measures across any two categorical dimensions with automated row, column, and grand totals.
              </p>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Row Dimension (Vertical)</label>
                <select
                  value={selectedRowDim}
                  onChange={(e) => setSelectedRowDim(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select Row Dimension</option>
                  {analysisData.dimensions.map((dim) => (
                    <option key={dim} value={dim}>
                      {dim.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Column Dimension (Horizontal)</label>
                <select
                  value={selectedColDim}
                  onChange={(e) => setSelectedColDim(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select Column Dimension</option>
                  {analysisData.dimensions.map((dim) => (
                    <option key={dim} value={dim}>
                      {dim.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Measure Aggregation (Sum)</label>
                <select
                  value={selectedMeasure}
                  onChange={(e) => setSelectedMeasure(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select Numerical Measure</option>
                  {analysisData.measures.map((m) => (
                    <option key={m} value={m}>
                      {m.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleUpdateCrossTab}
                disabled={!selectedRowDim || !selectedColDim || !selectedMeasure || loadingCrossTab}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 disabled:opacity-50 flex items-center space-x-2 transition-all"
              >
                {loadingCrossTab ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sliders className="w-3.5 h-3.5" />
                )}
                <span>Generate Pivot Matrix</span>
              </button>
            </div>
          </div>

          {/* Pivot Table Rendering */}
          {crossTab && crossTab.rowKeys.length > 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="text-slate-300">
                  Showing <strong>{crossTab.measure.replace(/_/g, ' ')}</strong> grouped by{' '}
                  <span className="text-indigo-400 font-semibold">{crossTab.rowDimension.replace(/_/g, ' ')}</span> and{' '}
                  <span className="text-cyan-400 font-semibold">{crossTab.colDimension.replace(/_/g, ' ')}</span>
                </div>
                <div className="text-slate-400 font-mono">
                  Grand Total: <strong>{crossTab.grandTotal.toLocaleString()}</strong>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 border-b border-slate-800 font-semibold text-slate-300">
                    <tr>
                      <th className="p-3.5 font-bold text-indigo-400 uppercase tracking-wider sticky left-0 bg-slate-950 z-10 border-r border-slate-800">
                        {crossTab.rowDimension.replace(/_/g, ' ')}
                      </th>
                      {crossTab.colKeys.map((col) => (
                        <th key={col} className="p-3.5 text-right font-medium text-slate-300">
                          {col}
                        </th>
                      ))}
                      <th className="p-3.5 text-right font-bold text-slate-100 bg-slate-950/80 border-l border-slate-800">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {crossTab.rowKeys.map((rowKey) => {
                      const rowTotal = crossTab.rowTotals[rowKey] || 0;
                      return (
                        <tr key={rowKey} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5 font-semibold text-slate-200 sticky left-0 bg-slate-900 border-r border-slate-800 font-sans">
                            {rowKey}
                          </td>
                          {crossTab.colKeys.map((colKey) => {
                            const val = crossTab.matrix[rowKey]?.[colKey] || 0;
                            const maxRowVal = Math.max(...Object.values(crossTab.matrix[rowKey] || {}), 1);
                            const intensity = Math.min(1, val / maxRowVal);

                            return (
                              <td
                                key={colKey}
                                className="p-3.5 text-right text-slate-300 transition-colors"
                                style={{
                                  backgroundColor: val > 0 ? `rgba(99, 102, 241, ${intensity * 0.15})` : undefined,
                                }}
                              >
                                {val > 0 ? val.toLocaleString() : '—'}
                              </td>
                            );
                          })}
                          <td className="p-3.5 text-right font-bold text-indigo-400 bg-slate-950/50 border-l border-slate-800">
                            {rowTotal.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-950 border-t-2 border-slate-700 font-bold font-mono">
                    <tr>
                      <td className="p-3.5 text-slate-100 sticky left-0 bg-slate-950 font-sans border-r border-slate-800 uppercase tracking-wider text-[11px]">
                        Total ({crossTab.rowDimension.replace(/_/g, ' ')})
                      </td>
                      {crossTab.colKeys.map((colKey) => (
                        <td key={colKey} className="p-3.5 text-right text-slate-200">
                          {(crossTab.colTotals[colKey] || 0).toLocaleString()}
                        </td>
                      ))}
                      <td className="p-3.5 text-right text-emerald-400 border-l border-slate-800 text-sm">
                        {crossTab.grandTotal.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
              Select two categorical dimensions and a numerical measure above to compute the cross-tab pivot table.
            </div>
          )}
        </div>
      )}

      {/* VIEW 4: DIMENSIONS & PARETO BREAKDOWN */}
      {activeSubTab === 'dimensions' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Categorical Dimension Frequencies & Pareto Concentration
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies top volume segments, unique counts, modal categories, and percentage contributions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysisData.categoricalBreakdowns.map((cat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-100">{cat.label}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Column: <code className="text-indigo-400">{cat.column}</code>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                      {cat.uniqueCount} unique values
                    </span>
                  </div>
                </div>

                {cat.mode && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Most Frequent (Mode):</span>
                    <span className="font-semibold text-emerald-400">{cat.mode}</span>
                  </div>
                )}

                {/* Top Values Breakdown */}
                <div className="space-y-2.5 pt-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Top Segments (% of Rows)
                  </div>
                  {cat.topValues.slice(0, 6).map((item, itemIdx) => (
                    <div key={itemIdx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium truncate">{item.value}</span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {item.count.toLocaleString()} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                          style={{ width: `${Math.min(100, item.percentage)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

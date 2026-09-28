import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Home,
  ShieldCheck,
  RefreshCw,
  MessageSquareCode,
  FileText,
  Filter,
  Layers,
  Database,
  Calendar,
  AlertCircle,
  Sliders,
  Lightbulb,
} from 'lucide-react';
import { api } from '../services/api';
import { MetricCard } from '../components/MetricCard';
import { AnalyticalChart } from '../components/AnalyticalChart';
import { InsightCard } from '../components/InsightCard';
import { KPIItem, ChartDefinition, VerifiedInsight, NavigationTab } from '../types';

interface DashboardPageProps {
  datasetId: string;
  onNavigate: (tab: NavigationTab, initialQuery?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ datasetId, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<{
    name: string;
    rowCount: number;
    columnCount: number;
    qualityScore: number;
    kpis: KPIItem[];
    charts: ChartDefinition[];
    insights: VerifiedInsight[];
    quickQuestions: string[];
  } | null>(null);

  const [insightFilter, setInsightFilter] = useState<'all' | 'trend' | 'comparison' | 'ranking' | 'anomaly'>('all');

  const loadData = async (overrideId?: string) => {
    const idToFetch = overrideId || datasetId;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDashboard(idToFetch);
      setDashboardData(data);
    } catch (err: any) {
      // Automatic recovery: if specific dataset fails, try loading default sample sales dataset
      if (idToFetch !== 'sales-default-01') {
        try {
          const fallbackData = await api.getDashboard('sales-default-01');
          setDashboardData(fallbackData);
          return;
        } catch {
          // ignore fallback error and report primary error
        }
      }
      setError(err.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (datasetId) {
      loadData();
    }
  }, [datasetId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-4 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-300">Assembling verified metrics & analytical dashboard...</p>
        <p className="text-xs text-slate-500">Executing deterministic profiling and generating chart definitions</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/20">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-100">Unable to load requested dashboard</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {error || 'The requested dataset could not be found or has expired from cache.'}
          </p>
        </div>

        {/* Clear recovery and navigation options */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Home className="w-4 h-4 text-indigo-400" />
            <span>Go to Home</span>
          </button>

          <button
            type="button"
            onClick={() => loadData('sales-default-01')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load Verified Sales Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => loadData()}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Load</span>
          </button>
        </div>
      </div>
    );
  }

  const filteredInsights = dashboardData.insights.filter((i) => {
    if (insightFilter === 'all') return true;
    return i.type === insightFilter;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 min-w-0">
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/80 border border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 shadow-xl shadow-indigo-500/5 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-400 mb-1 truncate">
            <Database className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Active Dataset</span>
            <span>•</span>
            <span className="text-slate-300 font-semibold truncate">{dashboardData.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight truncate">
            KPI & Analytics Dashboard
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
            <span>{dashboardData.rowCount.toLocaleString()} verified rows</span>
            <span>•</span>
            <span>{dashboardData.columnCount} columns</span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Quality Score: {dashboardData.qualityScore}/100</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Analyzed Today</span>
            </span>
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('analysis')}
            className="flex items-center space-x-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold transition-all hover:scale-102"
            title="Open Deep Statistical Analysis Dashboard"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Analysis</span>
          </button>
          <button
            onClick={() => onNavigate('insights')}
            className="flex items-center space-x-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-all hover:scale-102"
            title="Open Dedicated Insights Dashboard"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Insights</span>
          </button>
          <button
            onClick={() => onNavigate('ask')}
            className="flex items-center space-x-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold transition-all hover:scale-102"
          >
            <MessageSquareCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Ask My Data</span>
          </button>
        </div>
      </div>

      {/* 1. KPIs Section */}
      <section className="space-y-3 min-w-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 truncate">
            Key Performance Indicators (Calculated Facts)
          </h2>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline shrink-0">100% verified</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0">
          {dashboardData.kpis.map((kpi) => (
            <MetricCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      </section>

      {/* 2. Visualizations Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Automated Visualizations
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Assembled deterministically from schema measures and dimensions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dashboardData.charts.map((chart) => (
            <AnalyticalChart key={chart.id} chart={chart} height={290} />
          ))}
        </div>
      </section>

      {/* 3. AI Insights Feed */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                AI Insight Discoveries
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Grounded in Calculated Evidence
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Strictly structured into Fact, Interpretation, and Boundary Limitations
            </p>
          </div>

          {/* Filter tabs and Full Insights Dashboard Link */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs overflow-x-auto">
              {(['all', 'trend', 'comparison', 'ranking', 'anomaly'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setInsightFilter(tab)}
                  className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                    insightFilter === tab
                      ? 'bg-slate-800 text-slate-100 font-semibold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              onClick={() => onNavigate('insights')}
              className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all"
            >
              <span>View Full Insights Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </section>

      {/* 4. Quick Questions & Flagship Ask My Data Gateway */}
      <section className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Ask Your Data Anything
          </h3>
        </div>
        <p className="text-xs text-slate-400 max-w-xl">
          Click any prompt below or type your own custom question in plain English. Calculations are verified before AI explanation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
          {dashboardData.quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate('ask', q)}
              className="p-3 text-left rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/40 text-xs text-slate-200 hover:text-indigo-300 transition-all flex items-center justify-between group"
            >
              <span className="truncate pr-2">&ldquo;{q}&rdquo;</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

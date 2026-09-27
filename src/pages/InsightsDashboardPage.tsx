import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Award,
  Layers,
  Search,
  Filter,
  ArrowRight,
  Home,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Calendar,
  MessageSquareCode,
  SlidersHorizontal,
  ChevronRight,
  BarChart3,
  Lightbulb,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import {
  InsightsBundle,
  VerifiedInsight,
  StrategicAction,
  ChartDefinition,
  NavigationTab,
} from '../types';
import { AnalyticalChart } from '../components/AnalyticalChart';

interface InsightsDashboardPageProps {
  datasetId: string;
  onNavigate: (tab: NavigationTab, initialQuery?: string) => void;
}

export const InsightsDashboardPage: React.FC<InsightsDashboardPageProps> = ({
  datasetId,
  onNavigate,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bundle, setBundle] = useState<InsightsBundle | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [impactFilter, setImpactFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedActionId, setCopiedActionId] = useState<string | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<VerifiedInsight | null>(null);

  const loadInsights = async (overrideId?: string) => {
    const idToFetch = overrideId || datasetId;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getInsightsBundle(idToFetch);
      setBundle(data);
      if (data.insights.length > 0) {
        setSelectedInsight(data.insights[0]);
      }
    } catch (err: any) {
      if (idToFetch !== 'sales-default-01') {
        try {
          const fallback = await api.getInsightsBundle('sales-default-01');
          setBundle(fallback);
          if (fallback.insights.length > 0) {
            setSelectedInsight(fallback.insights[0]);
          }
          return;
        } catch {
          // ignore fallback error
        }
      }
      setError(err.message || 'Failed to load insights dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (datasetId) {
      loadInsights();
    }
  }, [datasetId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-4 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-300">Generating grounded insights & strategic playbooks...</p>
        <p className="text-xs text-slate-500">Synthesizing verified calculations, contextual interpretations, and boundaries</p>
      </div>
    );
  }

  if (error || !bundle) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/20">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-100">Unable to load insights dashboard</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">{error || 'Insights data unavailable.'}</p>
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
            onClick={() => loadInsights('sales-default-01')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load Sample Insights</span>
          </button>
          <button
            type="button"
            onClick={() => loadInsights()}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  const filteredInsights = bundle.insights.filter((item) => {
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchFact = item.fact.toLowerCase().includes(q);
      const matchInterp = item.interpretation.toLowerCase().includes(q);
      if (!matchTitle && !matchFact && !matchInterp) return false;
    }
    return true;
  });

  const filteredActions = bundle.strategicActions.filter((act) => {
    if (impactFilter !== 'all' && act.impact !== impactFilter) return false;
    return true;
  });

  const handleCopyAction = (action: StrategicAction) => {
    const text = `### Strategic Action: ${action.title}\n- **Impact**: ${action.impact.toUpperCase()}\n- **Timeframe**: ${action.timeframe}\n- **Recommendation**: ${action.recommendation}\n- **Verified Fact**: ${action.factSummary}\n- **Limitation**: ${action.limitationNote}`;
    navigator.clipboard.writeText(text);
    setCopiedActionId(action.id);
    setTimeout(() => setCopiedActionId(null), 2000);
  };

  const getAssociatedChart = (insight: VerifiedInsight): ChartDefinition | undefined => {
    if (insight.recommendedChartId) {
      return bundle.charts.find((c) => c.id === insight.recommendedChartId);
    }
    return bundle.charts[0];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Workflow Stage & Next Navigation Alternative */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pb-1 border-b border-slate-800/40">
        <div className="flex items-center space-x-2 text-slate-400">
          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Pipeline:</span>
          <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold text-[11px]">
            Stage 3: Automated Intelligence & Synthesis
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => onNavigate('analysis')}
            className="text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-lg transition-colors font-medium cursor-pointer"
          >
            Analysis Deep Dive
          </button>
          <span className="text-slate-600">·</span>
          <button
            onClick={() => onNavigate('reports')}
            className="text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <span>Next: Management Report</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl shadow-indigo-500/5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-medium text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Verified Business Intelligence Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            {bundle.name} — Insights Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Every insight follows strict epistemic discipline: <strong>FACT</strong> (verified computation), <strong>INTERPRETATION</strong> (context), <strong>LIMITATION</strong> (boundary), and <strong>STRATEGIC ACTION</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 border border-slate-700 font-medium">
            <strong>{bundle.stats.totalInsights}</strong> Verified Findings
          </div>
          <button
            onClick={() => onNavigate('ask', `Give me a comprehensive deep-dive on all insights for ${bundle.name}`)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 flex items-center space-x-1.5 transition-all"
          >
            <MessageSquareCode className="w-3.5 h-3.5" />
            <span>Ask AI About Insights</span>
          </button>
        </div>
      </div>

      {/* Insight Summary KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-100 font-mono">{bundle.stats.trendCount}</div>
            <div className="text-xs text-slate-400">Directional Trends</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-100 font-mono">{bundle.stats.anomalyCount}</div>
            <div className="text-xs text-slate-400">Anomalies Detected</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-100 font-mono">{bundle.stats.rankingCount}</div>
            <div className="text-xs text-slate-400">Top Performers</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-100 font-mono">{bundle.strategicActions.length}</div>
            <div className="text-xs text-slate-400">Strategic Playbooks</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Findings' },
            { id: 'trend', label: 'Trends' },
            { id: 'ranking', label: 'Rankings' },
            { id: 'comparison', label: 'Comparisons' },
            { id: 'anomaly', label: 'Anomalies' },
            { id: 'contribution', label: 'Contributions' },
            { id: 'relationship', label: 'Correlations' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                typeFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search verified insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Main Insights Grid */}
      <div className="space-y-6">
        {filteredInsights.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
            No insights found matching your current filter criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInsights.map((insight) => {
              const chart = getAssociatedChart(insight);
              const isAnomaly = insight.type === 'anomaly';
              const isTrend = insight.type === 'trend';

              return (
                <div
                  key={insight.id}
                  className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-5 shadow-xl shadow-black/20"
                >
                  <div className="space-y-4">
                    {/* Badge & Type */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            isAnomaly
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : isTrend
                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}
                        >
                          {insight.type.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 font-mono">
                          ID: {insight.id}
                        </span>
                      </div>

                      <button
                        onClick={() => onNavigate('ask', `Explain why: "${insight.title}"`)}
                        className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                      >
                        <span>Ask AI</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-slate-100">{insight.title}</h3>

                    {/* Section 1: VERIFIED FACT */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Calculated Ground Truth Fact</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-mono">{insight.fact}</p>
                    </div>

                    {/* Evidence Points */}
                    {insight.evidence && insight.evidence.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {insight.evidence.map((ev, evIdx) => (
                          <div
                            key={evIdx}
                            className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs"
                          >
                            <span className="text-[10px] text-slate-400 block truncate">{ev.label}</span>
                            <span className="text-xs font-bold text-slate-200 font-mono">
                              {typeof ev.value === 'number' ? ev.value.toLocaleString() : ev.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Section 2: INTERPRETATION */}
                    <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-1">
                      <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Contextual Interpretation</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{insight.interpretation}</p>
                    </div>

                    {/* Section 3: LIMITATION */}
                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-[11px] text-amber-200/90 leading-relaxed space-y-0.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        Boundary & Limitation
                      </div>
                      <p>{insight.limitation}</p>
                    </div>

                    {/* Associated Visual Chart */}
                    {chart && (
                      <div className="pt-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
                          <span>Supporting Evidence Visual</span>
                          <span className="text-indigo-400 font-normal">{chart.title}</span>
                        </div>
                        <div className="rounded-xl border border-slate-800 bg-slate-950 p-2 overflow-hidden">
                          <AnalyticalChart chart={chart} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* STRATEGIC ACTION PLAYBOOK SECTION */}
      <section className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Executive Action Playbook</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
              Prescribed Strategic Recommendations
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Concrete operational playbooks derived from calculated facts and verified statistical patterns.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {(['all', 'high', 'medium'] as const).map((imp) => (
              <button
                key={imp}
                onClick={() => setImpactFilter(imp)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  impactFilter === imp
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {imp === 'all' ? 'All Priorities' : `${imp} Impact`}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredActions.map((action) => {
            const isCopied = copiedActionId === action.id;

            return (
              <div
                key={action.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        action.impact === 'high'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {action.impact} Impact
                    </span>
                    <span className="text-xs text-indigo-400 font-semibold flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{action.timeframe}</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100">{action.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{action.recommendation}</p>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 font-mono">
                    <span className="text-emerald-400 font-semibold block text-[10px] uppercase">
                      Grounded In Fact:
                    </span>
                    {action.factSummary}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleCopyAction(action)}
                    className="text-slate-400 hover:text-slate-200 flex items-center space-x-1.5 transition-colors"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied Playbook' : 'Copy Action'}</span>
                  </button>

                  <button
                    onClick={() => onNavigate('ask', `How should we implement: "${action.title}"?`)}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
                  >
                    <span>Execute in Ask My Data</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

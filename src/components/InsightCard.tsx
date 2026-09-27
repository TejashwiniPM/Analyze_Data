import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Award,
  Layers,
  HelpCircle,
  CheckCircle,
  Info,
} from 'lucide-react';
import { VerifiedInsight } from '../types';

interface InsightCardProps {
  insight: VerifiedInsight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const getTypeBadge = () => {
    switch (insight.type) {
      case 'trend':
        return {
          icon: <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />,
          label: 'Trend Discovery',
          style: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
        };
      case 'ranking':
        return {
          icon: <Award className="w-3.5 h-3.5 text-amber-400" />,
          label: 'Top Performer',
          style: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
        };
      case 'anomaly':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
          label: 'Statistical Anomaly',
          style: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
        };
      case 'comparison':
        return {
          icon: <Layers className="w-3.5 h-3.5 text-indigo-400" />,
          label: 'Comparative Analysis',
          style: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
        };
      default:
        return {
          icon: <Info className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'Data Finding',
          style: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
        };
    }
  };

  const badge = getTypeBadge();

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between space-y-4">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${badge.style}`}
          >
            {badge.icon}
            <span>{badge.label}</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>Verified Fact</span>
          </span>
        </div>

        <h4 className="mt-2.5 text-sm font-bold text-slate-100 leading-snug">
          {insight.title}
        </h4>
      </div>

      {/* Strict FACT / INTERPRETATION / LIMITATION Breakdown */}
      <div className="space-y-2.5 text-xs">
        {/* FACT */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
          <div className="flex items-center space-x-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Fact (Directly Calculated)</span>
          </div>
          <p className="text-slate-200 leading-relaxed font-medium">
            {insight.fact}
          </p>
        </div>

        {/* INTERPRETATION */}
        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
          <div className="flex items-center space-x-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Interpretation (AI Business Context)</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {insight.interpretation}
          </p>
        </div>

        {/* LIMITATION */}
        <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-1">
          <div className="flex items-center space-x-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            <HelpCircle className="w-3 h-3 text-amber-400" />
            <span>Limitation (Boundary of Dataset)</span>
          </div>
          <p className="text-amber-200/80 text-[11px] leading-relaxed">
            {insight.limitation}
          </p>
        </div>
      </div>

      {/* Supporting Evidence Chips / Table */}
      {insight.evidence && insight.evidence.length > 0 && (
        <div className="pt-3 border-t border-slate-800/80">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Verified Computational Evidence
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {insight.evidence.map((ev, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60"
              >
                <div className="text-[10px] text-slate-400 truncate">{ev.label}</div>
                <div className="text-xs font-bold text-slate-100 font-mono mt-0.5">
                  {typeof ev.value === 'number' ? ev.value.toLocaleString() : ev.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

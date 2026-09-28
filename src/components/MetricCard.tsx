import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Hash, Percent, Scale } from 'lucide-react';
import { KPIItem } from '../types';

interface MetricCardProps {
  kpi: KPIItem;
}

export const MetricCard: React.FC<MetricCardProps> = ({ kpi }) => {
  const getIcon = () => {
    switch (kpi.metricType) {
      case 'currency':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'percentage':
        return <Percent className="w-4 h-4 text-indigo-400" />;
      case 'ratio':
        return <Scale className="w-4 h-4 text-cyan-400" />;
      default:
        return <Hash className="w-4 h-4 text-amber-400" />;
    }
  };

  const isUp = kpi.changeDirection === 'up';

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 transition-all hover:shadow-xl hover:shadow-indigo-500/5 group min-w-0">
      <div className="flex items-center justify-between min-w-0">
        <span className="text-xs font-medium text-slate-400 truncate flex-1 min-w-0 mr-2" title={kpi.title}>
          {kpi.title}
        </span>
        <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
          {getIcon()}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2 min-w-0">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 group-hover:text-indigo-200 transition-colors truncate">
          {kpi.formattedValue}
        </h3>
        {kpi.change !== undefined && (
          <div
            className={`flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
              isUp
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(kpi.change)}%</span>
          </div>
        )}
      </div>

      <p className="mt-2 text-[11px] text-slate-400 line-clamp-1" title={kpi.description}>
        {kpi.description}
      </p>
    </div>
  );
};

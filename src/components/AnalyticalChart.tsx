import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { ChartDefinition } from '../types';

interface AnalyticalChartProps {
  chart: ChartDefinition;
  height?: number;
}

export const AnalyticalChart: React.FC<AnalyticalChartProps> = ({ chart, height = 280 }) => {
  const isCurrency = chart.meta?.yFormat === 'currency';
  const isLight = typeof document !== 'undefined' && (document.body.classList.contains('theme-light') || document.body.classList.contains('theme-light-brown') || !document.body.classList.contains('theme-dark'));

  const formatYAxis = (val: any) => {
    if (typeof val !== 'number') return val;
    if (Math.abs(val) >= 1_000_000) return `${isCurrency ? '$' : ''}${(val / 1_000_000).toFixed(1)}M`;
    if (Math.abs(val) >= 1_000) return `${isCurrency ? '$' : ''}${(val / 1_000).toFixed(0)}k`;
    return `${isCurrency ? '$' : ''}${val}`;
  };

  const customTooltipFormatter = (val: any, name: any) => {
    if (typeof val === 'number') {
      const formatted = isCurrency ? `$${val.toLocaleString()}` : val.toLocaleString();
      return [formatted, String(name).replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())];
    }
    return [val, name];
  };

  // Accessible, high-contrast color palette for White Lilac (#F8F8F9) and Dark Blue (#111439) theme
  const colors = isLight
    ? ['#111439', '#25308b', '#0e6b66', '#521c7a', '#b45309']
    : ['#f8f8f9', '#818cf8', '#38bdf8', '#34d399', '#fbbf24'];

  const gridStroke = isLight ? '#d0d5ec' : '#22295d';
  const axisStroke = isLight ? '#374182' : '#8690c2';
  const tickFill = isLight ? '#111439' : '#f8f8f9';
  const tooltipStyle = isLight
    ? {
        backgroundColor: '#f8f8f9',
        borderColor: '#b9c2eb',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(17, 20, 57, 0.15)',
        fontSize: '12px',
        color: '#111439',
      }
    : {
        backgroundColor: '#111439',
        borderColor: 'rgba(248, 248, 249, 0.2)',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6)',
        fontSize: '12px',
        color: '#f8f8f9',
      };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-100">{chart.title}</h4>
        <p className="text-xs text-slate-400 mt-0.5">{chart.description}</p>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          {chart.chartType === 'line' ? (
            <LineChart data={chart.data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.6} />
              <XAxis
                dataKey={chart.xAxis}
                stroke={axisStroke}
                tick={{ fontSize: 11, fill: tickFill }}
                tickLine={false}
              />
              <YAxis
                stroke={axisStroke}
                tick={{ fontSize: 11, fill: tickFill }}
                tickLine={false}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={customTooltipFormatter}
              />
              {chart.seriesKeys && chart.seriesKeys.length > 1 && <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />}
              {(chart.seriesKeys || [chart.yAxis]).map((key, idx) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[idx % colors.length]}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: colors[idx % colors.length] }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          ) : (
            <BarChart data={chart.data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.6} />
              <XAxis
                dataKey={chart.xAxis}
                stroke={axisStroke}
                tick={{ fontSize: 11, fill: tickFill }}
                tickLine={false}
              />
              <YAxis
                stroke={axisStroke}
                tick={{ fontSize: 11, fill: tickFill }}
                tickLine={false}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={customTooltipFormatter}
              />
              {chart.seriesKeys && chart.seriesKeys.length > 1 && <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />}
              {(chart.seriesKeys || [chart.yAxis]).map((key, idx) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[idx % colors.length]}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={45}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

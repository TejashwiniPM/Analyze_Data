import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
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
  theme?: 'light' | 'dark';
}

export const AnalyticalChart: React.FC<AnalyticalChartProps> = ({
  chart,
  height = 280,
  theme: propTheme,
}) => {
  // Reactive theme tracking: supports prop or observes document.body classList
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>(() => {
    if (propTheme) return propTheme;
    if (typeof document !== 'undefined') {
      return document.body.classList.contains('theme-dark') ||
        document.body.classList.contains('theme-dark-blue-gradient')
        ? 'dark'
        : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (propTheme) {
      setActiveTheme(propTheme);
      return;
    }

    const checkTheme = () => {
      if (typeof document !== 'undefined') {
        const isDark =
          document.body.classList.contains('theme-dark') ||
          document.body.classList.contains('theme-dark-blue-gradient');
        setActiveTheme(isDark ? 'dark' : 'light');
      }
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, [propTheme]);

  const isLight = activeTheme === 'light';
  const isCurrency = chart.meta?.yFormat === 'currency';

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

  // High-contrast, WCAG AAA compliant vibrant analytical palettes
  // Light Theme: Rich, saturated jewel tones that pop crisply on White/Lilac surfaces
  // Dark Theme: Radiant, luminous neon-accented tones that glow crisply on Dark Blue surfaces
  const colors = isLight
    ? [
        '#2563eb', // Royal Blue
        '#0891b2', // Deep Cyan
        '#059669', // Emerald Green
        '#d97706', // Amber Gold
        '#7c3aed', // Vivid Violet
        '#e11d48', // Rose Red
        '#4f46e5', // Indigo
        '#0d9488', // Teal
      ]
    : [
        '#60a5fa', // Electric Sky Blue
        '#38bdf8', // Luminous Cyan
        '#34d399', // Mint Emerald
        '#fbbf24', // Radiant Amber Gold
        '#a78bfa', // Luminous Violet
        '#fb7185', // Radiant Rose
        '#818cf8', // Periwinkle Indigo
        '#2dd4bf', // Luminous Teal
      ];

  const gridStroke = isLight ? '#e2e8f0' : '#22295d';
  const axisStroke = isLight ? '#94a3b8' : '#64748b';
  const tickFill = isLight ? '#334155' : '#cbd5e1';

  const tooltipContentStyle: React.CSSProperties = isLight
    ? {
        backgroundColor: '#ffffff',
        borderColor: '#cbd5e1',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(17, 20, 57, 0.12), 0 4px 6px -2px rgba(17, 20, 57, 0.05)',
        fontSize: '12px',
        color: '#0f172a',
        padding: '8px 12px',
        border: '1px solid #e2e8f0',
      }
    : {
        backgroundColor: '#111439',
        borderColor: '#2b357e',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6)',
        fontSize: '12px',
        color: '#f8f8f9',
        padding: '8px 12px',
        border: '1px solid #374182',
      };

  const isMultiSeries = chart.seriesKeys && chart.seriesKeys.length > 1;
  const seriesKeys = chart.seriesKeys && chart.seriesKeys.length > 0 ? chart.seriesKeys : [chart.yAxis];

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl flex flex-col justify-between min-w-0 w-full overflow-hidden transition-colors duration-200 border ${
        isLight
          ? 'bg-white border-[#d0d5ec] shadow-xs'
          : 'bg-[#141846]/90 border-[#22295d] shadow-xl shadow-black/20'
      }`}
    >
      <div className="mb-4 min-w-0 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4
            className={`text-sm font-bold tracking-tight truncate ${
              isLight ? 'text-[#111439]' : 'text-[#f8f8f9]'
            }`}
          >
            {chart.title}
          </h4>
          <p
            className={`text-xs mt-0.5 line-clamp-2 ${
              isLight ? 'text-[#475569]' : 'text-[#9aa3ce]'
            }`}
          >
            {chart.description}
          </p>
        </div>
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 border ${
            isLight
              ? 'bg-[#f1f5f9] text-[#334155] border-[#cbd5e1]'
              : 'bg-[#1e2568] text-[#cad1fa] border-[#29327a]'
          }`}
        >
          {chart.chartType}
        </span>
      </div>

      <div className="w-full min-w-0" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {chart.chartType === 'line' ? (
            <LineChart data={chart.data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.7} />
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
                contentStyle={tooltipContentStyle}
                formatter={customTooltipFormatter}
                itemStyle={{ color: isLight ? '#0f172a' : '#f8f8f9', fontWeight: 600 }}
                labelStyle={{ color: isLight ? '#334155' : '#94a3b8', fontWeight: 700, marginBottom: '4px' }}
                cursor={{ stroke: isLight ? '#94a3b8' : '#475569', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              {isMultiSeries && (
                <Legend
                  wrapperStyle={{
                    fontSize: '11px',
                    paddingTop: '10px',
                    color: tickFill,
                  }}
                />
              )}
              {seriesKeys.map((key, idx) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[idx % colors.length]}
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: colors[idx % colors.length], strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: colors[idx % colors.length], stroke: isLight ? '#ffffff' : '#111439', strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          ) : (
            <BarChart data={chart.data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.7} />
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
                contentStyle={tooltipContentStyle}
                formatter={customTooltipFormatter}
                itemStyle={{ color: isLight ? '#0f172a' : '#f8f8f9', fontWeight: 600 }}
                labelStyle={{ color: isLight ? '#334155' : '#94a3b8', fontWeight: 700, marginBottom: '4px' }}
                cursor={{ fill: isLight ? 'rgba(37, 99, 235, 0.05)' : 'rgba(255, 255, 255, 0.05)' }}
              />
              {isMultiSeries && (
                <Legend
                  wrapperStyle={{
                    fontSize: '11px',
                    paddingTop: '10px',
                    color: tickFill,
                  }}
                />
              )}
              {isMultiSeries ? (
                seriesKeys.map((key, idx) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={colors[idx % colors.length]}
                    radius={[5, 5, 0, 0]}
                    maxBarSize={40}
                  />
                ))
              ) : (
                <Bar
                  dataKey={seriesKeys[0]}
                  radius={[5, 5, 0, 0]}
                  maxBarSize={45}
                >
                  {chart.data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Bar>
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

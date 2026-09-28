import React, { useState, useEffect } from 'react';
import {
  Table2,
  Search,
  Filter,
  Layers,
  Hash,
  Calendar,
  Tag,
  Key,
  ChevronLeft,
  ChevronRight,
  Database,
  BarChart3,
} from 'lucide-react';
import { api } from '../services/api';
import { ColumnProfile, DatasetDetail, NavigationTab } from '../types';

interface DatasetExplorerPageProps {
  datasetId: string;
  onNavigate?: (tab: NavigationTab) => void;
}

export const DatasetExplorerPage: React.FC<DatasetExplorerPageProps> = ({ datasetId, onNavigate }) => {
  const [dataset, setDataset] = useState<DatasetDetail | null>(null);
  const [profiles, setProfiles] = useState<ColumnProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'profiles' | 'preview'>('profiles');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const loadData = (overrideId?: string) => {
    const idToFetch = overrideId || datasetId;
    if (!idToFetch) return;
    setLoading(true);
    Promise.all([api.getDataset(idToFetch), api.getProfiles(idToFetch)])
      .then(([ds, profs]) => {
        setDataset(ds);
        setProfiles(profs.profiles);
      })
      .catch((err) => {
        console.error(err);
        if (idToFetch !== 'sales-default-01') {
          Promise.all([api.getDataset('sales-default-01'), api.getProfiles('sales-default-01')])
            .then(([ds, profs]) => {
              setDataset(ds);
              setProfiles(profs.profiles);
            })
            .catch(console.error);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [datasetId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-4 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-300">Profiling columns & statistical distribution...</p>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <h3 className="text-xl font-bold text-slate-100">Dataset Explorer Unavailable</h3>
        <p className="text-xs text-slate-400">Could not retrieve records for the current dataset.</p>
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
            onClick={() => loadData('sales-default-01')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            Load Sample Dataset
          </button>
        </div>
      </div>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Identifier':
        return <Key className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Date':
        return <Calendar className="w-3.5 h-3.5 text-teal-400" />;
      case 'Measure':
        return <Hash className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Tag className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  // Filter rows by search
  const filteredRows = dataset.sampleRows.filter((row) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return Object.values(row).some((val) => String(val).toLowerCase().includes(q));
  });

  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Dataset Structure & Statistics</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">{dataset.name}</h1>
          <p className="text-xs text-slate-400 mt-1">
            {dataset.rowCount.toLocaleString()} total rows · {dataset.columnCount} columns · {dataset.filename}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center space-x-1 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs self-start md:self-auto">
          <button
            onClick={() => setActiveTab('profiles')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
              activeTab === 'profiles' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Column Profiling ({profiles.length})
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
              activeTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tabular Preview ({dataset.sampleRows.length})
          </button>
        </div>
      </div>

      {activeTab === 'profiles' ? (
        /* Column Profiling Cards */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((col) => (
              <div
                key={col.name}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                      {getRoleIcon(col.role)}
                      <span>{col.role}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 capitalize">
                      {col.type}
                    </span>
                  </div>

                  <h3 className="mt-2.5 text-base font-bold text-slate-100 truncate font-mono">
                    {col.name}
                  </h3>
                </div>

                {/* Statistics Table */}
                <div className="space-y-1.5 text-xs border-t border-slate-800 pt-3">
                  <div className="flex justify-between text-slate-400">
                    <span>Unique Values:</span>
                    <span className="text-slate-200 font-mono font-semibold">{col.uniqueCount}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Missing Values:</span>
                    <span className={`font-mono font-semibold ${col.nullCount > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
                      {col.nullCount} ({col.nullPercentage}%)
                    </span>
                  </div>

                  {col.type === 'numeric' && (
                    <>
                      <div className="flex justify-between text-slate-400">
                        <span>Min / Max:</span>
                        <span className="text-slate-200 font-mono">
                          {col.min?.toLocaleString()} / {col.max?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Average (Mean):</span>
                        <span className="text-slate-200 font-mono font-semibold">{col.mean?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Median:</span>
                        <span className="text-slate-200 font-mono">{col.median?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Std Deviation:</span>
                        <span className="text-slate-200 font-mono">{col.stdDev?.toLocaleString()}</span>
                      </div>
                      {col.outlierCount !== undefined && col.outlierCount > 0 && (
                        <div className="flex justify-between text-rose-400">
                          <span>Outliers (&gt;1.5 IQR):</span>
                          <span className="font-mono font-bold">{col.outlierCount}</span>
                        </div>
                      )}
                    </>
                  )}

                  {col.type === 'date' && (
                    <div className="flex justify-between text-slate-400">
                      <span>Date Range:</span>
                      <span className="text-slate-200 font-mono text-[11px]">
                        {col.minDate} &rarr; {col.maxDate}
                      </span>
                    </div>
                  )}

                  {col.topValues && col.topValues.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[10px] uppercase font-semibold text-slate-500 mb-1">
                        Top Categories:
                      </div>
                      <div className="space-y-1">
                        {col.topValues.slice(0, 3).map((tv, idx) => (
                          <div key={idx} className="flex justify-between text-[11px] text-slate-300">
                            <span className="truncate pr-2">{tv.value || '(empty)'}</span>
                            <span className="text-slate-500 font-mono">{tv.count} ({tv.percentage}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sample values */}
                <div className="pt-2 border-t border-slate-800">
                  <div className="text-[10px] uppercase font-semibold text-slate-500 mb-1">Sample:</div>
                  <div className="flex flex-wrap gap-1">
                    {col.sampleValues.slice(0, 3).map((val, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono truncate max-w-[120px]">
                        {String(val)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Tabular Data View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search across all records..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="text-xs text-slate-400">
              Showing {paginatedRows.length} of {filteredRows.length} preview rows
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-semibold">#</th>
                    {dataset.headers.map((h) => (
                      <th key={h} className="px-4 py-3 font-semibold whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                  {paginatedRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-2.5 text-slate-500 text-[10px]">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      {dataset.headers.map((h) => (
                        <td key={h} className="px-4 py-2.5 whitespace-nowrap max-w-[200px] truncate">
                          {row[h] !== null && row[h] !== undefined ? String(row[h]) : <span className="text-slate-600 italic">null</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div>
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

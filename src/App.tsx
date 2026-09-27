/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  ChevronRight,
  Home,
  BarChart3,
  Database,
  Sliders,
  Lightbulb,
  Sparkles,
  ShieldCheck,
  Table2,
  FileText,
} from 'lucide-react';
import { api } from './services/api';
import { NavigationTab, DatasetSummary } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { UploadModal } from './components/UploadModal';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalysisDashboardPage } from './pages/AnalysisDashboardPage';
import { InsightsDashboardPage } from './pages/InsightsDashboardPage';
import { AskMyDataPage } from './pages/AskMyDataPage';
import { DataQualityPage } from './pages/DataQualityPage';
import { DatasetExplorerPage } from './pages/DatasetExplorerPage';
import { ReportsPage } from './pages/ReportsPage';

export default function App() {
  // Theme state: defaults to 'light' for crisp, accessible executive BI presentation
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  // Default to 'dashboard' so user sees the live analytics dashboard immediately
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [tabHistory, setTabHistory] = useState<NavigationTab[]>([]);
  const [datasets, setDatasets] = useState<DatasetSummary[]>([]);
  // Initialize with sales-default-01 so dashboard is immediately active and never shows empty/missing state
  const [activeDatasetId, setActiveDatasetId] = useState<string | null>('sales-default-01');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [initialAskQuery, setInitialAskQuery] = useState<string | undefined>(undefined);
  const [qualityScore, setQualityScore] = useState<number | undefined>(undefined);

  // Sync theme with body class
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('theme-eef8cd', 'theme-light-brown');
      if (theme === 'light') {
        document.body.classList.remove('theme-dark', 'theme-dark-blue-gradient');
        document.body.classList.add('theme-light', 'theme-lilac-gradient');
      } else {
        document.body.classList.remove('theme-light', 'theme-lilac-gradient');
        document.body.classList.add('theme-dark', 'theme-dark-blue-gradient');
      }
    }
  }, [theme]);

  // Fetch all datasets on mount
  const refreshDatasets = async (targetIdToSelect?: string) => {
    try {
      const list = await api.getDatasets();
      setDatasets(list);

      // Verify that targetId actually exists in the list
      let targetId: string | null = null;
      if (targetIdToSelect && list.some((d) => d.id === targetIdToSelect)) {
        targetId = targetIdToSelect;
      } else if (activeDatasetId && list.some((d) => d.id === activeDatasetId)) {
        targetId = activeDatasetId;
      } else if (list.length > 0) {
        targetId = list[0].id;
      } else {
        targetId = 'sales-default-01';
      }

      if (targetId) {
        setActiveDatasetId(targetId);
        const active = list.find((d) => d.id === targetId);
        if (active?.qualityScore !== undefined) {
          setQualityScore(active.qualityScore);
        }
      }
    } catch (err) {
      console.error('Failed to load datasets:', err);
    }
  };

  useEffect(() => {
    refreshDatasets();
  }, []);

  const handleSelectDataset = (id: string) => {
    setActiveDatasetId(id);
    const ds = datasets.find((d) => d.id === id);
    if (ds?.qualityScore !== undefined) {
      setQualityScore(ds.qualityScore);
    }
  };

  const handleDatasetLoaded = (newDatasetId: string) => {
    refreshDatasets(newDatasetId);
    handleNavigate('dashboard');
  };

  const handleNavigate = (tab: NavigationTab, initialQuery?: string) => {
    if (tab !== currentTab) {
      setTabHistory((prev) => [...prev, currentTab]);
    }
    if (initialQuery) {
      setInitialAskQuery(initialQuery);
    } else {
      setInitialAskQuery(undefined);
    }
    setCurrentTab(tab);
  };

  const handleBack = () => {
    if (tabHistory.length > 0) {
      const previous = tabHistory[tabHistory.length - 1];
      setTabHistory((h) => h.slice(0, -1));
      setInitialAskQuery(undefined);
      setCurrentTab(previous);
    } else if (currentTab !== 'home') {
      setCurrentTab('home');
    } else {
      setCurrentTab('dashboard');
    }
  };

  // Back option is ALWAYS available and functional across the app
  const canGoBack = true;

  const getTabLabel = (tab: NavigationTab): string => {
    switch (tab) {
      case 'home':
        return 'Home';
      case 'dashboard':
        return 'Dashboard';
      case 'analysis':
        return 'Analysis Dashboard';
      case 'insights':
        return 'Insights Dashboard';
      case 'ask':
        return 'Ask My Data';
      case 'quality':
        return 'Data Quality';
      case 'explorer':
        return 'Dataset Explorer';
      case 'reports':
        return 'Management Reports';
      default:
        return tab;
    }
  };

  const getTabIcon = (tab: NavigationTab) => {
    switch (tab) {
      case 'home':
        return Home;
      case 'dashboard':
        return BarChart3;
      case 'analysis':
        return Sliders;
      case 'insights':
        return Lightbulb;
      case 'ask':
        return Sparkles;
      case 'quality':
        return ShieldCheck;
      case 'explorer':
        return Table2;
      case 'reports':
        return FileText;
      default:
        return BarChart3;
    }
  };

  const previousTab = tabHistory.length > 0 ? tabHistory[tabHistory.length - 1] : null;
  const CurrentIcon = getTabIcon(currentTab);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-150 ${
        theme === 'light'
          ? 'theme-light theme-lilac-gradient text-[#111439] selection:bg-[#111439] selection:text-[#f8f8f9]'
          : 'theme-dark theme-dark-blue-gradient text-[#f8f8f9] selection:bg-[#f8f8f9] selection:text-[#111439]'
      }`}
    >
      {/* Top Persistent Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          handleNavigate(tab);
        }}
        datasets={datasets}
        activeDatasetId={activeDatasetId}
        onSelectDataset={handleSelectDataset}
        onOpenUpload={() => setUploadModalOpen(true)}
        qualityScore={qualityScore}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
      />

      {/* Universal Interactive Navigation Trail & Context Bar */}
      <div
        className={`border-b px-4 sm:px-6 lg:px-8 py-2.5 backdrop-blur-sm sticky top-16 z-30 transition-colors ${
          theme === 'light'
            ? 'bg-[#f8f8f9]/95 border-[#d0d5ec] text-[#111439] shadow-xs'
            : 'bg-[#111439]/90 border-[#22295d] text-[#f8f8f9]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          {/* Left: Interactive Hierarchical Breadcrumbs & Contextual Jump */}
          <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto min-w-0 py-0.5 no-scrollbar">
            {/* Clickable Breadcrumbs */}
            <nav className={`flex items-center space-x-1.5 whitespace-nowrap text-xs ${theme === 'light' ? 'text-[#242b65]' : 'text-[#d0d4ea]'}`}>
              <button
                type="button"
                onClick={() => handleNavigate('home')}
                className={`hover:opacity-80 transition-colors flex items-center space-x-1 px-2 py-1 rounded-md cursor-pointer ${
                  currentTab === 'home'
                    ? theme === 'light'
                      ? 'bg-[#edf0f8] text-[#111439] font-bold border border-[#d0d5ec] shadow-xs'
                      : 'bg-[#1e2568] text-[#f8f8f9] font-bold border border-[#374182]'
                    : theme === 'light'
                      ? 'hover:bg-[#edf0f8] text-[#242b65]'
                      : 'hover:bg-[#1a205a] text-[#d0d4ea]'
                }`}
                title="Go to Home overview"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>

              <ChevronRight className={`w-3.5 h-3.5 shrink-0 opacity-60 ${theme === 'light' ? 'text-[#374182]' : 'text-[#8690c2]'}`} />

              <button
                type="button"
                onClick={() => handleNavigate('dashboard')}
                className={`hover:opacity-80 transition-colors flex items-center space-x-1 px-2 py-1 rounded-md cursor-pointer ${
                  currentTab === 'dashboard'
                    ? theme === 'light'
                      ? 'bg-[#edf0f8] text-[#111439] font-bold border border-[#d0d5ec] shadow-xs'
                      : 'bg-[#1e2568] text-[#f8f8f9] font-bold border border-[#374182]'
                    : theme === 'light'
                      ? 'hover:bg-[#edf0f8] text-[#242b65]'
                      : 'hover:bg-[#1a205a] text-[#d0d4ea]'
                }`}
                title="Go to KPI Dashboard"
              >
                <Database className="w-3.5 h-3.5" />
                <span className="max-w-[140px] truncate sm:max-w-none">
                  {datasets.find((d) => d.id === activeDatasetId)?.name || 'Default Dataset'}
                </span>
              </button>

              {currentTab !== 'home' && currentTab !== 'dashboard' && (
                <>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 opacity-60 ${theme === 'light' ? 'text-[#374182]' : 'text-[#8690c2]'}`} />
                  <span
                    className={`flex items-center space-x-1.5 font-bold px-2.5 py-1 rounded-md border shadow-xs ${
                      theme === 'light'
                        ? 'bg-[#eceff9] text-[#111439] border-[#b9c2eb]'
                        : 'bg-[#242c7a]/60 text-[#f8f8f9] border-[#3e4ba8]'
                    }`}
                  >
                    <CurrentIcon className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-[#111439]' : 'text-[#f8f8f9]'}`} />
                    <span>{getTabLabel(currentTab)}</span>
                  </span>
                </>
              )}
            </nav>

            {/* Smart Contextual Jump Chip (Alternative to raw back button) */}
            {previousTab && previousTab !== currentTab && (
              <>
                <span className={theme === 'light' ? 'text-[#c8cee8] hidden sm:inline' : 'text-[#374182] hidden sm:inline'}>|</span>
                <button
                  type="button"
                  onClick={handleBack}
                  className={`hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all group shrink-0 shadow-xs cursor-pointer ${
                    theme === 'light'
                      ? 'bg-white hover:bg-[#edf0f8] text-[#111439] border border-[#d0d5ec]'
                      : 'bg-[#161b4d] hover:bg-[#1e2568] text-[#f8f8f9] border border-[#2b357e]'
                  }`}
                  title={`Jump back to ${getTabLabel(previousTab)}`}
                >
                  <RotateCcw className={`w-3 h-3 transition-transform group-hover:-rotate-45 ${theme === 'light' ? 'text-[#111439]' : 'text-[#f8f8f9]'}`} />
                  <span>Return to <span className="underline decoration-dotted">{getTabLabel(previousTab)}</span></span>
                </button>
              </>
            )}
          </div>

          {/* Right: Active Dataset Indicator & Fast Switcher */}
          <div className={`flex items-center space-x-2 shrink-0 ${theme === 'light' ? 'text-[#111439]' : 'text-[#f8f8f9]'}`}>
            <span className="hidden md:inline text-[11px] font-medium opacity-70">Dataset:</span>
            <div
              className={`flex items-center space-x-1.5 font-semibold px-2.5 py-1 rounded-lg border text-[11px] ${
                theme === 'light'
                  ? 'bg-white text-[#111439] border-[#d0d5ec] shadow-xs'
                  : 'bg-[#161b4d] text-[#f8f8f9] border-[#29327a]'
              }`}
            >
              <Database className={`w-3 h-3 ${theme === 'light' ? 'text-[#111439]' : 'text-[#38bdf8]'}`} />
              <span className="truncate max-w-[130px] sm:max-w-[200px]">
                {datasets.find((d) => d.id === activeDatasetId)?.name || 'Sales & Profit Analytics'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Dashboard & Tab Navigation Strip - Always visible across mobile, tablet, and desktop */}
      <div
        className={`border-b px-4 sm:px-6 lg:px-8 py-2 transition-colors ${
          theme === 'light'
            ? 'bg-[#edf0f8]/90 border-[#d0d5ec]'
            : 'bg-[#111439]/80 border-[#22295d]'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
            {[
              { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: BarChart3 },
              { id: 'analysis' as NavigationTab, label: 'Analysis', icon: Sliders },
              { id: 'insights' as NavigationTab, label: 'Insights', icon: Lightbulb },
              { id: 'ask' as NavigationTab, label: 'Ask My Data', icon: Sparkles },
              { id: 'quality' as NavigationTab, label: 'Quality Audit', icon: ShieldCheck },
              { id: 'explorer' as NavigationTab, label: 'Explorer', icon: Table2 },
              { id: 'reports' as NavigationTab, label: 'Reports', icon: FileText },
              { id: 'home' as NavigationTab, label: 'Home', icon: Home },
            ].map((tabItem) => {
              const Icon = tabItem.icon;
              const isActive = currentTab === tabItem.id;
              let tabClasses = '';
              if (theme === 'light') {
                tabClasses = isActive
                  ? 'bg-gradient-to-r from-[#111439] via-[#1a215e] to-[#252f86] text-[#f8f8f9] font-bold shadow-sm shadow-[#111439]/30 border border-[#111439]'
                  : 'bg-[#f8f8f9] hover:bg-[#edf0f8] text-[#111439] border border-[#d0d5ec] font-semibold hover:text-[#111439]';
              } else {
                tabClasses = isActive
                  ? 'bg-gradient-to-r from-[#242c78] via-[#3540a8] to-[#4a57ce] text-[#f8f8f9] font-bold shadow-md shadow-[#3540a8]/30 border border-[#4a57ce]'
                  : 'bg-[#141846] hover:bg-[#1a205a] text-[#d0d4ea] border border-[#22295d] hover:text-[#f8f8f9] font-semibold';
              }

              return (
                <button
                  key={tabItem.id}
                  onClick={() => handleNavigate(tabItem.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${tabClasses}`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tabItem.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setUploadModalOpen(true)}
            className={`hidden sm:inline-flex items-center space-x-1 text-xs font-semibold shrink-0 cursor-pointer ${
              theme === 'light'
                ? 'text-[#111439] hover:text-[#252f86] font-bold'
                : 'text-[#cad1fa] hover:text-[#f8f8f9] font-bold'
            }`}
          >
            <span>+ Upload / Switch</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentTab === 'home' && (
          <HomePage
            onOpenUpload={() => setUploadModalOpen(true)}
            onTrySample={() => {
              if (datasets.length > 0) {
                setActiveDatasetId(datasets[0].id);
                handleNavigate('dashboard');
              } else {
                setUploadModalOpen(true);
              }
            }}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'dashboard' && activeDatasetId && (
          <DashboardPage
            datasetId={activeDatasetId}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'analysis' && activeDatasetId && (
          <AnalysisDashboardPage
            datasetId={activeDatasetId}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'insights' && activeDatasetId && (
          <InsightsDashboardPage
            datasetId={activeDatasetId}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'ask' && activeDatasetId && (
          <AskMyDataPage
            datasetId={activeDatasetId}
            initialQuery={initialAskQuery}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'quality' && activeDatasetId && (
          <DataQualityPage
            datasetId={activeDatasetId}
            onRefreshDataset={() => refreshDatasets(activeDatasetId)}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'explorer' && activeDatasetId && (
          <DatasetExplorerPage
            datasetId={activeDatasetId}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'reports' && activeDatasetId && (
          <ReportsPage
            datasetId={activeDatasetId}
            onNavigate={handleNavigate}
          />
        )}

        {/* Fallback if no dataset is active and user navigated away from home */}
        {currentTab !== 'home' && !activeDatasetId && (
          <div className="max-w-md mx-auto py-24 text-center space-y-4">
            <h3 className="text-lg font-bold text-slate-100">No Dataset Selected</h3>
            <p className="text-xs text-slate-400">
              Upload a dataset (CSV, Excel .xlsx/.xls, JSON, JSONL, TSV, or TXT) or explore with one of our realistic pre-packaged datasets.
            </p>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
            >
              Upload or Select Sample
            </button>
          </div>
        )}
      </main>

      {/* Global Executive Website Footer */}
      <Footer
        currentTab={currentTab}
        onNavigate={handleNavigate}
        activeDataset={datasets.find((d) => d.id === activeDatasetId)}
        onOpenUpload={() => setUploadModalOpen(true)}
        theme={theme}
      />

      {/* Upload and Sample Dataset Loader Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onDatasetLoaded={handleDatasetLoaded}
      />
    </div>
  );
}

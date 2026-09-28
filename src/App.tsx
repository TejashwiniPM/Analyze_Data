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
  UploadCloud,
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
      className={`min-h-screen w-full max-w-full overflow-x-clip flex flex-col font-sans transition-colors duration-150 ${
        theme === 'light'
          ? 'theme-light theme-lilac-gradient text-[#111439] selection:bg-[#111439] selection:text-[#f8f8f9]'
          : 'theme-dark theme-dark-blue-gradient text-[#f8f8f9] selection:bg-[#f8f8f9] selection:text-[#111439]'
      }`}
    >
      {/* Fixed Sticky Top Header */}
      <header className="fixed top-0 left-0 right-0 z-40 w-full backdrop-blur-md bg-gradient-to-r from-[#111439] via-[#151a4b] to-[#1c2363] border-b border-[#242b6a] shadow-lg shadow-black/25">
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
        {currentTab !== 'home' && (
          <div className="border-t border-[#242b6a]/80 bg-[#0d102e]/90 px-4 sm:px-6 lg:px-8 h-10 flex items-center">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3 text-xs">
              {/* Left: Interactive Hierarchical Breadcrumbs */}
              <div className="flex items-center space-x-2 min-w-0">
                <nav className="flex items-center space-x-1.5 text-xs truncate text-[#d0d4ea]">
                  <button
                    type="button"
                    onClick={() => handleNavigate('home')}
                    className="hover:text-white transition-colors inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md cursor-pointer hover:bg-white/10"
                    title="Go to Home overview"
                  >
                    <Home className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                    <span>Home</span>
                  </button>

                  <ChevronRight className="w-3.5 h-3.5 opacity-40 text-slate-400 shrink-0" />

                  <button
                    type="button"
                    onClick={() => handleNavigate('dashboard')}
                    className="hover:text-white transition-colors inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md cursor-pointer truncate hover:bg-white/10"
                    title="Go to KPI Dashboard"
                  >
                    <Database className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                    <span className="max-w-[140px] sm:max-w-[200px] truncate font-medium text-slate-200">
                      {datasets.find((d) => d.id === activeDatasetId)?.name || 'Dataset'}
                    </span>
                  </button>

                  <ChevronRight className="w-3.5 h-3.5 opacity-40 text-slate-400 shrink-0" />

                  <span className="inline-flex items-center space-x-1.5 font-bold px-2.5 py-0.5 rounded-md border text-xs truncate bg-[#20276a] text-[#f8f8f9] border-[#3e4ba8]">
                    <CurrentIcon className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                    <span className="truncate">{getTabLabel(currentTab)}</span>
                  </span>
                </nav>
              </div>

              {/* Right: Smart Return Chip & Fast Switcher */}
              <div className="flex items-center space-x-2 shrink-0">
                {previousTab && previousTab !== currentTab && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold text-[#cad1fa] hover:text-white hover:bg-white/10 transition-colors group shrink-0 cursor-pointer"
                    title={`Return to ${getTabLabel(previousTab)}`}
                  >
                    <RotateCcw className="w-3 h-3 text-[#38bdf8] transition-transform group-hover:-rotate-45" />
                    <span className="hidden sm:inline">Back to</span>
                    <span className="underline decoration-dotted">{getTabLabel(previousTab)}</span>
                  </button>
                )}

                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold px-2 py-0.5 rounded-md border border-[#29327a] text-[#cad1fa] hover:bg-[#1e2568] hover:text-white transition-colors cursor-pointer"
                  title="Upload or switch dataset"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span className="hidden sm:inline">Switch Dataset</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area with exact top-padding compensation for fixed header */}
      <main className={`flex-1 w-full max-w-full pb-16 ${currentTab === 'home' ? 'pt-16' : 'pt-[104px]'}`}>
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

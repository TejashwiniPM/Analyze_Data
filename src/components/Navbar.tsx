import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart3,
  MessageSquareCode,
  ShieldCheck,
  Table2,
  FileText,
  UploadCloud,
  ChevronDown,
  Database,
  Menu,
  X,
  Sparkles,
  Check,
  Sliders,
  Lightbulb,
  Home,
  Palette,
  Sun,
  Moon,
} from 'lucide-react';
import { NavigationTab, DatasetSummary } from '../types';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  datasets: DatasetSummary[];
  activeDatasetId: string | null;
  onSelectDataset: (id: string) => void;
  onOpenUpload: () => void;
  qualityScore?: number;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  datasets,
  activeDatasetId,
  onSelectDataset,
  onOpenUpload,
  qualityScore,
  theme = 'light',
  onToggleTheme,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeDataset = datasets.find((d) => d.id === activeDatasetId);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: BarChart3 },
    { id: 'analysis' as NavigationTab, label: 'Analysis', icon: Sliders },
    { id: 'insights' as NavigationTab, label: 'Insights', icon: Lightbulb, badge: 'Verified', badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    { id: 'ask' as NavigationTab, label: 'Ask My Data', icon: MessageSquareCode, badge: 'AI' },
    {
      id: 'quality' as NavigationTab,
      label: 'Data Quality',
      icon: ShieldCheck,
      badge: qualityScore ? `${qualityScore}%` : undefined,
      badgeColor:
        (qualityScore || 100) >= 80
          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
          : 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    { id: 'explorer' as NavigationTab, label: 'Explorer', icon: Table2 },
    { id: 'reports' as NavigationTab, label: 'Reports', icon: FileText },
    { id: 'home' as NavigationTab, label: 'Home', icon: Home },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  const handleDatasetChange = (id: string) => {
    onSelectDataset(id);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#111439] via-[#151a4b] to-[#1c2363] backdrop-blur-md border-b border-[#242b6a] shadow-lg shadow-[#111439]/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Brand Logo & Dataset Switcher */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0 shrink-0">
            {/* Logo Button */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-2.5 text-left group focus:outline-none shrink-0"
              title="Analyze Data Home"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#111439] via-[#2d3794] to-[#f8f8f9] p-[1.5px] shadow-lg shadow-[#111439]/40 shrink-0">
                <div className="w-full h-full bg-[#111439] rounded-[10px] flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-[#f8f8f9] group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-[#f8f8f9] tracking-tight text-sm sm:text-base group-hover:text-[#cad1fa] transition-colors whitespace-nowrap">
                    Analyze Data
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.2 rounded bg-[#f8f8f9]/15 text-[#f8f8f9] border border-[#f8f8f9]/25 hidden xs:inline-block">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-[#cbd1ed] hidden xl:block truncate">
                  Verified Math · Grounded AI Explanations
                </p>
              </div>
            </button>

            {/* Desktop Dataset Switcher Dropdown */}
            {datasets.length > 0 && (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    dropdownOpen
                      ? 'bg-[#1e2568] border-[#f8f8f9]/40 text-[#f8f8f9] ring-2 ring-[#f8f8f9]/20'
                      : 'bg-[#161b4d] hover:bg-[#1e2568] border-[#29327a] text-[#f8f8f9]'
                  }`}
                  aria-expanded={dropdownOpen}
                >
                  <Database className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                  <span className="max-w-[110px] lg:max-w-[140px] truncate">
                    {activeDataset?.name || 'Select Dataset'}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#cbd1ed] shrink-0 transition-transform ${
                      dropdownOpen ? 'rotate-180 text-[#f8f8f9]' : ''
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-72 rounded-xl bg-[#141846] border border-[#2b357e] shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="px-3 py-2 border-b border-[#22295d] text-[10px] font-semibold text-[#cbd1ed] uppercase tracking-wider flex items-center justify-between">
                      <span>Switch Active Dataset</span>
                      <span className="text-[10px] text-[#9aa3ce] font-mono">{datasets.length} available</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1">
                      {datasets.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => handleDatasetChange(d.id)}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#1e2568] transition-colors ${
                            d.id === activeDatasetId
                              ? 'text-[#f8f8f9] font-semibold bg-[#262f7c]'
                              : 'text-[#d0d4ea]'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <p className="truncate font-medium">{d.name}</p>
                            <p className="text-[10px] text-[#9aa3ce]">
                              {d.rowCount.toLocaleString()} rows · {d.filename}
                            </p>
                          </div>
                          {d.id === activeDatasetId && (
                            <Check className="w-4 h-4 text-[#f8f8f9] shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="p-2 border-t border-[#22295d]">
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          onOpenUpload();
                        }}
                        className="w-full py-1.5 px-2 rounded-lg bg-[#1e2568] hover:bg-[#283287] text-[#f8f8f9] text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-[#38bdf8]" />
                        <span>Upload New CSV</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Center: Desktop Navigation Tabs (visible on lg: and up) */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#20276a] to-[#2d368e] text-[#f8f8f9] border border-[#3e4ba8] shadow-sm shadow-[#111439]/30'
                      : 'text-[#d0d4ea] hover:text-[#f8f8f9] hover:bg-[#1a205a]/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#f8f8f9]' : 'text-[#a8b0d8]'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                        item.badgeColor || 'bg-[#f8f8f9]/15 text-[#f8f8f9] border-[#f8f8f9]/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Theme Toggle, Upload Button & Mobile Menu Toggle */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Visual Theme Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shrink-0 cursor-pointer bg-[#161b4d] text-[#f8f8f9] border-[#29327a] hover:bg-[#1e2568] hover:border-[#3d4999] shadow-xs"
              title={theme === 'light' ? 'Switch to Dark Blue Gradient Mode' : 'Switch to White Lilac Gradient Mode'}
              aria-label="Toggle visual theme"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#f8f8f9] shrink-0" />
                  <span className="hidden sm:inline font-semibold text-xs text-[#f8f8f9]">Dark Blue Gradient</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="hidden sm:inline font-semibold text-xs text-[#f8f8f9]">White Lilac Gradient</span>
                </>
              )}
            </button>

            {/* Upload Button */}
            <button
              onClick={onOpenUpload}
              className="flex items-center space-x-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#1e266a] via-[#2a348e] to-[#3946b5] hover:from-[#252f82] hover:to-[#4554d1] text-[#f8f8f9] text-xs font-semibold shadow-lg shadow-[#111439]/35 border border-[#f8f8f9]/15 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
              title="Upload CSV dataset"
            >
              <UploadCloud className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-[#f8f8f9]" />
              <span className="hidden sm:inline whitespace-nowrap">Upload Dataset</span>
              <span className="sm:hidden whitespace-nowrap">Upload</span>
            </button>

            {/* Mobile Menu Hamburger / Close Button (visible below lg) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 lg:hidden transition-colors focus:outline-none shrink-0"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-indigo-400" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Dropdown Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/98 border-b border-slate-800 shadow-2xl animate-in slide-in-from-top-2 duration-150">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-3">
            {/* Mobile Dataset Selector */}
            {datasets.length > 0 && (
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center space-x-1.5">
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Active Dataset</span>
                  </span>
                  <span className="text-slate-500 font-mono">{activeDataset?.rowCount.toLocaleString()} rows</span>
                </div>
                <div className="grid grid-cols-1 gap-1 pt-1">
                  {datasets.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => handleDatasetChange(d.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        d.id === activeDatasetId
                          ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="truncate">{d.name}</span>
                      {d.id === activeDatasetId && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Nav Links */}
            <div className="space-y-1">
              <div className="px-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Navigation
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                          : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                            item.badgeColor || 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Theme Toggle */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Appearance</span>
              <button
                type="button"
                onClick={onToggleTheme}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-300" />
                    <span>Switch to Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                    <span>Switch to Light Theme</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};


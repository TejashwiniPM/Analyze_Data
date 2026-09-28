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
  Check,
  Sliders,
  Lightbulb,
  Home,
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

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
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
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'analysis', label: 'Analysis', icon: Sliders },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
    { id: 'ask', label: 'Ask Data', icon: MessageSquareCode },
    {
      id: 'quality',
      label: 'Quality',
      icon: ShieldCheck,
      badge: qualityScore ? `${qualityScore}%` : undefined,
    },
    { id: 'explorer', label: 'Explorer', icon: Table2 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'home', label: 'Home', icon: Home },
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
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Left Wing: Brand Logo & Dataset Selector */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0 min-w-0">
            {/* Logo */}
            <button
              onClick={() => handleNavClick('home')}
              className="h-9 inline-flex items-center space-x-2 text-left group focus:outline-none shrink-0 cursor-pointer"
              title="Analyze Data Home"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#111439] via-[#2d3794] to-[#f8f8f9] p-[1.5px] shadow-sm shadow-[#111439]/40 shrink-0">
                <div className="w-full h-full bg-[#111439] rounded-[7px] flex items-center justify-center">
                  <BarChart3 className="w-4.5 h-4.5 text-[#f8f8f9] group-hover:scale-105 transition-transform" />
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-[#f8f8f9] tracking-tight text-sm sm:text-base group-hover:text-[#cad1fa] transition-colors whitespace-nowrap">
                  Analyze Data
                </span>
                <span className="text-[9px] font-extrabold tracking-wider uppercase px-1 py-0.2 rounded bg-white/15 text-[#f8f8f9] border border-white/20 hidden xs:inline-block">
                  AI
                </span>
              </div>
            </button>

            {/* Vertical Divider */}
            {datasets.length > 0 && (
              <div className="h-5 w-px bg-white/20 hidden sm:block shrink-0" />
            )}

            {/* Dataset Switcher Dropdown */}
            {datasets.length > 0 && (
              <div className="relative hidden sm:block shrink-0" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`h-9 inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 rounded-lg border text-xs font-semibold transition-all max-w-[130px] md:max-w-[170px] cursor-pointer ${
                    dropdownOpen
                      ? 'bg-[#1e2568] border-white/40 text-white ring-2 ring-white/20'
                      : 'bg-[#161b4d] hover:bg-[#1e2568] border-[#29327a] text-white'
                  }`}
                  aria-expanded={dropdownOpen}
                  title={activeDataset?.name || 'Select Dataset'}
                >
                  <Database className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                  <span className="truncate text-white font-medium" style={{ color: '#ffffff' }}>
                    {activeDataset?.name || 'Select Dataset'}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-white/80 shrink-0 transition-transform ${
                      dropdownOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="dataset-dropdown absolute left-0 mt-2 w-72 rounded-xl bg-[#141846] border border-[#2b357e] shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 text-white">
                    <div className="px-3 py-2 border-b border-[#22295d] text-[10px] font-bold uppercase tracking-wider flex items-center justify-between" style={{ color: '#cbd5e1' }}>
                      <span style={{ color: '#cbd5e1' }}>Switch Active Dataset</span>
                      <span className="text-[10px] font-mono" style={{ color: '#cbd5e1' }}>{datasets.length} available</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1">
                      {datasets.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => handleDatasetChange(d.id)}
                          className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-[#20286b] transition-colors cursor-pointer ${
                            d.id === activeDatasetId
                              ? 'bg-[#262f7c] border-l-2 border-[#38bdf8]'
                              : 'hover:bg-[#1e2568]'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <span
                              className="block truncate font-bold text-white text-xs leading-snug"
                              style={{ color: '#ffffff' }}
                            >
                              {d.name}
                            </span>
                            <span
                              className="block text-[11px] mt-0.5 font-medium"
                              style={{ color: '#cbd5e1' }}
                            >
                              {d.rowCount.toLocaleString()} rows · {d.filename}
                            </span>
                          </div>
                          {d.id === activeDatasetId && (
                            <Check className="w-4 h-4 text-[#38bdf8] shrink-0 ml-1" />
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
                        className="w-full py-2 px-2.5 rounded-lg bg-[#20286b] hover:bg-[#283287] text-white text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer border border-white/10 shadow-sm"
                        style={{ color: '#ffffff' }}
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-[#38bdf8]" />
                        <span style={{ color: '#ffffff' }}>Upload New Dataset</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Center Navigation Tabs: Visible on md+ with smooth horizontal flow */}
          <nav className="hidden md:flex items-center space-x-1 min-w-0 overflow-x-auto scrollbar-none py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`h-9 inline-flex items-center space-x-1.5 px-2.5 lg:px-3 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#20276a] to-[#2d368e] text-[#f8f8f9] border border-[#3e4ba8] shadow-xs'
                      : 'text-[#d0d4ea] hover:text-[#f8f8f9] hover:bg-[#1a205a]/60 border border-transparent'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#38bdf8]' : 'text-[#a8b0d8]'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/15 text-[#f8f8f9] border border-white/30 ml-0.5">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Wing: Actions (Upload + Theme Toggle + Mobile Menu) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="h-9 w-9 inline-flex items-center justify-center rounded-lg border text-xs font-semibold transition-all shrink-0 cursor-pointer bg-[#161b4d] text-[#f8f8f9] border-[#29327a] hover:bg-[#1e2568] hover:border-[#3d4999]"
              title={theme === 'light' ? 'Switch to Dark Blue Theme' : 'Switch to White Lilac Theme'}
              aria-label="Toggle visual theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-[#f8f8f9]" />
              ) : (
                <Sun className="w-4 h-4 text-amber-300" />
              )}
            </button>

            {/* Upload Button */}
            <button
              onClick={onOpenUpload}
              className="h-9 inline-flex items-center justify-center space-x-1.5 px-2.5 sm:px-3 rounded-lg bg-gradient-to-r from-[#1e266a] via-[#2a348e] to-[#3946b5] hover:from-[#252f82] hover:to-[#4554d1] text-[#f8f8f9] text-xs font-semibold shadow-md shadow-[#111439]/35 border border-white/15 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
              title="Upload CSV or Excel dataset"
            >
              <UploadCloud className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Upload Dataset</span>
            </button>

            {/* Mobile Hamburger Button (visible on < md) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-[#161b4d] hover:bg-[#1e2568] text-slate-200 border border-[#29327a] md:hidden transition-colors focus:outline-none shrink-0 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5 text-indigo-300" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (visible on < md when hamburger is tapped) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111439]/98 border-t border-[#242b6a] shadow-2xl animate-in slide-in-from-top-2 duration-150">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-3">
            {/* Mobile Dataset Selector */}
            {datasets.length > 0 && (
              <div className="p-2.5 rounded-xl bg-[#161b4d] border border-[#29327a] space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                  <span className="flex items-center space-x-1.5 text-slate-300">
                    <Database className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span style={{ color: '#ffffff' }}>Active Dataset</span>
                  </span>
                  <span className="font-mono text-slate-300" style={{ color: '#cbd5e1' }}>{activeDataset?.rowCount.toLocaleString()} rows</span>
                </div>
                <div className="grid grid-cols-1 gap-1 pt-1">
                  {datasets.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => handleDatasetChange(d.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        d.id === activeDatasetId
                          ? 'bg-[#262f7c] text-white font-bold border border-[#3e4ba8]'
                          : 'text-white hover:bg-[#1e2568]'
                      }`}
                    >
                      <span className="truncate font-medium text-white" style={{ color: '#ffffff' }}>{d.name}</span>
                      {d.id === activeDatasetId && (
                        <Check className="w-3.5 h-3.5 text-[#38bdf8] shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              <div className="px-1 text-[10px] font-semibold text-[#9aa3ce] uppercase tracking-wider">
                Pages & Dashboards
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#262f7c] text-[#f8f8f9] font-semibold border border-[#3e4ba8]'
                          : 'text-[#d0d4ea] hover:text-[#f8f8f9] hover:bg-[#1e2568]'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#38bdf8]' : 'text-[#a8b0d8]'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/15 text-[#f8f8f9]">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Home, Type, Sparkles, AtSign, PenTool, Heart, History, Settings } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  favoritesCount: number;
  historyCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  favoritesCount,
  historyCount,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'fonts', label: 'Font', icon: Type },
    { id: 'symbols', label: 'Simboli', icon: Sparkles },
    { id: 'social', label: 'Social', icon: AtSign },
    { id: 'composer', label: 'Componi', icon: PenTool },
    { id: 'favorites', label: 'Preferiti', icon: Heart, badge: favoritesCount },
    { id: 'history', label: 'Cronologia', icon: History, badge: historyCount > 0 ? historyCount : undefined },
    { id: 'settings', label: 'Opzioni', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-lg safe-area-bottom">
      <div className="max-w-xl mx-auto px-1 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-xl transition-all duration-200 tap-highlight min-w-[48px] ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight leading-none whitespace-nowrap">
                {item.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// Barre d’icônes : afficher / masquer les blocs du fil (même page, préférence locale).

import { Ic } from '@/Components/Dashboard/Icons';
import { useTranslation } from 'react-i18next';

function DockBtn({ id, active, onToggle, children, title, label }) {
  return (
    <button
      type="button"
      title={title}
      onClick={() => onToggle(id)}
      className="relative flex flex-col items-center gap-1 min-w-[3.25rem] px-2 py-2 rounded-xl transition-all"
      style={{
        border: active ? '1px solid rgba(99,179,237,0.45)' : '1px solid var(--border)',
        background: active ? 'rgba(99,179,237,0.12)' : 'var(--bg-glass)',
        color: active ? 'var(--accent-1)' : 'var(--text-3)',
      }}
    >
      <span className="flex items-center justify-center w-8 h-8">{children}</span>
      <span className="text-[9px] font-bold uppercase tracking-wide max-w-[4.5rem] truncate hidden sm:block">
        {label}
      </span>
      {active && (
        <span
          className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
          style={{ background: 'var(--accent-2)', boxShadow: '0 0 6px var(--accent-2)' }}
        />
      )}
    </button>
  );
}

function IconStories() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="8" strokeDasharray="4 3" />
    </svg>
  );
}

function IconFeed() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="14" y2="17" />
    </svg>
  );
}

function IconFilters() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function IconSidebar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <rect x="3" y="3" width="8" height="18" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export default function DashboardPanelDock({ panels, onToggle, onShowAll, onHideAll }) {
  const { t } = useTranslation();

  return (
    <div
      className="glass-card rounded-2xl p-3 mb-4 d-fade-up flex flex-col sm:flex-row sm:items-center gap-3"
      style={{ animationDelay: '0.02s' }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
          style={{ color: 'var(--text-3)' }}
        >
          {t('dashboard.dock.display')}
        </span>
        <p className="text-[11px] hidden md:block truncate" style={{ color: 'var(--text-3)' }}>
          {t('dashboard.dock.hint')}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 flex-1 justify-start sm:justify-center">
        <DockBtn id="chrome" active={panels.chrome} onToggle={onToggle} title={t('dashboard.dock.titleChrome')} label={t('dashboard.dock.chrome')}>
          <Ic.Zap />
        </DockBtn>
        <DockBtn id="stories" active={panels.stories} onToggle={onToggle} title={t('dashboard.dock.titleStories')} label={t('dashboard.dock.stories')}>
          <IconStories />
        </DockBtn>
        <DockBtn id="filters" active={panels.filters} onToggle={onToggle} title={t('dashboard.dock.titleFilters')} label={t('dashboard.dock.filters')}>
          <IconFilters />
        </DockBtn>
        <DockBtn id="feed" active={panels.feed} onToggle={onToggle} title={t('dashboard.dock.titleFeed')} label={t('dashboard.dock.feed')}>
          <IconFeed />
        </DockBtn>
        <DockBtn id="sidebar" active={panels.sidebar} onToggle={onToggle} title={t('dashboard.dock.titleSidebar')} label={t('dashboard.dock.sidebar')}>
          <IconSidebar />
        </DockBtn>
      </div>
      <div className="flex items-center gap-2 justify-end">
        <button
          type="button"
          className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--accent-2)', border: '1px solid rgba(118,228,176,0.25)' }}
          onClick={onShowAll}
        >
          {t('dashboard.dock.showAll')}
        </button>
        <button
          type="button"
          className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--text-3)', border: '1px solid var(--border)' }}
          onClick={onHideAll}
        >
          {t('dashboard.dock.hideAll')}
        </button>
      </div>
    </div>
  );
}

export const DASHBOARD_PANELS_STORAGE_KEY = 'uniconnect.dashboard.panels.v1';

export const DASHBOARD_PANEL_DEFAULTS = {
  chrome: false,
  stories: true,
  filters: false,
  feed: false,
  sidebar: false,
};

export function mergeDashboardPanels(saved) {
  return { ...DASHBOARD_PANEL_DEFAULTS, ...(saved && typeof saved === 'object' ? saved : {}) };
}

/**
 * Pages sous `FeedNavFrame` : le dégradé du fil (`getFeedAmbient`) est peint sur
 * `#uni-feed-main-scroll`. Un `bg-white` / `bg-zinc-950` sur la page le masque entièrement.
 * Utiliser un fond transparent + panneaux semi-transparents pour la cohérence.
 */
export const feedPageRoot = 'min-h-0 w-full flex-1 bg-transparent';

export const feedGlassStickyHeader =
  'border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-white/15 dark:bg-slate-950/72';

export const feedGlassAside =
  'border-neutral-200/80 bg-white/75 backdrop-blur-md dark:border-white/15 dark:bg-slate-950/68';

export const feedGlassMain =
  'bg-slate-50/55 backdrop-blur-sm dark:bg-slate-950/58';

export const feedGlassCard =
  'border-slate-200/80 bg-white/75 dark:border-white/15 dark:bg-slate-950/66';

/**
 * Blocs / en-têtes alignés sur les variables du layout (mode clair & sombre « mood »),
 * sans dépendre uniquement de la classe Tailwind `dark` (évite texte clair sur fond clair).
 */
export const feedMoodPanel = {
  className: 'rounded-2xl border p-4 shadow-sm backdrop-blur-md sm:p-5 [border-color:var(--border)]',
  style: { background: 'var(--panel-bg)', color: 'var(--text-1)' },
};

export const feedMoodStickyHeader = {
  className: 'sticky top-0 z-20 -mx-3 border-b px-3 py-2.5 [border-color:var(--border)] sm:mx-0 sm:px-0',
  style: {
    background: 'var(--nav-blur-bg)',
    color: 'var(--text-1)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  },
};

export const feedMoodListRow = {
  className: 'rounded-xl border p-2.5 [border-color:var(--border)]',
  style: { background: 'var(--bg-card)', color: 'var(--text-1)' },
};

export const feedMoodText = {
  primary: { color: 'var(--text-1)' },
  secondary: { color: 'var(--text-2)' },
  muted: { color: 'var(--text-3)' },
};

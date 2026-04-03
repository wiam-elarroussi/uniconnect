import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Avatar from './Avatar';
import { Ic } from './Icons';

export default function StoriesBar({ auth, stories = [], onOpenStoryViewer }) {
  const { t } = useTranslation();
  const myId = auth.user.id;
  const byUser = new Map();
  stories.forEach((s) => {
    if (!byUser.has(s.user_id)) {
      byUser.set(s.user_id, { user: s.user, firstStory: s });
    }
  });

  const ordered = [];
  if (byUser.has(myId)) {
    ordered.push({ userId: myId, ...byUser.get(myId) });
  }
  byUser.forEach((val, userId) => {
    if (userId !== myId) {
      ordered.push({ userId, ...val });
    }
  });

  const createUrl = `${route('stories.index')}?new=1`;

  const handleBubbleClick = (userId) => {
    const idx = stories.findIndex((s) => s.user_id === userId);
    if (idx >= 0) {
      onOpenStoryViewer(idx);
    } else if (userId === myId) {
      window.location.href = createUrl;
    }
  };

  return (
    <div className="glass-card rounded-2xl px-4 py-4 noise">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[10px] font-display font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-3)' }}>
          {t('dashboard.storiesBar.title')}
        </span>
        <Link
          href={route('stories.index')}
          className="text-[9px] px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(99,179,237,0.1)', color: 'var(--accent-1)', border: '1px solid rgba(99,179,237,0.2)' }}
        >
          {t('dashboard.storiesBar.seeAll')}
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scroll pb-1">
        <div className="flex flex-col items-center gap-2 flex-shrink-0" style={{ animationDelay: '0s' }}>
          <div className="relative">
            <button
              type="button"
              onClick={() => handleBubbleClick(myId)}
              className="rounded-full flex items-center justify-center border-0 bg-transparent p-0 cursor-pointer"
              aria-label={t('dashboard.storiesBar.myStoryAria')}
            >
              <Avatar name={auth.user.name} size="lg" story={byUser.has(myId)} online src={auth.user.avatar_url} builder={auth.user.avatar_builder} />
            </button>
            <a
              href={createUrl}
              onClick={(e) => e.stopPropagation()}
              className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full flex items-center justify-center border z-10"
              style={{ background: 'linear-gradient(135deg,#1a6cad,#2d3a8c)', borderColor: 'var(--bg-deep)' }}
              title={t('dashboard.storiesBar.createStoryTitle')}
            >
              <span style={{ color: 'white' }}>
                <Ic.Plus />
              </span>
            </a>
          </div>
          <p className="text-[10px] font-medium truncate w-14 text-center" style={{ color: 'var(--text-2)' }}>
            {t('dashboard.storiesBar.you')}
          </p>
        </div>

        {ordered
          .filter((o) => o.userId !== myId)
          .map((o, i) => (
            <button
              key={o.userId}
              type="button"
              onClick={() => handleBubbleClick(o.userId)}
              className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group border-0 bg-transparent p-0"
              style={{ animationDelay: `${(i + 1) * 0.06}s` }}
            >
              <div className="relative">
                <Avatar name={o.user?.name} size="lg" story online src={o.user?.avatar_url} builder={o.user?.avatar_builder} />
              </div>
              <p className="text-[10px] font-medium truncate w-14 text-center" style={{ color: 'var(--text-2)' }}>
                {(o.user?.name ?? '?').split(' ')[0]}
              </p>
            </button>
          ))}
      </div>
    </div>
  );
}

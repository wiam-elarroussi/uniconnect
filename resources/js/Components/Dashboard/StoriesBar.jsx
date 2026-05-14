import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useFeedUI } from '@/contexts/FeedUIContext';
import Avatar from './Avatar';
import { Ic } from './Icons';

/** @param {{ auth: object, stories: object[], onOpenStoryViewer: (userId: number) => void, isLight?: boolean }} props */
export default function StoriesBar({ auth, stories = [], onOpenStoryViewer }) {
  const { t } = useTranslation();
  const { openStoryCreate } = useFeedUI();
  const myId = auth.user.id;

  const byUser = new Map();
  stories.forEach((s) => {
    if (!byUser.has(s.user_id)) {
      byUser.set(s.user_id, { user: s.user, firstStory: s, allSeen: !!s.viewed_by_me });
    } else {
      const entry = byUser.get(s.user_id);
      if (!s.viewed_by_me) entry.allSeen = false;
    }
  });

  const ordered = [];
  if (byUser.has(myId)) ordered.push({ userId: myId, ...byUser.get(myId) });
  byUser.forEach((val, userId) => {
    if (userId !== myId) ordered.push({ userId, ...val });
  });

  const handleBubbleClick = (userId) => {
    if (userId === myId) {
      if (!byUser.has(myId)) { openStoryCreate(); return; }
      onOpenStoryViewer(myId);
      return;
    }
    onOpenStoryViewer(userId);
  };

  return (
    <div
      className="overflow-x-auto"
      style={{ borderBottom: '1px solid var(--border)', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
    >
      <div className="flex gap-4 px-4 py-3 min-w-max">

        {/* Ma story */}
        <div className="flex flex-shrink-0 flex-col items-center gap-1.5">
          <div className="relative">
            <button
              type="button"
              onClick={() => handleBubbleClick(myId)}
              className="rounded-full p-0 bg-transparent border-0"
              aria-label={t('dashboard.storiesBar.myStoryAria')}
            >
              <Avatar
                name={auth.user.name}
                size="lg"
                story={byUser.has(myId)}
                src={auth.user.avatar_url}
                builder={auth.user.avatar_builder}
              />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); openStoryCreate(); }}
              className="absolute -bottom-0.5 -right-0.5 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2"
              style={{ background: '#3b82f6', borderColor: 'var(--bg-deep)' }}
              title={t('dashboard.storiesBar.createStoryTitle')}
              aria-label={t('dashboard.storiesBar.createStoryTitle')}
            >
              <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-white" fill="currentColor">
                <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <p className="w-[3.8rem] truncate text-center text-[10px] font-medium" style={{ color: 'var(--text-2)' }}>
            {t('dashboard.storiesBar.you')}
          </p>
        </div>

        {/* Autres utilisateurs */}
        {ordered
          .filter((o) => o.userId !== myId)
          .map((o) => (
            <button
              key={o.userId}
              type="button"
              onClick={() => handleBubbleClick(o.userId)}
              className="flex flex-shrink-0 flex-col items-center gap-1.5 border-0 bg-transparent p-0"
            >
              <Avatar
                name={o.user?.name}
                size="lg"
                story={!o.allSeen}
                src={o.user?.avatar_url}
                builder={o.user?.avatar_builder}
              />
              <p
                className="w-[3.8rem] truncate text-center text-[10px] font-medium"
                style={{ color: o.allSeen ? 'var(--text-3)' : 'var(--text-2)' }}
              >
                {(o.user?.name ?? '?').split(' ')[0]}
              </p>
            </button>
          ))}
      </div>
    </div>
  );
}

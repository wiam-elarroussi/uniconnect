// resources/js/Components/Layout/FeedOverlays.jsx
// Menu création (post / story) + compositeur + story + notifications — layout feed.
import Composer from '@/Components/Dashboard/Composer';
import StoryCreatePanel from '@/Components/Dashboard/StoryCreatePanel';
import { useFeedUI } from '@/contexts/FeedUIContext';
import { useTranslation } from 'react-i18next';

/**
 * @param {object} props
 * @param {Record<string, string>} props.theme - variables CSS (dash)
 * @param {boolean} props.isFocus
 * @param {object} props.auth
 * @param {import('react').ReactNode} [props.dateLocale] - ex. de useTranslation i18n
 * @param {Array} [props.channels]
 * @param {boolean} props.processing
 * @param {object} [props.errors]
 * @param {(formData: FormData, onSuccess: () => void) => void} props.onComposerSubmit
 * @param {Array} [props.notifications]
 * @param {number} [props.unreadNotificationsCount]
 */
export default function FeedOverlays({
  theme,
  isFocus,
  auth,
  channels = [],
  processing,
  errors = {},
  onComposerSubmit,
  notifications: _notifications = [],
  unreadNotificationsCount: _unreadNotificationsCount = 0,
}) {
  const { t } = useTranslation();
  const {
    composerOpen,
    closeComposer,
    openStoryCreate,
    storyCreateOpen,
    closeStoryCreate,
  } = useFeedUI();

  /** Même principe que le Composer : le panneau doit avoir un fond opaque, pas seulement les variables CSS. */
  const shellTheme = { ...theme, background: 'var(--panel-bg)' };

  return (
    <>
      {storyCreateOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeStoryCreate();
          }}
        >
          <div className="absolute inset-0 bg-zinc-950/75 backdrop-blur-md" />
          <div
            className="relative z-10 flex w-full max-w-[min(100%,42rem)] flex-col self-end overflow-hidden rounded-t-3xl border shadow-2xl sm:max-h-[min(92dvh,880px)] sm:rounded-3xl sm:self-center lg:max-w-[min(100%,44rem)]"
            style={{ ...shellTheme, borderColor: 'var(--border)' }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="dash-root flex max-h-[min(96dvh,880px)] w-full min-w-0 flex-col overflow-hidden sm:max-h-[min(92dvh,880px)]"
              style={shellTheme}
            >
              <div
                className="flex shrink-0 items-center justify-end border-b px-2 py-2.5 sm:px-3"
                style={{ borderColor: 'var(--border)', background: 'var(--panel-bg)' }}
              >
                <button
                  type="button"
                  onClick={closeStoryCreate}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-2xl leading-none transition hover:bg-white/10"
                  style={{ color: 'var(--text-2)' }}
                  title={t('dashboard.close', { defaultValue: 'Fermer' })}
                  aria-label={t('dashboard.close', { defaultValue: 'Fermer' })}
                >
                  ×
                </button>
              </div>
              <div
                className="min-h-0 max-h-[calc(100dvh-3.75rem)] overflow-y-auto overscroll-y-contain [scrollbar-gutter:stable] sm:max-h-[calc(min(92dvh,880px)-3.75rem)]"
                style={{ background: 'var(--panel-bg)' }}
              >
                <StoryCreatePanel />
              </div>
            </div>
          </div>
        </div>
      )}

      {composerOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeComposer();
          }}
        >
          <div className="absolute inset-0 bg-zinc-950/75 backdrop-blur-md" />
          <div
            className="relative z-10 flex w-full max-w-[min(100%,42rem)] flex-col self-end overflow-hidden rounded-t-3xl border shadow-2xl sm:max-h-[min(92dvh,880px)] sm:rounded-3xl sm:self-center lg:max-w-[min(100%,44rem)]"
            style={{ ...shellTheme, borderColor: 'var(--border)' }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="dash-root flex max-h-[min(96dvh,880px)] w-full min-w-0 flex-col overflow-hidden sm:max-h-[min(92dvh,880px)]"
              style={shellTheme}
            >
              <div
                className="flex shrink-0 items-center justify-end border-b px-2 py-2.5 sm:px-3"
                style={{ borderColor: 'var(--border)', background: 'var(--panel-bg)' }}
              >
                <button
                  type="button"
                  onClick={closeComposer}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-2xl leading-none transition hover:bg-white/10"
                  style={{ color: 'var(--text-2)' }}
                  title={t('dashboard.close', { defaultValue: 'Fermer' })}
                  aria-label={t('dashboard.close', { defaultValue: 'Fermer' })}
                >
                  ×
                </button>
              </div>
              <div
                className="min-h-0 max-h-[calc(100dvh-3.75rem)] overflow-y-auto overscroll-y-contain [scrollbar-gutter:stable] sm:max-h-[calc(min(92dvh,880px)-3.75rem)]"
                style={{ background: 'var(--panel-bg)' }}
              >
                <Composer
                  auth={auth}
                  isFocusMode={isFocus}
                  onSubmit={onComposerSubmit}
                  processing={processing}
                  errors={errors}
                  channels={channels}
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

import { router } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function StoryViewerModal({ open, stories = [], initialIndex = 0, onClose }) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (open) {
      setActiveIndex(initialIndex);
      setProgress(0);
    }
  }, [open, initialIndex]);

  const activeStory = useMemo(
    () => (open && stories.length ? stories[activeIndex] ?? null : null),
    [open, stories, activeIndex]
  );

  const nextStory = useCallback(() => {
    setProgress(0);
    setActiveIndex((idx) => {
      if (idx >= stories.length - 1) {
        onClose();
        return idx;
      }
      return idx + 1;
    });
  }, [stories.length, onClose]);

  const prevStory = useCallback(() => {
    setProgress(0);
    setActiveIndex((idx) => Math.max(0, idx - 1));
  }, []);

  useEffect(() => {
    if (!open || !activeStory) return;

    router.post(route('stories.view', activeStory.id), {}, { preserveScroll: true, preserveState: true });
    setProgress(0);

    const duration = activeStory.media_url?.match(/\.(mp4|webm|mov)$/i) ? 12000 : 7000;
    const step = 100;
    const increment = (step / duration) * 100;
    const timer = setInterval(() => {
      setProgress((p) => {
        const next = p + increment;
        if (next >= 100) {
          clearInterval(timer);
          setProgress(0);
          setActiveIndex((idx) => {
            if (idx >= stories.length - 1) {
              onClose();
              return idx;
            }
            return idx + 1;
          });
          return 100;
        }
        return next;
      });
    }, step);

    return () => clearInterval(timer);
  }, [open, activeStory, stories.length, onClose]);

  const react = (emoji) => {
    if (!activeStory) return;
    router.post(route('stories.react', activeStory.id), { reaction: emoji }, { preserveScroll: true, preserveState: true });
  };

  if (!open || !stories.length) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="flex gap-1 mb-3">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-1 bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-[width] duration-75 ease-linear"
                style={{
                  width: `${i < activeIndex ? 100 : i === activeIndex ? progress : 0}%`,
                }}
              />
            </div>
          ))}
        </div>

        <div className="bg-black rounded-2xl overflow-hidden border border-white/20">
          <div className="p-3 text-white text-sm font-semibold flex items-center justify-between">
            <span>{activeStory?.user?.name}</span>
            <button type="button" onClick={onClose} className="text-white/80">
              Fermer
            </button>
          </div>

          {activeStory?.media_url?.match(/\.(mp4|webm|mov)$/i) ? (
            <video autoPlay muted controls className="w-full max-h-[70vh] object-cover">
              <source src={activeStory.media_url} />
            </video>
          ) : (
            <img src={activeStory?.media_url} alt="" className="w-full max-h-[70vh] object-cover" />
          )}

          <div className="p-3 flex items-center justify-between text-white flex-wrap gap-2">
            <div className="flex gap-2 flex-wrap">
              {['❤️', '🔥', '👏', '😍', '😂'].map((e) => (
                <button key={e} type="button" onClick={() => react(e)} className="text-lg">
                  {e}
                </button>
              ))}
            </div>
            <span className="text-xs text-white/70">{activeStory?.views_count ?? 0} vues</span>
          </div>
        </div>

        <button
          type="button"
          onClick={prevStory}
          className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10 text-white text-3xl"
          aria-label="Précédent"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={nextStory}
          className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 text-white text-3xl"
          aria-label="Suivant"
        >
          ›
        </button>
      </div>
    </div>
  );
}

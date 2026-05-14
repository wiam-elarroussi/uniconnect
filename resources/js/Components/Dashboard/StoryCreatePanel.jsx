import Avatar from '@/Components/Dashboard/Avatar';
import { Ic } from '@/Components/Dashboard/Icons';
import { useFeedUI } from '@/contexts/FeedUIContext';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Création de story — même logique qu’avant, présentation alignée sur le compositeur (fond solide, hiérarchie claire).
 */
export default function StoryCreatePanel() {
  const { t } = useTranslation();
  const { auth } = usePage().props;
  const { closeStoryCreate } = useFeedUI();
  const form = useForm({ body: '', media: null });
  const fileInputRef = useRef(/** @type {HTMLInputElement | null} */ (null));
  const [imagePreviewUrl, setImagePreviewUrl] = useState(/** @type {string | null} */ (null));
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(/** @type {string | null} */ (null));

  const submit = (e) => {
    e.preventDefault();
    form.post(route('stories.store'), {
      forceFormData: true,
      onSuccess: () => {
        form.reset();
        closeStoryCreate();
      },
    });
  };

  useEffect(() => {
    const f = form.data.media;
    if (!f) {
      setImagePreviewUrl(null);
      setVideoPreviewUrl((u) => {
        if (u) URL.revokeObjectURL(u);
        return null;
      });
      return undefined;
    }
    if (f.type?.startsWith('image/')) {
      setVideoPreviewUrl((u) => {
        if (u) URL.revokeObjectURL(u);
        return null;
      });
      const url = URL.createObjectURL(f);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    if (f.type?.startsWith('video/')) {
      setImagePreviewUrl(null);
      setVideoPreviewUrl((old) => {
        if (old) URL.revokeObjectURL(old);
        return null;
      });
      const url = URL.createObjectURL(f);
      setVideoPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setImagePreviewUrl(null);
    setVideoPreviewUrl((u) => {
      if (u) URL.revokeObjectURL(u);
      return null;
    });
    return undefined;
  }, [form.data.media]);

  const hasPreview = Boolean(form.data.body?.trim() || form.data.media);

  return (
    <form
      id="story-publish-form"
      onSubmit={submit}
      className="px-4 pb-6 pt-1 sm:px-5 sm:pb-8"
      style={{ color: 'var(--text-1)', background: 'var(--panel-bg)' }}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <Avatar name={auth.user.name} size="md" src={auth.user.avatar_url} builder={auth.user.avatar_builder} online />
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-base font-bold leading-tight sm:text-lg" style={{ color: 'var(--text-1)' }}>
            {t('pages.stories.createTitle')}
          </h2>
          <p className="mt-1 text-sm leading-snug" style={{ color: 'var(--text-2)' }}>
            {t('pages.stories.createHint')}
          </p>
        </div>
      </div>

      <div
        className="mt-5 rounded-2xl border p-4 sm:p-5"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--bg-card)',
          boxShadow: '0 1px 0 0 rgba(255,255,255,0.04) inset',
        }}
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
          {t('pages.stories.textSection', { defaultValue: 'Texte' })}
        </p>
        <textarea
          value={form.data.body}
          onChange={(e) => form.setData('body', e.target.value)}
          rows={3}
          placeholder={t('pages.stories.textPlaceholder', { defaultValue: 'Texte (optionnel si vous choisissez un média)' })}
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
          style={{
            background: 'var(--input-bg)',
            borderColor: 'var(--input-border)',
            color: 'var(--text-1)',
            minHeight: '4.5rem',
          }}
        />
        {form.errors.body && (
          <p className="mt-2 text-sm text-rose-400" role="alert">
            {form.errors.body}
          </p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        name="media"
        accept="image/*,video/*"
        className="sr-only"
        onChange={(e) => form.setData('media', e.target.files?.[0] || null)}
      />

      <div
        className="mt-5 rounded-2xl border p-4 sm:p-5"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--bg-card)',
          boxShadow: '0 1px 0 0 rgba(255,255,255,0.04) inset',
        }}
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
          {t('pages.stories.mediaSectionOptional', { defaultValue: 'Média (optionnel si vous avez un texte)' })}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-stretch sm:gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex min-h-12 w-full min-w-0 items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-3 text-sm font-semibold transition hover:brightness-110 sm:min-w-[12rem] sm:max-w-xs"
            style={{
              borderColor: 'rgba(99,179,237,0.45)',
              background: 'rgba(99,179,237,0.08)',
              color: 'var(--text-1)',
            }}
          >
            {t('pages.stories.pickMedia')}
          </button>

          <div className="min-w-0 flex-1 self-center sm:min-w-[8rem]">
            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-2)' }}>
              {form.data.media ? (
                <span className="block break-all font-medium" title={form.data.media.name} style={{ color: 'var(--text-1)' }}>
                  {form.data.media.name}
                </span>
              ) : (
                t('pages.stories.noMediaYet')
              )}
            </p>
          </div>

          {imagePreviewUrl && (
            <div className="mx-auto shrink-0 sm:ml-auto sm:mr-0">
              <img
                src={imagePreviewUrl}
                alt=""
                className="h-24 w-24 rounded-xl border-2 object-cover sm:h-28 sm:w-28"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
          )}
        </div>
      </div>

      {hasPreview && (
        <div
          className="mt-5 rounded-2xl border p-4 sm:p-5"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--bg-card)',
            boxShadow: '0 1px 0 0 rgba(255,255,255,0.04) inset',
          }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
            {t('pages.stories.previewLabel')}
          </p>
          <div
            className="mx-auto max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-black"
            style={{ aspectRatio: '9 / 16', maxHeight: 'min(70vh, 480px)' }}
          >
            <div className="flex h-full min-h-0 w-full min-w-0 flex-col">
              <div className="shrink-0 border-b border-white/10 px-2 py-1.5 text-left text-xs font-semibold text-white/90">
                {auth.user.name}
              </div>
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {!imagePreviewUrl && !videoPreviewUrl ? (
                  <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-4 text-center text-sm leading-relaxed text-white/95 sm:text-base">
                    {form.data.body?.trim() || t('pages.stories.previewEmpty')}
                  </div>
                ) : (
                  <>
                    <div className="relative min-h-0 flex-1 bg-black">
                      {imagePreviewUrl && (
                        <img src={imagePreviewUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      )}
                      {videoPreviewUrl && (
                        <video
                          src={videoPreviewUrl}
                          className="absolute inset-0 h-full w-full object-cover"
                          controls
                          muted
                          playsInline
                        />
                      )}
                    </div>
                    {form.data.body?.trim() && (
                      <p className="shrink-0 border-t border-white/10 px-3 py-2 text-left text-xs text-white/90">
                        {form.data.body}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="submit"
          className="inline-flex min-h-12 w-full min-w-0 items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:brightness-110 disabled:pointer-events-none disabled:opacity-40 sm:ml-auto sm:w-auto"
          disabled={form.processing || (!form.data.body?.trim() && !form.data.media)}
        >
          {form.processing ? <Ic.Spin /> : t('pages.stories.publish')}
        </button>
      </div>

      {(form.errors.media || form.errors.body) && (
        <p className="mt-3 rounded-lg border px-3 py-2 text-sm" style={{ color: '#fecaca', borderColor: 'rgba(248,113,113,0.35)', background: 'rgba(127,29,29,0.2)' }} role="alert">
          {form.errors.media || form.errors.body}
        </p>
      )}
    </form>
  );
}

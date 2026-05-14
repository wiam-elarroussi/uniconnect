import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Avatar from './Avatar';
import { Ic } from './Icons';

const POST_BODY_MAX = 100000;
const MAX_CAROUSEL = 10;
const MAX_BLOCKS = 20;

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/** @typedef {{ id: string, type: 'text', text: string } | { id: string, type: 'file', file: File }} Block */

/**
 * Fils du post = suite ordonnée de blocs texte et de fichiers (même logique côté serveur).
 * @param {{ auth: object, isFocusMode: boolean, onSubmit: (formData: FormData, onSuccess: () => void) => void, processing: boolean, errors: object, channels?: object[] }} props
 */
export default function Composer({ auth, isFocusMode, onSubmit, processing, errors, channels = [] }) {
  const { t } = useTranslation();
  const [blocks, setBlocks] = useState(/** @type {Block[]} */ () => []);
  const [channelId, setChannelId] = useState('');
  const mediaInputRef = useRef(null);

  const fileBlocksInOrder = useMemo(() => blocks.filter((b) => b.type === 'file' && b.file), [blocks]);
  const filePreviews = useMemo(
    () => fileBlocksInOrder.map((b) => (b.type === 'file' && b.file ? { url: URL.createObjectURL(b.file), isVideo: b.file.type.startsWith('video/') } : null)).filter(Boolean),
    [fileBlocksInOrder]
  );

  useEffect(() => {
    return () => filePreviews.forEach((m) => URL.revokeObjectURL(m.url));
  }, [filePreviews]);

  const charTotal = useMemo(
    () => blocks.reduce((a, b) => a + (b.type === 'text' ? b.text.length : 0), 0),
    [blocks]
  );
  const fileCount = fileBlocksInOrder.length;

  const canContinue = useMemo(() => {
    if (isFocusMode) return false;
    const hasText = blocks.some((b) => b.type === 'text' && b.text.trim().length > 0);
    return hasText || fileCount > 0;
  }, [blocks, isFocusMode, fileCount]);

  const buildApiPayload = () => {
    const items = /** @type {{ type: string, text?: string }[]} */ [];
    for (const b of blocks) {
      if (b.type === 'text' && b.text?.trim()) {
        items.push({ type: 'text', text: b.text.trim() });
      } else if (b.type === 'file' && b.file) {
        items.push({ type: 'media' });
      }
    }
    const files = fileBlocksInOrder.map((b) => (b.type === 'file' ? b.file : null)).filter(Boolean);
    return { items, files };
  };

  const onPickFiles = (e) => {
    const raw = e.target?.files;
    if (!raw?.length) return;
    const next = Array.from(raw).filter(
      (f) => f.type.startsWith('image/') || f.type.startsWith('video/') || f.type === 'application/octet-stream'
    );
    if (!next.length) {
      e.target.value = '';
      return;
    }
    setBlocks((prev) => {
      const n = prev.filter((b) => b.type === 'file' && b.file).length;
      const room = Math.max(0, MAX_CAROUSEL - n);
      const take = next.slice(0, room);
      const added = take.map((file) => ({ id: genId(), type: 'file', file }));
      if (prev.length + added.length > MAX_BLOCKS) {
        return [...prev, ...added].slice(0, MAX_BLOCKS);
      }
      return [...prev, ...added];
    });
    e.target.value = '';
  };

  const addTextBlock = () => {
    setBlocks((prev) => (prev.length >= MAX_BLOCKS ? prev : [...prev, { id: genId(), type: 'text', text: '' }]));
  };

  const removeBlock = (i) => {
    setBlocks((prev) => prev.filter((_, j) => j !== i));
  };

  const moveBlock = (from, to) => {
    setBlocks((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      if (from < 0 || from >= prev.length) return prev;
      const a = [...prev];
      const [x] = a.splice(from, 1);
      a.splice(to, 0, x);
      return a;
    });
  };

  const onDropFileAt = (e, toIndex) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('application/x-uc-bi') || e.dataTransfer.getData('text/plain');
    const from = Number.parseInt(String(raw), 10);
    if (Number.isNaN(from) || from === toIndex) return;
    moveBlock(from, toIndex);
  };

  const handlePublish = () => {
    if (!canContinue) return;
    const { items, files } = buildApiPayload();
    if (items.length === 0) return;
    const formData = new FormData();
    formData.append('items', JSON.stringify(items));
    files.forEach((f) => formData.append('media[]', f));
    if (channelId) formData.append('channel_id', String(channelId));
    onSubmit(formData, () => {
      setBlocks([]);
      setChannelId('');
    });
  };

  return (
    <div
      className="relative overflow-visible"
      style={{
        background: 'var(--panel-bg)',
      }}
    >
      {isFocusMode && (
        <div className="flex items-center gap-3 px-5 py-3.5" style={{ background: 'rgba(246,173,85,0.07)', borderBottom: '1px solid rgba(246,173,85,0.15)' }}>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'rgba(246,173,85,0.15)' }}>
            <span style={{ color: '#f6ad55' }}>
              <Ic.Moon />
            </span>
          </div>
          <div>
            <p className="font-display text-xs font-bold" style={{ color: '#f6ad55' }}>
              {t('dashboard.composer.focusTitle')}
            </p>
            <p className="text-[10px]" style={{ color: 'rgba(246,173,85,0.6)' }}>
              {t('dashboard.composer.focusSubtitle')}
            </p>
          </div>
        </div>
      )}

      <div className="px-3 pb-6 pt-1 sm:px-5 sm:pb-8">
        <div className="flex items-start gap-3 sm:gap-4">
          <Avatar name={auth.user.name} size="md" src={auth.user.avatar_url} builder={auth.user.avatar_builder} online pulse />
          <div className="min-w-0 flex-1 space-y-3 sm:space-y-4" aria-describedby="composer-sr-instructions">
            <p id="composer-sr-instructions" className="sr-only">
              {t('dashboard.composer.helpScreenReader')}
            </p>

            {!isFocusMode && (
              <p className="w-full text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
                {t('dashboard.composer.stepEdit')}
              </p>
            )}

            {!isFocusMode && (
              <>
                <input
                  ref={mediaInputRef}
                  type="file"
                  className="sr-only"
                  accept="image/*,video/mp4,video/webm,video/quicktime,.heic,.heif"
                  multiple
                  onChange={onPickFiles}
                />

                <div className="space-y-2.5">
                  {blocks.length === 0 && (
                    <div
                      className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2"
                      role="group"
                      aria-label={t('dashboard.composer.composerStartEmpty')}
                    >
                      <button
                        type="button"
                        onClick={addTextBlock}
                        disabled={blocks.length >= MAX_BLOCKS}
                        className="flex min-h-32 flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed px-4 py-4 transition active:scale-[0.99] disabled:opacity-40"
                        style={{
                          borderColor: 'rgba(56,189,248,0.4)',
                          background: 'linear-gradient(180deg, rgba(56,189,248,0.08), var(--bg-card))',
                        }}
                        title={t('dashboard.composer.addTextBlock')}
                        aria-label={t('dashboard.composer.addTextBlock')}
                      >
                        <div
                          className="flex h-16 w-16 items-center justify-center rounded-2xl"
                          style={{ background: 'rgba(56,189,248,0.16)', color: 'var(--accent-1)' }}
                        >
                          <span className="scale-[1.4]">
                            <Ic.TypeText />
                          </span>
                        </div>
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-full text-base font-bold"
                          style={{ background: 'var(--accent-1)', color: '#fff' }}
                        >
                          +
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (fileCount < MAX_CAROUSEL) mediaInputRef.current?.click();
                        }}
                        disabled={blocks.length >= MAX_BLOCKS || fileCount >= MAX_CAROUSEL}
                        className="flex min-h-32 flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed px-4 py-4 transition active:scale-[0.99] disabled:opacity-40"
                        style={{
                          borderColor: 'rgba(167,139,250,0.4)',
                          background: 'linear-gradient(180deg, rgba(167,139,250,0.08), var(--bg-card))',
                        }}
                        title={t('dashboard.composer.addMedia')}
                        aria-label={t('dashboard.composer.addMedia')}
                      >
                        <div
                          className="flex h-16 w-16 items-center justify-center gap-0.5 rounded-2xl"
                          style={{ background: 'rgba(167,139,250,0.16)', color: 'var(--accent-2)' }}
                        >
                          <span className="scale-150">
                            <Ic.Image />
                          </span>
                          <span className="scale-125">
                            <Ic.Video />
                          </span>
                        </div>
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-full text-base font-bold"
                          style={{ background: 'var(--accent-2)', color: '#fff' }}
                        >
                          +
                        </span>
                      </button>
                    </div>
                  )}
                  {blocks.map((b, i) => (
                    <div
                      key={b.id}
                      className="rounded-2xl border p-3 sm:p-4"
                      style={{
                        borderColor: b.type === 'text' ? 'rgba(56,189,248,0.25)' : 'rgba(167,139,250,0.3)',
                        background: 'var(--bg-card)',
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => onDropFileAt(e, i)}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold" style={{ color: 'var(--text-2)' }}>
                          {b.type === 'text' ? (
                            <span
                              className="inline-flex h-8 w-8 items-center justify-center rounded-xl"
                              style={{ color: 'var(--accent-1)', background: 'rgba(56,189,248,0.12)' }}
                              title={t('dashboard.composer.blockText')}
                              aria-label={t('dashboard.composer.blockText')}
                            >
                              <span className="scale-110">
                                <Ic.TypeText />
                              </span>
                            </span>
                          ) : (
                            <span
                              className="inline-flex h-8 w-8 items-center justify-center rounded-xl"
                              style={{ color: 'var(--accent-2)', background: 'rgba(167,139,250,0.12)' }}
                              title={
                                b.file?.type?.startsWith('video/')
                                  ? t('dashboard.composer.uxVideos')
                                  : t('dashboard.composer.uxPhotos')
                              }
                              aria-label={
                                b.file?.type?.startsWith('video/')
                                  ? t('dashboard.composer.uxVideos')
                                  : t('dashboard.composer.uxPhotos')
                              }
                            >
                              <span className="scale-110">
                                {b.file?.type?.startsWith('video/') ? <Ic.Video /> : <Ic.Image />}
                              </span>
                            </span>
                          )}
                        </span>
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => moveBlock(i, i - 1)}
                            disabled={i === 0}
                            className="rounded-md border px-1.5 py-0.5 text-[10px] font-extrabold disabled:opacity-30"
                            style={{ borderColor: 'var(--border)', color: 'var(--text-1)' }}
                            aria-label={t('dashboard.composer.reorderEarlier')}
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBlock(i, i + 1)}
                            disabled={i === blocks.length - 1}
                            className="rounded-md border px-1.5 py-0.5 text-[10px] font-extrabold disabled:opacity-30"
                            style={{ borderColor: 'var(--border)', color: 'var(--text-1)' }}
                            aria-label={t('dashboard.composer.reorderLater')}
                          >
                            ›
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBlock(i)}
                            className="ml-0.5 rounded-md px-1.5 text-[10px] font-extrabold"
                            style={{ color: '#fc8181' }}
                            title={t('dashboard.composer.removeBlock', { defaultValue: 'Retirer ce bloc' })}
                            aria-label={t('dashboard.composer.removeBlock', { defaultValue: 'Retirer ce bloc' })}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      {b.type === 'text' && (
                        <textarea
                          value={b.text}
                          onChange={(e) => {
                            if (e.target.value.length > POST_BODY_MAX) return;
                            setBlocks((prev) => {
                              const next = [...prev];
                              if (next[i].type === 'text') {
                                next[i] = { ...next[i], text: e.target.value };
                              }
                              return next;
                            });
                          }}
                          placeholder={t('dashboard.composer.typePlaceholder')}
                          aria-label={t('dashboard.composer.textBlockPlaceholder')}
                          rows={4}
                          className="w-full resize-y max-h-48 sm:max-h-64 rounded-xl border px-3 py-2.5 text-sm leading-relaxed outline-none sm:text-base"
                          style={{ color: 'var(--text-1)', background: 'var(--panel-bg)', borderColor: 'var(--border)' }}
                        />
                      )}
                      {b.type === 'file' && b.file && (() => {
                        const fIdx = fileBlocksInOrder.findIndex((x) => x.id === b.id);
                        const pv = fIdx >= 0 ? filePreviews[fIdx] : null;
                        if (!pv) return null;
                        return (
                        <div className="relative">
                          <div
                            role="img"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('application/x-uc-bi', String(i));
                              e.dataTransfer.setData('text/plain', String(i));
                              e.dataTransfer.effectAllowed = 'move';
                            }}
                            className="flex h-40 cursor-grab items-center justify-center overflow-hidden rounded-xl border active:cursor-grabbing"
                            style={{ borderColor: 'var(--border)' }}
                          >
                            {pv.isVideo ? (
                              <span className="text-2xl font-bold" style={{ color: 'var(--text-2)' }}>
                                ▶
                              </span>
                            ) : (
                              <img src={pv.url} alt="" className="h-full w-full object-contain" />
                            )}
                          </div>
                        </div>
                        );
                      })()}
                    </div>
                  ))}
                </div>

                {blocks.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={addTextBlock}
                      disabled={blocks.length >= MAX_BLOCKS}
                      className="flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl border border-dashed px-3 text-xs font-bold"
                      style={{ borderColor: 'var(--border)', color: 'var(--accent-1)' }}
                      title={t('dashboard.composer.addTextBlock')}
                      aria-label={t('dashboard.composer.addTextBlock')}
                    >
                      <span className="shrink-0 text-sky-400 [&_svg]:h-5 [&_svg]:w-5">
                        <Ic.TypeText />
                      </span>
                      <span className="font-black" style={{ color: 'var(--accent-1)' }}>
                        +
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (fileCount < MAX_CAROUSEL) mediaInputRef.current?.click();
                      }}
                      disabled={blocks.length >= MAX_BLOCKS || fileCount >= MAX_CAROUSEL}
                      className="flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-2xl border border-dashed px-3 text-xs font-bold"
                      style={{ borderColor: 'var(--border)', color: 'var(--accent-2)' }}
                      title={t('dashboard.composer.addMedia')}
                      aria-label={t('dashboard.composer.addMedia')}
                    >
                      <span className="shrink-0" style={{ color: 'var(--accent-1)' }}>
                        <Ic.Image />
                      </span>
                      <span className="shrink-0" style={{ color: 'var(--accent-2)' }}>
                        <Ic.Video />
                      </span>
                      <span className="font-black" style={{ color: 'var(--accent-2)' }}>
                        +
                      </span>
                    </button>
                  </div>
                )}
                {fileCount > 0 && (
                  <div
                    className="flex items-center justify-center gap-1.5"
                    style={{ color: 'var(--text-2)' }}
                    aria-label={t('dashboard.composer.carouselCount', { n: fileCount, max: MAX_CAROUSEL })}
                  >
                    <span className="opacity-80" style={{ color: 'var(--accent-1)' }}>
                      <Ic.CarouselStack />
                    </span>
                    <span className="text-sm font-black tabular-nums">
                      {fileCount} / {MAX_CAROUSEL}
                    </span>
                  </div>
                )}

                {channels.length > 0 && (
                  <fieldset
                    className="rounded-2xl border p-3 sm:p-4"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
                    aria-label={t('dashboard.composer.publishAsChannel')}
                  >
                    <legend
                      className="flex w-full items-center justify-center gap-2 px-0.5 sm:justify-start"
                      style={{ color: 'var(--text-2)' }}
                    >
                      <span className="text-[var(--accent-1)] [&_svg]:h-4 [&_svg]:w-4" aria-hidden>
                        <Ic.Users />
                      </span>
                      <span className="sr-only">{t('dashboard.composer.publishAsChannel')}</span>
                    </legend>
                    <div className="mt-2.5 flex flex-wrap gap-2" role="radiogroup" aria-label={t('dashboard.composer.publishAsChannel')}>
                      <button
                        type="button"
                        onClick={() => setChannelId('')}
                        className="inline-flex min-h-[2.75rem] items-center gap-2 rounded-2xl px-3.5 py-2 text-left text-sm font-bold transition-all"
                        style={{
                          border: channelId === '' ? '2px solid var(--accent-1)' : '1.5px solid var(--border)',
                          background: channelId === '' ? 'rgba(99,179,237,0.14)' : 'var(--bg-card)',
                          color: 'var(--text-1)',
                          boxShadow: channelId === '' ? '0 0 0 1px rgba(99,179,237,0.25)' : 'none',
                        }}
                        aria-pressed={channelId === ''}
                      >
                        {t('dashboard.composer.personalAccount')}
                      </button>
                      {channels.map((c) => {
                        const idStr = String(c.id);
                        const active = channelId === idStr;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setChannelId(idStr)}
                            className="inline-flex min-h-[2.75rem] max-w-full min-w-0 items-center gap-2 rounded-2xl px-3.5 py-2 text-left text-sm font-bold transition-all"
                            style={{
                              border: active ? '2px solid var(--accent-1)' : '1.5px solid var(--border)',
                              background: active ? 'rgba(99,179,237,0.14)' : 'var(--bg-card)',
                              color: 'var(--text-1)',
                              boxShadow: active ? '0 0 0 1px rgba(99,179,237,0.25)' : 'none',
                            }}
                            aria-pressed={active}
                            title={c.name}
                          >
                            <span className="min-w-0 truncate">{c.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                )}

                <div className="flex items-center justify-between gap-3 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-1.5 text-[10px] tabular-nums" style={{ color: 'var(--text-3)' }} title={t('dashboard.composer.charBudget')}>
                    <span className="opacity-70" style={{ color: 'var(--accent-1)' }} aria-hidden>
                      <Ic.TypeText />
                    </span>
                    <span>
                      {charTotal.toLocaleString()} / {POST_BODY_MAX.toLocaleString()}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={!canContinue || processing}
                    className="ml-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white sm:h-11 sm:w-11"
                    style={{
                      background: canContinue
                        ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
                        : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                      opacity: canContinue && !processing ? 1 : 0.45,
                      boxShadow: canContinue ? '0 0 18px rgba(99,130,237,0.35)' : 'none',
                      transition: 'opacity 0.2s, box-shadow 0.2s',
                    }}
                    title={t('dashboard.composer.publish')}
                    aria-label={t('dashboard.composer.publish')}
                  >
                    {processing ? <Ic.Spin /> : <Ic.Send />}
                  </button>
                </div>
              </>
            )}


            {errors?.body && <p className="mt-1 text-xs" style={{ color: '#fc8181' }}>⚠ {errors.body}</p>}
            {errors?.items && <p className="mt-1 text-xs" style={{ color: '#fc8181' }}>⚠ {errors.items}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

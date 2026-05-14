import Avatar from '@/Components/Dashboard/Avatar';
import { feedGlassAside, feedGlassMain } from '@/Components/Layout/feedPageSurface';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function MessagesIndex({
  contacts = [],
  groupConversations = [],
  selectedUserId,
  selectedConversationId,
  selectedUser = null,
  conversation,
  campusPeers = [],
}) {
  const { t, i18n } = useTranslation();
  const { auth } = usePage().props;
  const myId = auth.user.id;
  const [listTab, setListTab] = useState('direct');
  const [showCompose, setShowCompose] = useState(false);
  const [body, setBody] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [micToast, setMicToast] = useState(false);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordTimerRef = useRef(null);
  const [groupModal, setGroupModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const groupForm = useForm({ name: '', member_ids: [] });

  const dateLocale =
    i18n.language === 'ar' ? 'ar-MA' : i18n.language === 'en' ? 'en-US' : 'fr-FR';

  const formatTime = useCallback(
    (iso) => {
      if (!iso) return '';
      const d = new Date(iso);
      return d.toLocaleString(dateLocale, {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    [dateLocale],
  );

  const previewSnippet = useCallback(
    (m) => {
      if (!m) return '';
      if (m.content_type === 'image') {
        return m.sender_id === myId ? t('pages.messages.previewPhotoYou') : t('pages.messages.previewPhoto');
      }
      if (m.content_type === 'audio') {
        return m.sender_id === myId ? t('pages.messages.previewAudioYou') : t('pages.messages.previewAudio');
      }
      return m.body || '';
    },
    [myId, t],
  );

  useEffect(() => {
    if (!mediaFile) { setMediaPreviewUrl(null); return; }
    const url = URL.createObjectURL(mediaFile);
    setMediaPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [mediaFile]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      recordedChunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        setMediaFile(new File([blob], 'audio.webm', { type: 'audio/webm' }));
        setRecording(false);
        setRecordingTime(0);
        clearInterval(recordTimerRef.current);
      };
      mr.start(100);
      mediaRecorderRef.current = mr;
      setRecording(true);
      setRecordingTime(0);
      recordTimerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } catch {
      setMicToast(true);
      setTimeout(() => setMicToast(false), 4000);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recording) {
      clearInterval(recordTimerRef.current);
      mediaRecorderRef.current.stop();
    }
  }, [recording]);

  const messages = (conversation?.messages || [])
    .slice()
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  const selectedContact = contacts.find((c) => c.id === selectedUserId) || selectedUser;
  const isGroupView = Boolean(selectedConversationId && conversation?.type === 'group');
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const lastMessageCountRef = useRef(messages.length);
  const isAtBottomRef = useRef(true);

  // Scroll to bottom when messages arrive or conversation changes
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const newCount = messages.length;
    const wasAtBottom = isAtBottomRef.current;
    // Always scroll on conversation switch; on new message only if already at bottom
    if (newCount !== lastMessageCountRef.current || selectedUserId || selectedConversationId) {
      if (wasAtBottom || newCount !== lastMessageCountRef.current) {
        container.scrollTop = container.scrollHeight;
      }
    }
    lastMessageCountRef.current = newCount;
  }, [messages.length, selectedUserId, selectedConversationId]);

  // Track if user scrolled away from bottom
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 60;
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [selectedUserId, selectedConversationId]);

  // Polling : recharge les messages toutes les 4s quand une conversation est ouverte
  useEffect(() => {
    if (!selectedUserId && !selectedConversationId) return;
    const interval = setInterval(() => {
      router.reload({ only: ['conversation', 'contacts', 'groupConversations'], preserveScroll: true });
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedUserId, selectedConversationId]);

  const hasActiveConversation = Boolean(selectedUserId || selectedConversationId);

  const submitMessage = (e) => {
    e.preventDefault();
    const text = body.trim();
    if (!text && !mediaFile) return;

    const fd = new FormData();
    fd.append('body', text);
    if (mediaFile) fd.append('media', mediaFile);
    if (isGroupView) {
      fd.append('conversation_id', String(selectedConversationId));
    } else {
      fd.append('receiver_id', String(selectedUserId));
    }

    router.post(route('messages.store'), fd, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setBody('');
        setMediaFile(null);
        setMediaPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
    });
  };

  const openCreateGroup = () => {
    groupForm.reset();
    groupForm.clearErrors();
    setGroupModal(true);
  };

  const submitCreateGroup = (e) => {
    e.preventDefault();
    groupForm.post(route('messages.groups.store'), {
      preserveScroll: true,
      onSuccess: () => {
        setGroupModal(false);
        groupForm.reset();
      },
    });
  };

  const toggleMember = (id) => {
    const ids = groupForm.data.member_ids || [];
    const n = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
    groupForm.setData('member_ids', n);
  };

  const requestDeleteConversation = (payload) => {
    setDeleteTarget(payload);
  };

  const confirmDeleteConversation = () => {
    if (!deleteTarget) return;
    router.delete(deleteTarget.href, {
      preserveScroll: true,
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <AuthenticatedLayout layoutVariant="feed">
      <Head title={t('pages.messages.headTitle')} />

      {/* Microphone error toast */}
      {micToast && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium"
          style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', backdropFilter: 'blur(12px)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 flex-shrink-0">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          {t('pages.messages.micDenied', { defaultValue: 'Accès au microphone refusé.' })}
        </div>
      )}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-white dark:bg-zinc-950 lg:mx-auto lg:max-w-5xl lg:flex-row lg:border-x lg:border-neutral-200 dark:lg:border-zinc-800">
        <aside
          className={
            hasActiveConversation
              ? 'hidden md:flex md:w-72 md:flex-shrink-0 md:flex-col md:overflow-hidden md:border-r md:border-neutral-100 md:bg-white md:dark:border-zinc-800 md:dark:bg-zinc-950 lg:w-[min(100%,400px)]'
              : 'flex w-full flex-shrink-0 flex-col overflow-hidden bg-white dark:bg-zinc-950 md:w-72 md:border-r md:border-neutral-100 md:dark:border-zinc-800 lg:w-[min(100%,400px)]'
          }
        >
          <div className="flex items-center justify-between px-4 pb-2 pt-3">
            <h1 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
              {t('pages.messages.header')}
            </h1>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCompose(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                title="Nouveau message"
                aria-label="Nouveau message"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              {listTab === 'groups' && (
                <button
                  type="button"
                  onClick={openCreateGroup}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-lg font-semibold text-blue-600 hover:bg-neutral-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                  title={t('pages.messages.newGroup')}
                  aria-label={t('pages.messages.newGroup')}
                >
                  +
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-2 px-4 pb-3">
            <button
              type="button"
              onClick={() => setListTab('direct')}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                listTab === 'direct'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {t('pages.messages.tabDirect')}
            </button>
            <button
              type="button"
              onClick={() => setListTab('groups')}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                listTab === 'groups'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {t('pages.messages.tabGroups')}
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {listTab === 'direct' && (
              <>
                {contacts.length === 0 && (
                  <p className="px-4 pb-6 text-center text-sm text-neutral-500">
                    {t('pages.messages.noContacts')}
                    <span className="mt-2 block text-xs text-neutral-400">{t('pages.messages.noContactsFollowHint')}</span>
                  </p>
                )}
                {contacts.map((c) => (
                  <div
                    key={c.id}
                    className={`flex items-center gap-2 px-2 py-1.5 ${
                      selectedUserId === c.id && !selectedConversationId ? 'bg-neutral-50 dark:bg-zinc-900' : ''
                    }`}
                  >
                    <Link
                      href={route('messages.index', { user_id: c.id })}
                      className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-neutral-50 dark:hover:bg-zinc-900"
                    >
                      <Avatar
                        name={c.name}
                        size="lg"
                        src={c.avatar_url}
                        builder={c.avatar_builder}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="truncate text-[15px] font-semibold text-neutral-900 dark:text-white">{c.name}</p>
                          {c.last_message?.created_at && (
                            <span className="shrink-0 text-xs text-neutral-400">{formatTime(c.last_message.created_at)}</span>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center justify-between gap-2">
                          <p className="truncate text-sm text-neutral-500 dark:text-zinc-400">
                            {c.last_message ? (
                              <span
                                className={
                                  c.unread_count > 0 && c.last_message?.sender_id !== myId
                                    ? 'font-semibold text-neutral-800 dark:text-zinc-200'
                                    : ''
                                }
                              >
                                {c.last_message.sender_id === myId ? t('pages.messages.youPrefix') : ''}
                                {previewSnippet(c.last_message)}
                              </span>
                            ) : (
                              <span className="text-neutral-400">{c.email}</span>
                            )}
                          </p>
                          {c.unread_count > 0 && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" aria-hidden />
                          )}
                        </div>
                      </div>
                    </Link>
                    {c.conversation_id ? (
                      <button
                        type="button"
                        className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-neutral-300 hover:bg-red-50 hover:text-red-500 dark:text-zinc-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors text-sm"
                          onClick={() =>
                            requestDeleteConversation({
                              href: route('messages.direct.destroy', c.id),
                              title: c.name,
                            })}
                        aria-label={t('pages.messages.deleteConversation', { defaultValue: 'Supprimer' })}
                      >
                        ✕
                      </button>
                    ) : null}
                  </div>
                ))}
              </>
            )}

            {listTab === 'groups' && (
              <>
                {groupConversations.length === 0 && (
                  <p className="px-4 pb-6 text-center text-sm text-neutral-500">{t('pages.messages.noGroups')}</p>
                )}
                {groupConversations.map((g) => (
                  <div
                    key={g.id}
                    className={`flex items-center gap-2 px-2 py-1.5 ${selectedConversationId === g.id ? 'bg-neutral-50 dark:bg-zinc-900' : ''}`}
                  >
                    <Link
                      href={route('messages.index', { conversation_id: g.id })}
                      className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-neutral-50 dark:hover:bg-zinc-900"
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white">
                        G
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="truncate text-[15px] font-semibold text-neutral-900 dark:text-white">{g.title}</p>
                          {g.unread_count > 0 && <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />}
                        </div>
                        <p className="mt-0.5 truncate text-sm text-neutral-500 dark:text-zinc-400">
                          {g.last_message
                            ? previewSnippet(g.last_message)
                            : t('pages.messages.membersCount', { count: g.members?.length || 0 })}
                        </p>
                      </div>
                    </Link>
                    <button
                      type="button"
                      className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-neutral-300 hover:bg-red-50 hover:text-red-500 dark:text-zinc-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors text-sm"
                      onClick={() =>
                        requestDeleteConversation({
                          href: route('messages.groups.destroy', g.id),
                          title: g.title,
                        })}
                      aria-label={t('pages.messages.deleteConversation', { defaultValue: 'Supprimer' })}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </aside>

          <section
            className={
              (hasActiveConversation
                ? 'flex min-h-[min(52dvh,520px)] flex-1 flex-col '
                : 'hidden min-h-[min(52dvh,520px)] flex-1 flex-col md:flex ') +
              feedGlassMain +
              ' md:min-h-[min(100dvh-5rem,800px)]'
            }
          >
            {!selectedUserId && !selectedConversationId && (
              <div className="flex-1 flex items-center justify-center p-6 sm:p-8 text-center text-slate-500 text-sm">
                {t('pages.messages.selectConversation')}
              </div>
            )}

            {selectedConversationId && (!conversation || conversation.type !== 'group') && (
              <div className="flex-1 flex items-center justify-center p-6 sm:p-8 text-center text-slate-500 text-sm">
                {t('pages.messages.conversationNotFound')}
              </div>
            )}

            {selectedUserId && !selectedConversationId && (
              <>
                <div className="flex flex-shrink-0 items-center gap-3 border-b border-neutral-200/80 bg-white/90 px-4 py-3 backdrop-blur-sm dark:border-zinc-700/80 dark:bg-slate-950/55">
                  <Link
                    href={route('messages.index')}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg text-neutral-700 hover:bg-neutral-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    aria-label={t('pages.messages.backList', { defaultValue: 'Retour' })}
                  >
                    ←
                  </Link>
                  {selectedContact && (
                    <Avatar
                      name={selectedContact.name}
                      size="lg"
                      src={selectedContact.avatar_url}
                      builder={selectedContact.avatar_builder}
                    />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-neutral-900 dark:text-white">
                      {selectedContact?.name ?? t('pages.messages.conversationFallback')}
                    </p>
                    <p className="truncate text-xs text-neutral-500 dark:text-zinc-400">{selectedContact?.email}</p>
                  </div>
                </div>

                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 min-h-0">
                  {messages.map((m) => {
                    const mine = m.sender_id === myId;
                    return (
                      <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[min(85%,420px)] rounded-2xl px-3 py-2 shadow-sm ${
                            mine
                              ? 'bg-blue-600 text-white rounded-br-sm'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
                          }`}
                        >
                          {!mine && (
                            <p className="text-[10px] font-bold opacity-80 mb-0.5">{m.sender?.name}</p>
                          )}
                          {m.content_type === 'image' && m.media_url && (
                            <img src={m.media_url} alt="" className="rounded-lg max-h-48 w-auto mb-1" />
                          )}
                          {m.content_type === 'audio' && m.media_url && (
                            <audio controls src={m.media_url} className="max-w-full h-8 mb-1">
                              <track kind="captions" />
                            </audio>
                          )}
                          {m.body ? <p className="text-sm whitespace-pre-wrap break-words">{m.body}</p> : null}
                          <p className={`text-[10px] mt-1 ${mine ? 'text-blue-100' : 'text-slate-400'}`}>
                            {formatTime(m.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={submitMessage}
                  className="p-3 border-t border-slate-200/80 bg-white/90 backdrop-blur-sm dark:bg-slate-950/55 flex flex-col gap-2 flex-shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
                >
                  {mediaFile && (
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700">
                      {mediaFile.type.startsWith('image/') && mediaPreviewUrl && (
                        <img src={mediaPreviewUrl} alt="" className="h-14 w-14 object-cover rounded-lg flex-shrink-0" />
                      )}
                      {mediaFile.type.startsWith('audio/') && (
                        <span className="text-xl shrink-0">🎵</span>
                      )}
                      <span className="text-xs text-slate-600 dark:text-zinc-300 truncate flex-1">{mediaFile.name}</span>
                      <button type="button" onClick={() => setMediaFile(null)}
                        className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 text-xs font-bold hover:bg-red-100 hover:text-red-600">
                        ×
                      </button>
                    </div>
                  )}
                  {recording && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                        Enregistrement… {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:{(recordingTime % 60).toString().padStart(2, '0')}
                      </span>
                      <button type="button" onClick={stopRecording}
                        className="ml-auto text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded-lg">
                        ■ Stop
                      </button>
                    </div>
                  )}
                  <div className="flex flex-row gap-2 items-end">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                    />
                    <button
                      type="button"
                      className="shrink-0 h-11 w-11 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-500 bg-white dark:bg-zinc-800 flex items-center justify-center hover:bg-slate-50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                      title={t('pages.messages.media')}
                      aria-label={t('pages.messages.media')}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <rect x="3" y="3" width="18" height="18" rx="3"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={recording ? stopRecording : startRecording}
                      disabled={!!mediaFile && !recording}
                      className={`shrink-0 h-11 w-11 rounded-xl border flex items-center justify-center transition-colors ${
                        recording
                          ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-500'
                          : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-500 hover:bg-slate-50 disabled:opacity-40'
                      }`}
                      title="Enregistrer un audio"
                      aria-label="Enregistrer un audio"
                    >
                      <svg className="w-5 h-5" fill={recording ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <rect x="9" y="2" width="6" height="12" rx="3"/>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                        <line x1="12" y1="19" x2="12" y2="22"/>
                        <line x1="8" y1="22" x2="16" y2="22"/>
                      </svg>
                    </button>
                    <input
                      className="flex-1 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm min-w-0 min-h-[44px] bg-white dark:bg-zinc-800 text-slate-900 dark:text-white"
                      placeholder={t('pages.messages.placeholderDm')}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitMessage(e); } }}
                    />
                    <button
                      type="submit"
                      className="shrink-0 h-11 w-11 rounded-xl bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 hover:bg-blue-500 transition-colors"
                      disabled={!body.trim() && !mediaFile}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </button>
                  </div>
                </form>
              </>
            )}

            {selectedConversationId && isGroupView && (
              <>
                <div className="flex flex-shrink-0 items-center gap-3 border-b border-neutral-200/80 bg-white/90 px-4 py-3 backdrop-blur-sm dark:border-zinc-700/80 dark:bg-slate-950/55">
                  <Link
                    href={route('messages.index')}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg text-neutral-700 hover:bg-neutral-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    aria-label={t('pages.messages.backList', { defaultValue: 'Retour' })}
                  >
                    ←
                  </Link>
                  <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-neutral-900 dark:text-white">{conversation.title}</p>
                  <p className="line-clamp-2 text-xs text-neutral-500 dark:text-zinc-400">
                    {(conversation?.members || []).map((m) => m.name).join(', ')}
                  </p>
                  </div>
                </div>

                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 min-h-0">
                  {messages.map((m) => {
                    const mine = m.sender_id === myId;
                    return (
                      <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[min(85%,420px)] rounded-2xl px-3 py-2 shadow-sm ${
                            mine
                              ? 'bg-emerald-600 text-white rounded-br-sm'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
                          }`}
                        >
                          {!mine && (
                            <p className="text-[10px] font-bold opacity-80 mb-0.5">{m.sender?.name}</p>
                          )}
                          {m.content_type === 'image' && m.media_url && (
                            <img src={m.media_url} alt="" className="rounded-lg max-h-48 w-auto mb-1" />
                          )}
                          {m.content_type === 'audio' && m.media_url && (
                            <audio controls src={m.media_url} className="max-w-full h-8 mb-1">
                              <track kind="captions" />
                            </audio>
                          )}
                          {m.body ? <p className="text-sm whitespace-pre-wrap break-words">{m.body}</p> : null}
                          <p className={`text-[10px] mt-1 ${mine ? 'text-emerald-100' : 'text-slate-400'}`}>
                            {formatTime(m.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={submitMessage}
                  className="p-3 border-t border-slate-200/80 bg-white/90 backdrop-blur-sm dark:bg-slate-950/55 flex flex-col gap-2 flex-shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
                >
                  {mediaFile && (
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700">
                      {mediaFile.type.startsWith('image/') && mediaPreviewUrl && (
                        <img src={mediaPreviewUrl} alt="" className="h-14 w-14 object-cover rounded-lg flex-shrink-0" />
                      )}
                      {mediaFile.type.startsWith('audio/') && (
                        <span className="text-xl shrink-0">🎵</span>
                      )}
                      <span className="text-xs text-slate-600 dark:text-zinc-300 truncate flex-1">{mediaFile.name}</span>
                      <button type="button" onClick={() => setMediaFile(null)}
                        className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 text-xs font-bold hover:bg-red-100 hover:text-red-600">
                        ×
                      </button>
                    </div>
                  )}
                  {recording && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                        Enregistrement… {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:{(recordingTime % 60).toString().padStart(2, '0')}
                      </span>
                      <button type="button" onClick={stopRecording}
                        className="ml-auto text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-2 py-1 rounded-lg">
                        ■ Stop
                      </button>
                    </div>
                  )}
                  <div className="flex flex-row gap-2 items-end">
                    <button
                      type="button"
                      className="shrink-0 h-11 w-11 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-500 bg-white dark:bg-zinc-800 flex items-center justify-center hover:bg-slate-50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <rect x="3" y="3" width="18" height="18" rx="3"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={recording ? stopRecording : startRecording}
                      disabled={!!mediaFile && !recording}
                      className={`shrink-0 h-11 w-11 rounded-xl border flex items-center justify-center transition-colors ${
                        recording
                          ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-500'
                          : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-500 hover:bg-slate-50 disabled:opacity-40'
                      }`}
                    >
                      <svg className="w-5 h-5" fill={recording ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <rect x="9" y="2" width="6" height="12" rx="3"/>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                        <line x1="12" y1="19" x2="12" y2="22"/>
                        <line x1="8" y1="22" x2="16" y2="22"/>
                      </svg>
                    </button>
                    <input
                      className="flex-1 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm min-w-0 min-h-[44px] bg-white dark:bg-zinc-800 text-slate-900 dark:text-white"
                      placeholder={t('pages.messages.placeholderGroup')}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitMessage(e); } }}
                    />
                    <button
                      type="submit"
                      className="shrink-0 h-11 w-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center disabled:opacity-50 hover:bg-emerald-500 transition-colors"
                      disabled={!body.trim() && !mediaFile}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        </div>

        {showCompose && (
          <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 sm:items-center sm:p-4" onClick={() => setShowCompose(false)}>
            <div
              className="relative z-10 w-full max-w-sm rounded-t-3xl bg-white dark:bg-zinc-900 shadow-2xl sm:rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-zinc-800">
                <h2 className="text-base font-bold text-neutral-900 dark:text-white">Nouveau message</h2>
                <button type="button" onClick={() => setShowCompose(false)} className="text-neutral-500 text-lg hover:opacity-70">×</button>
              </div>
              <div className="max-h-[60dvh] overflow-y-auto py-2">
                {campusPeers.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-neutral-500">Aucun pair campus trouvé.</p>
                ) : (
                  campusPeers.map((peer) => (
                    <Link
                      key={peer.id}
                      href={route('messages.index', { user_id: peer.id })}
                      onClick={() => setShowCompose(false)}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-neutral-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Avatar name={peer.name} size="lg" src={peer.avatar_url} builder={peer.avatar_builder} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-sm text-neutral-900 dark:text-white">{peer.name}</p>
                        <p className="truncate text-xs text-neutral-500 dark:text-zinc-400">{peer.email}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {groupModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
            <div className="mt-auto flex max-h-[90dvh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-slate-950/90 shadow-2xl sm:mt-0 sm:max-h-[85vh] sm:rounded-2xl">
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
                <p className="font-bold text-white">{t('pages.messages.newGroupModalTitle')}</p>
                <button type="button" className="text-slate-300 text-sm hover:text-white" onClick={() => setGroupModal(false)}>
                  {t('pages.messages.close')}
                </button>
              </div>
              <form onSubmit={submitCreateGroup} className="p-4 flex flex-col gap-3 overflow-y-auto min-h-0">
                <div>
                  <label className="text-xs font-bold text-slate-300">{t('pages.messages.groupName')}</label>
                  <input
                    className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-white"
                    value={groupForm.data.name}
                    onChange={(e) => groupForm.setData('name', e.target.value)}
                    required
                  />
                  {groupForm.errors.name && <p className="text-xs text-red-600 mt-1">{groupForm.errors.name}</p>}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-300 mb-2">{t('pages.messages.membersHint')}</p>
                  <div className="max-h-48 overflow-y-auto rounded-xl border border-white/10 divide-y divide-white/5 bg-slate-900/60">
                    {campusPeers.map((p) => (
                      <label key={p.id} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-100 cursor-pointer hover:bg-white/5">
                        <input
                          type="checkbox"
                          checked={(groupForm.data.member_ids || []).includes(p.id)}
                          onChange={() => toggleMember(p.id)}
                        />
                        <span>{p.name}</span>
                      </label>
                    ))}
                  </div>
                  {groupForm.errors.member_ids && (
                    <p className="text-xs text-red-600 mt-1">{groupForm.errors.member_ids}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={groupForm.processing}
                  className="py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold disabled:opacity-50"
                >
                  {t('pages.messages.createGroup')}
                </button>
              </form>
            </div>
          </div>
        )}
        {deleteTarget && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
            <button
              type="button"
              className="absolute inset-0"
              aria-label={t('pages.messages.close')}
              onClick={() => setDeleteTarget(null)}
            />
            <div className="relative z-10 w-full max-w-sm rounded-t-2xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl sm:rounded-2xl">
              <p className="text-base font-bold text-white">
                {t('pages.messages.confirmDeleteConversation', { defaultValue: 'Supprimer cette conversation ?' })}
              </p>
              {deleteTarget.title ? (
                <p className="mt-1 truncate text-sm text-slate-300">{deleteTarget.title}</p>
              ) : null}
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
                >
                  {t('pages.messages.close')}
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteConversation}
                  className="flex-1 rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
                >
                  {t('pages.messages.deleteConversation', { defaultValue: 'Supprimer' })}
                </button>
              </div>
            </div>
          </div>
        )}
    </AuthenticatedLayout>
  );
}

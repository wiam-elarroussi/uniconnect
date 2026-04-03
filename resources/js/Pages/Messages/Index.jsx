import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export default function MessagesIndex({
  contacts = [],
  groupConversations = [],
  selectedUserId,
  selectedConversationId,
  conversation,
  campusPeers = [],
}) {
  const { t, i18n } = useTranslation();
  const { auth } = usePage().props;
  const myId = auth.user.id;
  const [listTab, setListTab] = useState('direct');
  const [body, setBody] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const fileInputRef = useRef(null);
  const [groupModal, setGroupModal] = useState(false);
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

  const messages = (conversation?.messages || []).slice();
  const selectedContact = contacts.find((c) => c.id === selectedUserId);
  const isGroupView = Boolean(selectedConversationId && conversation?.type === 'group');

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

  return (
    <AuthenticatedLayout header={<span className="font-semibold">{t('pages.messages.header')}</span>}>
      <Head title={t('pages.messages.headTitle')} />
      <div className="max-w-6xl mx-auto p-3 sm:p-4 md:p-6 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="mb-3 sm:mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 sm:px-4 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('pages.messages.callsBanner')}
          </p>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              disabled
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-200 text-slate-500 cursor-not-allowed"
              title={t('pages.messages.comingSoonTitle')}
            >
              {t('pages.messages.audioCall')}
            </button>
            <button
              type="button"
              disabled
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-200 text-slate-500 cursor-not-allowed"
              title={t('pages.messages.comingSoonTitle')}
            >
              {t('pages.messages.videoCall')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 md:gap-4 rounded-2xl md:border md:border-slate-200 md:overflow-hidden min-h-0 md:min-h-[520px]">
          <aside className="border-b md:border-b-0 md:border-r border-slate-200 bg-white flex flex-col max-h-[min(42vh,380px)] md:max-h-[560px] md:h-auto overflow-y-auto min-h-0">
            <div className="flex border-b border-slate-100 shrink-0">
              <button
                type="button"
                className={`flex-1 py-2.5 text-xs font-bold ${listTab === 'direct' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
                onClick={() => setListTab('direct')}
              >
                {t('pages.messages.tabDirect')}
              </button>
              <button
                type="button"
                className={`flex-1 py-2.5 text-xs font-bold ${listTab === 'groups' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
                onClick={() => setListTab('groups')}
              >
                {t('pages.messages.tabGroups')}
              </button>
            </div>
            {listTab === 'groups' && (
              <div className="p-2 border-b border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={openCreateGroup}
                  className="w-full py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  {t('pages.messages.newGroup')}
                </button>
              </div>
            )}

            {listTab === 'direct' && (
              <>
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                  {t('pages.messages.conversations')}
                </p>
                {contacts.length === 0 && (
                  <p className="p-4 text-sm text-slate-500">{t('pages.messages.noContacts')}</p>
                )}
                {contacts.map((c) => (
                  <Link
                    key={c.id}
                    href={route('messages.index', { user_id: c.id })}
                    className={`flex items-start gap-3 px-3 py-3 border-b border-slate-50 hover:bg-slate-50 ${
                      selectedUserId === c.id && !selectedConversationId ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {(c.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm text-slate-900 truncate">{c.name}</p>
                        {c.unread_count > 0 && (
                          <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                            {c.unread_count > 99 ? '99+' : c.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {c.last_message ? (
                          <span
                            className={
                              c.unread_count > 0 && c.last_message?.sender_id !== myId ? 'font-semibold text-slate-800' : ''
                            }
                          >
                            {c.last_message.sender_id === myId ? t('pages.messages.youPrefix') : ''}
                            {previewSnippet(c.last_message)}
                          </span>
                        ) : (
                          c.email
                        )}
                      </p>
                      {c.last_message?.created_at && (
                        <p className="text-[10px] text-slate-400 mt-0.5">{formatTime(c.last_message.created_at)}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </>
            )}

            {listTab === 'groups' && (
              <>
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                  {t('pages.messages.yourGroups')}
                </p>
                {groupConversations.length === 0 && (
                  <p className="p-4 text-sm text-slate-500">{t('pages.messages.noGroups')}</p>
                )}
                {groupConversations.map((g) => (
                  <Link
                    key={g.id}
                    href={route('messages.index', { conversation_id: g.id })}
                    className={`flex items-start gap-3 px-3 py-3 border-b border-slate-50 hover:bg-slate-50 ${
                      selectedConversationId === g.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      G
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm text-slate-900 truncate">{g.title}</p>
                        {g.unread_count > 0 && (
                          <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                            {g.unread_count > 99 ? '99+' : g.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {g.last_message
                          ? previewSnippet(g.last_message)
                          : t('pages.messages.membersCount', { count: g.members?.length || 0 })}
                      </p>
                    </div>
                  </Link>
                ))}
              </>
            )}
          </aside>

          <section className="md:col-span-3 flex flex-col bg-slate-100 min-h-[min(55dvh,560px)] md:min-h-[560px]">
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
                <div className="px-3 sm:px-4 py-3 border-b border-slate-200 bg-white flex-shrink-0 flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {selectedContact?.name ?? t('pages.messages.conversationFallback')}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{selectedContact?.email}</p>
                  </div>
                  <div className="flex gap-2 opacity-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{t('pages.messages.callLabel')}</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 min-h-0">
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
                </div>

                <form
                  onSubmit={submitMessage}
                  className="p-3 border-t border-slate-200 bg-white flex flex-col gap-2 flex-shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
                >
                  {mediaFile && (
                    <p className="text-xs text-slate-600">
                      {t('pages.messages.fileLabel')} {mediaFile.name}{' '}
                      <button type="button" className="text-red-600 font-semibold" onClick={() => setMediaFile(null)}>
                        {t('pages.messages.remove')}
                      </button>
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,audio/*"
                      className="hidden"
                      onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                    />
                    <button
                      type="button"
                      className="shrink-0 px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold bg-white w-full sm:w-auto"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {t('pages.messages.media')}
                    </button>
                    <input
                      className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm min-w-0 w-full"
                      placeholder={t('pages.messages.placeholderDm')}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-50 w-full sm:w-auto shrink-0"
                      disabled={!body.trim() && !mediaFile}
                    >
                      {t('pages.messages.send')}
                    </button>
                  </div>
                </form>
              </>
            )}

            {selectedConversationId && isGroupView && (
              <>
                <div className="px-3 sm:px-4 py-3 border-b border-slate-200 bg-white flex-shrink-0">
                  <p className="font-semibold text-slate-900">{conversation.title}</p>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {(conversation?.members || []).map((m) => m.name).join(', ')}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 min-h-0">
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
                </div>

                <form
                  onSubmit={submitMessage}
                  className="p-3 border-t border-slate-200 bg-white flex flex-col gap-2 flex-shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
                >
                  {mediaFile && (
                    <p className="text-xs text-slate-600">
                      {t('pages.messages.fileLabel')} {mediaFile.name}{' '}
                      <button type="button" className="text-red-600 font-semibold" onClick={() => setMediaFile(null)}>
                        {t('pages.messages.remove')}
                      </button>
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,audio/*"
                      className="hidden"
                      onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                    />
                    <button
                      type="button"
                      className="shrink-0 px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold bg-white w-full sm:w-auto"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {t('pages.messages.media')}
                    </button>
                    <input
                      className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm min-w-0 w-full"
                      placeholder={t('pages.messages.placeholderGroup')}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold disabled:opacity-50 w-full sm:w-auto shrink-0"
                      disabled={!body.trim() && !mediaFile}
                    >
                      {t('pages.messages.send')}
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        </div>

        {groupModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full max-h-[90dvh] sm:max-h-[85vh] overflow-hidden flex flex-col shadow-xl mt-auto sm:mt-0">
              <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center shrink-0">
                <p className="font-bold text-slate-900">{t('pages.messages.newGroupModalTitle')}</p>
                <button type="button" className="text-slate-500 text-sm" onClick={() => setGroupModal(false)}>
                  {t('pages.messages.close')}
                </button>
              </div>
              <form onSubmit={submitCreateGroup} className="p-4 flex flex-col gap-3 overflow-y-auto min-h-0">
                <div>
                  <label className="text-xs font-bold text-slate-600">{t('pages.messages.groupName')}</label>
                  <input
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                    value={groupForm.data.name}
                    onChange={(e) => groupForm.setData('name', e.target.value)}
                    required
                  />
                  {groupForm.errors.name && <p className="text-xs text-red-600 mt-1">{groupForm.errors.name}</p>}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 mb-2">{t('pages.messages.membersHint')}</p>
                  <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50">
                    {campusPeers.map((p) => (
                      <label key={p.id} className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-slate-50">
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
      </div>
    </AuthenticatedLayout>
  );
}

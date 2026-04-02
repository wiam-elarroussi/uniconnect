// resources/js/Components/Dashboard/Composer.jsx
import { useRef, useState } from 'react';
import Avatar from './Avatar';
import EmojiPicker from './EmojiPicker';
import { Ic } from './Icons';

export default function Composer({ auth, isFocusMode, onSubmit, processing, errors, channels = [] }) {
  const [body, setBody]       = useState('');
  const [media, setMedia]     = useState(null);
  const [channelId, setChannelId] = useState('');
  const [focused, setFocused] = useState(false);
  const taRef = useRef(null);
  const MAX = 500;

  const insertEmoji = (emoji) => {
    const el = taRef.current;
    if (!el) {
      setBody((b) => ((b || '') + emoji).slice(0, MAX));
      return;
    }
    const start = el.selectionStart ?? body.length;
    const end = el.selectionEnd ?? body.length;
    const next = (body.slice(0, start) + emoji + body.slice(end)).slice(0, MAX);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + emoji.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const handle = (e) => {
    e.preventDefault();
    if ((!body.trim() && !media) || isFocusMode) return;
    onSubmit(body, media, channelId ? Number(channelId) : null, () => {
      setBody('');
      setMedia(null);
      setChannelId('');
    });
  };

  return (
    <div className={`glass-card rounded-2xl overflow-visible noise transition-all duration-500 relative ${focused && !isFocusMode ? 'ring-1' : ''}`}
         style={focused && !isFocusMode ? {ringColor:'rgba(99,179,237,0.3)',boxShadow:'0 0 40px rgba(99,179,237,0.08)'} : {}}>

      {/* Ambient top glow */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,rgba(99,179,237,0.3),transparent)'}} />

      {/* Focus Mode Banner */}
      {isFocusMode && (
        <div className="flex items-center gap-3 px-5 py-3.5" style={{background:'rgba(246,173,85,0.07)',borderBottom:'1px solid rgba(246,173,85,0.15)'}}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'rgba(246,173,85,0.15)'}}>
            <span style={{color:'#f6ad55'}}><Ic.Moon /></span>
          </div>
          <div>
            <p className="text-xs font-display font-bold" style={{color:'#f6ad55'}}>Mode Focus · Neurones en repos</p>
            <p className="text-[10px]" style={{color:'rgba(246,173,85,0.6)'}}>Publication suspendue — UniConnect protège votre cycle cognitif.</p>
          </div>
          <span className="ml-auto text-[9px] px-2 py-1 rounded-full font-bold" style={{background:'rgba(246,173,85,0.1)',color:'#f6ad55',border:'1px solid rgba(246,173,85,0.2)'}}>
            22:00–07:00
          </span>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start gap-3.5">
          <Avatar name={auth.user.name} size="md" src={auth.user.avatar_url} builder={auth.user.avatar_builder} online pulse />
          <div className="flex-1 min-w-0">
            <textarea
              ref={taRef}
              value={body}
              onChange={e => e.target.value.length <= MAX && setBody(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              disabled={isFocusMode}
              placeholder={isFocusMode ? 'Vos pensées attendent demain…' : 'Partagez une insight, question ou ressource…'}
              rows={focused ? 3 : 2}
              className="w-full bg-transparent outline-none text-sm leading-relaxed resize-none disabled:cursor-not-allowed"
              style={{color:'var(--text-1)'}}
            />
            {errors?.body && <p className="text-xs mt-1" style={{color:'#fc8181'}}>⚠ {errors.body}</p>}
            {channels.length > 0 && (
              <div className="mt-2">
                <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
                  Publier en tant que canal (optionnel)
                </label>
                <select
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  className="mt-1 w-full rounded-xl px-3 py-2 input-neo text-xs"
                  style={{ color: 'var(--text-1)', borderColor: 'var(--border)' }}
                >
                  <option value="">Mon compte personnel</option>
                  {channels.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {(focused || body.length > 0 || media) && (
          <>
            <div className="h-px my-3.5" style={{background:'var(--border)'}} />
            <div className="flex items-center justify-between">
              {/* Left tools */}
              <div className="flex items-center gap-1">
                <label className="p-2 rounded-xl transition-all hover:bg-white/5 cursor-pointer" style={{color:'var(--text-3)'}} title="Media">
                  <Ic.Image />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,video/mp4,video/webm,video/quicktime"
                    onChange={(e) => setMedia(e.target.files?.[0] || null)}
                  />
                </label>
                <EmojiPicker onPick={insertEmoji} placement="up">
                  <Ic.Smile />
                </EmojiPicker>
                <div className="w-px h-4 mx-1" style={{background:'var(--border)'}} />
                {[['💡','Question'],['📎','Ressource'],['🎯','Projet']].map(([e,l]) => (
                  <button key={l} type="button"
                    onClick={() => setBody(b => (b?b+' ':'')+e+' '+l+' : ')}
                    className="text-[10px] font-medium px-2.5 py-1 rounded-full transition-all hover:bg-white/5"
                    style={{color:'var(--text-2)',border:'1px solid var(--border)'}}>
                    {e} {l}
                  </button>
                ))}
              </div>

              {/* Right: counter + publish */}
              <div className="flex items-center gap-3">
                {media && (
                  <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>
                    {media.name}
                  </span>
                )}
                {body.length > MAX*0.7 && (
                  <svg viewBox="0 0 24 24" className="w-5 h-5 -rotate-90">
                    <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5"/>
                    <circle cx="12" cy="12" r="9" fill="none"
                      stroke={body.length > MAX*0.9 ? '#fc8181' : 'var(--accent-1)'}
                      strokeWidth="2.5"
                      strokeDasharray={`${2*Math.PI*9}`}
                      strokeDashoffset={`${2*Math.PI*9*(1-body.length/MAX)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                <button onClick={handle}
                  disabled={processing || (!body.trim() && !media) || isFocusMode}
                  className="btn-neon flex items-center gap-2 px-5 py-2 rounded-full text-xs font-display font-bold text-white">
                  {processing ? <Ic.Spin /> : <Ic.Send />}
                  Diffuser
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
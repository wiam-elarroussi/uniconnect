// resources/js/Components/Dashboard/Sidebar.jsx
import Avatar from './Avatar';
import { Ic } from './Icons';
import { Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// ── ProfileCard ───────────────────────────────────────────────────────────────
export function ProfileCard({ auth, posts, resources, myPostsCount }) {
  const { t } = useTranslation();
  const myPosts = typeof myPostsCount === 'number'
    ? myPostsCount
    : posts.filter(p => p.user_id === auth.user.id).length;
  const myRes   = resources.filter(r => r.user_id === auth.user.id).length;
  const contributions = myPosts + myRes;

  return (
    <div className="glass-card rounded-2xl overflow-hidden noise">
      {/* Cover — animated mesh gradient */}
      <div className="h-20 relative overflow-hidden" style={{background:'linear-gradient(135deg,#0d1b4b 0%,#1a2a6c 40%,#0d3b59 70%,#06202e 100%)'}}>
        {/* Floating orbs */}
        <div className="absolute w-20 h-20 rounded-full d-float" style={{background:'radial-gradient(circle,rgba(99,179,237,0.3),transparent)',top:'-10px',left:'20px',animationDelay:'0s'}}/>
        <div className="absolute w-14 h-14 rounded-full d-float" style={{background:'radial-gradient(circle,rgba(183,148,244,0.25),transparent)',top:'0px',right:'30px',animationDelay:'-2s'}}/>
        <div className="absolute w-10 h-10 rounded-full d-float" style={{background:'radial-gradient(circle,rgba(118,228,176,0.2),transparent)',bottom:'5px',left:'50%',animationDelay:'-1s'}}/>
        {/* Grid overlay */}
        <div className="absolute inset-0" style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)',backgroundSize:'16px 16px'}}/>
      </div>

      <div className="px-4 pb-5 -mt-8">
        <div className="flex items-end justify-between mb-3">
          <div
            className="ring-4 rounded-full"
            style={{ ringColor: 'var(--bg-deep)', border: '4px solid var(--bg-deep)' }}
          >
            <Avatar name={auth.user.name} size="lg" src={auth.user.avatar_url} builder={auth.user.avatar_builder} online pulse />
          </div>
          <a href={route('profile.edit')}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:bg-white/5"
            style={{color:'var(--accent-1)',border:'1px solid rgba(99,179,237,0.25)'}}>
            <Ic.Edit /> {t('dashboard.sidebar.edit')}
          </a>
        </div>

        <h3 className="font-display font-bold text-sm" style={{color:'var(--text-1)'}}>{auth.user.name}</h3>
        <p className="text-[10px] truncate mb-3" style={{color:'var(--text-3)'}}>{auth.user.email}</p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-1 pt-3" style={{borderTop:'1px solid var(--border)'}}>
          {[
            { label: t('dashboard.sidebar.posts'),     val: myPosts, color:'var(--accent-1)' },
            { label: t('dashboard.sidebar.resources'), val: myRes,   color:'var(--accent-2)' },
            { label: t('dashboard.sidebar.contributions', { defaultValue: 'Contribution' }), val: contributions, color:'var(--accent-3)' },
          ].map(({ label, val, color }) => (
            <div key={label} className="text-center py-2 rounded-xl" style={{background:'rgba(255,255,255,0.02)'}}>
              <p className="font-display font-bold text-base" style={{color}}>{val}</p>
              <p className="text-[8px] uppercase tracking-wider" style={{color:'var(--text-3)'}}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── LibraryCard ───────────────────────────────────────────────────────────────
function ResItem({ res }) {
  const { t } = useTranslation();
  const catKey = { Cours: 'catCours', Exercice: 'catExercice', Projet: 'catProjet', Article: 'catArticle' };
  const catLabel = t(`dashboard.sidebar.${catKey[res.category] || 'catCours'}`);
  const colors = {
    'Cours':    {c:'var(--accent-1)',bg:'rgba(99,179,237,0.08)',b:'rgba(99,179,237,0.15)'},
    'Exercice': {c:'var(--accent-3)',bg:'rgba(183,148,244,0.08)',b:'rgba(183,148,244,0.15)'},
    'Projet':   {c:'var(--accent-2)',bg:'rgba(118,228,176,0.08)',b:'rgba(118,228,176,0.15)'},
    'Article':  {c:'var(--accent-hot)',bg:'rgba(246,173,85,0.08)',b:'rgba(246,173,85,0.15)'},
  };
  const col = colors[res.category] || colors['Cours'];

  return (
    <a href={res.link} target="_blank" rel="noopener noreferrer"
      className="group flex items-start gap-3 p-3 rounded-xl transition-all hover:bg-white/5"
      style={{ border: `1px solid var(--border)` }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = col.b; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
           style={{background:col.bg,color:col.c,border:`1px solid ${col.b}`}}>
        <Ic.Book />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between mb-0.5 gap-1 flex-wrap">
          <span className="text-[9px] font-bold uppercase tracking-wider" style={{color:col.c}}>{catLabel}</span>
          {res.filiere && (
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md truncate max-w-[7rem]" style={{ color: 'var(--text-3)', border: '1px solid var(--border)' }}>
              {res.filiere}
            </span>
          )}
          <span className="transition-colors" style={{color:'var(--text-3)'}}><Ic.Link /></span>
        </div>
        <h4 className="text-xs font-semibold line-clamp-2 transition-colors break-words" style={{ color: 'var(--text-1)' }}>{res.title}</h4>
        <div className="flex items-center gap-1.5 mt-1">
          <Avatar name={res.user?.name} size="xs" />
          <span className="text-[9px]" style={{color:'var(--text-3)'}}>{res.user?.name}</span>
        </div>
      </div>
    </a>
  );
}

const FILIERES = ['', 'Informatique', 'Gestion', 'Marketing', 'Génie civil', 'Droit', 'Autre'];

export function LibraryCard({ resources }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [filterCat, setFilterCat] = useState('');
  const [filterFiliere, setFilterFiliere] = useState('');
  const [filterQ, setFilterQ] = useState('');
  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    link: '',
    category: 'Cours',
    filiere: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('resources.store'), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        setOpen(false);
        router.reload({ only: ['resources'] });
      },
    });
  };

  const filteredResources = resources.filter((r) => {
    if (filterCat && r.category !== filterCat) return false;
    if (filterFiliere && (r.filiere || '') !== filterFiliere) return false;
    if (filterQ.trim()) {
      const q = filterQ.trim().toLowerCase();
      const t = `${r.title ?? ''} ${r.category ?? ''} ${r.filiere ?? ''}`.toLowerCase();
      if (!t.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="glass-card rounded-2xl overflow-hidden noise flex flex-col max-h-[min(70vh,32rem)] sm:max-h-none">
      <div className="flex items-center justify-between px-4 py-3.5 shrink-0" style={{borderBottom:'1px solid var(--border)'}}>
        <h3 className="font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2" style={{color:'var(--text-2)'}}>
          <span className="w-6 h-6 rounded-lg flex items-center justify-center" style={{background:'rgba(99,179,237,0.1)',color:'var(--accent-1)'}}>
            <Ic.Book />
          </span>
          {t('dashboard.sidebar.libraryTitle')}
        </h3>
        <button onClick={() => setOpen(true)} className="w-6 h-6 rounded-lg flex items-center justify-center transition-all hover:bg-white/5"
                style={{color:'var(--accent-1)',border:'1px solid rgba(99,179,237,0.2)'}}>
          <Ic.Plus />
        </button>
      </div>
      <div className="px-3 pt-3 space-y-2 shrink-0">
        <div className="grid grid-cols-1 gap-2">
          <input
            value={filterQ}
            onChange={(e) => setFilterQ(e.target.value)}
            placeholder={t('dashboard.sidebar.filterKeyword')}
            className="w-full rounded-lg px-2 py-1.5 text-[10px] input-neo"
            style={{ color: 'var(--text-1)', borderColor: 'var(--border)' }}
          />
          <div className="flex flex-wrap gap-1.5">
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="flex-1 min-w-[100px] rounded-lg px-2 py-1 text-[10px] input-neo"
              style={{ color: 'var(--text-1)', borderColor: 'var(--border)' }}
            >
              <option value="">{t('dashboard.sidebar.allCategories')}</option>
              {[
                { v: 'Cours', k: 'catCours' },
                { v: 'Exercice', k: 'catExercice' },
                { v: 'Projet', k: 'catProjet' },
                { v: 'Article', k: 'catArticle' },
              ].map(({ v, k }) => (
                <option key={v} value={v}>{t(`dashboard.sidebar.${k}`)}</option>
              ))}
            </select>
            <select
              value={filterFiliere}
              onChange={(e) => setFilterFiliere(e.target.value)}
              className="flex-1 min-w-[100px] rounded-lg px-2 py-1 text-[10px] input-neo"
              style={{ color: 'var(--text-1)', borderColor: 'var(--border)' }}
            >
              <option value="">{t('dashboard.sidebar.allFilieres')}</option>
              {FILIERES.filter(Boolean).map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="p-3 space-y-1 min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {filteredResources.length > 0
          ? filteredResources.map(r => <ResItem key={r.id} res={r} />)
          : <div className="py-8 text-center"><p className="text-xs" style={{color:'var(--text-3)'}}>{t('dashboard.sidebar.noResourcesFilter')}</p></div>
        }
      </div>

      {open && (
        <div
        className="w-full max-w-[min(28rem,calc(100vw-1rem))] rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: '#1a202c',
          border: '1px solid rgba(255,255,255,0.1)',
          maxHeight: 'calc(100vh - 3rem)',
          position: 'relative',
          zIndex: 70
        }}
      >
          <div
            className="w-full max-w-[min(28rem,calc(100vw-1rem))] rounded-2xl overflow-hidden noise"
            style={{
              background: 'var(--panel-bg)',
              border: '1px solid var(--border)',
              maxHeight: 'calc(100vh - 3rem)',
            }}
          >
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <p className="font-display font-bold text-sm" style={{ color: 'var(--text-1)' }}>{t('dashboard.sidebar.addResourceTitle')}</p>
                <p className="text-[11px]" style={{ color: 'var(--text-3)' }}>{t('dashboard.sidebar.addResourceSubtitle')}</p>
              </div>
              <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/5" style={{ color: 'var(--text-2)' }}>
                <span className="text-lg leading-none">×</span>
              </button>
            </div>

            <form onSubmit={submit} className="p-5 space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 9.5rem)' }}>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-3)' }}>{t('dashboard.sidebar.titleLabel')}</label>
                <input
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  className="w-full rounded-xl px-4 py-3 input-neo text-sm"
                  placeholder={t('dashboard.sidebar.titlePlaceholder')}
                />
                {errors?.title && <p className="text-xs mt-1" style={{ color: '#fc8181' }}>⚠ {errors.title}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-3)' }}>{t('dashboard.sidebar.linkLabel')}</label>
                <input
                  value={data.link}
                  onChange={(e) => setData('link', e.target.value)}
                  className="w-full rounded-xl px-4 py-3 input-neo text-sm"
                  placeholder={t('dashboard.sidebar.linkPlaceholder')}
                />
                {errors?.link && <p className="text-xs mt-1" style={{ color: '#fc8181' }}>⚠ {errors.link}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-3)' }}>{t('dashboard.sidebar.categoryLabel')}</label>
                <select
                  value={data.category}
                  onChange={(e) => setData('category', e.target.value)}
                  className="w-full rounded-xl px-4 py-3 input-neo text-sm"
                  style={{ colorScheme: 'dark' }}
                >
                  {[
                    { v: 'Cours', k: 'catCours' },
                    { v: 'Exercice', k: 'catExercice' },
                    { v: 'Projet', k: 'catProjet' },
                    { v: 'Article', k: 'catArticle' },
                  ].map(({ v, k }) => (
                    <option key={v} value={v}>{t(`dashboard.sidebar.${k}`)}</option>
                  ))}
                </select>
                {errors?.category && <p className="text-xs mt-1" style={{ color: '#fc8181' }}>⚠ {errors.category}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-3)' }}>{t('dashboard.sidebar.filiereLabel')}</label>
                <select
                  value={data.filiere}
                  onChange={(e) => setData('filiere', e.target.value)}
                  className="w-full rounded-xl px-4 py-3 input-neo text-sm"
                  style={{ colorScheme: 'dark' }}
                >
                  {FILIERES.map((f) => (
                    <option key={f || 'none'} value={f}>{f || t('dashboard.sidebar.filiereUnset')}</option>
                  ))}
                </select>
                {errors?.filiere && <p className="text-xs mt-1" style={{ color: '#fc8181' }}>⚠ {errors.filiere}</p>}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/5"
                        style={{ color: 'var(--text-2)', border: '1px solid var(--border)' }}>
                  {t('dashboard.sidebar.cancel')}
                </button>
                <button type="submit" disabled={processing} className="btn-neon px-5 py-2 rounded-xl text-xs font-display font-bold text-white">
                  {processing ? t('dashboard.sidebar.submitting') : t('dashboard.sidebar.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CharteCard ────────────────────────────────────────────────────────────────
export function CharteCard() {
  const { t } = useTranslation();
  const charteItems = t('dashboard.sidebar.charteItems', { returnObjects: true }) || [];
  return (
    <div className="rounded-2xl p-4 relative overflow-hidden noise" style={{background:'linear-gradient(135deg,rgba(10,25,60,0.9),rgba(15,30,70,0.85))',border:'1px solid rgba(99,179,237,0.15)'}}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full" style={{background:'radial-gradient(circle,rgba(99,179,237,0.15),transparent)',transform:'translate(30%,-30%)'}}/>
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'rgba(118,228,176,0.15)',color:'var(--accent-2)'}}>
            <Ic.Shield />
          </div>
          <h3 className="font-display font-bold text-xs uppercase tracking-wider" style={{color:'var(--text-2)'}}>{t('dashboard.sidebar.charteTitle')}</h3>
        </div>
        <ul className="space-y-1.5">
          {Array.isArray(charteItems) && charteItems.map((item, i) => (
            <li key={item} className="flex items-center gap-2 text-[10px]" style={{color:'var(--text-3)'}}>
              <span style={{color:['var(--accent-2)','var(--accent-1)','var(--accent-3)','var(--accent-hot)'][i]}}>✦</span>
              {item}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1.5 mt-3 pt-3" style={{borderTop:'1px solid rgba(255,255,255,0.06)'}}>
          <span className="w-1.5 h-1.5 rounded-full d-glow" style={{background:'var(--accent-2)'}}/>
          <p className="text-[8px] font-bold uppercase tracking-widest" style={{color:'var(--text-3)'}}>
            {t('dashboard.sidebar.charteFooter')}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── TrendingCard ──────────────────────────────────────────────────────────────
export function TrendingCard({ tags = [] }) {
  const { t } = useTranslation();
  const hotThreshold = tags.length ? Math.max(...tags.map((row) => row.posts ?? 0), 1) * 0.5 : 0;

  return (
    <div className="glass-card rounded-2xl overflow-hidden noise">
      <div className="flex items-center gap-2 px-4 py-3.5" style={{borderBottom:'1px solid var(--border)'}}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{background:'rgba(246,173,85,0.1)',color:'var(--accent-hot)'}}>
          <Ic.Fire />
        </div>
        <h3 className="font-display font-bold text-xs uppercase tracking-wider" style={{color:'var(--text-2)'}}>{t('dashboard.sidebar.trending')}</h3>
      </div>
      <div className="p-3 space-y-0.5">
        {tags.length === 0 ? (
          <p className="text-[10px] px-2 py-3" style={{ color: 'var(--text-3)' }}>{t('dashboard.sidebar.trendingEmpty')}</p>
        ) : (
          tags.map(({ tag, posts }, i) => {
            const hot = (posts ?? 0) >= hotThreshold && (posts ?? 0) > 1;
            return (
              <div key={`${tag}-${i}`}
                className="flex items-center justify-between py-2 px-2 rounded-xl transition-all hover:bg-white/5 group">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[9px] font-bold w-4 text-center shrink-0" style={{color:'var(--text-3)'}}>{i+1}</span>
                  <span className="text-xs font-medium truncate" style={{color:hot?'var(--accent-1)':'var(--text-2)'}}>{tag.startsWith('#') ? tag : `#${tag}`}</span>
                  {hot && <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold shrink-0" style={{background:'rgba(246,173,85,0.1)',color:'var(--accent-hot)'}}>🔥</span>}
                </div>
                <span className="text-[9px] font-mono shrink-0" style={{color:'var(--text-3)'}}>{posts}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── FollowSuggestionsCard ─────────────────────────────────────────────────────
export function FollowSuggestionsCard({ suggestions = [] }) {
  const { t } = useTranslation();
  return (
    <div className="glass-card rounded-2xl overflow-hidden noise">
      <div className="flex items-center gap-2 px-4 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(183,148,244,0.12)', color: 'var(--accent-2)' }}>
          <Ic.Users />
        </div>
        <h3 className="font-display font-bold text-xs uppercase tracking-wider" style={{ color: 'var(--text-2)' }}>{t('dashboard.sidebar.suggestions')}</h3>
      </div>
      <div className="p-3 space-y-2">
        {suggestions.length === 0 ? (
          <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>{t('dashboard.sidebar.suggestionsEmpty')}</p>
        ) : (
          suggestions.map((u) => (
            <div key={u.id} className="flex items-center justify-between gap-2 rounded-xl px-2 py-1.5 hover:bg-white/5">
              <Link href={route('users.show', u.id)} className="flex items-center gap-2 min-w-0 flex-1">
                <Avatar name={u.name} size="sm" src={u.avatar_url} builder={u.avatar_builder} previewOnHover previewLabel={u.name} />
                <span className="text-xs font-medium truncate" style={{ color: 'var(--text-1)' }}>{u.name}</span>
              </Link>
              <Link
                href={route('users.show', u.id)}
                className="text-[10px] font-bold px-2 py-1 rounded-lg shrink-0"
                style={{ color: 'var(--accent-1)', border: '1px solid rgba(99,179,237,0.25)' }}
              >
                {t('dashboard.sidebar.view')}
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── ActiveMembersCard ─────────────────────────────────────────────────────────
export function ActiveMembersCard({ members = [] }) {
  const { t } = useTranslation();
  const n = members.length;
  const shown = members.slice(0, 6);
  const rest = Math.max(0, n - shown.length);

  return (
    <div className="glass-card rounded-2xl overflow-hidden noise">
      <div className="flex items-center gap-2 px-4 py-3.5" style={{borderBottom:'1px solid var(--border)'}}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{background:'rgba(99,179,237,0.1)',color:'var(--accent-1)'}}>
          <Ic.Users />
        </div>
        <h3 className="font-display font-bold text-xs uppercase tracking-wider" style={{color:'var(--text-2)'}}>{t('dashboard.sidebar.online')}</h3>
        <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full font-bold" style={{background:'rgba(118,228,176,0.1)',color:'var(--accent-2)',border:'1px solid rgba(118,228,176,0.2)'}}>
          {n === 1 ? t('dashboard.sidebar.activeCountOne') : t('dashboard.sidebar.activeCount', { n })}
        </span>
      </div>
      <div className="p-4">
        {n === 0 ? (
          <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>{t('dashboard.sidebar.onlineEmpty')}</p>
        ) : (
          <>
            <div className="flex -space-x-2 mb-3 flex-wrap gap-y-2">
              {shown.map((u) => (
                <Link key={u.id} href={route('users.show', u.id)} className="relative hover:z-10 transition-transform hover:scale-110" title={u.name}>
                  <Avatar name={u.name} size="sm" src={u.avatar_url} builder={u.avatar_builder} previewOnHover previewLabel={u.name} />
                </Link>
              ))}
              {rest > 0 && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold"
                     style={{background:'rgba(255,255,255,0.05)',border:'2px solid var(--bg-deep)',color:'var(--text-3)',zIndex:0}}>
                  +{rest}
                </div>
              )}
            </div>
            <p className="text-[10px]" style={{color:'var(--text-3)'}}>
              <span style={{color:'var(--accent-2)'}} className="font-bold">{t('dashboard.sidebar.recentActivity')}</span> · {t('dashboard.sidebar.last15')}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

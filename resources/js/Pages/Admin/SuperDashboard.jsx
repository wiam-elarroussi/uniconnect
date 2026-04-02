import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';

export default function SuperDashboard({
  universities = [],
  rootUniversities = [],
  admins = [],
  contactMessages = [],
  unreadContactCount = 0,
}) {
  const { auth, flash, errors } = usePage().props;
  const uniForm = useForm({ name: '', domain: '', is_active: true, parent_university_id: '' });
  const adminForm = useForm({ name: '', email: '', password: '', role: 'admin', university_id: '' });

  const addUniversity = (e) => {
    e.preventDefault();
    uniForm.post(route('superadmin.universities.store'), {
      onSuccess: () => uniForm.reset('name', 'domain', 'parent_university_id'),
    });
  };

  const addAdmin = (e) => {
    e.preventDefault();
    adminForm.post(route('superadmin.admins.store'), { onSuccess: () => adminForm.reset('name', 'email', 'password') });
  };

  const deleteUniversity = (id) => {
    if (!confirm('Supprimer cette université et son domaine ? Impossible si des comptes y sont liés.')) return;
    router.delete(route('superadmin.universities.destroy', id), {
      preserveScroll: true,
    });
  };

  const deleteAdmin = (id) => {
    if (!confirm('Supprimer ce compte administrateur ?')) return;
    router.delete(route('superadmin.admins.destroy', id), { preserveScroll: true });
  };

  const markContactRead = () => {
    router.post(route('superadmin.contact.read-all'), {}, { preserveScroll: true });
  };

  return (
    <AuthenticatedLayout header={<span className="font-semibold">Super Admin · Contrôle Global</span>}>
      <Head title="Super Admin" />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {flash?.success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{flash.success}</div>
        )}
        {(errors?.university || errors?.domain || errors?.name || errors?.parent_university_id) && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
            {errors.university || errors.domain || errors.name || errors.parent_university_id}
          </div>
        )}

        <p className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <strong>Règle :</strong> une ligne = <strong>un seul domaine e-mail</strong> (ex. <code>supmti.ma</code>), unique dans toute l’application.
          Pour un <strong>deuxième domaine</strong> (même école), choisissez « Domaine supplémentaire de… » : les inscriptions et la modération admin seront sur le{' '}
          <strong>même campus</strong> que l’université principale.
        </p>

        <div className="bg-white rounded-2xl border p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-bold text-slate-900">Messages « Contactez-nous »</h2>
            <div className="flex items-center gap-2">
              {unreadContactCount > 0 && (
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-900">{unreadContactCount} non lu(s)</span>
              )}
              <button
                type="button"
                onClick={markContactRead}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800"
              >
                Tout marquer comme lu
              </button>
            </div>
          </div>
          {contactMessages.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun message pour l’instant.</p>
          ) : (
            <ul className="space-y-3 max-h-80 overflow-y-auto">
              {contactMessages.map((m) => (
                <li key={m.id} className={`border rounded-xl p-3 text-sm ${m.read_at ? 'bg-slate-50' : 'bg-blue-50/60 border-blue-200'}`}>
                  <p className="font-semibold text-slate-900">{m.name}</p>
                  <p className="text-xs text-slate-500">{m.email}</p>
                  <p className="text-slate-700 mt-2 whitespace-pre-wrap">{m.body}</p>
                  <p className="text-[10px] text-slate-400 mt-2">
                    {m.created_at ? new Date(m.created_at).toLocaleString('fr-FR') : ''}
                    {m.read_at ? ' · lu' : ''}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={addUniversity} className="bg-white rounded-2xl border p-5 space-y-3">
            <h2 className="font-bold text-slate-900">Ajouter une université</h2>
            <input
              className="w-full border rounded-xl p-2.5"
              placeholder="Nom (ex. SupMTI)"
              value={uniForm.data.name}
              onChange={(e) => uniForm.setData('name', e.target.value)}
            />
            <input
              className="w-full border rounded-xl p-2.5"
              placeholder="Domaine seul : supmti.ma (sans @ ni https)"
              value={uniForm.data.domain}
              onChange={(e) => uniForm.setData('domain', e.target.value)}
            />
            {uniForm.errors.domain && <p className="text-xs text-red-600">{uniForm.errors.domain}</p>}
            <label className="text-sm flex items-center gap-2">
              <input type="checkbox" checked={!!uniForm.data.is_active} onChange={(e) => uniForm.setData('is_active', e.target.checked)} />
              Université active
            </label>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Domaine supplémentaire de (optionnel)</label>
              <select
                className="w-full border rounded-xl p-2.5 text-sm"
                value={uniForm.data.parent_university_id}
                onChange={(e) => uniForm.setData('parent_university_id', e.target.value)}
              >
                <option value="">— Nouveau campus principal (pas un alias) —</option>
                {rootUniversities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.domain})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Si vous choisissez une université, ce domaine sera rattaché à son admin campus (même liste d’utilisateurs).
              </p>
            </div>
            {uniForm.errors.parent_university_id && <p className="text-xs text-red-600">{uniForm.errors.parent_university_id}</p>}
            <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold" disabled={uniForm.processing}>
              Créer
            </button>
          </form>

          <form onSubmit={addAdmin} className="bg-white rounded-2xl border p-5 space-y-3">
            <h2 className="font-bold text-slate-900">Créer un compte admin d&apos;université</h2>
            <p className="text-xs text-slate-500">
              Choisissez l&apos;université dans la liste. L&apos;admin se connectera sur <code>/login</code> et sera redirigé vers la modération.
            </p>
            <input
              className="w-full border rounded-xl p-2.5"
              placeholder="Nom"
              value={adminForm.data.name}
              onChange={(e) => adminForm.setData('name', e.target.value)}
            />
            <input
              className="w-full border rounded-xl p-2.5"
              placeholder="Email (ex. admin@supmti.ma)"
              value={adminForm.data.email}
              onChange={(e) => adminForm.setData('email', e.target.value)}
            />
            <input
              type="password"
              className="w-full border rounded-xl p-2.5"
              placeholder="Mot de passe (min. 8 caractères)"
              value={adminForm.data.password}
              onChange={(e) => adminForm.setData('password', e.target.value)}
            />
            <select className="w-full border rounded-xl p-2.5" value={adminForm.data.role} onChange={(e) => adminForm.setData('role', e.target.value)}>
              <option value="admin">Admin université</option>
              <option value="super_admin">Super admin</option>
            </select>
            {adminForm.data.role === 'admin' && (
              <select
                className="w-full border rounded-xl p-2.5"
                value={adminForm.data.university_id}
                onChange={(e) => adminForm.setData('university_id', e.target.value)}
                required
              >
                <option value="">— Choisir une université (obligatoire) —</option>
                {rootUniversities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.domain})
                  </option>
                ))}
              </select>
            )}
            {adminForm.errors.university_id && <p className="text-xs text-red-600">{adminForm.errors.university_id}</p>}
            <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold" disabled={adminForm.processing}>
              Créer l&apos;admin
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl border p-5">
          <h3 className="font-bold mb-3">Universités</h3>
          <div className="space-y-2">
            {universities.length === 0 && <p className="text-sm text-slate-500">Aucune université pour l’instant.</p>}
            {universities.map((u) => (
              <div key={u.id} className="flex items-center justify-between border rounded-xl p-3 gap-3">
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-sm text-slate-500">{u.domain}</p>
                  {u.parent && (
                    <p className="text-xs text-indigo-700 mt-1">
                      Domaine rattaché au campus : {u.parent.name} ({u.parent.domain})
                    </p>
                  )}
                </div>
                <button type="button" className="text-red-600 text-sm font-medium whitespace-nowrap" onClick={() => deleteUniversity(u.id)}>
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-5">
          <h3 className="font-bold mb-3">Admins</h3>
          <div className="space-y-2">
            {admins.map((a) => (
              <div key={a.id} className="flex items-center justify-between border rounded-xl p-3">
                <div>
                  <p className="font-semibold">
                    {a.name} · {a.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </p>
                  <p className="text-sm text-slate-500">
                    {a.email} {a.university ? `· ${a.university.name}` : ''}
                  </p>
                </div>
                {a.id !== auth.user.id && (
                  <button type="button" className="text-red-600 text-sm" onClick={() => deleteAdmin(a.id)}>
                    Supprimer
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

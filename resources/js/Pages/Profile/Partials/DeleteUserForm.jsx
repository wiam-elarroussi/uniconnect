import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const IconTrash  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconShield = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconEye    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconEyeOff = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const IconSpin   = () => <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>;
const IconX      = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

export default function DeleteUserForm({ className = '' }) {
    const { t } = useTranslation();
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({ password: '' });

    const confirmUserDeletion = () => setConfirmingUserDeletion(true);

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
        setShowPassword(false);
    };

    const consequences = [
        { icon: '📝', text: t('profile.delete.con1') },
        { icon: '📚', text: t('profile.delete.con2') },
        { icon: '🔑', text: t('profile.delete.con3') },
        { icon: '✅', text: t('profile.delete.con4') },
    ];

    return (
        <section className={`space-y-5 ${className}`}>

            {/* Header */}
            <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                        <IconTrash />
                    </span>
                    {t('profile.delete.title')}
                </h2>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    {t('profile.dangerBannerBody')}
                </p>
            </div>

            {/* Conséquences */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 space-y-2.5">
                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3">{t('profile.delete.whatDeleted')}</p>
                {consequences.map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5">
                        <span className="text-base leading-none">{icon}</span>
                        <span className="text-xs text-red-700 font-medium">{text}</span>
                    </div>
                ))}
            </div>

            {/* Bouton déclencheur */}
            <button
                onClick={confirmUserDeletion}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 transition-all shadow-md shadow-red-100 hover:shadow-red-200 hover:-translate-y-0.5 active:translate-y-0"
            >
                <IconTrash />
                {t('profile.delete.deleteBtn')}
            </button>

            {/* ── Modal confirmation ── */}
            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <div className="relative overflow-hidden">

                    {/* Dégradé fond modal */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-red-500 to-rose-600" />

                    <div className="p-7">

                        {/* Bouton fermeture */}
                        <button
                            onClick={closeModal}
                            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            <IconX />
                        </button>

                        {/* Icône alerte */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-900 leading-tight">
                                    {t('profile.delete.confirmTitle')}
                                </h2>
                                <p className="text-xs text-red-500 font-semibold mt-0.5">{t('profile.delete.confirmSubtitle')}</p>
                            </div>
                        </div>

                        {/* Message */}
                        <p className="text-sm text-slate-600 leading-relaxed mb-6">
                            {t('profile.dangerBannerBody')}
                        </p>

                        {/* Résumé conséquences */}
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            {consequences.map(({ icon, text }) => (
                                <div key={text} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                                    <span className="text-sm">{icon}</span>
                                    <span className="text-[10px] text-slate-500 font-medium leading-tight">{text}</span>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={deleteUser}>
                            {/* Champ mot de passe */}
                            <div className="mb-5">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    {t('profile.delete.confirmPasswordLabel')}
                                </label>
                                <div
                                    className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                                        errors.password
                                            ? 'border-red-300 bg-red-50 shadow-[0_0_0_3px_rgba(239,68,68,0.10)]'
                                            : inputFocused
                                                ? 'border-blue-300 bg-white shadow-[0_0_0_3px_rgba(37,99,235,0.10)]'
                                                : 'border-gray-200 bg-slate-50'
                                    }`}
                                >
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        ref={passwordInput}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        onFocus={() => setInputFocused(true)}
                                        onBlur={() => setInputFocused(false)}
                                        autoFocus
                                        placeholder={t('profile.delete.confirmPasswordPlaceholder')}
                                        className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm text-slate-800 placeholder-slate-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        className="px-3 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <IconEyeOff /> : <IconEye />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1">
                                        <span>⚠</span> {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Badge RGPD */}
                            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5 mb-5">
                                <span className="text-emerald-500"><IconShield /></span>
                                <p className="text-[10px] text-emerald-700 font-semibold leading-relaxed">
                                    {t('profile.delete.rgpdBadge')}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-5 py-2.5 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-200 transition-all"
                                >
                                    {t('profile.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || !data.password.trim()}
                                    className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-red-100"
                                >
                                    {processing ? <IconSpin /> : <IconTrash />}
                                    {processing ? t('profile.delete.deleting') : t('profile.delete.confirmDeleteBtn')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </section>
    );
}
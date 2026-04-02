import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

/**
 * Affiche les messages flash Laravel (success / error) via react-hot-toast.
 * Monté une fois par page grâce au wrapper dans app.jsx.
 */
export default function GlobalFlashToasts() {
    const flash = usePage().props.flash;
    const seen = useRef('');

    useEffect(() => {
        const key = `${flash?.success ?? ''}\0${flash?.error ?? ''}\0${flash?.warning ?? ''}\0${flash?.info ?? ''}`;
        if (!flash?.success && !flash?.error && !flash?.warning && !flash?.info) {
            return;
        }
        if (key === seen.current) {
            return;
        }
        seen.current = key;
        if (flash.success) {
            toast.success(flash.success, {
                duration: 4500,
                style: {
                    background: '#166534',
                    color: '#fff',
                    fontWeight: 600,
                },
            });
        }
        if (flash.error) {
            toast.error(flash.error, { duration: 5000 });
        }
        if (flash.warning) {
            toast(flash.warning, {
                duration: 6000,
                icon: '⚠️',
                style: {
                    background: '#1e293b',
                    color: '#fff',
                    fontWeight: 500,
                },
            });
        }
        if (flash.info) {
            toast(flash.info, {
                duration: 5000,
                style: {
                    background: '#1d4ed8',
                    color: '#fff',
                    fontWeight: 500,
                },
            });
        }
    }, [flash]);

    return null;
}

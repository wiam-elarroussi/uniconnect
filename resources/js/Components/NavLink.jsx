import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={[
                'relative inline-flex items-center gap-1.5 px-4 py-2 rounded-xl',
                'text-sm font-semibold transition-all duration-200',
                'focus:outline-none',
                active
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100',
                className,
            ].join(' ')}
        >
            {children}
            {/* Indicateur actif */}
            {active && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500" />
            )}
        </Link>
    );
}